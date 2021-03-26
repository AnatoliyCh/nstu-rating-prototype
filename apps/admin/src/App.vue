<template>
  <div id="app">
    <!-- тек. пользователь -->
    <div class="app-user-element">Пользователь:</div>
    <div class="app-body">
      <!-- навигационное меню -->
      <div class="app-body-menu"></div>
      <div class="app-body-content">
        <a-config-provider :locale="currentLocale">
          <router-view />
        </a-config-provider>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// локализация
import ruRU from "ant-design-vue/es/locale/ru_RU";
import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");

@Component
export default class App extends Vue {
  created(): void {
    this.$store.commit("setAccessToken", localStorage.getItem("aT"));
    this.$store.commit("setRefreshToken", localStorage.getItem("rT"));
  }
  // eslint-disable-next-line
  get currentLocale(): any {
    return ruRU;
  }

  // get layout():string {
  //   return "v-layout-" + (this.$route.meta.layout || "empty");
  // }
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

  min-width: 800px;

  > .app-user-element {
    border-block-end: 1px solid #e8e8e8;
    height: 32px;
  }
  > .app-body {
    height: calc(100% - 32px);
    overflow: hidden;
    display: flex;
    flex-direction: row;
    > .app-body-menu {
      height: 100%;
      width: 200px;
      border-right: 1px solid #e8e8e8;
    }
    > .app-body-content {
      width: 100%;
      overflow: auto;
    }
  }
}
</style>
