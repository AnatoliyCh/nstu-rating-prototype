<template>
  <div class="v-user-list">
    <a-page-header
      title="Список: пользователи"
      class="v-user-list-header-block"
    >
      <template slot="extra">
        <a-input-search
          v-model="filterName"
          key="2"
          placeholder="поиск ФИО..."
          allowClear
          style="width: 200px"
        />
        <a-button
          v-if="userAccess.user.create"
          key="1"
          type="primary"
          @click="routing('user-create')"
        >
          Создать пользователя
        </a-button>
      </template>
    </a-page-header>
    <a-table
      :columns="columnsTableUser"
      :data-source="dataTableUser"
      :loading="isDataLoading"
      :pagination="pagination"
      :scroll="{ y: 'calc(100vh - 16em)' }"
      @change="changePagination"
    >
      <span slot="roles" slot-scope="item">
        <a-tag
          v-for="(role, index) in item.roles"
          :key="index"
          :color="role.color"
        >
          {{ role.name }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="item">
        <a @click="createChat(item.key)">Чат</a>
      </span>
    </a-table>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import { getRolesByArrId } from "@/common/services/user";
import VBaseMixin from "@/common/v-base-mixin";
import VPaginationMixin from "@/common/v-pagination-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { CreateChat } from "../../../../../common/types/api";
import { User } from "../../../../../common/types/model";

@Component
export default class VUserList extends mixins(VBaseMixin, VPaginationMixin) {
  users: User[] = [];
  filterName = ""; // фильтр названия

  async created(): Promise<void> {
    this.menuKey = [0];
    await this.getUsers();
  }
  // получение списка пользователей
  async getUsers(): Promise<void> {
    if (!this.userAccess.user.viewList) return;
    this.isDataLoading = true;
    const [response, error] = await api.user.getUsers(
      this.offset,
      this.pagination.pageSize
    );
    if (!error && response?.data) {
      this.users = response.data;
      this.pagination.total = response.size ?? 0;
    } else if (error && this.$router.currentRoute.name === "user-list") {
      console.warn(error);
      this.$notification.error({
        message: "Не удалось загрузить пользователей",
        description: "",
      });
    }
    this.isDataLoading = false;
  }
  // создание чата
  async createChat(idSubUser: number | null): Promise<void> {
    if (!idSubUser || !this.currentUser) return;
    const newChat: CreateChat = {
      users: [idSubUser],
      chatType: 1,
    };
    this.isLoading = true;
    const [response, error] = await api.chat.createChat(
      this.accessToken,
      newChat
    );
    if (!error && response?.id)
      this.routing("chat-details", { id: response.id.toString() });
    else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error.message ?? "",
        description: "",
      });
    }
    this.isLoading = false;
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTableUser() {
    return [
      {
        title: "Фамилия",
        dataIndex: "lastName",
        key: "lastName",
        width: 200,
        ellipsis: true,
      },
      {
        title: "Имя",
        dataIndex: "firstName",
        key: "firstName",
        width: 200,
        ellipsis: true,
      },
      {
        title: "Отчество",
        dataIndex: "middleName",
        key: "middleName",
        width: 200,
        ellipsis: true,
      },
      {
        title: "Роли",
        key: "roles",
        scopedSlots: { customRender: "roles" },
      },
      {
        title: "Действия",
        key: "action",
        scopedSlots: { customRender: "action" },
        width: 200,
      },
    ];
  }
  // данные для таблицы
  // eslint-disable-next-line
  get dataTableUser() {
    let data = this.users.map((item) => ({
      key: item.id,
      lastName: item.profile.lastName,
      firstName: item.profile.firstName,
      middleName: item.profile.middleName,
      roles: getRolesByArrId(item.roles ?? []),
    }));
    if (this.filterName)
      return data.filter((item) => {
        const fullName = `${item.lastName} ${item.firstName} ${item.middleName}`.toLowerCase();
        return fullName.includes(this.filterName.toLowerCase());
      });
    return data;
  }
  /** переключение страниц */
  async changePagination(
    pagination: VPaginationMixin["pagination"]
  ): Promise<void> {
    this.pagination.current = pagination.current;
    await this.getUsers();
  }
}
</script>

<style lang="scss">
.v-user-list {
  &-header-block {
    border-block-end: 1px solid rgb(235, 237, 240);
    margin-bottom: 0px;
  }
}
</style>
