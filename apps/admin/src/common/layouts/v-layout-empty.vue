<template functional>
  <div class="v-layout-empty">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class VLayoutEmpty extends Vue {}
</script>

<style lang="scss" scoped>
@import "src/app/common/components/base/scss/__root";
.v-layout-empty {
  width: 100%;
  height: 100%;
  background-color: $color-main-two-light-1;
}
</style>
