<template>
  <div class="v-edit-details-group">
    <a-page-header
      title="Просмотр: группа"
      class="header-block"
      @back="routing('group-list')"
    >
      <template slot="extra">
        <a-button
          v-if="isEdit"
          key="2"
          type="primary"
          @click="modalAddGradebookPageVisible = true"
        >
          Добавить дисциплину
        </a-button>
        <a-button
          v-if="userAccess.group.delete"
          key="1"
          type="danger"
          @click="deleteGroup"
        >
          Удалить
        </a-button>
      </template>
    </a-page-header>
    <div v-if="!isLoading" class="v-edit-details-group-body">
      <a-row type="flex" justify="start" :gutter="16">
        <!-- информация -->
        <a-col :span="6">
          <a-card
            title="Основная инфомация"
            class="v-edit-details-group-card"
            hoverable
          >
            <div class="vertical-margin-element-8">
              <label :class="{ 'required-label': isEdit }"> Название </label>
              <a-input v-model="group.name" :disabled="!isEdit" allowClear />
            </div>
            <div v-if="isEdit" class="vertical-margin-element-8">
              <a-button type="primary" @click="updateGroup">
                Сохранить
              </a-button>
            </div>
          </a-card>
        </a-col>
        <!-- участники -->
        <a-col :span="9">
          <a-card
            title="Участники"
            class="v-edit-details-group-card v-edit-details-group-body-card-no-pading"
            hoverable
          >
            <div slot="extra">
              <a-input-search
                v-model="filterName"
                key="2"
                placeholder="поиск ФИО..."
                allowClear
                style="width: 200px"
              />
              <label> Только участники </label>
              <a-checkbox v-model="membersOnly" />
            </div>
            <a-table
              :columns="tableColumn"
              :data-source="tableData"
              :loading="isLoading"
              :pagination="{ pageSize: 20 }"
              size="small"
              :scroll="{ y: 'calc(100vh - 22em)' }"
            >
              <span slot="isUser" slot-scope="item">
                <a-checkbox
                  :checked="item.isUser"
                  :disabled="!isEdit || isLoadingMember"
                  @click="changeMember(item.key, 'user', item.isUser)"
                />
              </span>
              <span slot="isModerator" slot-scope="item">
                <a-checkbox
                  :checked="item.isModerator"
                  :disabled="!isEdit || isLoadingMember"
                  @click="changeMember(item.key, 'moder', item.isModerator)"
                />
              </span>
            </a-table>
          </a-card>
        </a-col>
        <!-- список страниц журнала группы -->
        <a-col :span="9">
          <v-group-details-gradebook-pages
            v-if="this.group.id !== -1 && this.group.id && keyPages"
            :groupId="this.group.id"
            :isEdit="isEdit"
            :key="keyPages"
          />
        </a-col>
      </a-row>
    </div>
    <v-loading v-else />
    <!-- добавление к группе страницы журнала успеваемости -->
    <v-modal-add-gradebook-page-group
      v-model="modalAddGradebookPageVisible"
      :groupId="group.id"
      @successful="keyPages++"
    />
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import { viewFullName } from "@/common/filters";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { Group, User } from "../../../../../common/types/model";
import VGroupDetailsGradebookPages from "./v-group-details-gradebook-pages.vue";
import VModalAddGradebookPageGroup from "./v-modal-add-gradebook-page-group.vue";

type TypeMember = "user" | "moder";

@Component({
  components: {
    "v-modal-add-gradebook-page-group": VModalAddGradebookPageGroup,
    "v-group-details-gradebook-pages": VGroupDetailsGradebookPages,
  },
})
export default class VEditDetailsGroup extends mixins(VBaseMixin) {
  group: Group = {
    id: -1,
    name: "",
    users: [],
    moderators: [],
  };
  users: User[] = [];
  modalAddGradebookPageVisible = false; // видимость окна добавления дисциплины
  membersOnly = true; // фильтр только участники
  filterName = ""; // фильтр названия
  keyPages = 0; // ключ для перерендера списка страниц журнала
  // изменение состава участников
  isLoadingMember = false;

  test() {
    console.log("1");
  }

