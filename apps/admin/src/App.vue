<template>
  <div id="app">
    <!-- тек. пользователь -->
    <div class="app-user-element">{{ `Пользователь: ${currentUserId}` }}</div>
    <div class="app-body">
      <!-- навигационное меню -->
      <a-menu
        class="app-body-menu"
        :default-selected-keys="['1']"
        mode="inline"
      >
        <a-menu-item v-for="(link, index) in viewModelLinks" :key="index">
          <router-link :to="link.path">
            <a-icon v-if="link.meta.icon" :type="link.meta.icon" />
            <span>{{ link.meta.name }}</span>
          </router-link>
        </a-menu-item>
      </a-menu>
      <!-- тело -->
      <div class="app-body-content">
        <a-config-provider :locale="currentLocale">
          <router-view />
        </a-config-provider>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import { RouteConfig } from "vue-router";
import VBaseMixin from "@/common/v-base-mixin";
// локализация
import ruRU from "ant-design-vue/es/locale/ru_RU";
import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");
// JWT
import jwt from "jsonwebtoken";

@Component
export default class App extends mixins(VBaseMixin) {
  created(): void {
    // токены
    this.$store.commit("setAccessToken", localStorage.getItem("aT"));
    this.$store.commit("setRefreshToken", localStorage.getItem("rT"));
    // текущий пользователь
    const decodeToken = jwt.decode(this.accessToken);
    if (
      decodeToken &&
      typeof decodeToken !== "string" &&
      "userId" in decodeToken
    )
      this.$store.commit("setUser", {
        id: decodeToken.userId,
        roles: [],
        profile: {
          lastName: null, // ф
          firstName: null, // и
          middleName: null, // о
        },
      });
  }
  // eslint-disable-next-line
  get currentLocale(): any {
    return ruRU;
  }
  get viewModelLinks(): RouteConfig[] {
    const routes = this.$router.options.routes;
    if (!routes) return [];
    return routes.filter((route) => Boolean(route.meta?.name));
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
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}
</style>
