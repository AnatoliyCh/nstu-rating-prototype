<template>
  <div class="v-user-space">
    <a-page-header
      title="Просмотр: личный кабинет"
      class="v-user-space-header-block"
    />
    <div class="v-user-space-body">
      <a-tabs default-active-key="1" size="small">
        <!-- достижения -->
        <a-tab-pane key="1" tab="Достижения">
          <v-user-table-achievements
            :key="renderKey.list"
            :getData="getAchievements"
            action-name="Распределить"
            @action-click="modalRequestShow($event, 'achievement')"
          />
        </a-tab-pane>
        <!-- история распределения достижений -->
        <a-tab-pane key="2" tab="История распределения достижений">
          <v-user-table-achievements
            :key="renderKey.history"
            :getData="getAchievementsHistory"
          />
        </a-tab-pane>
        <!-- мои запросы на распределение -->
        <a-tab-pane key="3" tab="Мои запросы на распределение">
          <v-user-table-achievements
            :key="renderKey.requestList"
            :getData="getAchievementRequests"
            action-name="Отозвать"
            @action-click="deleteAchievementRequest($event, 'achievement')"
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
        :ok-button-props="{ props: { disabled: modalmodalRequestOkDisabled } }"
        @cancel="modalRequestCancel"
        centered
      >
        <!-- отправка баллов за внеучебные достижения -->
        <template v-if="requestType === 'achievement'">
          <!-- название -->
          <div class="vertical-margin-element-16">
            <label>Название достижения: </label>
            <p>{{ request.achievement.name }}</p>
          </div>
          <!-- дисциплина -->
          <div class="vertical-margin-element-16">
            <label style="display: block">Дисциплина: </label>
            <a-input-search
              :value="selectedDiscipline"
              placeholder="выбрать дисциплину..."
              enter-button
              @search="modalGradebookPagesVisible = true"
            />
          </div>
          <!-- количество баллов -->
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
      <!-- модальное окно выбора дисциплины (страница журнала) -->
      <v-modal-get-gradebook
        v-model="modalGradebookPagesVisible"
        @click="setGradebookPage"
      />
    </div>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import {
  Achievement,
  GradebookPage,
} from "../../../../../../common/types/model";

type TypeRequest = "achievement";

@Component
export default class VUserSpace extends mixins(VBaseMixin) {
  modalRequestVisible = false; // видимость окна для распределения
  modalRequestIsLoading = false; // ожидание отправки запроса
  modalGradebookPagesVisible = false;
  // данные для запроса
  request: null | {
    type: TypeRequest; // тип запроса
    achievement: Achievement | null; // выбранное достижение
    requestScore: number; // запрашеваемый балл на распределение
    gradebookPage: GradebookPage | null; // выбранная страница журнала
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
      pageSize,
      this.currentUser?.id
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
      pageSize,
      this.currentUser?.id
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
      gradebookPage: null,
      requestId: null,
    };
    this.modalRequestVisible = true;
  }
  /** отправка запроса на распределение */
  async modalRequestOk(): Promise<void> {
    this.modalRequestIsLoading = true;
    // создание запроса на распределение
    if (
      this.request?.achievement?.id !== null &&
      this.request?.achievement?.id !== undefined &&
      this.request.gradebookPage?.id !== null &&
      this.request.gradebookPage?.id !== undefined
    ) {
      const [response, error] = await api.rating.createAchievementRequest(
        this.accessToken,
        this.request.achievement.id,
        this.request.gradebookPage.id,
        this.request.requestScore
      );
      if (response && !error) {
        this.updateKeys();
        this.$notification.success({
          message: "Запрос успешно отправлен",
          description: "",
        });
      }
    }
    this.modalRequestIsLoading = false;
    this.modalRequestCancel();
  }
  /** блокировка ортправки запроса на распределение */
  get modalmodalRequestOkDisabled(): boolean {
    return !(
      Boolean(this.request?.achievement?.id) &&
      Boolean(this.request?.gradebookPage?.id) &&
      Boolean(this.request?.requestScore)
    );
  }
  modalRequestCancel(): void {
    this.modalRequestVisible = false;
    setTimeout(() => {
      !this.modalRequestVisible && (this.request = null);
    }, 2000);
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
  /** выбор страницы журнала */
  setGradebookPage(value: GradebookPage | null): void {
    this.modalGradebookPagesVisible = false;
    if (!value || !this.request?.achievement) return;
    this.request.gradebookPage = value;
  }
  /** выбранная страница журнала */
  get selectedDiscipline(): string | null {
    return this.request?.gradebookPage?.discipline?.name ?? null;
  }
  /** удаление запроса на распределение */
  async deleteAchievementRequest(value: Achievement | null): Promise<void> {
    this.$confirm({
      title: "Удаление запроса на распределение",
      content: "Вы точно хотите удалить запрос?",
      onOk: async () => {
        if (!value?.id || !value.achievementId || !value.gradebookPage?.id)
          return;
        const [response, error] = await api.rating.deleteAchievementRequest(
          this.accessToken,
          value.achievementId,
          value.gradebookPage?.id,
          value.id
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
