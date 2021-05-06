<template>
  <div class="v-group-list">
    <a-page-header title="Список: группы" class="v-group-list-header-block">
      <template slot="extra">
        <a-input-search
          v-model="filterName"
          key="2"
          placeholder="поиск по названию..."
          allowClear
          enter-button
          @search="(pagination.current = 1) && getGroups()"
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
      :loading="isDataLoading"
      :pagination="pagination"
      :scroll="{ y: 'calc(100vh - 16em)' }"
      rowKey="id"
      @change="changePagination"
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
import VPaginationMixin from "@/common/v-pagination-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { Group } from "../../../../../common/types/model";

@Component
export default class VGroupList extends mixins(VBaseMixin, VPaginationMixin) {
  groups: Group[] = [];
  filterName = ""; // фильтр названия
  // модальное окно создания группы
  visibleModalCreateGroup = false;
  isLoadingCreate = false;
  newGroupName = "";

  async created(): Promise<void> {
    this.menuKey = [4];
    await this.getGroups();
  }
  /** получение списка групп */
  async getGroups(): Promise<void> {
    this.isDataLoading = true;
    const [response, error] = await api.group.getGroups(
      this.accessToken,
      this.offset,
      this.pagination.pageSize,
      this.filterName
    );
    if (response && !error) {
      this.groups = response.data ?? [];
      this.pagination.total = response.size ?? 0;
    } else if (error && this.$router.currentRoute.name === "group-list") {
      console.warn(error);
      this.$notification.error({
        message: "Не удалось загрузить группы",
        description: "",
      });
    }
    this.isDataLoading = false;
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
        if (response && !error) await this.changePagination(this.pagination);
        else if (error && this.$router.currentRoute.name === "group-list") {
          console.warn(error);
          this.$notification.warning({
            message: error?.message ?? "",
            description: "Удаление группы",
          });
        }
      },
    });
  }
  // переход на страницу просмотра группы
  goGroupDetails(groupId: number | null | undefined): void {
    if (groupId === null || groupId === undefined) return;
    this.routing("group-details", { id: groupId.toString() });
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    return this.groups;
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
    } else if (error && this.$router.currentRoute.name === "group-list") {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "Создание группы",
      });
    }
    this.changePagination(this.pagination);
    this.handleCancelCreate();
  }
  handleCancelCreate(): void {
    this.visibleModalCreateGroup = false;
    this.isLoadingCreate = false;
    this.newGroupName = "";
  }
  /** переключение страниц */
  async changePagination(
    pagination: VPaginationMixin["pagination"]
  ): Promise<void> {
    this.pagination.current = pagination.current;
    await this.getGroups();
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
