<template>
  <div class="v-group-list">
    <a-page-header title="Список: группы" class="v-group-list-header-block">
      <template slot="extra">
        <a-input-search
          v-model="filterName"
          key="2"
          placeholder="поиск по названию..."
          allowClear
          style="width: 200px"
        />
        <a-button
          v-if="userAccess.group.create"
          key="1"
          type="primary"
          @click="visibleModalCreateGroup = true"
        >
          Создать группу
        </a-button>
      </template>
    </a-page-header>
    <a-table
      :columns="columnsTable"
      :data-source="tableData"
      :loading="isLoading"
      :pagination="{ pageSize: 20 }"
      :scroll="{ y: 'calc(100vh - 16em)' }"
      rowKey="id"
    >
      <a slot="name" slot-scope="name, group" @click="goGroupDetails(group.id)">
        {{ name }}
      </a>
      <a
        v-if="userAccess.group.delete"
        slot="action"
        slot-scope="group"
        @click="deleteGroup(group)"
      >
        Удалить
      </a>
    </a-table>
    <!-- модальное окно создания группы -->
    <a-modal
      title="Название новой группы"
      v-model="visibleModalCreateGroup"
      :confirm-loading="isLoadingCreate"
      :ok-button-props="{ props: { disabled: !Boolean(newGroupName) } }"
      @ok="handleOkCreate"
      @cancel="handleCancelCreate"
      centered
    >
      <div class="vertical-margin-element-24">
        <label class="required-label">Название </label>
        <a-input v-model="newGroupName" />
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import VEventApiMixin from "@/common/v-event-api-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { Group } from "../../../../../common/types/model";

@Component
export default class VGroupList extends mixins(VBaseMixin, VEventApiMixin) {
  groups: Group[] = [];
  size = 0;
  filterName = ""; // фильтр названия
  // модальное окно создания группы
  visibleModalCreateGroup = false;
  isLoadingCreate = false;
  newGroupName = "";

  async created(): Promise<void> {
    this.menuKey = [4];
    this.isLoading = true;
    await this.getGroups();
    this.isLoading = false;
  }
  /** получение списка групп */
  async getGroups(): Promise<void> {
    const [response, error] = await api.group.getGroups(
      this.accessToken,
      0,
      999
    );
    if (response && !error) {
      this.groups = response.data ?? [];
      this.size = response.size ?? 0;
    } else if (error) {
      console.warn(error);
      this.$notification.error({
        message: "Не удалось загрузить группы",
        description: "",
      });
    } else console.error(error);
  }
  // удаление группы
  async deleteGroup(group: Group | null): Promise<void> {
    if (!group || !this.userAccess.group.delete) return;
    this.$confirm({
      title: "Удаление группы",
      content: `Вы точно хотите удалить группу: ${group.name}`,
      onOk: async () => {
        if (group?.id === null || group?.id === undefined) return;
        const [response, error] = await api.group.deleteGroup(
          this.accessToken,
          group.id
        );
        if (response && !error) {
          // удаление по id
          const findId = this.groups.findIndex((item) => item.id === group.id);
          findId > -1 && this.groups.splice(findId, 1);
        } else if (error) {
          console.warn(error);
          this.$notification.warning({
            message: error?.message ?? "",
            description: "Удаление группы",
          });
        } else console.error(error);
      },
    });
  }
  // переход на страницу просмотра группы
  goGroupDetails(groupId: number | null | undefined): void {
    if (groupId === null || groupId === undefined) return;
    this.$router.push({
      name: "group-details",
      params: { id: groupId.toString() },
    });
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    if (this.filterName)
      return this.groups.filter((item) =>
        item.name?.toLowerCase().includes(this.filterName.toLowerCase())
      );
    else return this.groups;
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTable() {
    const columns = [
      {
        title: "Название группы",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        scopedSlots: { customRender: "name" },
      },
      {
        title: "Действия",
        key: "action",
        width: 200,
        ellipsis: true,
        scopedSlots: { customRender: "action" },
      },
    ];
    if (this.userAccess.group.update || this.userAccess.group.delete)
      return columns;
    else return [columns[0]];
  }
  //* модальное окно создания группы
  async handleOkCreate(): Promise<void> {
    if (!this.userAccess.group.create) {
      this.visibleModalCreateGroup = false;
      return;
    }
    this.isLoadingCreate = true;
    const [response, error] = await api.group.createGroup(this.accessToken, {
      name: this.newGroupName,
    });
    if (response && !error) {
      this.$notification.success({
        message: "Группа создана",
        description: `Название: ${this.newGroupName}`,
      });
      this.groups.push({ id: response.id, name: this.newGroupName });
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "Создание группы",
      });
    } else console.error(error);
    this.visibleModalCreateGroup = false;
    this.isLoadingCreate = false;
    this.newGroupName = "";
  }
  handleCancelCreate(): void {
    this.visibleModalCreateGroup = false;
    this.newGroupName = "";
  }
}
</script>

<style lang="scss">
.v-group-list {
  &-header-block {
    border-block-end: 1px solid rgb(235, 237, 240);
    margin-bottom: 0px;
  }
}
</style>
