<template>
  <div class="v-user-list">
    <a-page-header
      title="Список: пользователи"
      class="v-user-list-header-block"
    >
      <template slot="extra">
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
      :loading="isLoading"
      :pagination="{ pageSize: 20 }"
      :scroll="{ y: 'calc(100vh - 16em)' }"
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
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { CreateChat } from "../../../../../common/types/api";
import { User } from "../../../../../common/types/model";

@Component
export default class VUserList extends mixins(VBaseMixin) {
  users: User[] = [];
  size = 0;

  async created(): Promise<void> {
    this.menuKey = [0];
    await this.getUsers();
  }
  // получение списка пользователей
  async getUsers(): Promise<void> {
    if (!this.userAccess.user.viewList) return;
    this.isLoading = true;
    const [response, error] = await api.user.getUsers(0, 999);
    if (!error && response && response.data) {
      this.users = response.data;
      response.size && (this.size = response.size);
    } else if (error) {
      console.warn(error);
      this.$notification.error({
        message: "Не удалось загрузить пользователей",
        description: "",
      });
    } else console.error(error);
    this.isLoading = false;
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
    if (!error && response) console.log(response, "добавить переадрисацию");
    else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error.message ?? "",
        description: "",
      });
    } else console.error(error);
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
    return this.users.map((item) => ({
      key: item.id,
      lastName: item.profile.lastName,
      firstName: item.profile.firstName,
      middleName: item.profile.middleName,
      roles: getRolesByArrId(item.roles ?? []),
    }));
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
