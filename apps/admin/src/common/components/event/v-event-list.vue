<template>
  <div class="v-event-list">
    <a-page-header title="Список: мероприятия" class="header-block">
      <template slot="extra">
        <!-- действия для орг. и админа -->
        <a-button key="2" @click="routing('event-create-type')">
          Создать тип мероприятия
        </a-button>
        <a-button key="1" type="primary" @click="routing('event-create')">
          Создать мероприятие
        </a-button>
      </template>
    </a-page-header>
    <!-- загрузка -->
    <a-spin v-if="isLoading" class="spin-width">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
    </a-spin>
    <!-- пусто -->
    <a-empty v-else-if="!isLoading && !outstudyEvents.length" />
    <!-- список -->
    <div
      v-else-if="!isLoading && outstudyEvents.length"
      class="v-event-list-body"
    >
      <a-card
        v-for="(event, index) in viewModel"
        :key="index"
        :title="event.name"
        class="vertical-margin-element-24"
        hoverable
      >
        <div class="vertical-margin-element-24">
          <label>Организатор </label>
          <a-input :value="event.organizer" disabled />
        </div>
        <div class="vertical-margin-element-24">
          <label>Тип мероприятия </label>
          <a-input :value="event.type" disabled />
        </div>
        <div class="vertical-margin-element-24">
          <label>Дата начала </label>
          <a-date-picker
            :value="event.dateStart"
            show-time
            format="YYYY-MM-DD HH:mm"
            style="width: 100%"
            disabled
          />
        </div>
        <div class="vertical-margin-element-24">
          <label>Дата окончания </label>
          <a-date-picker
            :value="event.dateEnd"
            show-time
            format="YYYY-MM-DD HH:mm"
            style="width: 100%"
            disabled
          />
        </div>
        <div class="vertical-margin-element-24">
          <label>Адрес </label>
          <a-textarea
            :value="event.address"
            placeholder="Адрес мероприятия"
            :auto-size="{ minRows: 2, maxRows: 2 }"
            disabled
          />
        </div>
        <div class="vertical-margin-element-24">
          <a-space :size="24">
            <a-button type="primary" @click="registration(event.id)">
              {{ event.isNeedMemberConfirmation ? "Заявка" : "Участвовать" }}
            </a-button>
            <a-button @click="goEventDetails(event.id)"> Подробнее </a-button>
          </a-space>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import { viewFullName } from "@/common/filters";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { OutstudyEvent, TypeEvent } from "../../../../../common/types/model";

@Component
export default class VEventList extends mixins(VBaseMixin) {
  outstudyEvents: OutstudyEvent[] = []; // массив мероприятий
  typesEvent: TypeEvent[] = []; // типы мероприятий
  sizeEvents = 0; // для пагинации

  async created(): Promise<void> {
    this.isLoading = true;
    const [response, error] = await api.event.getEvents(
      this.accessToken,
      0,
      20
    );
    if (!error && response) {
      this.outstudyEvents = response.data ?? [];
      response.size && (this.sizeEvents = response.size);
    } else {
      console.error(error);
      this.$notification.error({
        message: "Не удалось загрузить мероприятия",
        description: "",
      });
    }
    await this.getEventTypes();
    this.isLoading = false;
  }
  // получение типов мероприятия
  async getEventTypes(): Promise<void> {
    const [response, error] = await api.event.getEventTypes(this.accessToken);
    if (response && !error) {
      this.typesEvent = response;
    } else {
      console.error(error);
      this.$notification.error({
        message: "Не удалось загрузить типы мероприятия",
        description: "",
      });
    }
  }
  // модель для отображения
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
  goEventDetails(idEvent: number | null) {
    if (!idEvent) return;
    this.$router.push({
      name: "event-details",
      params: { id: idEvent.toString() },
    });
  }
}
</script>

<style lang="scss">
.v-event-list {
  > .v-event-list-body {
    padding-top: 16px;
    width: 40%;
    margin: auto;
  }
}
</style>
