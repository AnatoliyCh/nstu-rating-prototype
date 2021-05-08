<template>
  <div class="v-user-space">
    <a-page-header
      title="Просмотр: личный кабинет"
      class="v-user-space-header-block"
    />
    <div class="v-user-space-body">
      <a-tabs default-active-key="1" size="small">
        <a-tab-pane key="1" tab="Достижения">
          <v-user-table-achievements
            :action="actionCreateRequest"
            :getData="getAchievements"
          />
        </a-tab-pane>
        <a-tab-pane key="2" tab="История распределения достижений">
          <v-user-table-achievements />
        </a-tab-pane>
        <a-tab-pane key="3" tab="Мои запросы на распределение">
          <v-user-table-achievements />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import { roles } from "@/common/services/user";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { CreateUser } from "../../../../../../common/types/api";
import { Achievement, UserRole } from "../../../../../../common/types/model";

@Component
export default class VUserSpace extends mixins(VBaseMixin) {
  created(): void {
    this.menuKey = [0];
    if (!this.userAccess.user.space) this.routing("user-list");
  }
  //* достижения
  /** действие для списка достижений */
  actionCreateRequest = {
    name: "Распределить",
    func: () => {
      console.log("test");
    },
  };
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
