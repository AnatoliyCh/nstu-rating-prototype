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
            @addMember="getMembers()"
            @AddMessageVisible="modalAddMessageVisible = true"
          />
          <!-- участники -->
          <v-event-details-members :members="members" />
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

@Component({
  components: {
    "v-event-details-info": VEventDetailsInfo,
    "v-event-details-members": VEventDetailsMembers,
    "v-event-details-chat": VEventDetailsChat,
    "v-event-details-modal-add-message": VEventDetailsModalAddMessage,
  },
})
export default class VEventDetails extends mixins(VBaseMixin, VEventApiMixin) {
  event: OutstudyEvent | null = null;
  members: User[] = []; // участники

  keyChat = 0; // при отправке сообщения перерисовка чата/лога
  modalAddMessageVisible = false;

  async created(): Promise<void> {
    this.menuKey = [1];
    if (!this.userAccess.event.view) this.routing("event-list");
    this.isLoading = true;
    await this.getEvent();
    if (this.event) {
      await this.getMembers();
      // await this.getMessages();
      // this.timerId = setInterval(async () => await this.getMessages(), 10000); // каждые 10 секунд получаем сообщения
    }
    this.isLoading = false;
  }
  // получение текущего event по id в url
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
  // получение списка участников
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

  outstudyEvent: OutstudyEvent | null = null; // массив мероприятий
  // всё что касается типа
  typeEvent: TypeEvent | null = null; // тип мероприятия
  readonly criteriaTypeOneName =
    "Критерий: Фиксированное количество баллов за участие";
  readonly criteriaTypeTwoName = "Критерий: Пропорционально занятому месту";
  readonly criteriaTypeThreeName = "Критерий: По набранному баллу";
  // модальное окно (заявки)
  visibleModalRequest = false;
  isLoadingRequests = false;
  requests: Request[] = []; // заявки на участие
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

  get eventName(): string {
    return `Мероприятие: ${this.event?.name ?? ""}`;
  }

  beforeDestroy(): void {
    // отписка от прослушивания получения сообщений
    this.timerId && clearTimeout(this.timerId);
  }
  //* данные о мероприятии
  // удаление мероприятия
  async deleteEvent(): Promise<void> {
    if (!this.userAccess.event.delete) return;
    this.$confirm({
      title: "Удаление мероприятия",
      content: "Вы точно хотите удалить данное мероприятие?",
      onOk: async () => {
        if (!this.outstudyEvent?.id) return;
        const [response, error] = await api.event.deleteEvent(
          this.accessToken,
          this.outstudyEvent.id
        );
        if (!error && response) this.routing("event-list");
        else if (error && this.$router.currentRoute.name === "event-details") {
          console.warn(error);
          this.$notification.warning({
            message: error?.message ?? "",
            description: "",
          });
          await this.routing("event-list");
        } else console.error(error);
      },
    });
  }
  // получение типа мероприятия
  async getType(): Promise<void> {
    if (!this.outstudyEvent || !this.outstudyEvent.eventKindId) return;
    const types = await this.getEventTypes();
    types.forEach(
      (item) =>
        item.id === this.outstudyEvent?.eventKindId && (this.typeEvent = item)
    );
  }

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

