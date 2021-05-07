<template>
  <div class="v-event-list">
    <a-page-header title="Список: мероприятия" class="header-block">
      <template slot="extra">
        <a-tooltip title="Заявка принята">
          <a-checkbox key="5" v-model="isConfirmed" />
        </a-tooltip>
        <a-date-picker
          show-time
          key="4"
          format="DD.MM.YYYY HH:mm"
          placeholder="дата начала..."
          @change="dateChange($event, 'start')"
          allowClear
        />
        <a-date-picker
          show-time
          key="3"
          format="DD.MM.YYYY HH:mm"
          placeholder="дата окончания..."
          @change="dateChange($event, 'end')"
          allowClear
        />
        <a-button
          v-if="userAccess.eventType.create"
          key="2"
          @click="routing('event-type-create')"
        >
          Создать тип мероприятия
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
    <!-- список -->
    <a-list
      :grid="gridList"
      :data-source="viewModel"
      :loading="isLoading"
      class="v-event-list-body"
    >
      <!-- кнопка загрузить ещё -->
      <div
        v-if="!isLoading && pagination.total !== outstudyEvents.length"
        slot="loadMore"
        :style="{
          textAlign: 'center',
          marginBottom: '12px',
          height: '32px',
          lineHeight: '32px',
        }"
      >
        <a-spin v-if="isDataLoading" />
        <a-button v-else @click="changePagination"> Загрузить ещё... </a-button>
      </div>
      <!-- элемент -->
      <a-list-item slot="renderItem" slot-scope="event">
        <a-card
          :title="event.name"
          class="vertical-margin-element-16 v-event-list-card"
          hoverable
        >
          <!-- доп. действия в заголовке -->
          <div slot="extra">
            <a-tooltip title="Скопировать ссылку на мероприятие">
              <a-button icon="link" @click="saveLinkToevent(event.id)" />
            </a-tooltip>
          </div>
          <!-- тело -->
          <div class="vertical-margin-element-16">
            <label>Организатор </label>
            <a-input :value="event.organizer" disabled />
          </div>
          <div class="vertical-margin-element-16">
            <label>Тип мероприятия </label>
            <a-input :value="event.type" disabled />
          </div>
          <div class="vertical-margin-element-16">
            <label>Дата начала </label>
            <a-date-picker
              :value="event.dateStart"
              show-time
              format="DD.MM.YYYY HH:mm"
              style="width: 100%"
              disabled
            />
          </div>
          <div class="vertical-margin-element-16">
            <label>Дата окончания </label>
            <a-date-picker
              :value="event.dateEnd"
              show-time
              format="DD.MM.YYYY HH:mm"
              style="width: 100%"
              disabled
            />
          </div>
          <div class="vertical-margin-element-16">
            <label>Адрес </label>
            <a-textarea
              :value="event.address"
              placeholder="Адрес мероприятия"
              :auto-size="{ minRows: 2, maxRows: 2 }"
              disabled
            />
          </div>
          <div class="vertical-margin-element-16">
            <a-space :size="24">
              <a-button type="primary" @click="registration(event.id)">
                {{ event.isNeedMemberConfirmation ? "Заявка" : "Участвовать" }}
              </a-button>
              <a-button @click="goEventDetails(event.id)"> Подробнее </a-button>
            </a-space>
          </div>
        </a-card>
      </a-list-item>
    </a-list>
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
export default class VEventList extends mixins(
  VBaseMixin,
  VEventApiMixin,
  VPaginationMixin
) {
  outstudyEvents: OutstudyEvent[] = []; // массив мероприятий
  typesEvent: TypeEvent[] = []; // типы мероприятий
  //* фильтры
  dateStart: Date | null = null;
  dateEnd: Date | null = null;
  status: number | null = null;
  isConfirmed = false;

  async created(): Promise<void> {
    this.menuKey = [1];
    this.isLoading = true;
    this.pagination.pageSize = 8;
    if (this.userAccess.event.viewList) {
      await this.getEvents();
      this.typesEvent = await this.getEventTypes();
    }
    this.isLoading = false;
  }
  // получение мероприятий
  async getEvents(): Promise<void> {
    if (!this.userAccess.event.viewList) return;
    const [response, error] = await api.event.getEvents(
      this.accessToken,
      this.offset,
      this.pagination.pageSize,
      this.dateStart,
      this.dateEnd,
      this.status,
      this.isConfirmed
    );
    if (!error && response) {
      const newEvents = response.data ?? [];
      this.outstudyEvents = this.outstudyEvents.concat(newEvents);
      this.pagination.total = response.size ?? 0;
      !response.data?.length && this.pagination.current--;
    } else if (error && this.$router.currentRoute.name === "event-list") {
      this.pagination.current--;
      console.warn(error);
      this.$notification.error({
        message: "Не удалось загрузить мероприятия",
        description: "",
      });
    } else this.pagination.current--;
  }
  // модель для отображения
  // eslint-disable-next-line
  get viewModel() {
    return this.outstudyEvents.map((item) => {
      const findType = this.typesEvent.find(
        (type) => type.id === item.eventKindId
      );
      item.address;
      return {
        id: item.id,
        name: item.name,
        organizer: viewFullName(item.organizer?.user?.profile ?? null, true),
        type: findType?.name ?? null,
        dateStart: item.dateStart,
        dateEnd: item.dateEnd,
        address: item.address,
        isNeedMemberConfirmation: item.isNeedMemberConfirmation,
      };
    });
  }
  // грид
  // eslint-disable-next-line
  get gridList() {
    return {
      gutter: 16,
      xs: 1,
      sm: 1,
      md: 2,
      lg: 2,
      xl: 3,
      xxl: 4,
    };
  }
  // регистрация тек. пользователя в мероприятии
  async registration(idEvent: number | null): Promise<void> {
    if (!idEvent) return;
    const [response, error] = await api.event.memberEventRegistration(
      this.accessToken,
      idEvent
    );
    if (!error && response) {
      console.info(response);
      const event = this.outstudyEvents.find((item) => item.id === idEvent);
      if (!event) return;
      const label = event.isNeedMemberConfirmation
        ? "Заявка на участие подана"
        : "Вы зарегистрированы";
      this.$notification.success({
        message: label,
        description: "",
      });
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
  }
  // переход на страницу просмотра меропрития
  goEventDetails(idEvent: number | null): void {
    if (idEvent === null || idEvent === undefined) return;
    this.routing("event-details", { id: idEvent.toString() });
  }
  /** сохранение ссылки на мероприятие в буфер */
  saveLinkToevent(eventId: number | null | undefined): void {
    if (eventId === null || eventId === undefined) return;
    const path =
      window.location.origin +
      "/" +
      this.$router.resolve({
        name: "event-details",
        params: { id: eventId.toString() },
      }).href;
    const input = document.createElement("input");
    document.body.append(input);
    input.value = path;
    input.select();
    document.execCommand("copy");
    input.remove();
    this.$notification.success({
      message: "Ссылка скопирована",
      description: path,
    });
  }
  /** подгрузка элементов */
  async changePagination(): Promise<void> {
    this.pagination.current++;
    this.isDataLoading = true;
    await this.getEvents();
    this.isDataLoading = false;
  }
  //* фильтры
  async dateChange(value: Moment | null, type: "start" | "end"): Promise<void> {
    if (type === "start")
      this.dateStart = value ? new Date(value.toString()) : null;
    if (type === "end")
      this.dateEnd = value ? new Date(value.toString()) : null;
    this.pagination.current = 0;
    await this.changePagination();
  }
}
</script>

<style lang="scss">
.v-event-list {
  > .v-event-list-body {
    margin: 0px 16px;
    .v-event-list-card {
      cursor: default;
    }
  }
}
</style>
