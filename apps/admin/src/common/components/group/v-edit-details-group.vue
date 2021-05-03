<template>
  <div class="v-edit-details-group">
    <a-page-header
      title="Просмотр: группа"
      class="header-block"
      @back="routing('group-list')"
    >
      <template slot="extra">
        <a-button
          v-if="userAccess.group.delete"
          key="2"
          type="danger"
          @click="deleteGroup"
        >
          Удалить
        </a-button>
      </template>
    </a-page-header>
    <div v-if="!isLoading" class="v-edit-details-group-body">
      <a-row type="flex" justify="start" :gutter="16">
        <a-col :span="6">
          <a-card
            title="Основная инфомация"
            class="v-edit-details-group-card"
            hoverable
          >
            <div class="vertical-margin-element-8">
              <label :class="[mode === 'add' ? 'required-label' : '']">
                Название
              </label>
              <a-input v-model="group.name" :disabled="!isEdit" allowClear />
            </div>
            <div v-if="isEdit" class="vertical-margin-element-8">
              <a-button type="primary" @click="updateGroup">
                Сохранить
              </a-button>
            </div>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="Роли" class="v-edit-details-group-card" hoverable>
            <a-table
              :columns="tableColumn"
              :data-source="tableData"
              :loading="isLoading"
              :pagination="{ pageSize: 20 }"
              :scroll="{ y: 'calc(100vh - 16em)' }"
            >
              <span slot="isUser" slot-scope="item">
                <a-checkbox :checked="item.isUser" :disabled="!isEdit" />
              </span>
              <span slot="isModerator" slot-scope="item">
                <a-checkbox :checked="item.isModerator" :disabled="!isEdit" />
              </span>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <v-loading v-else />
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import { viewFullName } from "@/common/filters";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { Group, User } from "../../../../../common/types/model";

@Component
export default class VEditDetailsGroup extends mixins(VBaseMixin) {
  group: Group = {
    id: -1,
    name: "",
    users: [],
    moderators: [],
  };
  users: User[] = [];

  async created() {
    this.isLoading = true;
    this.menuKey = [4];
    const id = Number(this.$route.params["id"]); // id тек. группы
    // получение тек. группы по id
    if (id) {
      // тек. группа
      const [response, error] = await api.group.getGroupById(
        this.accessToken,
        id
      );
      if (response && !error) this.group = response;
      else if (error) {
        console.warn(error);
        this.$notification.warning({
          message: error?.message ?? "",
          description: error?.statusText ?? "",
        });
        this.routing("group-list");
      } else console.error(error);
      //   пользователи
      const [responseUsers, errorUsers] = await api.user.getUsers(0, 999);
      if (!errorUsers && responseUsers && responseUsers.data)
        this.users = responseUsers.data;
      else if (errorUsers) {
        console.warn(errorUsers);
        this.$notification.error({
          message: "Не удалось загрузить пользователей",
          description: "",
        });
      } else console.error(errorUsers);
    }
    this.isLoading = false;
  }
  // обновление группы
  async updateGroup() {
    if (!this.isEdit || !this.group.name) return;
    if (this.group.id === null || this.group.id === undefined) return;
    // обновление параметров группы
    this.isLoading = true;
    const [response, error] = await api.group.сhangeGroup(
      this.accessToken,
      this.group.id,
      { name: this.group.name }
    );
    if (response && !error)
      this.$notification.success({
        message: "Группа обнавлена",
        description: "",
      });
    else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoading = false;
  }
  /** есть ли в массиве пользователь с данным id */
  isArrUsersIncludeUserById(id: number): boolean {
    for (const user of this.users) if (user.id === id) return true;
    return false;
  }
  // удаление группы
  async deleteGroup(group: Group | null): Promise<void> {
    if (!group || !this.userAccess.group.delete) return;
    this.$confirm({
      title: "Удаление группы",
      content: `Вы точно хотите группу: ${group.name}`,
      onOk: async () => {
        if (group?.id === null || group?.id === undefined) return;
        const [response, error] = await api.group.deleteGroup(
          this.accessToken,
          group.id
        );
        if (response && !error) this.routing("group-list");
        else if (error) {
          console.warn(error);
          this.$notification.warning({
            message: error?.message ?? "",
            description: "Удаление группы",
          });
        } else console.error(error);
      },
    });
  }
  // возможность редактировть
  get isEdit(): boolean {
    return this.userAccess.group.create || this.userAccess.group.update;
  }
  // данные для таблицы
  get tableData() {
    return this.users.map((item) => ({
      key: item.id,
      name: viewFullName(item.profile, false),
      isUser: this.isArrUsersIncludeUserById(item.id),
      isModerator: this.isArrUsersIncludeUserById(item.id),
    }));
  }
  get tableColumn() {
    return [
      {
        title: "ФИО",
        dataIndex: "name",
        key: "name",
        width: 200,
        ellipsis: true,
      },
      {
        title: "Участник",
        key: "isUser",
        scopedSlots: { customRender: "isUser" },
      },
      {
        title: "Модератор",
        key: "isModerator",
        scopedSlots: { customRender: "isModerator" },
      },
    ];
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-edit-details-group {
  height: 80%;
  &-body {
    margin: 0px 16px;
    .v-edit-details-group-card {
      cursor: default;
    }
  }
}
</style>
