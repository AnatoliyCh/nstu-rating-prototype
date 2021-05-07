<template>
  <div class="v-user-space">
    <a-page-header title="Просмотр: личный кабинет" class="header-block" />
    <div class="v-user-space-body">
      <a-row type="flex" justify="start" :gutter="8">
        <a-col :span="8">
          <a-card title="Достижения" class="v-user-space-card" hoverable>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card
            title="История достижений"
            class="v-user-space-card"
            hoverable
          >
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card
            title="Мои запросы на распределение"
            class="v-user-space-card"
            hoverable
          >
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import { roles } from "@/common/services/user";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { CreateUser } from "../../../../../common/types/api";
import { UserRole } from "../../../../../common/types/model";

@Component
export default class VUserSpace extends mixins(VBaseMixin) {
  created(): void {
    this.menuKey = [0];
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-user-space {
  &-body {
    margin: 0px 8px;
    .v-user-space-card {
      cursor: default;
      .ant-card-head-title {
        text-align: center;
      }
    }
  }
}
</style>
