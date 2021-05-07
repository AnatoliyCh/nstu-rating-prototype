<template>
  <div id="app">
    <!-- тек. пользователь -->
    <div v-if="!isLoading" class="app-user-element">
      <label>Пользователь: </label>
      <label v-if="!userAccess.user.space"> {{ viewCurrentUser }} </label>
      <a-button v-else type="link" @click="routing('user-space')">
        {{ viewCurrentUser }}
      </a-button>
      <!-- теги -->
      <label style="margin: 0 16px">Роли: </label>
      <template v-for="(role, index) in viewCurrentUserRoles">
        <a-tooltip v-if="role.name.length > 15" :key="index" :title="role.name">
          <a-tag :key="index" :color="role.color">
            {{ `${role.name.slice(0, 20)}...` }}
          </a-tag>
        </a-tooltip>
        <a-tag v-else :key="index" :color="role.color"> {{ role.name }} </a-tag>
      </template>
    </div>
    <div v-if="!isLoading" class="app-body">
      <!-- навигационное меню -->
      <a-menu class="app-body-menu" v-model="menuKey" mode="inline">
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
    <v-loading v-else />
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import { viewFullName } from "@/common/filters";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { RouteConfig } from "vue-router";
import { UserRole } from "../../common/types/model";
// локализация
import ruRU from "ant-design-vue/es/locale/ru_RU";
import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");
// JWT
import jwt from "jsonwebtoken";

@Component
export default class App extends mixins(VBaseMixin) {
  async created(): Promise<void> {
    this.isLoading = true;
    // токены
    this.$store.commit("setAccessToken", localStorage.getItem("aT"));
    this.$store.commit("setRefreshToken", localStorage.getItem("rT"));
    // текущий пользователь
    const decodeToken = jwt.decode(this.accessToken);
    if (decodeToken && typeof decodeToken !== "string" && decodeToken.userId) {
      const user = await this.getUserById(decodeToken.userId, false);
      user && this.$store.commit("setUser", user);
    }
    // не авторизировались
    if (process.env.NODE_ENV !== "development" && !this.currentUser)
      document.location.href = api.pathAuthorization;
    this.isLoading = false;
  }
  // eslint-disable-next-line
  get currentLocale(): any {
    return ruRU;
  }
  get viewCurrentUser(): string {
    if (!this.currentUser) return "-";
    return `${viewFullName(this.currentUser.profile, false)} `;
  }
  get viewCurrentUserRoles(): UserRole[] {
    return this.currentUser?.roles ?? [];
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
    margin-left: 16px;
    display: flex;
    align-items: center;
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
