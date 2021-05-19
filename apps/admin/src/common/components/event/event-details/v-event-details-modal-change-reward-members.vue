<template>
  <a-modal
    :visible="value"
    @change="changeVisible"
    title="Награждение за место"
    centered
    @cancel="modalCancel"
    :cancel-button-props="{ props: { disabled: Boolean(isLoading) } }"
    :width="700"
    class="v-event-details-modal-change-requests-members"
  >
    <div>
      <label>Мин. балл: </label>
      <a-input-number v-model="minBall" :min="0" allowClear />
      <label>Макс. балл: </label>
      <a-input-number v-model="maxBall" :min="0" allowClear />
    </div>
    <a-table
      :columns="columnsTable"
      :data-source="tableData"
      :loading="isDataLoading"
      :pagination="pagination"
      :scroll="{ y: 'calc(100vh - 16em)' }"
      @change="changePagination"
      size="small"
    >
      <span slot="place" slot-scope="item">
        <a-input-number v-model="item.place" :min="1" allowClear />
      </span>
      <span slot="reward" slot-scope="item">
        <a-checkbox v-model="item.reward" />
      </span>
    </a-table>
  </a-modal>
</template>
<script lang="ts">
import api from "@/common/api";
import { viewFullName } from "@/common/filters";
import VBaseMixin from "@/common/v-base-mixin";
import VPaginationMixin from "@/common/v-pagination-mixin";
import { mixins } from "vue-class-component";
import { Component, Emit, Model, Prop } from "vue-property-decorator";
import { Request, User } from "../../../../../../common/types/model";
/** награждение по занятому месту */
@Component
export default class VEventDetailsModalChangeRewardMembers extends mixins(
  VBaseMixin,
  VPaginationMixin
) {
  /** видимость окна */
  @Model("change", { type: Boolean }) readonly value!: boolean;
  /** изменение видимости */
  @Emit("change")
  changeVisible(visible: boolean): boolean {
    return visible;
  }
  @Prop({ type: Number, default: null }) readonly eventId!: number | null;
  @Prop({ type: Array, default: [] }) readonly members!: User[];

  minBall = 0;
  maxBall = 0;

  rewards: {
    key: number;
    place: number | null;
    name: string;
    reward: boolean;
    user: User;
  }[] = [];

  created() {
    this.members.forEach((item, index) => {
      this.rewards.push({
        key: index,
        place: index + 1,
        name: viewFullName(item.profile ?? null, false),
        reward: false,
        user: item,
      });
    });
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    return this.rewards;
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTable() {
    return [
      {
        title: "Место",
        key: "place",
        scopedSlots: { customRender: "place" },
        align: "center",
        width: 100,
      },
      {
        title: "ФИО",
        dataIndex: "name",
        key: "name",
        width: 200,
        ellipsis: true,
      },
      {
        title: "Наградить",
        key: "reward",
        scopedSlots: { customRender: "reward" },
        align: "center",
        width: 200,
      },
    ];
  }
  /** переключение страниц */
  changePagination(pagination: VPaginationMixin["pagination"]): void {
    this.pagination.current = pagination.current;
  }
  /** скрытие окна  */
  modalCancel(): void {
    this.changeVisible(false);
    setTimeout(() => {
      if (!this.value) {
        this.rewards = [];
      }
    }, 2000);
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-event-details-modal-change-requests-members {
  .ant-modal-body {
    padding: 0;
  }
}
</style>
