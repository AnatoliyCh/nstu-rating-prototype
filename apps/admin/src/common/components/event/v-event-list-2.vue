<template>
  <div class="v-event-list">
    <a-page-header title="Список: мероприятия" class="header-block">
      <template slot="extra">
        <a-button
          v-if="userAccess.event.createAchievement"
          key="2"
          @click="modalCreateAchievementVisible = true"
        >
          Наградить
        </a-button>
        <a-button
          v-if="userAccess.event.create"
          key="1"
          type="primary"
          @click="routing('event-create')"
        >
          Создать мероприятие
        </a-button>
      </template>
    </a-page-header>
    <div class="filters-wrapper">
      <div v-if="userAccess.event.create">
        <a-radio-group
          :default-value="null"
          button-style="solid"
          @change="setUserId('organizerId', $event.target.value)"
        >
          <a-radio-button :value="null"> Все </a-radio-button>
          <a-radio-button value="user"> Я организатор </a-radio-button>
        </a-radio-group>
      </div>
      <div v-else>
        <a-radio-group
          :default-value="null"
          button-style="solid"
          @change="setUserId('memberId', $event.target.value)"
        >
          <a-radio-button :value="null"> Все </a-radio-button>
          <a-radio-button value="user"> Я участник </a-radio-button>
        </a-radio-group>
      </div>
      <!-- даты -->
      <a-date-picker
        format="DD.MM.YYYY"
        placeholder="дата начала..."
        @change="changeDate($event, 'start')"
        allowClear
      />
      <label> - </label>
      <a-date-picker
        format="DD.MM.YYYY"
        placeholder="дата окончания..."
        @change="changeDate($event, 'end')"
        allowClear
      />
      <!-- статус -->
      <a-dropdown v-model="dropdownVisible">
        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
          {{ statusName }} <a-icon type="down" />
        </a>
        <a-menu slot="overlay" @click="dropdownVisible = true">
          <a-menu-item key="1" @click="changeStatus(null)">
            <label style="cursor: pointer"> Любой </label>
          </a-menu-item>
          <a-menu-item key="2" @click="changeStatus(10)">
            <label style="cursor: pointer"> Анонсировано </label>
          </a-menu-item>
          <a-menu-item key="3" @click="changeStatus(20)">
            <label style="cursor: pointer"> В процессе </label>
          </a-menu-item>
          <a-menu-item key="4" @click="changeStatus(40)">
            <label style="cursor: pointer"> Архивное </label>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <a-table
      :columns="columnsTable"
      :data-source="tableData"
      :loading="isDataLoading"
      :pagination="pagination"
      :scroll="{ y: 'calc(100vh - 15.5em)' }"
      @change="changePagination"
    >
      <div slot="info" slot-scope="record">
        <div class="body-wrapper">
          <div>
            <label v-if="record.name.length < 20" style="font-weight: bold">
              {{ record.name }}
            </label>
            <a-tooltip v-else :title="record.name">
              <label style="font-weight: bold">
                {{ `${record.name.slice(0, 20)}...` }}
              </label>
            </a-tooltip>
            <label> {{ record.dateStart }} - {{ record.dateEnd }} </label>
          </div>
          <div>
            <label> Организатор: {{ record.organizer }} </label>
            <label> {{ record.type }} </label>
          </div>
          <div>
            <label>
              Вид участия:
              {{ record.confirmation ? "с подтверждением" : "свободный" }}
            </label>
            <label>
              Участники: {{ record.membersSize }} / {{ record.maxMembers }}
            </label>
          </div>
          <div>
            <label v-if="record.address.length < 20">
              Место: {{ record.address }}
            </label>
            <a-tooltip v-else :title="record.address">
              <label> Место: {{ `${record.address.slice(0, 20)}...` }} </label>
            </a-tooltip>
            <label
              :style="{ color: record.statusColor, 'font-weight': 'bold' }"
            >
              {{ record.status }}
            </label>
          </div>
        </div>
      </div>
      <div slot="action" slot-scope="record">
        <a-tooltip title="Подробнее">
          <a-button
            icon="profile"
            size="large"
            @click="goEventDetails(record.id)"
            style="font-size: 24px"
          />
        </a-tooltip>
      </div>
    </a-table>
    <!-- модальное окно создания достижения (преп. для студента) -->
    <v-modal-create-achievement
      v-if="userAccess.event.createAchievement"
      v-model="modalCreateAchievementVisible"
    />
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import { viewFullName } from "@/common/filters";
import VBaseMixin from "@/common/v-base-mixin";
import VEventApiMixin from "@/common/v-event-api-mixin";
import VPaginationMixin from "@/common/v-pagination-mixin";
import { Moment } from "moment";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { OutstudyEvent, TypeEvent } from "../../../../../common/types/model";

