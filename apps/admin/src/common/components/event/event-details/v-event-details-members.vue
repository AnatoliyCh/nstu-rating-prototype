<template>
  <div class="v-event-details-members">
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

  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    return this.members.map((item, index) => ({
      key: index,
      name: viewFullName(item.profile, false),
      user: item,
    }));
  }
}
</script>

<style lang="scss">
.v-event-details-members {
  height: calc(100vh - 22em);
  overflow: auto;
  > div.ant-card.ant-card-bordered {
    border-top: none !important;
    border-left: none !important;
    border-radius: 0;
    .ant-card-body {
      padding: 16px 0px 16px 16px !important;
    }
  }
}
</style>
