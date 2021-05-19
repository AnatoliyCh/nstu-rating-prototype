<template>
  <div class="v-event-details-members">
    <div class="filter-wrapper">
      <!-- поиск -->
      <a-input-search
        v-model="filterName"
        placeholder="поиск по ФИО..."
        allowClear
      />
    </div>
    <a-card>
      <a-list size="small" item-layout="horizontal" :data-source="tableData">
        <a-list-item slot="renderItem" slot-scope="item">
          <a> {{ item.name }} </a>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>
<script lang="ts">
import VEventApiMixin from "@/common/v-event-api-mixin";
import VBaseMixin from "@/common/v-base-mixin";
import Component, { mixins } from "vue-class-component";
import { Prop } from "vue-property-decorator";
import {
  OutstudyEvent,
  TypeEvent,
  Request,
  User,
} from "../../../../../../common/types/model";
import api from "@/common/api";
import { viewFullName } from "@/common/filters";

@Component
export default class VEventDetailsMembers extends mixins(
  VBaseMixin,
  VEventApiMixin
) {
  @Prop({ type: Array, default: [] }) readonly members!: User[];
  @Prop({ type: Object, default: null }) readonly event!: OutstudyEvent | null;
  filterName = ""; // фильтр по ФИО

  /** тек. польз. организатор (или админ или тьютор) */
  get isOrganizer(): boolean {
    return (
      this.currentUser?.id === this.event?.organizer?.user?.id ||
      this.getIsContainsAccessRole(["администратор", "тьютор"])
    );
  }

  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    const data = this.members.map((item, index) => ({
      key: index,
      name: viewFullName(item.profile, false),
      user: item,
    }));
    if (this.filterName)
      return data.filter((x) =>
        x.name.toLowerCase().includes(this.filterName.toLowerCase())
      );
    return data;
  }
}
</script>

<style lang="scss">
.v-event-details-members {
  // height: calc(100vh - 22em);
  // overflow: auto;
  .filter-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }
  > div.ant-card.ant-card-bordered {
    height: calc(100vh - 25.6em);
    overflow: auto;
    border-top: none !important;
    border-left: none !important;
    border-radius: 0;
    .ant-card-body {
      padding: 16px 0px 16px 16px !important;
    }
  }
}
</style>
