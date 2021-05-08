<template>
  <div class="v-user-table-achievements">
    <a-table
      :columns="tableColumns"
      :data-source="tableData"
      :loading="isDataLoading"
      :pagination="pagination"
      :scroll="{ y: 'calc(100vh - 18em)' }"
      @change="changePagination"
    >
      <div v-if="Boolean(action)" slot="action">
        <a @click="action.func">{{ action.name }}</a>
      </div>
    </a-table>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import VPaginationMixin from "@/common/v-pagination-mixin";
import { mixins } from "vue-class-component";
import { Component, Prop } from "vue-property-decorator";
import { Achievement } from "../../../../../../common/types/model";

@Component
export default class VUserTableAchievements extends mixins(VPaginationMixin) {
  data: Achievement[] = [];
  /** функция получения списка достижений */
  @Prop({ type: Function, default: null }) readonly getData!:
    | ((offset: number, pageSize: number) => Promise<[Achievement[], number]>)
    | null;
  /** блок действий */
  @Prop({ type: Object, default: null }) readonly action!: {
    name: string | null; // название кнопки
    func: () => void; // функция
  } | null;

  async created() {
    this.pagination.hideOnSinglePage = false;
    await this.changePagination(this.pagination);
  }

  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    return this.data.map((item, index) => ({
      key: item.id ?? index,
      name: item.name,
      balanceScore: item.balanceScore,
      score: item.score,
      eventName: item.event.name,
    }));
  }
  // колонки таблицы
  // eslint-disable-next-line
  get tableColumns() {
    const columns = [
      {
        title: "Название",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
      },
      {
        title: "Остаток баллов",
        dataIndex: "balanceScore",
        key: "balanceScore",
        ellipsis: true,
        width: 200,
      },
      {
        title: "Всего баллов",
        dataIndex: "score",
        key: "score",
        ellipsis: true,
        width: 200,
      },
      {
        title: "Мероприятие",
        dataIndex: "eventName",
        key: "eventName",
        ellipsis: true,
      },
      {
        title: "Действия",
        key: "action",
        width: 150,
        ellipsis: true,
        scopedSlots: { customRender: "action" },
      },
    ];
    if (!this.action) return columns.slice(0, columns.length - 1);
    return columns;
  }
  /** переключение страниц */
  async changePagination(
    pagination: VPaginationMixin["pagination"]
  ): Promise<void> {
    this.pagination.current = pagination.current;
    this.isDataLoading = true;
    if (this.getData) {
      const [data, total] = await this.getData(
        this.offset,
        this.pagination.pageSize
      );
      this.data = data;
      this.pagination.total = total;
    }
    this.isDataLoading = false;
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
// .v-user-table-achievements {

// }
</style>
