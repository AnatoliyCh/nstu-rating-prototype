<template>
  <div class="v-event-type-list">
    <a-page-header
      title="Список: типы мероприятия"
      class="v-event-type-list-header-block"
    >
      <template slot="extra">
        <a-input-search
          v-model="filterName"
          key="2"
          placeholder="поиск поназванию..."
          allowClear
          style="width: 200px"
        />
        <a-button
          v-if="userAccess.eventType.create"
          key="1"
          type="primary"
          @click="routing('event-type-create')"
        >
          Создать тип мероприятия
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
      <a
        slot="name"
        slot-scope="name, item"
        @click="goEventTypeDetails(item.id)"
        >{{ name }}</a
      >
      <a
        v-if="userAccess.eventType.delete"
        slot="action"
        slot-scope="type"
        @click="deleteEventType(type)"
      >
        Удалить
      </a>
    </a-table>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import VEventApiMixin from "@/common/v-event-api-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { TypeEvent } from "../../../../../../common/types/model";

@Component
export default class VEventTypeList extends mixins(VBaseMixin, VEventApiMixin) {
  typesEvent: TypeEvent[] = [];
  size = 0;
  filterName = ""; // фильтр названия

  async created(): Promise<void> {
    this.menuKey = [2];
    this.isLoading = true;
    this.typesEvent = await this.getEventTypes();
    this.isLoading = false;
  }

  // удаление типа мероприятия
  async deleteEventType(type: TypeEvent | null): Promise<void> {
    if (!type || !this.userAccess.eventType.delete) return;
    this.$confirm({
      title: "Удаление типы мероприятия",
      content: `Вы точно хотите тип мероприятия: ${type.name}`,
      onOk: async () => {
        if (!type?.id) return;
        const [response, error] = await api.event.deleteEventType(
          this.accessToken,
          type.id
        );
        if (response && !error) {
          // удаление по id
          const findId = this.typesEvent.findIndex(
            (item) => item.id === type.id
          );
          findId > -1 && this.typesEvent.splice(findId, 1);
        } else if (error) {
          console.warn(error);
          this.$notification.warning({
            message: error?.message ?? "",
            description: "",
          });
        } else console.error(error);
      },
    });
  }
  // переход на страницу просмотра типа мероприятия
  goEventTypeDetails(idEventType: number | null | undefined): void {
    if (!idEventType) return;
    this.$router.push({
      name: "event-type-details",
      params: { id: idEventType.toString(), mode: "details" },
    });
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    if (this.filterName)
      return this.typesEvent.filter((item) =>
        item.name?.toLowerCase().includes(this.filterName.toLowerCase())
      );
    else return this.typesEvent;
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTable() {
    const columns = [
      {
        title: "Название типа",
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
    if (!this.userAccess.eventType.delete) return [columns[0]];
    return columns;
  }
}
</script>

<style lang="scss">
.v-event-type-list {
  &-header-block {
    border-block-end: 1px solid rgb(235, 237, 240);
    margin-bottom: 0px;
  }
}
</style>
