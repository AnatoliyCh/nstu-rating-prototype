<template>
  <div class="v-event-details">
    <!-- загрузка -->
    <a-spin v-if="isLoading || !outstudyEvent" class="spin-width">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
    </a-spin>
    <template v-else>
      <a-page-header
        :title="`Мероприятие: ${outstudyEvent.name}`"
        class="header-block"
        @back="routing('event-list')"
      >
        <template slot="extra">
          <!-- действия для орг. и админа -->
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
        </template>
      </a-page-header>
      <!-- основная информация -->
      <a-row :gutter="16" class="vertical-margin-element-16">
        <a-col :span="6">
          <a-card title="Основная информация" hoverable>
            <div v-if="outstudyEvent" class="vertical-margin-element-24">
              <label class="required-label">Название </label>
              <a-input v-model="outstudyEvent.name" disabled />
            </div>
            <div v-if="typeEvent" class="vertical-margin-element-24">
              <label>Тип мероприятия </label>
              <a-input :value="typeEvent.name" disabled />
            </div>
            <div
              v-if="outstudyEvent"
              class="vertical-margin-element-24"
              style="height: 54px"
            >
              <label>Вид участия </label>
              <a-radio-group
                v-model="outstudyEvent.isNeedMemberConfirmation"
                style="width: 100%"
                disabled
              >
                <a-radio :value="false"> Свободный </a-radio>
                <a-radio :value="true">
                  Требуется подтверждение организатора
                </a-radio>
              </a-radio-group>
            </div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card title="Дата и место проведения" hoverable>
            <div v-if="outstudyEvent" class="vertical-margin-element-24">
              <label>Дата начала </label>
              <a-date-picker
                :value="outstudyEvent.dateStart"
                show-time
                format="YYYY-MM-DD HH:mm"
                style="width: 100%"
                disabled
              />
            </div>
            <div v-if="outstudyEvent" class="vertical-margin-element-24">
              <label>Дата окончания </label>
              <a-date-picker
                :value="outstudyEvent.dateEnd"
                show-time
                format="YYYY-MM-DD HH:mm"
                style="width: 100%"
                disabled
              />
            </div>
            <div
              v-if="outstudyEvent && outstudyEvent.dateRegistrationEnd"
              class="vertical-margin-element-24"
            >
              <label>Дата окончания регистрации </label>
              <a-date-picker
                :value="outstudyEvent.dateRegistrationEnd"
                show-time
                format="YYYY-MM-DD HH:mm"
                style="width: 100%"
                disabled
              />
            </div>
            <div v-if="outstudyEvent" class="vertical-margin-element-24">
              <label>Место проведения </label>
              <a-textarea
                :value="outstudyEvent.address"
                placeholder="aдрес мероприятия..."
                :auto-size="{ minRows: 2, maxRows: 2 }"
                disabled
              />
            </div>
          </a-card>
        </a-col>
        <!-- описание -->
        <a-col :span="12">
          <a-card title="Описание мероприятия" hoverable>
            <a-textarea
              :value="outstudyEvent ? outstudyEvent.description : null"
              placeholder="описание мероприятия..."
              :auto-size="{ minRows: 2, maxRows: 10 }"
              disabled
            />
          </a-card>
        </a-col>
      </a-row>
      <!-- критерии -->
      <a-row :gutter="16" class="vertical-margin-element-16">
        <!-- 1 критерий -->
        <a-col :span="8">
          <a-card :title="criteriaTypeOneName" hoverable>
            <!-- список притериев -->
            <div
              v-for="(criteria, index) in criteriaTypeOne"
              :key="index"
              class="vertical-margin-element-24"
            >
              <a-space :size="24">
                <label>#{{ index + 1 }} Балл </label>
                <a-input-number
                  v-model="criteria.value"
                  :min="0"
                  disabled
                  style="width: 100%"
                />
              </a-space>
            </div>
          </a-card>
        </a-col>
        <!-- 2 критерий -->
        <a-col :span="8">
          <a-card :title="criteriaTypeTwoName" hoverable>
            <!-- список притериев -->
            <div
              v-for="(criteria, index) in criteriaTypeTwo"
              :key="index"
              class="vertical-margin-element-24"
            >
              <a-space :size="8">
                <label style="white-space: nowrap"
                  >#{{ index + 1 }} Балл
                </label>
                <a-input-number
                  v-model="criteria.value"
                  :min="0"
                  style="width: 100%"
                  disabled
                />
                <label style="white-space: nowrap">места c </label>
                <a-input-number
                  v-model="criteria.topPlace"
                  :min="1"
                  style="width: 100%"
                  disabled
                />
                <label style="white-space: nowrap">по </label>
                <a-input-number
                  v-model="criteria.bottomPlace"
                  :min="criteria.topPlace"
                  style="width: 100%"
                  disabled
                />
                <a-button @click="showModalReward(criteria)">
                  Наградить
                </a-button>
              </a-space>
            </div>
          </a-card>
        </a-col>
        <!-- 3 критерий -->
        <a-col :span="8">
          <a-card :title="criteriaTypeThreeName" hoverable>
            <!-- список притериев -->
            <div
              v-for="(criteria, index) in criteriaTypeThree"
              :key="index"
              class="vertical-margin-element-24"
            >
              <a-space :size="8">
                <label style="white-space: nowrap">#{{ index + 1 }} </label>
                <a-input
                  v-model="criteria.name"
                  placeholder="задание"
                  disabled
                />
                <a-input-number
                  v-model="criteria.value"
                  placeholder="балл"
                  :min="0"
                  style="width: 100%"
                  disabled
                />
                <a-button @click="showModalReward(criteria)">
                  Наградить
                </a-button>
              </a-space>
            </div>
          </a-card>
        </a-col>
      </a-row>
      <!-- участники и чат -->
      <a-row
        :gutter="16"
        class="vertical-margin-element-16"
        style="margin-bottom: 16px"
      >
        <!-- участиники -->
        <a-col :span="12">
          <a-card title="Участники" hoverable>
            <!-- пусто -->
            <a-empty v-if="!isLoading && !members.length" />
            <!-- список -->
            <a-list
              v-else-if="!isLoading && members.length"
              item-layout="horizontal"
              :data-source="members"
              style="overflow: auto; max-height: 729px"
            >
              <a-list-item slot="renderItem" slot-scope="item">
                <a-list-item-meta>
                  <a slot="title" href="">
                    {{ item.profile | viewFullName }}
                  </a>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <!-- чат -->
        <a-col :span="12">
          <a-card title="Чат" hoverable>
            <!-- создание сообщения -->
            <a-comment>
              <div slot="content">
                <a-form-item>
                  <a-textarea
                    :auto-size="{ minRows: 4, maxRows: 4 }"
                    v-model="message"
                  />
                </a-form-item>
                <a-form-item>
                  <a-button
                    html-type="submit"
                    :loading="isLoadingMessage"
                    type="primary"
                    @click="sendMessage"
                  >
                    Отправить
                  </a-button>
                </a-form-item>
              </div>
            </a-comment>
            <!-- сообщения -->
            <a-list
              id="list"
              :data-source="messageList"
              :loading="isLoading"
              size="small"
              item-layout="horizontal"
              class="v-chat-details-body-list"
              style="overflow: auto; max-height: 510px"
            >
              <a-list-item slot="renderItem" slot-scope="item">
                <a-comment
                  :author="item.sender"
                  :content="item.text"
                  :datetime="item.dateTime"
                  size="small"
                />
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
      <!-- модальное окно принятия заявок -->
      <a-modal
        title="Заявки на участие в мероприятии"
        v-model="visibleModalRequest"
        :width="700"
        @ok="handleOkRequest"
        @cancel="handleCancelRequest"
        centered
      >
        <a-table
          :columns="columnsTableRequests"
          :data-source="dataTableRequests"
          :pagination="{ pageSize: 10 }"
          :loading="isLoadingRequests"
          size="small"
        >
          <span slot="action" slot-scope="item">
            <template v-if="item.status === 'принято'">
              <a-button type="danger" @click="changeRequest(item.key, 3)">
                Отклонить
              </a-button>
            </template>
            <template v-else-if="item.status === 'отказано'">
              <a-button @click="changeRequest(item.key, 2)"> Принять </a-button>
            </template>
            <template v-else>
              <a-button @click="changeRequest(item.key, 2)"> Принять </a-button>
              <a-divider type="vertical" />
              <a-button type="danger" @click="changeRequest(item.key, 3)">
                Отклонить
              </a-button>
            </template>
          </span>
        </a-table>
      </a-modal>
      <!-- модальное окно награждения -->
      <a-modal
        title="Награждение участников"
        v-model="visibleModalReward"
        :confirm-loading="isLoadingReward"
        @ok="handleOkReward"
        @cancel="handleCancelReward"
        centered
      >
        <p>{{ criteriaReward.name }}</p>
        <a-table
          :columns="columnsTableReward"
          :data-source="dataTableReward"
          :pagination="{ pageSize: 10 }"
          :row-selection="rowSelection"
          size="small"
        />
      </a-modal>
    </template>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import { viewFullName } from "@/common/filters";
