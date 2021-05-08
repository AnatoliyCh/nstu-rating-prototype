<template>
  <div class="v-user-space">
    <a-page-header
      title="Просмотр: личный кабинет"
      class="v-user-space-header-block"
    />
    <div class="v-user-space-body">
      <a-button @click="modalDisciplinesVisible = true">
        Создать группу
      </a-button>
      <a-tabs default-active-key="1" size="small">
        <a-tab-pane key="1" tab="Достижения">
          <v-user-table-achievements
            :key="renderKey.list"
            :getData="getAchievements"
            action-name="Распределить"
            @action-click="modalRequestShow($event, 'achievement')"
          />
        </a-tab-pane>
        <a-tab-pane key="2" tab="История распределения достижений">
          <v-user-table-achievements :getData="getAchievementsHistory" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="Мои запросы на распределение">
          <v-user-table-achievements
            :getData="getAchievementRequests"
            action-name="Отозвать"
            @action-click="deleteAchievementRequest"
          />
        </a-tab-pane>
      </a-tabs>
      <!-- модальное окно для запросов на распределение -->
      <a-modal
        v-model="modalRequestVisible"
        :title="modalRequestName"
        :confirm-loading="modalRequestIsLoading"
        :closable="false"
        @ok="modalRequestOk"
        @cancel="modalRequestcancel"
        centered
      >
        <!-- отправка баллов за внеучебные достижения -->
        <template v-if="requestType === 'achievement'">
          <div class="vertical-margin-element-16">
            <label>Название достижения: </label>
            <p>{{ request.achievement.name }}</p>
          </div>
          <div class="vertical-margin-element-16">
            <label>Дисциплина: </label>
          </div>
          <div class="vertical-margin-element-16">
            <label>Количество баллов: </label>
            <a-input-number
              v-model="request.requestScore"
              :max="request.achievement.balanceScore"
              :min="0"
              style="width: 100%"
            />
          </div>
        </template>
      </a-modal>
      <!-- модальное окно выбора дисциплины -->
      <v-modal-get-discipline
        v-model="modalDisciplinesVisible"
        @click="setDiscipline"
      />
    </div>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { Achievement, Discipline } from "../../../../../../common/types/model";

type TypeRequest = "achievement";

@Component
export default class VUserSpace extends mixins(VBaseMixin) {
  modalRequestVisible = false; // видимость окна для распределения
  modalRequestIsLoading = false; // ожидание отправки запроса
  modalDisciplinesVisible = false;
  // данные для запроса
  request: null | {
    type: TypeRequest;
    achievement: Achievement | null;
    requestScore: number; // запрашеваемый балл на распределение
    discipline: Discipline | null; // выбранная дисциплина
    requestId: number | null; // при удалении
  } = null;
  renderKey = { list: 0, history: 0, requestList: 0 }; // ключи для рендера

  created(): void {
    this.menuKey = [0];
    if (!this.userAccess.user.space) this.routing("user-list");
  }
  /** получение списка достижений */
  async getAchievements(
    offset: number,
    pageSize: number
  ): Promise<[Achievement[], number]> {
    const [response, error] = await api.rating.getAchievements(
      this.accessToken,
      offset,
      pageSize
    );
    if (response && !error) {
      const data = response.data ?? [];
      const totalSize = response.size ?? 0;
      return [data, totalSize];
    }
    return [[], 0];
  }
  /** получение истории списка достижений */
  async getAchievementsHistory(
    offset: number,
    pageSize: number
  ): Promise<[Achievement[], number]> {
    const [response, error] = await api.rating.getAchievementsHistory(
      this.accessToken,
      offset,
      pageSize
    );
    if (response && !error) {
      const data = response.data ?? [];
      const totalSize = response.size ?? 0;
      return [data, totalSize];
    }
    return [[], 0];
  }
  /** получение списка запросов достижений */
  async getAchievementRequests(
    offset: number,
    pageSize: number
  ): Promise<[Achievement[], number]> {
    const [response, error] = await api.rating.getAchievementRequests(
      this.accessToken,
      offset,
      pageSize
    );
    if (response && !error) {
      const data = response.data ?? [];
      const totalSize = response.size ?? 0;
      return [data, totalSize];
    }
    return [[], 0];
  }
  modalRequestShow(value: Achievement | null, type: TypeRequest): void {
    if (!value) return;
    this.request = {
      type: type,
      achievement: value,
      requestScore: value.balanceScore ?? 0,
      discipline: null,
      requestId: null,
    };
    this.modalRequestVisible = true;
  }
  /** отправка запроса */
  async modalRequestOk(): Promise<void> {
    this.modalRequestIsLoading = true;
    // создание запроса на распределение
    if (this.request?.achievement?.id && this.request.discipline?.id) {
      const [response, error] = await api.rating.createAchievementRequest(
        this.accessToken,
        this.request.achievement.id,
        this.request.discipline?.id,
        this.request.requestScore
      );
      if (response && !error) this.updateKeys();
    }
    this.modalRequestIsLoading = false;
    this.modalRequestcancel();
  }
  modalRequestcancel(): void {
    this.modalRequestVisible = false;
    // this.request = null;
  }
  get modalRequestName(): string {
    return "Запрос на распределение баллов";
  }
  get requestType(): TypeRequest | null {
    if (this.request?.type === "achievement" && this.request?.achievement) {
      return "achievement";
    }
    return null;
  }
  /** обновление дочерних элеменов */
  updateKeys(): void {
    this.renderKey.list++;
    this.renderKey.history++;
    this.renderKey.requestList++;
  }
  /** выбор дисциплины */
  setDiscipline(value: Discipline | null) {
    this.modalDisciplinesVisible = false;
    if (!value || !this.request?.achievement) return;
    this.request.discipline = value;
  }
  /** удаление запроса на распределение */
  async deleteAchievementRequest(): Promise<void> {
    this.$confirm({
      title: "Удаление запроса на распределение",
      content: "Вы точно хотите удалить запрос?",
      onOk: async () => {
        if (
          !this.request?.achievement?.id ||
          !this.request?.discipline?.id ||
          !this.request?.requestId
        )
          return;
        const [response, error] = await api.rating.deleteAchievementRequest(
          this.accessToken,
          this.request.achievement.id,
          this.request.discipline.id,
          this.request.requestId
        );
        if (response && !error) this.updateKeys();
      },
    });
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-user-space {
  height: 100%;
  &-header-block {
    border-block-end: 1px solid rgb(235, 237, 240);
    margin-bottom: 0px;
  }
  &-body {
    height: calc(100% - 70px);
    .ant-tabs {
      height: 100%;
      .ant-tabs-bar {
        margin: 0 !important;
      }
    }
  }
}
</style>
