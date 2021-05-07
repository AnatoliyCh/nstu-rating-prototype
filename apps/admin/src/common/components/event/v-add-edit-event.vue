<template>
  <div class="v-add-edit-event">
    <a-page-header
      title="Создание: мероприятие"
      class="header-block"
      @back="routing('event-list')"
    />
    <!-- основные блоки -->
    <a-row :gutter="16" class="vertical-margin-element-16">
      <a-col :span="8">
        <a-card title="Основная информация" hoverable>
          <div class="vertical-margin-element-24">
            <label class="required-label">Название </label>
            <a-input v-model="outstudyEvent.name" allowClear />
          </div>
          <div class="vertical-margin-element-24">
            <label class="required-label">Тип мероприятия </label>
            <a-select
              :value="selectedTypeEvent"
              style="width: 100%"
              @change="typesEventChange"
            >
              <a-select-option
                v-for="(type, index) in typesEvent"
                :value="type.id"
                :key="index"
                >{{ type.name ? type.name : "-" }}</a-select-option
              >
            </a-select>
          </div>
          <a-button
            type="primary"
            :disabled="!disabledButton"
            @click="createEvent"
          >
            Создать
          </a-button>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="Дата и место проведения" hoverable>
          <div class="vertical-margin-element-24">
            <!-- дата начала -->
            <label class="required-label">Дата начала </label>
            <a-date-picker
              show-time
              format="DD.MM.YYYY HH:mm"
              @change="dateChange($event, 'start')"
              style="width: 100%"
            />
          </div>
          <!-- дата окончания -->
          <div class="vertical-margin-element-24">
            <label class="required-label">Дата окончания </label>
            <a-date-picker
              show-time
              format="DD.MM.YYYY HH:mm"
              @change="dateChange($event, 'end')"
              style="width: 100%"
            />
          </div>
          <!-- дата окончания регистрации -->
          <div class="vertical-margin-element-24">
            <label>Дата окончания регистрации </label>
            <a-date-picker
              show-time
              format="DD.MM.YYYY HH:mm"
              @change="dateChange($event, 'regEnd')"
              style="width: 100%"
            />
          </div>
          <div class="vertical-margin-element-24">
            <label class="required-label">Место проведения </label>
            <a-input v-model="outstudyEvent.address" allowClear />
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="Участники и место участия" hoverable>
          <div class="vertical-margin-element-24">
            <label>Минимум участников </label>
            <a-input-number
              v-model="outstudyEvent.minMembers"
              :min="0"
              allowClear
              style="width: 100%"
            />
          </div>
          <div class="vertical-margin-element-24">
            <label>Максимум участников </label>
            <a-input-number
              v-model="outstudyEvent.maxMembers"
              :min="outstudyEvent.minMembers"
              allowClear
              style="width: 100%"
            />
          </div>
          <div class="vertical-margin-element-24" style="height: 54px">
            <label>Вид участия </label>
            <a-radio-group
              v-model="outstudyEvent.isNeedMemberConfirmation"
              style="width: 100%"
            >
              <a-radio :value="false"> Свободный </a-radio>
              <a-radio :value="true">
                Требуется подтверждение организатора
              </a-radio>
            </a-radio-group>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <!-- описание -->
    <a-row :gutter="16" class="vertical-margin-element-16">
      <a-col :span="16">
        <a-card title="Описание мероприятия" hoverable>
          <a-textarea
            v-model="outstudyEvent.description"
            placeholder="Описание мероприятия"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            allowClear
          />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import VEventApiMixin from "@/common/v-event-api-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { OutstudyEvent, TypeEvent } from "../../../../../common/types/model";
import { Moment } from "moment";

@Component
export default class VAddEditEvent extends mixins(VBaseMixin, VEventApiMixin) {
  // типы мероприятия
  typesEvent: TypeEvent[] = [];
  // мероприятие
  outstudyEvent: OutstudyEvent = {
    name: null,
    outstudyEventKindId: null,
    status: 1,
    dateStart: null,
    dateEnd: null,
    address: "",
    minMembers: 0,
    maxMembers: 10,
    isNeedMemberConfirmation: false,
    description: null,
    dateRegistrationEnd: null,
  };

  async created(): Promise<void> {
    this.menuKey = [1];
    this.isLoading = true;
    this.typesEvent = await this.getEventTypes();
    this.isLoading = false;
  }
  //* типы мероприятия
  // изменение типа мероприятия
  typesEventChange(value: number | null): void {
    if (!value) return;
    this.outstudyEvent.outstudyEventKindId = value;
  }
  // выбранный тип мероприятия
  get selectedTypeEvent(): string {
    if (!this.outstudyEvent.outstudyEventKindId) return "";
    const find = this.typesEvent.find(
      (item) => item.id === this.outstudyEvent.outstudyEventKindId
    );
    return find?.name ?? "";
  }
  /** изменение дат */
  dateChange(value: Moment | null, type: "start" | "regEnd" | "end"): void {
    switch (type) {
      case "start":
        this.outstudyEvent.dateStart = value
          ? new Date(value.toString()).toISOString()
          : null;
        break;
      case "regEnd":
        this.outstudyEvent.dateRegistrationEnd = value
          ? new Date(value.toString()).toISOString()
          : null;
        break;
      case "end":
        this.outstudyEvent.dateEnd = value
          ? new Date(value.toString()).toISOString()
          : null;
        break;
      default:
        break;
    }
  }
  // блокировка кнопки
  get disabledButton(): boolean {
    return (
      Boolean(this.outstudyEvent.name) &&
      Boolean(this.outstudyEvent.outstudyEventKindId) &&
      Boolean(this.outstudyEvent.dateStart) &&
      Boolean(this.outstudyEvent.dateEnd) &&
      Boolean(this.outstudyEvent.address) &&
      this.isLoading === false
    );
  }
  // создание мероприятия
  async createEvent(): Promise<void> {
    this.isLoading = true;
    const [response, error] = await api.event.createEvent(
      this.accessToken,
      this.outstudyEvent
    );
    if (response && !error) {
      this.$notification.success({
        message: "Мероприятие создано",
        description: `Название: ${this.outstudyEvent.name}`,
      });
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoading = false;
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-add-edit-event {
  > .ant-row {
    padding: 0px 16px;
    .ant-card-head-title {
      text-align: center;
    }
  }
}
</style>
