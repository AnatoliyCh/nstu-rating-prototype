<template>
  <a-modal
    :visible="value"
    @change="changeVisible"
    title="Награждение за место"
    :closable="false"
    :confirm-loading="isLoading"
    @ok="changeUserTopBoard()"
    @cancel="modalCancel"
    :cancel-button-props="{ props: { disabled: Boolean(isLoading) } }"
    :width="700"
    centered
    class="v-event-details-modal-change-reward-members-place"
  >
    <div class="line-wrapper">
      <label>Мин. балл: </label>
      <a-input-number v-model="userTopBoard.minBall" :min="0" allowClear />
      <label>Макс. балл: </label>
      <a-input-number v-model="userTopBoard.maxBall" :min="0" allowClear />
      <a-tooltip title="Ball0 + MaxBall * (N_мест - место+1) / N_мест">
        <a-button type="primary" shape="round" icon="question" size="small" />
      </a-tooltip>
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
import {
  Request,
  User,
  UserTopBoard,
} from "../../../../../../common/types/model";
/** награждение по занятому месту */
@Component
export default class VEventDetailsModalChangeRewardMembersPlace extends mixins(
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
  @Prop({ type: Object }) readonly userTopBoard!: UserTopBoard;

  rewards: {
    key: number;
    place: number | null;
    name: string;
    user: User;
  }[] = [];

  created() {
    this.changeRewards();
  }
  @Watch("value") changeRewards() {
    this.rewards = [];
    this.members.forEach((item, index) => {
      const place = this.userTopBoard.userPlace.find((x) => x.user === item.id)
        ?.place;
      this.rewards.push({
        key: index,
        place: place ?? index + 1,
        name: viewFullName(item.profile ?? null, false),
        user: item,
      });
    });
  }
  async changeUserTopBoard() {
    if (!this.eventId) return;
    this.isLoading = true;
    this.userTopBoard.userPlace = [];
    this.rewards.forEach((x) => {
      x.user.id &&
        x.place !== null &&
        this.userTopBoard.userPlace.push({ user: x.user.id, place: x.place });
    });
    const [response, error] = await api.event.changeUserTopBoard(
      this.accessToken,
      this.eventId,
      this.userTopBoard
    );
    if (response && !error) {
      this.$emit("changeUserTopBoard");
      this.modalCancel();
    }
    this.isLoading = false;
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
.v-event-details-modal-change-reward-members-place {
  .ant-modal-body {
    padding: 0;

    .line-wrapper {
      padding: 8px;
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
</style>