  //* модальное окно и таблица (заявки)
  // показать модальное окно
  async showModalRequest(): Promise<void> {
    this.visibleModalRequest = true;
    this.isLoadingRequests = true;
    await this.getRequestsEvent();
  }
  handleOkRequest(): void {
    this.visibleModalRequest = false;
    this.requests = [];
  }
  handleCancelRequest(): void {
    this.visibleModalRequest = false;
    this.requests = [];
  }
  // список заявок на участие (все: принятые, не принятые)
  async getRequestsEvent(): Promise<void> {
    if (!this.userAccess.event.membersConfirmation) return;
    if (!this.outstudyEvent?.id) return;
    const [response, error] = await api.event.getRequestsEvent(
      this.accessToken,
      this.outstudyEvent.id
    );
    if (!error && response && response.data) this.requests = response.data;
    else if (error && this.$router.currentRoute.name === "event-details") {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoadingRequests = false;
  }
  // рахрешение на принятие участников
  get membersConfirmationAcces(): boolean {
    return (
      Boolean(this.outstudyEvent?.isNeedMemberConfirmation) &&
      this.userAccess.event.membersConfirmation
    );
  }
  // принятие/отклонение заявок
  async changeRequest(
    idRequest: number,
    status: 1 | 2 | 3 | null
  ): Promise<void> {
    if (!this.outstudyEvent?.id || !status) return;
    this.isLoadingRequests = true;
    const [response, error] = await api.event.memberEventRequestChange(
      this.accessToken,
      this.outstudyEvent.id,
      idRequest,
      status
    );
    if (!error && response) {
      const find = this.requests.find((item) => item.id === idRequest);
      find && (find.status = status);
      await this.getMembers(false);
    } else if (error && this.$router.currentRoute.name === "event-details") {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoadingRequests = false;
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTableRequests() {
    return [
      {
        title: "Имя",
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
        width: 200,
      },
    ];
  }
  // данные для таблицы
  // eslint-disable-next-line
  get dataTableRequests() {
    return this.requests.map((item) => {
      let newStatus = "";
      if (item.status === 1) newStatus = "новая заявка";
      else if (item.status === 2) newStatus = "принято";
      else if (item.status === 3) newStatus = "отказано";
      return {
        key: item.id,
        name: viewFullName(item.user?.profile ?? null, false),
        status: newStatus,
      };
    });
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

  //* чат
  // id чата
  get chatId(): number {
    return this.outstudyEvent?.chat?.id ?? -1;
  }
  // элемент списка, для прокрутки
  get elementList(): Element | null {
    return this.$el.querySelector("#list");
  }
  // parent элемент для прокрутки (из-за чата)
  get elementParent(): Element | null {
    return document.querySelector(".app-body-content");
  }
  // получение списка сообщений
  async getMessages(): Promise<void> {
    this.isLoading = true;
    const scroll = this.elementParent?.scrollTop; // сохранение тек. скролла на странице
    const [response, error] = await api.chat.getMessages(
      this.accessToken,
      this.chatId,
      0,
      999
    );
    if (!error && response && response.data) {
      // изменение времени
      response.data.forEach(
        (item) =>
          item.dateTime &&
          (item.dateTime = `${new Date(
            item.dateTime
          ).toLocaleDateString()} ${new Date(
            item.dateTime
          ).toLocaleTimeString()}`)
      );
      this.messageList = response.data;
    } else if (error && this.$router.currentRoute.name === "event-details") {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoading = false;
    // возвращение скролла
    this.$nextTick(() => {
      scroll && this.elementParent && (this.elementParent.scrollTop = scroll);
    });
  }
  /** отправка сообщений */
  async sendMessage(): Promise<void> {
    const newMessage = this.message;
    this.isLoading = this.isLoadingMessage = true;
    const [response, error] = await api.chat.sendMessage(
      this.accessToken,
      this.chatId,
      newMessage
    );
    if (!error && response) {
      this.message = "";
      await this.getMessages();
    } else if (error && this.$router.currentRoute.name === "event-details") {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoading = this.isLoadingMessage = false;
    // прокрутка вниз, после отпраки сообщения
    this.elementList &&
      (this.elementList.scrollTop = this.elementList.scrollHeight);
  }
  // переход на страницу чата
  goChatDetails(): void {
    if (!this.chatId || !this.outstudyEvent?.name || !this.outstudyEvent?.id)
      return;
    this.$router.push({
      name: "chat-details",
      params: {
        id: this.chatId.toString(),
        eventName: this.outstudyEvent.name,
        eventId: this.outstudyEvent.id?.toString(),
      },
    });
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
