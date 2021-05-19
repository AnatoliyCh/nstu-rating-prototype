<template>
  <div class="v-event-details-info">
    <a-card>
      <!-- тип -->
      <div class="vertical-margin-element-8">
        <label>
          Тип: <label style="font-weight: bold"> {{ type }} </label>
        </label>
      </div>
      <!-- даты -->
      <div class="vertical-margin-element-8">
        <label> Дата проведения: {{ dateStart }} - {{ dateEnd }} </label>
      </div>
      <!-- место -->
      <div class="vertical-margin-element-8">
        <label>
          Место проведения:
          <label v-if="address && address.length < 20"> {{ address }} </label>
          <a-tooltip v-else-if="address" :title="address">
            <label> {{ `${address.slice(0, 20)}...` }} </label>
          </a-tooltip>
        </label>
      </div>
      <!-- кол-во участников -->
      <div class="vertical-margin-element-8">
        <label> Участники: {{ minMaxMembers }} </label>
      </div>
      <!-- статус -->
      <div class="vertical-margin-element-8">
        <label>
          Статус:
          <label :style="{ color: statusColor, 'font-weight': 'bold' }">
            {{ getStatusToString(status) }}
          </label>
        </label>
      </div>
      <div class="vertical-margin-element-8">
        <a-space>
          <template v-if="isOrganizer">
            <!-- начать мероприятие -->
            <a-tooltip
              v-if="isOrganizer && status === 10"
              title="Начать мероприятие"
            >
              <a-button
                class="btn-green"
                icon="flag"
                type="primary"
                @click="changeStatus(20)"
              />
            </a-tooltip>
            <!-- закончить мероприятие -->
            <a-tooltip
              v-else-if="isOrganizer && status === 20"
              title="Закончить мероприятие"
            >
              <a-button
                class="btn-green"
                icon="check"
                type="primary"
                @click="changeStatus(30)"
              />
            </a-tooltip>
          </template>
          <!-- принятие заявок -->
          <a-tooltip
            v-if="isOrganizer && isRequestMember"
            title="Заявки на участие"
          >
            <a-button
              icon="usergroup-add"
              type="primary"
              @click="() => $emit('requestsMembersVisible')"
            />
          </a-tooltip>
          <!-- участвовать -->
          <a-tooltip v-if="isJoin && !isMember" title="Участвовать">
            <a-button icon="user-add" type="primary" @click="registration" />
          </a-tooltip>
          <!-- сообщение в ленту -->
          <a-tooltip
            v-if="(isOrganizer || isMember) && ![30, 40].includes(status)"
            title="Сообщение в ленту"
          >
            <a-button
              icon="message"
              type="primary"
              @click="() => $emit('addMessageVisible')"
            />
          </a-tooltip>
          <!-- в архив -->
          <a-tooltip
            v-if="isOrganizer && status && status !== 40"
            title="Архивировать"
          >
            <a-button icon="delete" type="danger" @click="changeStatus(40)" />
          </a-tooltip>
        </a-space>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts">
import VEventApiMixin from "@/common/v-event-api-mixin";
import VBaseMixin from "@/common/v-base-mixin";
import Component, { mixins } from "vue-class-component";
import { Prop } from "vue-property-decorator";
import {
  OutstudyEvent,
  TypeEvent,
  Request,
  User,
} from "../../../../../../common/types/model";
import api from "@/common/api";

@Component
export default class VEventDetailsInfo extends mixins(
  VBaseMixin,
  VEventApiMixin
) {
  @Prop({ type: Object, default: null }) readonly event!: OutstudyEvent | null;
  @Prop({ type: Array, default: [] }) readonly members!: User[];
  @Prop({ type: Number, default: 0 }) readonly requestMembersCount!: number;

  types: TypeEvent[] = []; // все типы мероприятияй
  api: any;

  // назвение
  get name(): string | null {
    return this.event?.name ?? null;
  }
  set name(value: string | null) {
    if (!this.event) return;
    this.event.name = value;
  }
  // тип
  get type(): string {
    if (
      this.event?.eventKindId === null ||
      this.event?.eventKindId === undefined
    )
      return "";
    const type = this.types.filter(
      (item) => item.id === this.event?.eventKindId
    );
    return type.length > 0 ? type[0].name ?? "" : "";
  }
  // даты
  get dateStart(): string | null {
    return new Date(this.event?.dateStart ?? "").toLocaleDateString();
  }
  get dateEnd(): string | null {
    return new Date(this.event?.dateEnd ?? "").toLocaleDateString();
  }
  // место
  get address(): string | null {
    return this.event?.address ?? null;
  }
  // кол-во участников
  get minMaxMembers(): string | null {
    return `${this.event?.minMembers ?? ""} - ${this.event?.maxMembers ?? ""}`;
  }
  // статус
  get status(): number | null {
    return this.event?.status ?? null;
  }
  get statusColor(): string | null {
    return this.getStatusColor(this.event?.status);
  }
  // тек. организатор (или админ или тьютор)
  get isOrganizer(): boolean {
    return (
      this.currentUser?.id === this.event?.organizer?.user?.id ||
      this.getIsContainsAccessRole(["администратор", "тьютор"])
    );
  }
  // заявки
  get isRequestMember(): boolean {
    return (
      (this.event?.isNeedMemberConfirmation &&
        this.requestMembersCount > 0 &&
        [10, 20].includes(this.status ?? -1)) ??
      false
    );
  }
  // я могу участвовать
  get isJoin() {
    return this.userAccess.event.join && [10, 20].includes(this.status ?? -1);
  }
  // я уже участник
  get isMember() {
    return this.members.some((item) => item.id === this.currentUser?.id);
  }

  async created() {
    this.types = await this.getEventTypes();
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
        return "#ff4d4f";
      case 40: // В архиве
        return "#ff4d4f";
      default:
        return "gray";
    }
  }
  // регистрация тек. пользователя в мероприятии
  async registration(): Promise<void> {
    this.isLoading = true;
    if (!this.event?.id) return;
    const [response, error] = await api.event.memberEventRegistration(
      this.accessToken,
      this.event.id
    );
    if (response && !error) {
      const label = this.event.isNeedMemberConfirmation
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
    }
    this.$emit("addMember");
    this.isLoading = false;
  }
  async changeStatus(status: number) {
    if (!this.event?.id) return;
    this.isLoading = true;
    const [response, error] = await api.event.сhangeEventStatus(
      this.accessToken,
      this.event.id,
      status
    );
    if (response && this.event) this.event.status = status;
    this.isLoading = false;
  }
}
</script>

<style lang="scss">
.v-event-details-info {
  > div.ant-card.ant-card-bordered {
    border-top: none;
    border-left: none;
    border-radius: 0;
    .ant-card-body {
      padding: 16px !important;

      button.ant-btn {
        font-size: 16px;
      }

      .btn-green {
        background-color: #52c41a !important;
        border-color: #52c41a !important;
      }
    }
  }
}
</style>