@Component
export default class VEventList2 extends mixins(
  VBaseMixin,
  VEventApiMixin,
  VPaginationMixin
) {
  events: OutstudyEvent[] = []; // массив мероприятий
  typesEvent: TypeEvent[] = []; // типы мероприятий

  modalCreateAchievementVisible = false; // видимость окна для распределения

  // фильтры
  dateStart: Date | null = null;
  dateEnd: Date | null = null;
  status: number | null = null;
  memberId: number | null = null;
  organizerId: number | null = null;
  dropdownVisible = false;

  async created(): Promise<void> {
    this.menuKey = [1];
    if (this.userAccess.event.viewList) {
      await this.getEvents();
      this.typesEvent = await this.getEventTypes();
    }
  }
  // получение мероприятий
  async getEvents(): Promise<void> {
    if (!this.userAccess.event.viewList) return;
    this.isDataLoading = true;
    const [response, error] = await api.event.getEvents(
      this.accessToken,
      this.offset,
      this.pagination.pageSize,
      this.dateStart,
      this.dateEnd,
      this.status,
      this.memberId,
      this.organizerId
    );
    if (!error && response) {
      this.events = response.data ?? [];
      this.pagination.total = response.size ?? 0;
    } else if (error && this.$router.currentRoute.name === "event-list") {
      console.warn(error);
      this.$notification.error({
        message: "Не удалось загрузить мероприятия",
        description: "",
      });
    }
    this.isDataLoading = false;
  }
  // переход на страницу просмотра меропрития
  goEventDetails(idEvent: number | null): void {
    if (idEvent === null || idEvent === undefined) return;
    this.routing("event-details", { id: idEvent.toString() });
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    return this.events.map((item, index) => {
      const findType = this.typesEvent.find(
        (type) => type.id === item.eventKindId
      );
      return {
        key: index,
        id: item.id,
        name: item.name,
        dateStart: new Date(item.dateStart ?? "").toLocaleDateString(),
        dateEnd: new Date(item.dateEnd ?? "").toLocaleDateString(),
        organizer: viewFullName(item.organizer?.user?.profile ?? null, true),
        type: findType?.name ?? "",
        confirmation: item.isNeedMemberConfirmation, // вид участия
        minMembers: item.minMembers,
        maxMembers: item.maxMembers,
        membersSize: item.membersSize ?? 0,
        address: item.address,
        status: this.getStatusToString(item.status),
        statusColor: this.getStatusColor(item.status),
      };
    });
  }
  /** статус в строку */
  getStatusToString(status: number | null | undefined): string {
    switch (status) {
      case 10:
        return `Анонсировано`;
      case 20:
        return `В процессе`;
      case 30:
        return `Завершено`;
      case 40:
        return `В архиве`;
      default:
        return ``;
    }
  }
  /** статус в строку */
  getStatusColor(status: number | null | undefined): string {
    switch (status) {
      case 10: // Анонс
        return "#1890ff";
      case 20: // В процессе
        return "#52c41a";
      case 30: // завершено
        return "orange";
      case 40: // В архиве
        return "#ff4d4f";
      default:
        return "gray";
    }
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTable() {
    return [
      {
        // title: "",
        key: "info",
        ellipsis: true,
        scopedSlots: { customRender: "info" },
      },
      {
        // title: "",
        key: "action",
        width: 200,
        ellipsis: true,
        align: "center",
        scopedSlots: { customRender: "action" },
      },
    ];
  }
  /** переключение страниц */
  async changePagination(
    pagination: VPaginationMixin["pagination"]
  ): Promise<void> {
    this.pagination.current = pagination.current;
    await this.getEvents();
  }
  //* фильтры
  async changeDate(value: Moment | null, type: "start" | "end"): Promise<void> {
    if (type === "start") {
      this.dateStart = value ? new Date(value.toString()) : null;
      this.dateStart instanceof Date && this.dateStart.setHours(0, 0, 0, 0);
    }
    if (type === "end") {
      this.dateEnd = value ? new Date(value.toString()) : null;
      this.dateEnd instanceof Date && this.dateEnd.setHours(23, 59, 59, 59);
    }
    this.pagination.current = 1;
    await this.changePagination(this.pagination);
  }
  /** изм. статуса */
  async changeStatus(value: number | null) {
    this.status = value;
    await this.changePagination({ ...this.pagination, current: 1 });
  }
  /** название статуса */
  get statusName(): string {
    switch (this.status) {
      case 10:
        return `Статус: Анонсировано`;
      case 20:
        return `Статус: В процессе`;
      case 40:
        return `Статус: В архиве`;
      default:
        return `Статус: Любой`;
    }
  }
  /** я организатор */
  async setUserId(type: "organizerId" | "memberId", value: null | string) {
    if (type === "memberId")
      this.memberId = value ? this.currentUser?.id ?? null : null;
    if (type === "organizerId")
      this.organizerId = value ? this.currentUser?.id ?? null : null;
    await this.changePagination({ ...this.pagination, current: 1 });
  }
}
</script>

<style lang="scss">
.v-event-list {
  thead {
    display: none;
  }
  > .v-event-list-body {
    margin: 0px 16px;
    .v-event-list-card {
      cursor: default;
    }
  }
  .body-wrapper {
    display: flex;
    > div {
      display: flex;
      flex-direction: column;
      margin-right: 20px;
      width: 250px;
      > label {
        overflow: hidden;
        text-overflow: ellipsis;
        :first-child {
          margin-bottom: 8px;
        }
      }
    }
  }
  .filters-wrapper {
    display: flex;
    // justify-content: flex-end;
    align-items: center;
    > * {
      // margin-right: 8px;
      margin-left: 8px;
    }
  }
}
</style>
