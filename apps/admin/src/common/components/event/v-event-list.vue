<template>
  <div class="v-event-list">
    <!-- действия для орг. и админа -->
    <div class="v-event-list-actions">
      <a-space :size="24">
        <label>Действия: </label>
        <a-button type="primary" @click="routing('event-create')">
          Создать мероприятие
        </a-button>
        <a-button @click="routing('event-create-type')">
          Создать тип мероприятия
        </a-button>
      </a-space>
    </div>
    <!-- список -->
    <div class="v-event-list-body">
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
            <a-button type="primary" @click="registration(event.id)"
              >Заявка</a-button
            >
            <a-button>Подробнее</a-button>
          </a-space>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import VBaseMixin from "@/common/v-base-mixin";
import { OutstudyEvent, TypeEvent } from "../../../../../common/types/model";
import { viewFullName } from "@/common/filters";
import api from "@/common/api";

@Component
export default class VEventList extends mixins(VBaseMixin) {
  outstudyEvents: OutstudyEvent[] = []; // массив мероприятий
  typesEvent: TypeEvent[] = []; // типы мероприятий
  sizeEvents = 0; // для пагинации

  async created(): Promise<void> {
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
      };
    });
  }
  // регистрация тек. пользователя в мероприятии
  async registration(idEvent: number | null) {
    if (!idEvent) return;
    const [response, error] = await api.event.memberEventRegistration(
      this.accessToken,
      idEvent
    );
    if (!error && response) {
      console.log(response);
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
  }
}
</script>

<style lang="scss">
.v-event-list {
  > .v-event-list-actions {
    display: flex;
    height: 64px;
    padding: 8px;
    border-block-end: 1px solid #e8e8e8;
  }
  > .v-event-list-body {
    padding-top: 16px;
    width: 40%;
    margin: auto;
  }
}
</style>