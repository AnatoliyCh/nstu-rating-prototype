<template>
  <div class="v-event-type-list">
    <a-page-header
      title="Список: типы мероприятия"
      class="v-event-type-list-header-block"
    >
      <!-- действия для орг. и админа -->
      <template slot="extra">
        <a-button key="1" type="primary" @click="routing('event-type-create')">
          Создать тип мероприятия
        </a-button>
      </template>
    </a-page-header>
    <a-table
      :columns="columnsTable"
      :data-source="typesEvent"
      :loading="isLoading"
      :pagination="{ pageSize: 20 }"
      :scroll="{ y: 'calc(100vh - 16em)' }"
      rowKey="id"
    >
      <a slot="name" slot-scope="name">{{ name }}</a>
      <a
        v-if="deleteAccess"
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

  async created(): Promise<void> {
    this.isLoading = true;
    this.typesEvent = await this.getEventTypes();
    this.isLoading = false;
  }

  // удаление мероприятия
  async deleteEventType(type: TypeEvent | null): Promise<void> {
    if (!type) return;
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
    if (!this.deleteAccess) return [columns[0]];
    return columns;
  }
  /** возможность удалять типы мероприятий*/
  get deleteAccess(): boolean {
    for (const role of this.currentUser?.roles ?? []) {
      if (["администратор", "тьютор", "организатор"].includes(role.name))
        return true;
    }
    return false;
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
