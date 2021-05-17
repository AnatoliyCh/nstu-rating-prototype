<template>
  <a-card
    title="Журнал группы"
    class="v-group-details-gradebook-pages"
    hoverable
  >
    <div slot="extra">
      <a-input-search
        v-model="filterName"
        key="1"
        placeholder="поиск по названию..."
        allowClear
        style="width: 200px"
      />
    </div>
    <a-table
      :columns="columnsTable"
      :data-source="tableData"
      :loading="isDataLoading"
      :pagination="pagination"
      :scroll="{ y: 'calc(50vh)' }"
    >
      <a
        v-if="isEdit"
        slot="name"
        slot-scope="name, record"
        @click="goGroupGradebookPage(record.page)"
      >
        {{ name }}
      </a>
      <label v-else> {{ name }} </label>
      <a
        v-if="isEdit"
        slot="action"
        slot-scope="record"
        @click="deletePage(record.page)"
      >
        Удалить
      </a>
    </a-table>
  </a-card>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import VPaginationMixin from "@/common/v-pagination-mixin";
import { mixins } from "vue-class-component";
import { Component, Prop } from "vue-property-decorator";
import { GradebookPage } from "../../../../../common/types/model";
/** страницы журнала успеваемости группы */
@Component
export default class VGroupDetailsGradebookPages extends mixins(
  VPaginationMixin,
  VBaseMixin
) {
  @Prop({ type: Number, default: null }) readonly groupId!: number | null;
  @Prop({ type: Boolean, default: false }) readonly isEdit!: boolean;

  pages: GradebookPage[] = [];
  filterName = ""; // фильтр названия

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
      undefined,
      undefined,
      this.groupId ?? undefined
    );
    if (response && !error) {
      // там может прийти массив
      response.data?.forEach((item) => {
        this.pages = this.pages.concat(item.pages ?? []);
      });
      this.pagination.total = this.tableData.length;
    }
    this.isDataLoading = false;
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    let data = this.pages.map((item, index) => ({
      key: index,
      name: item.discipline?.name ?? "",
      page: item,
    }));
    if (this.filterName)
      data = data.filter((item) =>
        item.name.toLowerCase().includes(this.filterName.toLowerCase())
      );
    this.pagination.total = data.length;
    return data;
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTable() {
    // eslint-disable-next-line
    const columns: any[] = [
      {
        title: "Название дисциплинны",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        scopedSlots: { customRender: "name" },
      },
    ];
    if (this.isEdit)
      columns.push({
        title: "Действия",
        key: "action",
        width: 200,
        ellipsis: true,
        align: "center",
        scopedSlots: { customRender: "action" },
      });
    return columns;
  }
  // переход на страницу просмотра страницы журнала
  goGroupGradebookPage(value: GradebookPage): void {
    if (
      this.groupId === null ||
      this.groupId === undefined ||
      value.discipline?.id === null ||
      value.discipline?.id === undefined
    )
      return;
    this.routing("group-gradebook-page", {
      groupId: this.groupId.toString(),
      disciplineId: value.discipline.id.toString(),
    });
  }
  // удаление страницы журнала
  async deletePage(gradebookPage: GradebookPage | null): Promise<void> {
    if (!gradebookPage || !this.isEdit) return;
    this.$confirm({
      title: "Удаление журнала группы",
      content: `Вы точно хотите удалить страницу журнала: ${gradebookPage.discipline?.name}`,
      onOk: async () => {
        if (gradebookPage?.id === null || gradebookPage?.id === undefined)
          return;
        const [response, error] = await api.rating.deleteGradebookPage(
          this.accessToken,
          gradebookPage.id
        );
        if (response && !error) {
          this.pages = this.pages.filter(
            (item) => item.id !== gradebookPage.id
          );
        } else if (error) {
          console.warn(error);
          this.$notification.warning({
            message: error?.message ?? "",
            description: "Удаление журнала группы",
          });
        }
      },
    });
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-group-details-gradebook-pages {
  cursor: default;
  .ant-card-body {
    padding: 0 !important;
  }
}
</style>
