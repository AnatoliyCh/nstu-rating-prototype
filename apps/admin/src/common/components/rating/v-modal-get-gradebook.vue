<template>
  <a-modal
    :visible="value"
    @change="changeVisible"
    :footer="null"
    title="Выбрать дисциплину для отправки запроса"
    :width="600"
    centered
    class="v-modal-get-gradebook"
  >
    <a-table
      :columns="columnsTable"
      :data-source="tableData"
      :loading="isDataLoading"
      :pagination="pagination"
      :scroll="{ y: 'calc(50vh)' }"
    >
      <a
        slot="name"
        slot-scope="name, record"
        @click="getGradebookPage(record.page)"
      >
        {{ name }}
      </a>
    </a-table>
  </a-modal>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import VPaginationMixin from "@/common/v-pagination-mixin";
import { mixins } from "vue-class-component";
import { Component, Emit, Model } from "vue-property-decorator";
import { GradebookPage } from "../../../../../common/types/model";

@Component
export default class VModalGetGradebook extends mixins(
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
  pages: GradebookPage[] = [];

  async created(): Promise<void> {
    await this.getGradebook();
  }
  /** получение журнала и его страниц */
  async getGradebook(): Promise<void> {
    this.isDataLoading = true;
    const [response, error] = await api.rating.getGradebook(
      this.accessToken,
      this.offset,
      this.pagination.pageSize,
      this.currentUser?.id
    );
    if (response && !error) {
      // там может прийти массив
      response.data?.forEach((item) => {
        this.pages = this.pages.concat(item.pages ?? []);
      });
      this.pagination.total = response.size ?? 0;
    }
    this.isDataLoading = false;
  }
  /** возвращает страницу журнала, parent объекту */
  @Emit("click") getGradebookPage(
    value: GradebookPage | null
  ): GradebookPage | null {
    return value;
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    return this.pages.map((item) => ({
      key: item.id,
      name: item.discipline?.name ?? "",
      page: item,
    }));
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTable() {
    return [
      {
        title: "Название дисциплинны",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        scopedSlots: { customRender: "name" },
      },
    ];
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-modal-get-gradebook {
  .ant-modal-body {
    padding: 0 !important;
    .ant-table-header-column {
      width: 100%;
    }
  }
}
</style>