  async created(): Promise<void> {
    this.isLoading = true;
    this.menuKey = [4];
    const id = Number(this.$route.params["id"]); // id тек. группы
    // получение тек. группы по id
    if (id) {
      this.group.id = id;
      // тек. группа
      const [response, error] = await api.group.getGroupById(
        this.accessToken,
        this.group.id
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
      const [responseUsers, errorUsers] = await api.user.getUsers(0, 9999);
      if (!errorUsers && responseUsers && responseUsers.data)
        this.users = responseUsers.data;
      else if (errorUsers) {
        console.warn(errorUsers);
        this.$notification.error({
          message: "Не удалось загрузить пользователей",
          description: "",
        });
      } else console.error(errorUsers);
      this.keyPages++;
    }
    this.isLoading = false;
  }
  // обновление группы
  async updateGroup(): Promise<void> {
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
  /** обновление списка участников */
  async changeMember(
    userId: number | null,
    mode: TypeMember | null,
    check: boolean
  ): Promise<void> {
    if (!userId || !mode) return;
    if (!this.group.users || !this.group.moderators) return;
    this.isLoadingMember = true;
    const find = this.users.find((item) => item.id === userId);
    if (find) {
      // удаление
      if (check) {
        const success = await this.deleteMembers(userId, mode);
        success && mode === "user"
          ? (this.group.users = this.group.users.filter((x) => x.id !== userId))
          : (this.group.moderators = this.group.moderators.filter(
              (x) => x.id !== userId
            ));
      }
      // добавление
      else {
        const success = await this.addMember(userId, mode);
        success && mode === "user"
          ? this.group.users.push(find)
          : this.group.moderators.push(find);
      }
    }
    this.isLoadingMember = false;
  }
  /** добавление участников */
  async addMember(
    userId: number | null,
    mode: TypeMember | null
  ): Promise<boolean> {
    if (!this.isEdit || !this.group.id) return false;
    if (!userId || !mode) return false;
    const [response, error] = await api.group.addMembers(
      this.accessToken,
      this.group.id,
      mode === "user"
        ? { users: [userId], moderators: [] }
        : { users: [], moderators: [userId] }
    );
    if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    }
    return Boolean(response);
  }
  /** удаление участников */
  async deleteMembers(
    userId: number | null,
    mode: TypeMember | null
  ): Promise<boolean> {
    if (!this.isEdit || !this.group.id) return false;
    if (!userId || !mode) return false;
    const [response, error] = await api.group.deleteMembers(
      this.accessToken,
      this.group.id,
      mode === "user"
        ? { users: [userId], moderators: [] }
        : { users: [], moderators: [userId] }
    );
    if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    }
    return Boolean(response);
  }
  // возможность редактировть
  get isEdit(): boolean {
    return this.userAccess.group.create || this.userAccess.group.update;
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    let data = this.users.map((item) => ({
      key: item.id,
      name: viewFullName(item.profile, false),
      isUser: this.isArrUsersIncludeUserById(item.id, "user"),
      isModerator: this.isArrUsersIncludeUserById(item.id, "moder"),
    }));
    this.membersOnly &&
      (data = data.filter((item) => item.isUser || item.isModerator));
    this.filterName &&
      (data = data.filter((item) =>
        item.name.toLowerCase().includes(this.filterName.toLowerCase())
      ));
    return data;
  }
  /** есть ли в массиве пользователь с данным id */
  isArrUsersIncludeUserById(id: number, mode: TypeMember): boolean {
    switch (mode) {
      case "user":
        for (const user of this.group.users ?? [])
          if (user.id === id) return true;
        break;
      case "moder":
        for (const user of this.group.moderators ?? [])
          if (user.id === id) return true;
        break;

      default:
        break;
    }
    return false;
  }
  // eslint-disable-next-line
  get tableColumn() {
    return [
      {
        title: "ФИО",
        dataIndex: "name",
        key: "name",
        width: 300,
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
  // удаление группы
  async deleteGroup(): Promise<void> {
    if (!this.userAccess.group.delete) return;
    this.$confirm({
      title: "Удаление группы",
      content: `Вы точно хотите группу: ${this.group.name}`,
      onOk: async () => {
        if (this.group?.id === null || this.group?.id === undefined) return;
        const [response, error] = await api.group.deleteGroup(
          this.accessToken,
          this.group.id
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
    &-card-no-pading {
      .ant-card-body {
        padding: 0;
      }
    }
  }
}
</style>
