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
      <div v-if="Boolean(actionName)" slot="action" slot-scope="achievement">
        <a @click="actionClick(achievement)">{{ actionName }}</a>
      </div>
    </a-table>
  </div>
</template>
<script lang="ts">
import VPaginationMixin from "@/common/v-pagination-mixin";
import { viewFullName } from "@/common/filters";
import { mixins } from "vue-class-component";
import { Component, Emit, Prop } from "vue-property-decorator";
import { Achievement } from "../../../../../../common/types/model";

@Component
export default class VUserTableAchievements extends mixins(VPaginationMixin) {
  data: Achievement[] = [];
  /** функция получения списка достижений */
  @Prop({ type: Function, default: null }) readonly getData!:
    | ((offset: number, pageSize: number) => Promise<[Achievement[], number]>)
    | null;
  /** название действия */
  @Prop({ type: String, default: null }) actionName!: string | null;
  /** событие при нажатии */
  @Emit("action-click") actionClick(
    value: Achievement | null
  ): Achievement | null {
    const find = this.data.find((item) => item.id === value?.id);
    return find ?? null;
  }

  async created(): Promise<void> {
    this.pagination.hideOnSinglePage = false;
    await this.changePagination(this.pagination);
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    return this.data.map((item, index) => ({
      key: index,
      id: item.id,
      name: item.name,
      balanceScore: item.balanceScore,
      score: item.score,
      eventName:
        item.event?.name ??
        viewFullName(item.awardedUser?.profile ?? null, true),
      discipline: item.gradebookPage?.discipline?.name ?? "",
    }));
    // const a: any[] = [];
    // for (let i = 0; i < 40; i++) {
    //   a.push({
    //     id: i,
    //     name: `name ${i}`,
    //     balanceScore: i,
    //     score: i,
    //     eventName: `eventName ${i}`,
    //     discipline: "",
    //   });
    // }
    // return a;
  }
  // колонки таблицы
  // eslint-disable-next-line
  get tableColumns() {
    // eslint-disable-next-line
    const columns: any[] = [
      {
        title: "Название",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
      },
      {
        title: "Мероприятие / Наградивший",
        dataIndex: "eventName",
        key: "eventName",
        ellipsis: true,
      },
      {
        title: "Баллы",
        dataIndex: "score",
        key: "score",
        align: "center",
        ellipsis: true,
        width: 200,
      },
    ];
    //показывать остаток баллов
    const showBalanceScore = Boolean(
      this.data.find((item) => item.balanceScore)
    );
    if (showBalanceScore)
      columns.push({
        title: "Остаток баллов",
        dataIndex: "balanceScore",
        key: "balanceScore",
        align: "center",
        ellipsis: true,
        width: 200,
      });
    //показывать дисциплину при наличии
    const showDiscipline = Boolean(
      this.data.find((item) => item.gradebookPage?.discipline?.name)
    );
    if (showDiscipline)
      columns.push({
        title: "Дициплина",
        dataIndex: "discipline",
        key: "discipline",
        width: 200,
        ellipsis: true,
      });
    if (this.actionName)
      columns.push({
        title: "Действия",
        key: "action",
        width: 150,
        ellipsis: true,
        scopedSlots: { customRender: "action" },
      });
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
