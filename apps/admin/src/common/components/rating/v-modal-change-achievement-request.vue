<template>
  <a-modal
    :visible="value"
    @change="changeVisible"
    :footer="null"
    title="Список запросов на распределение баллов"
    :width="600"
    centered
    class="v-modal-change-achievement-request"
  >
    <a-table
      :columns="columnsTable"
      :data-source="tableData"
      :loading="isDataLoading"
      :pagination="pagination"
      :scroll="{ y: 'calc(50vh)' }"
    >
      <div slot="action" slot-scope="record">
        <!-- принимаем если статус ожидание/отклонено -->
        <a
          v-if="record.status === 1 || record.status === 3"
          @click="!isLoading && changeAchievementRequest(record.request, 2)"
        >
          Принять
        </a>
        <a-divider v-if="record.status === 1" type="vertical" />
        <template v-if="record.status === 1 || record.status === 2">
          <!-- отклоняем если статус принято -->
          <a @click="!isLoading && changeAchievementRequest(record.request, 3)">
            Отклонить
          </a>
        </template>
      </div>
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
import { Achievement, GradebookPage } from "../../../../../common/types/model";

@Component
export default class VModalChangeAchievementRequest extends mixins(
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
  /** список запросов на распределение */
  @Prop({ type: Array, default: [] }) readonly requests!: Achievement[];

  async changeAchievementRequest(
    value: Achievement,
    status: 1 | 2 | 3
  ): Promise<void> {
    // 1 - WAIT, 2 - APPROVED, 3- REJECTED
    this.isLoading = true;
    if (
      value.achievementId === null ||
      value.achievementId === undefined ||
      value.gradebookPage?.id === null ||
      value.gradebookPage?.id === undefined ||
      value.id === null ||
      value.id === undefined
    )
      return;
    const [response, error] = await api.rating.changeAchievementRequest(
      this.accessToken,
      value.achievementId,
      value.gradebookPage.id,
      value.id,
      status
    );
    if (response && !error) {
      const text =
        status === 2
          ? "Баллы успешно распределены"
          : "Заявка успешно отклонена";
      value.status = status;
      this.$notification.success({
        message: text,
        description: "",
      });
      this.$emit("successful"); // обновление данных в родительском элементе
    } else {
      console.warn(error);
      this.$notification.warning({
        message: "Не удалось распределить Баллы",
        description: "",
      });
    }

    this.isLoading = false;
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    return this.requests.map((item, index) => ({
      key: index,
      name: viewFullName(item.user?.profile ?? null, true),
      score: item.score,
      status: item.status,
      request: item,
    }));
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTable() {
    return [
      {
        title: "ФИО студента",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
      },
      {
        title: "Балл",
        dataIndex: "score",
        key: "score",
        align: "center",
        ellipsis: true,
        width: 200,
      },
      {
        title: "Действия",
        key: "action",
        width: 200,
        ellipsis: true,
        align: "center",
        scopedSlots: { customRender: "action" },
      },
    ];
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-modal-change-achievement-request {
  .ant-modal-body {
    padding: 0 !important;
    .ant-table-header-column {
      width: 100%;
    }
  }
}
</style>
