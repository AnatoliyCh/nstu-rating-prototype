<template>
  <a-modal
    :visible="value"
    @change="changeVisible"
    :footer="null"
    title="Выбрать группу"
    :width="600"
    centered
    class="v-modal-get-group"
  >
    <a-table
      :columns="columnsTable"
      :data-source="tableData"
      :loading="isDataLoading"
      :pagination="pagination"
      :scroll="{ y: 'calc(50vh)' }"
      rowKey="id"
      @change="changePagination"
    >
      <a slot="name" slot-scope="name, group" @click="getGroup(group)">
        {{ name }}
      </a>
      <div
        slot="customTitle"
        style="display: flex; justify-content: space-between"
      >
        <span
          style="display: flex; flex-direction: column; justify-content: center"
        >
          Название группы
        </span>
        <a-input-search
          v-model="filterName"
          placeholder="поиск по названию..."
          allowClear
          enter-button
          @search="(pagination.current = 1) && getGroups()"
          style="width: 45%"
        />
      </div>
    </a-table>
  </a-modal>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import VPaginationMixin from "@/common/v-pagination-mixin";
import { mixins } from "vue-class-component";
import { Component, Emit, Model } from "vue-property-decorator";
import { Group } from "../../../../../common/types/model";

@Component
export default class VModalgetGroup extends mixins(
  VPaginationMixin,
  VBaseMixin
) {
  /** видимость окна */
  @Model("change", { type: Boolean }) readonly value!: boolean;
  /** изменение видимости */
  @Emit("change")
  changeVisible(visible: boolean): boolean {
    return visible;
  }
  groups: Group[] = [];
  filterName = ""; // фильтр названия

  async created(): Promise<void> {
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
  /** возвращает дисциплину parent объекту */
  @Emit("click") getGroup(value: Group | null): Group | null {
    return value;
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    return this.groups;
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTable() {
    return [
      {
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        slots: { title: "customTitle" },
        scopedSlots: { customRender: "name" },
      },
    ];
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
@import "src/common/main.scss";
.v-modal-get-group {
  .ant-modal-body {
    padding: 0 !important;
    .ant-table-header-column {
      width: 100%;
    }
  }
}
</style>
