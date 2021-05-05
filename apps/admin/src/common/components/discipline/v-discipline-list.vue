<template>
  <div class="v-discipline-list">
    <a-page-header
      title="Список: дисциплины"
      class="v-discipline-list-header-block"
    >
      <template slot="extra">
        <a-input-search
          v-model="filterName"
          key="2"
          placeholder="поиск по названию..."
          allowClear
          style="width: 200px"
        />
        <a-button
          v-if="userAccess.discipline.create"
          key="1"
          type="primary"
          @click="showModal('create')"
        >
          Создать дисциплину
        </a-button>
      </template>
    </a-page-header>
    <a-table
      :columns="columnsTable"
      :data-source="tableData"
      :loading="isLoading"
      :pagination="{ pageSize: 20 }"
      :scroll="{ y: 'calc(100vh - 16em)' }"
      rowKey="id"
    >
      <div slot="action" slot-scope="discipline">
        <a
          v-if="userAccess.discipline.delete"
          @click="showModal('update', discipline)"
        >
          Редактировать
        </a>
        <a-divider type="vertical" />
        <a
          v-if="userAccess.discipline.update"
          @click="deleteDiscipline(discipline)"
        >
          Удалить
        </a>
      </div>
    </a-table>
    <!-- модальное окно создания дисциплины -->
    <a-modal
      :title="titleModal"
      v-model="visibleModalCreateDiscipline"
      :confirm-loading="isLoadingCreate"
      :ok-button-props="{ props: { disabled: !Boolean(newDisciplineName) } }"
      @ok="handleOkCreate"
      @cancel="handleCancelCreate"
      centered
    >
      <div class="vertical-margin-element-24">
        <label class="required-label">Название </label>
        <a-input v-model="newDisciplineName" />
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import VEventApiMixin from "@/common/v-event-api-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { Discipline } from "../../../../../common/types/model";

@Component
export default class VGroupList extends mixins(VBaseMixin, VEventApiMixin) {
  disciplines: Discipline[] = [];
  size = 0;
  filterName = ""; // фильтр названия
  // модальное окно создания дисциплины
  visibleModalCreateDiscipline = false;
  isLoadingCreate = false;
  newDisciplineName = "";
  mode: "create" | "update" = "create"; // для модального окна
  changeDiscipline: Discipline | null = null; // изменяемая дисциплина

  async created(): Promise<void> {
    this.menuKey = [5];
    this.isLoading = true;
    await this.getDisciplines();
    this.isLoading = false;
  }
  /** получение списка дисциплин */
  async getDisciplines(): Promise<void> {
    const [response, error] = await api.discipline.getDisciplines(
      this.accessToken,
      0,
      9999
    );
    if (response && !error) {
      this.disciplines = response.data ?? [];
      this.size = response.size ?? 0;
    } else if (error) {
      console.warn(error);
      this.$notification.error({
        message: "Не удалось загрузить дисциплины",
        description: "",
      });
    } else console.error(error);
  }
  //* модальное окно создания/редактирования дисциплины
  showModal(
    mode: "create" | "update" | null,
    value: Discipline | null | undefined
  ): void {
    switch (mode) {
      case null:
        return;
      case "create":
        if (this.userAccess.discipline.create) {
          this.visibleModalCreateDiscipline = true;
          this.mode = "create";
        }
        break;
      case "update":
        if (this.userAccess.discipline.update && value) {
          this.visibleModalCreateDiscipline = true;
          this.newDisciplineName = value.name ?? "";
          this.changeDiscipline = value;
          this.mode = "update";
        }
        break;

      default:
        break;
    }
  }
  /** название модального окна */
  get titleModal(): string {
    if (this.mode === "update")
      return `Редактирование дисциплины: ${this.changeDiscipline?.name}`;
    return "Название новой дисциплины";
  }
  async handleOkCreate(): Promise<void> {
    this.isLoadingCreate = true;
    if (this.mode === "create") await this.createDiscipline();
    if (this.mode === "update") await this.updateDiscipline();
    this.isLoadingCreate = false;
  }
  handleCancelCreate(): void {
    this.visibleModalCreateDiscipline = false;
    this.newDisciplineName = "";
  }
  /** создание дисциплины */
  async createDiscipline(): Promise<void> {
    if (!this.userAccess.discipline.create) return;
    const [response, error] = await api.discipline.createDiscipline(
      this.accessToken,
      {
        name: this.newDisciplineName,
      }
    );
    if (response && !error) {
      this.$notification.success({
        message: "Дисциплина создана",
        description: `Название: ${this.newDisciplineName}`,
      });
      this.disciplines.push({ id: response.id, name: this.newDisciplineName });
      this.visibleModalCreateDiscipline = false;
      this.newDisciplineName = "";
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "Создание дисциплины",
      });
    } else console.error(error);
  }
  /** обновление дисциплины */
  async updateDiscipline(): Promise<void> {
    if (
      !this.userAccess.discipline.update ||
      this.changeDiscipline?.id === null ||
      this.changeDiscipline?.id === undefined
    )
      return;
    const [response, error] = await api.discipline.сhangeDiscipline(
      this.accessToken,
      this.changeDiscipline.id,
      { name: this.newDisciplineName }
    );
    if (response && !error) {
      this.changeDiscipline.name = this.newDisciplineName;
      this.$notification.success({
        message: "Дисциплина обновлена",
        description: ``,
      });
      this.changeDiscipline = null;
      this.visibleModalCreateDiscipline = false;
      this.newDisciplineName = "";
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "Обновление дисциплины",
      });
    } else console.error(error);
  }
  // удаление дисциплины
  async deleteDiscipline(discipline: Discipline | null): Promise<void> {
    if (!discipline || !this.userAccess.discipline.delete) return;
    this.$confirm({
      title: "Удаление дисциплины",
      content: `Вы точно хотите удалить дисциплину: ${discipline.name}`,
      onOk: async () => {
        if (discipline?.id === null || discipline?.id === undefined) return;
        const [response, error] = await api.discipline.deleteDiscipline(
          this.accessToken,
          discipline.id
        );
        if (response && !error) {
          // удаление по id
          const findId = this.disciplines.findIndex(
            (item) => item.id === discipline.id
          );
          findId > -1 && this.disciplines.splice(findId, 1);
        } else if (error) {
          console.warn(error);
          this.$notification.warning({
            message: error?.message ?? "",
            description: "Удаление дисциплины",
          });
        } else console.error(error);
      },
    });
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    if (this.filterName)
      return this.disciplines.filter((item) =>
        item.name?.toLowerCase().includes(this.filterName.toLowerCase())
      );
    else return this.disciplines;
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTable() {
    const columns = [
      {
        title: "Название дисциплины",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        scopedSlots: { customRender: "name" },
      },
      {
        title: "Действия",
        key: "action",
        width: 200,
        ellipsis: true,
        scopedSlots: { customRender: "action" },
      },
    ];
    if (this.userAccess.discipline.update || this.userAccess.discipline.delete)
      return columns;
    else return [columns[0]];
  }
}
</script>

<style lang="scss">
.v-discipline-list {
  &-header-block {
    border-block-end: 1px solid rgb(235, 237, 240);
    margin-bottom: 0px;
  }
}
</style>
