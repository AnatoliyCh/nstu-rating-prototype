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
          <a-button key="2" type="danger" @click="deleteEvent">
            Удалить
          </a-button>
          <a-button
            v-if="outstudyEvent.isNeedMemberConfirmation"
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
        <a-col :span="12">
          <a-card title="Участники" hoverable>
            <!-- пусто -->
            <a-empty v-if="!isLoading && !members.length" />
            <!-- список -->
            <a-list
              v-else-if="!isLoading && members.length"
              item-layout="horizontal"
              :data-source="members"
              :style="`overflow: auto; height: ${maxHeightMemberList}px`"
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
        <a-col :span="12">
          <a-card title="Чат" hoverable>
            <p>card content</p>
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
      <a-modal
        title="Награждение участников"
        v-model="visibleModalReward"
        @ok="handleOkReward"
      >
        <p>{{ criteriaReward.name }}</p>
      </a-modal>
    </template>
  </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import VBaseMixin from "@/common/v-base-mixin";
import {
  OutstudyEvent,
  TypeEvent,
  User,
  Criteria,
  Request,
} from "../../../../../common/types/model";
import api from "@/common/api";
import { viewFullName } from "@/common/filters";

@Component
export default class VEventDetails extends mixins(VBaseMixin) {
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
  isLoadingRewards = false;
  // критерий по которому награждают
  criteriaReward = { name: "", type: -1 };

  async created(): Promise<void> {
    this.isLoading = true;
    await this.getEvent();
    if (this.outstudyEvent) {
      await this.getType();
      await this.getMembers();
    }
    this.isLoading = false;
  }
  //* данные о мероприятии
  // удаление мероприятия
  async deleteEvent() {
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
  // пулчение типа мероприятия
  async getType(): Promise<void> {
    if (!this.outstudyEvent || !this.outstudyEvent.eventKindId) return;
    const [response, error] = await api.event.getEventTypes(this.accessToken);
    if (!error && response) {
      const findTypeEvent = response.find(
        (item) => item.id === this.outstudyEvent?.eventKindId
      );
      findTypeEvent && (this.typeEvent = findTypeEvent);
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
  }
  // получение списка учатсников
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
  get maxHeightMemberList(): string {
    if (!this.members.length) return "51";
    if (this.members.length > 10) return "510";
    else return (this.members.length * 51).toString();
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
      (item) => item.typeId === 2 && newArr.push(item)
    );
    return newArr;
  }
  //* модальное окно и таблица (заявки)
  // показать модальное окно
  async showModalRequest() {
    this.visibleModalRequest = true;
    this.isLoadingRequests = true;
    await this.getRequestsEvent();
  }
  handleOkRequest() {
    this.visibleModalRequest = false;
    this.requests = [];
  }
  handleCancelRequest() {
    this.visibleModalRequest = false;
    this.requests = [];
  }
  // список заявок на участие (все: принятые, не принятые)
  async getRequestsEvent(): Promise<void> {
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
  // колонки таблицы
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
  async changeRequest(idRequest: number, status: 1 | 2 | 3 | null) {
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
  showModalReward(criteria: Criteria | null) {
    if (!criteria) return (this.criteriaReward = { name: "", type: -1 });
    switch (criteria.typeId) {
      case 2:
        this.criteriaReward = {
          name: this.criteriaTypeTwoName,
          type: criteria.typeId,
        };
        break;
      case 3:
        this.criteriaReward = {
          name: this.criteriaTypeThreeName,
          type: criteria.typeId,
        };
        break;

      default:
        this.criteriaReward = { name: "", type: -1 };
        break;
    }
    this.visibleModalReward = true;
  }
  handleOkReward() {
    this.visibleModalReward = false;
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
