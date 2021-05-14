<template>
  <a-modal
    :visible="value"
    @change="changeVisible"
    :closable="false"
    :confirm-loading="isLoading"
    @ok="modalOk"
    :ok-button-props="{ props: { disabled: modalOkDisabled } }"
    @cancel="modalCancel"
    :cancel-button-props="{ props: { disabled: Boolean(isLoading) } }"
    title="Создание достижения для студента"
    centered
    class="v-modal-create-achievement"
  >
    <!-- добавление студента -->
    <div class="vertical-margin-element-24">
      <!-- кнопка -->
      <div class="vertical-margin-element-8">
        <a-button
          size="small"
          type="primary"
          icon="plus"
          @click="modalUserVisible = true"
        >
          Выбрать пользователя
        </a-button>
        <v-modal-get-user v-model="modalUserVisible" @click="addUser" />
      </div>
      <!-- выбранный студент -->
      <div class="vertical-margin-element-8">
        <a-tooltip
          v-if="student && studentFullName > 20"
          :title="studentFullName"
        >
          <a-tag closable @close="student = null">
            {{ `${studentFullName.slice(0, 20)}...` }}
          </a-tag>
        </a-tooltip>
        <a-tag v-else-if="student" closable @close="student = null">
          {{ studentFullName }}
        </a-tag>
      </div>
    </div>
    <!-- баллы -->
    <div class="vertical-margin-element-24">
      <label>Количество баллов: </label>
      <a-input-number v-model="score" :min="0" style="width: 100%" />
    </div>
    <!-- название -->
    <div class="vertical-margin-element-24">
      <label class="required-label">Название достижения: </label>
      <a-input v-model="name" />
    </div>
  </a-modal>
</template>
<script lang="ts">
import api from "@/common/api";
import { viewFullName } from "@/common/filters";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component, Emit, Model } from "vue-property-decorator";
import { User } from "../../../../../common/types/model";
/** модальное окно создания достижения (преп. для студента) */
@Component
export default class VModalCreateAchievement extends mixins(VBaseMixin) {
  /** видимость окна */
  @Model("change", { type: Boolean }) readonly value!: boolean;
  /** изменение видимости */
  @Emit("change")
  changeVisible(visible: boolean): boolean {
    return visible;
  }
  student: User | null = null; // студент, которому создаем достижение
  score = 0; // баллы, которые будут добавлены
  name = ""; // название нового достижения
  modalUserVisible = false;

  /** выбор студента */
  addUser(value: User | null): void {
    this.modalUserVisible = false;
    if (!value) return;
    this.student = value;
  }
  /** отобрадение ФИО студента */
  get studentFullName(): string {
    return viewFullName(this.student?.profile ?? null, false);
  }
  /** создание достижения для студента */
  async modalOk(): Promise<void> {
    if (!this.student?.id || !this.name.length) return;
    this.isLoading = true;
    const [responce, error] = await api.rating.createAchievement(
      this.accessToken,
      this.score,
      this.name,
      this.student.id
    );
    if (responce && !error) {
      this.modalCancel();
      this.$notification.success({
        message: "Достижение успешно создано",
        description: "",
      });
    } else {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: `Не удалось создать достижение для студента: ${this.studentFullName}`,
      });
    }
    this.isLoading = false;
  }
  /** блокирование кнопки отправки запроса */
  get modalOkDisabled(): boolean {
    return (
      this.student?.id === null ||
      this.student?.id === undefined ||
      !this.name.length
    );
  }
  /** закрытие модального окна */
  modalCancel(): void {
    this.changeVisible(false);
    setTimeout(() => {
      if (!this.value) {
        this.student = null;
        this.score = 0;
        this.name = "";
      }
    }, 2000);
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-modal-create-achievement {
  .tag-wrapper {
    max-height: calc(20vh);
    overflow: auto;

    .ant-tag {
      margin-bottom: 8px;
    }
  }
}
</style>
