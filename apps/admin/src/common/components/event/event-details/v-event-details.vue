<template>
  <div class="v-event-details">
    <a-page-header
      :title="eventName"
      class="v-event-details-header-block"
      @back="routing('event-list')"
    >
      <!-- <template slot="extra">
          <a-button key="3" @click="goChatDetails"> Чат мероприятия </a-button>
          <a-button
            v-if="userAccess.event.delete"
            key="2"
            type="danger"
            @click="deleteEvent"
          >
            Удалить
          </a-button>
          <a-button
            v-if="membersConfirmationAcces"
            key="1"
            type="primary"
            @click="showModalRequest"
          >
            Заявки участиников
          </a-button>
        </template> -->
    </a-page-header>
    <div class="v-event-details-body">
      <a-row :gutter="24">
        <a-col :span="5">
          <!-- информация -->
          <v-event-details-info
            :event="event"
            :members="members"
            :requestMembersCount="requests.length"
            @addMember="getMembers()"
            @requestsMembersVisible="modalRequestsMembersVisible = true"
            @addMessageVisible="modalAddMessageVisible = true"
            @rewardMembersVisible="modalRewardMembersVisible = true"
          />
          <!-- участники -->
          <v-event-details-members
            v-if="event"
            :members="members"
            :eventId="event.id"
          />
        </a-col>
        <a-col :span="14">
          <!-- чат/лог -->
          <v-event-details-chat
            v-if="event && event.chat"
            :key="keyChat"
            :chatId="event.chat.id"
          />
        </a-col>
      </a-row>
      <!-- сообщение в чат -->
      <v-event-details-modal-add-message
        v-model="modalAddMessageVisible"
        v-if="event && event.chat"
        :chatId="event.chat.id"
        @newMessage="keyChat++"
      />
      <!-- принятие заявок -->
      <v-event-details-modal-change-requests-members
        v-model="modalRequestsMembersVisible"
        v-if="event"
        :eventId="event.id"
        :requestsMembers="requests"
        @changeRequest="getMembers()"
      />
      <!-- наградить за места -->
      <v-event-details-modal-change-reward-members
        v-model="modalRewardMembersVisible"
        v-if="event && members.length"
        :eventId="event.id"
        :members="members"
      />
    </div>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import { viewFullName } from "@/common/filters";
import VBaseMixin from "@/common/v-base-mixin";
import VEventApiMixin from "@/common/v-event-api-mixin";
import { mixins } from "vue-class-component";
import Component from "vue-class-component";
import {
  Criteria,
  Message,
  OutstudyEvent,
  Request,
  TypeEvent,
  User,
} from "../../../../../../common/types/model";
import VEventDetailsInfo from "./v-event-details-info.vue";
import VEventDetailsMembers from "./v-event-details-members.vue";
import VEventDetailsChat from "./v-event-details-chat.vue";
import VEventDetailsModalAddMessage from "./v-event-details-modal-add-message.vue";
import VEventDetailsModalChangeRequestsMembers from "./v-event-details-modal-change-requests-members.vue";
import VEventDetailsModalChangeRewardMembers from "./v-event-details-modal-change-reward-members.vue";

@Component({
  components: {
    "v-event-details-info": VEventDetailsInfo,
    "v-event-details-members": VEventDetailsMembers,
    "v-event-details-chat": VEventDetailsChat,
    "v-event-details-modal-add-message": VEventDetailsModalAddMessage,
    "v-event-details-modal-change-requests-members": VEventDetailsModalChangeRequestsMembers,
    "v-event-details-modal-change-reward-members": VEventDetailsModalChangeRewardMembers,
  },
})
export default class VEventDetails extends mixins(VBaseMixin, VEventApiMixin) {
  event: OutstudyEvent | null = null;
  members: User[] = []; // участники
  requests: Request[] = []; // заявки на участие

  keyChat = 0; // при отправке сообщения перерисовка чата/лога
  modalAddMessageVisible = false; // окно создания сообщения
  modalRequestsMembersVisible = false; // окно заявок на вступление
  modalRewardMembersVisible = false; // окно награждения позанятому месту

