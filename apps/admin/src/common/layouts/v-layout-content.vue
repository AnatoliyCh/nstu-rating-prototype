<template>
  <div class="v-layout-content">
    <v-sidebar-vertical :links="linksApp" />
    <div class="v-content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RouteConfig } from "vue-router";
// пути приложений
import routesAdmin from "@/app/admin/route";

@Component
export default class VLayoutContent extends Vue {
  get linksApp(): RouteConfig[] {
    switch (this.$route.meta.app) {
      case "admin":
        return routesAdmin;

      default:
        return [];
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/app/common/components/base/scss/__root";
.v-layout-content {
  width: 100%;
  height: 100%;
  background-color: $color-main-two-light-1;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  .v-content {
    width: 100%;
    // margin-left: 4px;
    overflow: auto;
  }
}
</style>