import VBaseMixin from "@/common/v-base-mixin";
import VEventApiMixin from "@/common/v-event-api-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import {
  Criteria,
  Message,
  OutstudyEvent,
  Request,
  TypeEvent,
  User,
} from "../../../../../common/types/model";

@Component
export default class VEventDetails extends mixins(VBaseMixin, VEventApiMixin) {
  outstudyEvent: OutstudyEvent | null = null; // массив мероприятий
  members: User[] = []; // участники
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

  async created(): Promise<void> {
    this.menuKey = [1];
    if (!this.userAccess.event.view) this.routing("event-list");
    this.isLoading = true;
    await this.getEvent();
    if (this.outstudyEvent) {
      await this.getType();
      await this.getMembers();
      await this.getMessages();
      this.timerId = setInterval(async () => await this.getMessages(), 10000); // каждые 10 секунд получаем сообщения
    }
    this.isLoading = false;
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
        else if (error) {
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
  // получение текущего event по id в url
  async getEvent(): Promise<void> {
    const idCurrentEvent = Number(this.$route.params["id"]);
    const [response, error] = await api.event.getEventById(
      this.accessToken,
      idCurrentEvent
    );
    if (!error && response) this.outstudyEvent = response;
    else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
      await this.routing("event-list");
    } else console.error(error);
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
  // получение списка участников
  async getMembers(): Promise<void> {
    if (!this.outstudyEvent?.id) return;
    const [response, error] = await api.event.getMembersEvent(
      this.accessToken,
      this.outstudyEvent.id
    );
    if (!error && response && response.data) {
      this.members = response.data ?? [];
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
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
    else if (error) {
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
      await this.getMembers();
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoadingRequests = false;
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
    } else if (error) {
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
    } else if (error) {
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
    } else if (error) {
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
}
</script>

<style lang="scss">
.v-event-details {
  > .ant-row {
    padding: 0px 16px;
    .ant-card-head-title {
      text-align: center;
    }
  }
}
</style>