  async created(): Promise<void> {
    this.menuKey = [1];
    if (!this.userAccess.event.view) this.routing("event-list");
    this.isLoading = true;
    await this.getEvent();
    if (this.event) {
      await this.getMembers();
      await this.getRequests();
    }
    this.isLoading = false;
  }
  /** получение текущего event по id в url */
  async getEvent(): Promise<void> {
    const idCurrentEvent = Number(this.$route.params["id"]);
    const [response, error] = await api.event.getEventById(
      this.accessToken,
      idCurrentEvent
    );
    if (!error && response) this.event = response;
    else if (error && this.$router.currentRoute.name === "event-details") {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
      // await this.routing("event-list");
    } else console.error(error);
  }
  /** получение списка участников */
  async getMembers(message = true): Promise<void> {
    if (!this.event?.id) return;
    const [response, error] = await api.event.getMembersEvent(
      this.accessToken,
      this.event.id
    );
    if (response && !error) this.members = response.data ?? [];
    else if (error && this.$router.currentRoute.name === "event-details") {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
  }
  /** список заявок на участие */
  async getRequests(): Promise<void> {
    this.isLoading = true;
    if (!this.event?.id || !this.isOrganizer) return;
    const [response, error] = await api.event.getRequestsEvent(
      this.accessToken,
      this.event.id
    );
    if (response && !error) this.requests = response.data ?? [];
    this.isLoading = false;
  }
  /** название мероприятия */
  get eventName(): string {
    return `Мероприятие: ${this.event?.name ?? ""}`;
  }
  /** тек. польз. организатор (или админ или тьютор) */
  get isOrganizer(): boolean {
    return (
      this.currentUser?.id === this.event?.organizer?.user?.id ||
      this.getIsContainsAccessRole(["администратор", "тьютор"])
    );
  }

  outstudyEvent: OutstudyEvent | null = null; // массив мероприятий
  // всё что касается типа
  typeEvent: TypeEvent | null = null; // тип мероприятия
  readonly criteriaTypeOneName =
    "Критерий: Фиксированное количество баллов за участие";
  readonly criteriaTypeTwoName = "Критерий: Пропорционально занятому месту";
  readonly criteriaTypeThreeName = "Критерий: По набранному баллу";
  // модальное окно (награждение)
  visibleModalReward = false;
  isLoadingReward = false;
  selectedRowKeys: number[] = []; // выделенные строчки
  // критерий по которому награждают
  criteriaReward = { name: "", type: -1, id: -1, idUsers: [] as number[] };
  // чат
  messageList: Message[] = []; // список сообщений
  message = ""; // сообщение
  isLoadingMessage = false; // анимация кнопки отправки сообщения
  timerId: ReturnType<typeof setTimeout> | null = null; // id для setTimeout

  //* критерий
  // критерий: за участие
  get criteriaTypeOne(): Criteria[] {
    const currentTypeCriteria: Criteria[] = this.typeEvent?.criteria ?? [];
    const newArr: Criteria[] = [];
    currentTypeCriteria.forEach(
      (item) => item.typeId === 1 && newArr.push(item)
    );
    return newArr;
  }
  // критерий: пропорционально занятому месту
  get criteriaTypeTwo(): Criteria[] {
    const currentTypeCriteria: Criteria[] = this.typeEvent?.criteria ?? [];
    const newArr: Criteria[] = [];
    currentTypeCriteria.forEach(
      (item) => item.typeId === 2 && newArr.push(item)
    );
    return newArr;
  }
  // критерий: по набранному баллу
  get criteriaTypeThree(): Criteria[] {
    const currentTypeCriteria: Criteria[] = this.typeEvent?.criteria ?? [];
    const newArr: Criteria[] = [];
    currentTypeCriteria.forEach(
      (item) => item.typeId === 3 && newArr.push(item)
    );
    return newArr;
  }

  //* модальное окно и таблица (награждение)
  // показать модальное окно
  // eslint-disable-next-line
  showModalReward(criteria: Criteria | null) {
    if (!criteria?.id)
      return (this.criteriaReward = {
        name: "",
        type: -1,
        id: -1,
        idUsers: [],
      });
    switch (criteria.typeId) {
      case 2:
        this.criteriaReward = {
          name: this.criteriaTypeTwoName,
          type: criteria.typeId,
          id: criteria.id,
          idUsers: [],
        };
        break;
      case 3:
        this.criteriaReward = {
          name: this.criteriaTypeThreeName,
          type: criteria.typeId,
          id: criteria.id,
          idUsers: [],
        };
        break;

      default:
        this.criteriaReward = { name: "", type: -1, id: -1, idUsers: [] };
        break;
    }
    this.visibleModalReward = true;
  }
  async handleOkReward(): Promise<void> {
    this.isLoadingReward = true;
    await this.membersReward();
    this.handleCancelReward();
    this.isLoadingReward = false;
  }
  handleCancelReward(): void {
    this.visibleModalReward = false;
    this.selectedRowKeys = [];
    this.showModalReward(null);
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTableReward() {
    return [
      {
        title: "ФИО",
        dataIndex: "name",
        key: "name",
      },
    ];
  }
  // данные таблицы
  // eslint-disable-next-line
  get dataTableReward() {
    return this.members.map((item) => {
      return {
        key: item.id,
        name: viewFullName(item.profile ?? null, false),
      };
    });
  }
  // настройки селекта строк таблицы
  // eslint-disable-next-line
  get rowSelection() {
    return {
      selectedRowKeys: this.selectedRowKeys,
      onChange: (selectedRowKeys: number[]) => {
        this.selectedRowKeys = selectedRowKeys;
        this.criteriaReward.idUsers = [...this.selectedRowKeys];
      },
    };
  }
  // награждение участников
  async membersReward(): Promise<void> {
    if (
      !this.outstudyEvent?.id ||
      this.criteriaReward.type === -1 ||
      this.criteriaReward.id === -1 ||
      this.criteriaReward.idUsers === []
    )
      return;
    const [response, error] = await api.event.membersReward(
      this.accessToken,
      this.outstudyEvent.id,
      {
        data: [
          {
            criterionId: this.criteriaReward.id,
            usersIds: this.criteriaReward.idUsers,
          },
        ],
      }
    );
    if (!error && response) {
      this.criteriaReward = {
        name: "",
        type: -1,
        id: -1,
        idUsers: [],
      };
      this.$notification.success({
        message: "Участники награждены",
        description: this.criteriaReward.name,
      });
    } else if (error && this.$router.currentRoute.name === "event-details") {
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
.v-event-details {
  height: calc(100vh - 16em);
  &-header-block {
    border-block-end: 1px solid rgb(235, 237, 240);
    margin-bottom: 0px;
  }
  // &-body {
  // }
}
</style>
