<template>
  <a-modal
    :visible="value"
    @change="changeVisible"
    :footer="null"
    title="Выбрать дисциплину"
    :width="600"
    centered
    class="v-modal-get-discipline"
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
      <a
        slot="name"
        slot-scope="name, discipline"
        @click="getDiscipline(discipline)"
      >
        {{ name }}
      </a>
      <div
        slot="customTitle"
        style="display: flex; justify-content: space-between"
      >
        <span
          style="display: flex; flex-direction: column; justify-content: center"
        >
          Название дисциплины
        </span>
        <a-input-search
          v-model="filterName"
          placeholder="поиск по названию..."
          allowClear
          enter-button
          @search="(pagination.current = 1) && getDisciplines()"
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
import { Discipline } from "../../../../../common/types/model";

@Component
export default class VModalGetDiscipline extends mixins(
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
  disciplines: Discipline[] = [];
  filterName = ""; // фильтр названия

  async created(): Promise<void> {
    await this.getDisciplines();
  }
  /** получение списка дисциплин */
  async getDisciplines(): Promise<void> {
    this.isDataLoading = true;
    const [response, error] = await api.discipline.getDisciplines(
      this.accessToken,
      this.offset,
      this.pagination.pageSize,
      this.filterName
    );
    if (response && !error) {
      this.disciplines = response.data ?? [];
      this.pagination.total = response.size ?? 0;
    }
    this.isDataLoading = false;
  }
  /** возвращает дисциплину parent объекту */
  @Emit("click") getDiscipline(value: Discipline | null): Discipline | null {
    return value;
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    return this.disciplines;
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
    await this.getDisciplines();
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-modal-get-discipline {
  .ant-modal-body {
    padding: 0 !important;
    .ant-table-header-column {
      width: 100%;
    }
  }
}
</style>
