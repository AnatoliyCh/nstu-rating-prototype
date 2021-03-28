<template>
  <div class="v-user-list">
    <a-page-header
      title="Список: пользователи"
      class="v-user-list-header-block"
    >
      <!-- действия для орг. и админа -->
      <!-- <template slot="extra">
        <a-button key="1" type="primary" @click="routing('event-create')">
          Создать пользователя
        </a-button>
      </template> -->
    </a-page-header>
    <a-table
      :columns="columnsTableUser"
      :data-source="dataTableUser"
      :loading="isLoading"
      :pagination="{ pageSize: 20 }"
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
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import VBaseMixin from "@/common/v-base-mixin";
import { User } from "../../../../../common/types/model";
import { CreateChat } from "../../../../../common/types/api";
import { getRolesByArrId } from "@/common/services/user";
import api from "@/common/api";

@Component
export default class VEventList extends mixins(VBaseMixin) {
  users: User[] = [];
  size = 0;

  async created() {
    await this.getUsers();
  }
  // получение списка пользователей
  async getUsers() {
    this.isLoading = true;
    const [response, error] = await api.user.getUsers(0, 999);
    if (!error && response && response.data) {
      this.users = response.data;
      response.size && (this.size = response.size);
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoading = false;
  }
  // колонки таблицы
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
  get dataTableUser() {
    return this.users.map((item) => {
      return {
        key: item.id,
        lastName: item.profile.lastName,
        firstName: item.profile.firstName,
        middleName: item.profile.middleName,
        roles: getRolesByArrId(item.roles ?? []),
      };
    });
  }
  // создание чата
  async createChat(idSubUser: number | null) {
    if (!idSubUser) return;
    const newChat: CreateChat = { users: [2, idSubUser], chatType: 1 };
    this.isLoading = true;
    const [response, error] = await api.chat.createChat(
      this.accessToken,
      newChat
    );
    if (!error && response) {
      console.log(response);
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoading = false;
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
