<template>
  <a-locale-provider :locale="currentLocale">
    <div id="app">
      <v-add-edit-event> </v-add-edit-event>
    </div>
  </a-locale-provider>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// локализация
import ru_RU from "ant-design-vue/lib/locale-provider/ru_RU";
import moment from "moment";
import "moment/locale/ru";

// import VLayoutEmpty from "@/app/common/layouts/v-layout-empty.vue";
// import VLayoutContent from "@/app/common/layouts/v-layout-content.vue";

@Component
export default class App extends Vue {
  created(): void {
    this.$store.commit("setAccessToken", localStorage.getItem("aT"));
    this.$store.commit("setRefreshToken", localStorage.getItem("rT"));
  }

  get currentLocale() {
    return ru_RU;
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
#app {
  height: 100%;
  display: flex;
  flex-direction: column;
  // шрифты
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
