<template>
  <a-modal
    :visible="value"
    @change="changeVisible"
    title="Награждение за активность"
    :closable="false"
    :confirm-loading="isLoading"
    @ok="modalOk"
    @cancel="modalCancel"
    :cancel-button-props="{ props: { disabled: Boolean(isLoading) } }"
    :width="700"
    centered
    class="v-event-details-modal-change-reward-members"
  >
    <div class="line-wrapper">
      <div>
        <label>Балл: </label>
        <a-input-number v-model="ball" :min="0" allowClear />
        <label>Активность: </label>
        <a-input v-model="name" allowClear />
      </div>
      <div>
        <a-tooltip title="Выделить / Снять все галочки">
          <a-button icon="check" @click="checkAll" />
        </a-tooltip>
      </div>
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
import { Component, Emit, Model, Prop, Watch } from "vue-property-decorator";
import { Request, User } from "../../../../../../common/types/model";
/** награждение за задание */
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

  ball = 0; // балл который получат награжденные
  name = ""; // название за что наградили

  rewards: {
    key: number;
    name: string;
    reward: boolean;
    user: User;
  }[] = [];

  created() {
    this.changeRewards();
  }
  @Watch("value") changeRewards() {
    this.rewards = [];
    this.members.forEach((item, index) => {
      this.rewards.push({
        key: index,
        name: viewFullName(item.profile ?? null, false),
        reward: false,
        user: item,
      });
    });
  }
  /** создание достижения для студента */
  async modalOk(): Promise<void> {
    this.isLoading = true;
    this.rewards.forEach(async (item) => {
      if (item.reward)
        await api.rating.createAchievement(
          this.accessToken,
          this.ball,
          this.name,
          item.user.id,
          this.eventId
        );
    });
    this.$notification.success({
      message: "Участники награждены",
      description: "",
    });
    this.isLoading = false;
    this.modalCancel();
  }
  /** снять / выделить всех учатников */
  checkAll() {
    const countAll = this.rewards.length;
    let checkCount = 0; // количество выделенных
    this.rewards.forEach((item) => {
      item.reward && checkCount++;
    });
    if (checkCount === countAll)
      this.rewards.forEach((x) => (x.reward = false));
    else this.rewards.forEach((x) => (x.reward = true));
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
        this.ball = 0;
        this.name = "";
      }
    }, 2000);
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-event-details-modal-change-reward-members {
  .ant-modal-body {
    padding: 0;

    .line-wrapper {
      padding: 8px;
      display: flex;
      justify-content: space-between;
      > div {
        display: flex;
        align-items: center;
        > .ant-btn-round.ant-btn-sm {
          padding: 0 4px !important;
        }
        > * {
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
