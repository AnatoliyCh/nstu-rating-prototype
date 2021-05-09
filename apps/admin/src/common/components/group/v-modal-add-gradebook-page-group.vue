<template>
  <a-modal
    :visible="value"
    @change="changeVisible"
    :closable="false"
    title="Создание страницы журнала успеваемости"
    centered
    :confirm-loading="isLoading"
    @ok="modalOk"
    :ok-button-props="{ props: { disabled: modalOkDisabled } }"
    @cancel="modalCancel"
    :cancel-button-props="{ props: { disabled: Boolean(isLoading) } }"
    class="v-modal-add-gradebook-page-group"
  >
    <!-- добавление дисциплины -->
    <div class="vertical-margin-element-24">
      <!-- кнопка -->
      <div class="vertical-margin-element-8">
        <a-button
          size="small"
          type="primary"
          icon="search"
          @click="modalDisciplineVisible = true"
        >
          Выбрать дисциплину
        </a-button>
        <!-- модальное окно выбора дисциплины -->
        <v-modal-get-discipline
          v-model="modalDisciplineVisible"
          @click="addDiscipline"
        />
      </div>
      <!-- тег -->
      <div class="vertical-margin-element-8">
        <a-tooltip
          v-if="discipline && discipline.name > 20"
          :title="discipline.name"
        >
          <a-tag closable @close="discipline = null">
            {{ `${udiscipline.name.slice(0, 20)}...` }}
          </a-tag>
        </a-tooltip>
        <a-tag v-else-if="discipline" closable @close="discipline = null">
          {{ discipline.name }}
        </a-tag>
      </div>
    </div>
    <!-- добавление модератора -->
    <div class="vertical-margin-element-8">
      <a-button
        size="small"
        type="primary"
        icon="plus"
        @click="modalUserVisible = true"
      >
        Добавить модератора
      </a-button>
      <v-modal-get-user v-model="modalUserVisible" @click="addModerator" />
    </div>
    <!-- теги -->
    <div class="vertical-margin-element-8 tag-wrapper">
      <template v-for="user in dataView">
        <a-tooltip
          v-if="user.name.length > 20"
          :key="user.id"
          :title="user.name"
        >
          <a-tag :key="user.id" closable @close="() => deleteModerator(user)">
            {{ `${user.name.slice(0, 20)}...` }}
          </a-tag>
        </a-tooltip>
        <a-tag
          v-else
          :key="user.id"
          closable
          @close="() => deleteModerator(user)"
        >
          {{ user.name }}
        </a-tag>
      </template>
    </div>
  </a-modal>
</template>
<script lang="ts">
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component, Emit, Model, Prop } from "vue-property-decorator";
import { User, Discipline } from "../../../../../common/types/model";
import { GradebookPageCreate } from "../../../../../common/types/api";
import { viewFullName } from "@/common/filters";
import api from "@/common/api";
/** добавление к группе страницы журнала успеваемости */
@Component
export default class VModalAddGradebookPageGroup extends mixins(VBaseMixin) {
  /** видимость окна */
  @Model("change", { type: Boolean }) readonly value!: boolean;
  /** изменение видимости */
  @Emit("change")
  changeVisible(visible: boolean): boolean {
    return visible;
  }
  @Prop({ type: [Number], default: null }) readonly groupId!: number | null;
  moderators: User[] = []; // список тех, кто сможет редактировать эту страницу
  discipline: Discipline | null = null; // выбранная дисциплина
  modalDisciplineVisible = false;
  modalUserVisible = false;

  /** добавление модератора */
  addModerator(value: User | null): void {
    this.modalUserVisible = false;
    if (!value) return;
    this.moderators.push(value);
  }
  /** удаление модератора (закрытие тега) */
  deleteModerator(user: { id: number; name: string }): void {
    this.moderators = this.moderators.filter((item) => item.id !== user.id);
  }
  /** для отображения в тегах */
  // eslint-disable-next-line
  get dataView() {
    return this.moderators.map((item) => ({
      id: item.id,
      name: `${viewFullName(item.profile, false)}`,
    }));
  }
  /** выбор страницы журнала */
  addDiscipline(value: Discipline | null): void {
    this.modalDisciplineVisible = false;
    if (!value) return;
    this.discipline = value;
  }
  /** создание новвой страницы журнала */
  async modalOk(): Promise<void> {
    if (!this.groupId || !this.discipline?.id) return;
    const newPage: GradebookPageCreate = {
      groupId: this.groupId,
      moderators: this.moderators.map((item) => item.id),
      disciplineId: this.discipline.id,
    };
    this.isLoading = true;
    const [responce, error] = await api.rating.createGradebookPage(
      this.accessToken,
      newPage
    );
    if (responce && !error) {
      this.$emit("successful");
      this.modalCancel();
    } else {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "Не удалось создать новую страницу журнала",
      });
    }
    this.isLoading = false;
  }
  /** блокирование кнопки отправки запроса */
  get modalOkDisabled(): boolean {
    return (
      this.discipline?.id === null ||
      this.discipline?.id === undefined ||
      this.groupId === null
    );
  }
  modalCancel(): void {
    this.changeVisible(false);
    setTimeout(() => {
      if (!this.value) {
        this.discipline = null;
        this.moderators = [];
      }
    }, 2000);
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-modal-add-gradebook-page-group {
  .tag-wrapper {
    max-height: calc(20vh);
    overflow: auto;

    .ant-tag {
      margin-bottom: 8px;
    }
  }
}
</style>
