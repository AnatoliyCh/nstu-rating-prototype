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
          @click="visibleModalCreateDiscipline = true"
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
      <a slot="name" slot-scope="name, group" @click="goGroupDetails(group.id)">
        {{ name }}
      </a>
      <a
        v-if="userAccess.discipline.delete"
        slot="action"
        slot-scope="group"
        @click="deleteGroup(group)"
      >
        Удалить
      </a>
    </a-table>
    <!-- модальное окно создания группы -->
    <a-modal
      title="Название новой группы"
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
import { Group } from "../../../../../common/types/model";

@Component
export default class VGroupList extends mixins(VBaseMixin, VEventApiMixin) {
  groups: Group[] = [];
  size = 0;
  filterName = ""; // фильтр названия
  // модальное окно создания группы
  visibleModalCreateDiscipline = false;
  isLoadingCreate = false;
  newDisciplineName = "";

  async created(): Promise<void> {
    this.menuKey = [5];
    this.isLoading = true;
    await this.getDisciplines();
    this.isLoading = false;
  }
  /** получение списка групп */
  async getDisciplines(): Promise<void> {
    const [response, error] = await api.group.getGroups(
      this.accessToken,
      0,
      999
    );
    if (response && !error) {
      this.groups = response ?? [];
      this.size = response.length ?? 0;
    } else if (error) {
      console.warn(error);
      this.$notification.error({
        message: "Не удалось загрузить дисциплины",
        description: "",
      });
    } else console.error(error);
  }
  // удаление группы
  async deleteGroup(group: Group | null): Promise<void> {
    if (!group || !this.userAccess.discipline.delete) return;
    this.$confirm({
      title: "Удаление дисциплины",
      content: `Вы точно хотите удалить дисциплину: ${group.name}`,
      onOk: async () => {
        if (group?.id === null || group?.id === undefined) return;
        const [response, error] = await api.group.deleteGroup(
          this.accessToken,
          group.id
        );
        if (response && !error) {
          // удаление по id
          const findId = this.groups.findIndex((item) => item.id === group.id);
          findId > -1 && this.groups.splice(findId, 1);
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
  // переход на страницу просмотра группы
  goGroupDetails(groupId: number | null | undefined): void {
    if (groupId === null || groupId === undefined) return;
    this.$router.push({
      name: "group-details",
      params: { id: groupId.toString() },
    });
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    if (this.filterName)
      return this.groups.filter((item) =>
        item.name?.toLowerCase().includes(this.filterName.toLowerCase())
      );
    else return this.groups;
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
  //* модальное окно создания группы
  async handleOkCreate(): Promise<void> {
    if (!this.userAccess.discipline.create) {
      this.visibleModalCreateDiscipline = false;
      return;
    }
    this.isLoadingCreate = true;
    const [response, error] = await api.group.createGroup(this.accessToken, {
      name: this.newDisciplineName,
    });
    if (response && !error) {
      this.$notification.success({
        message: "Дисциплина создана",
        description: `Название: ${this.newDisciplineName}`,
      });
      this.groups.push({ id: response.id, name: this.newDisciplineName });
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "Создание дисциплины",
      });
    } else console.error(error);
    this.visibleModalCreateDiscipline = false;
    this.isLoadingCreate = false;
    this.newDisciplineName = "";
  }
  handleCancelCreate(): void {
    this.visibleModalCreateDiscipline = false;
    this.newDisciplineName = "";
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
