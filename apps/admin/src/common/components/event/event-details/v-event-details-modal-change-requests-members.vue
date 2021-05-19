<template>
  <a-modal
    :visible="value"
    @change="changeVisible"
    title="Заявки на учстие"
    centered
    :cancel-button-props="{ props: { disabled: Boolean(isLoading) } }"
    :footer="null"
    :width="700"
    class="v-event-details-modal-change-requests-members"
  >
    <a-table
      :columns="columnsTable"
      :data-source="tableData"
      :loading="isDataLoading"
      :pagination="pagination"
      :scroll="{ y: 'calc(100vh - 16em)' }"
      size="small"
    >
      <span slot="action" slot-scope="item">
        <template v-if="item.status === 'принято'">
          <a-button type="danger" @click="changeRequest(item.id, 3)">
            Отклонить
          </a-button>
        </template>
        <template v-else-if="item.status === 'отказано'">
          <a-button @click="changeRequest(item.id, 2)"> Принять </a-button>
        </template>
        <template v-else>
          <a-button @click="changeRequest(item.id, 2)"> Принять </a-button>
          <a-divider type="vertical" />
          <a-button type="danger" @click="changeRequest(item.id, 3)">
            Отклонить
          </a-button>
        </template>
      </span>
    </a-table>
  </a-modal>
</template>
<script lang="ts">
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component, Emit, Model, Prop } from "vue-property-decorator";
import {
  User,
  Discipline,
  Request,
} from "../../../../../../common/types/model";
import VPaginationMixin from "@/common/v-pagination-mixin";
import { GradebookPageCreate } from "../../../../../../common/types/api";
import { viewFullName } from "@/common/filters";
import api from "@/common/api";
/** заявки на участие в мероприятии */
@Component
export default class VEventDetailsModalChangeRequestsMembers extends mixins(
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
  @Prop({ type: Array, default: [] }) readonly requestsMembers!: Request[];

  // принятие/отклонение заявок
  async changeRequest(
    idRequest: number,
    status: 1 | 2 | 3 | null
  ): Promise<void> {
    if (!this.eventId || !status) return;
    this.isDataLoading = true;
    const [response, error] = await api.event.memberEventRequestChange(
      this.accessToken,
      this.eventId,
      idRequest,
      status
    );
    if (response && !error) {
      const find = this.requestsMembers.find((x) => x.id === idRequest);
      if (find) {
        find.status = status;
        this.$emit("changeRequest");
      }
    } else if (error && this.$router.currentRoute.name === "event-details") {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    }
    this.isDataLoading = false;
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    return this.requestsMembers.map((item, index) => {
      let newStatus = "";
      if (item.status === 1) newStatus = "новая заявка";
      else if (item.status === 2) newStatus = "принято";
      else if (item.status === 3) newStatus = "отказано";
      return {
        key: index,
        id: item.id,
        name: viewFullName(item.user?.profile ?? null, false),
        status: newStatus,
      };
    });
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
        title: "Статус",
        dataIndex: "status",
        key: "status",
        width: 150,
      },
      {
        title: "Действия",
        key: "action",
        scopedSlots: { customRender: "action" },
        align: "center",
        width: 200,
      },
    ];
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
