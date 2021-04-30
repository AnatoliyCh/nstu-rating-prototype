import Vue from "vue";
import Vuex from "vuex";
import { AccessKeys, User } from "../../../common/types/model";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // токены
    accessKeys: { accessToken: "", refreshToken: "" } as AccessKeys,
    // пользователь
    user: null as User | null,
    // выбранный item меню
    menuKey: -1 as number,
  },
  mutations: {
    // установка токенов
    setAccessToken(state, newAccessToken) {
      state.accessKeys.accessToken = newAccessToken;
    },
    setRefreshToken(state, newRefreshToken) {
      state.accessKeys.refreshToken = newRefreshToken;
    },
    // установка пользователя
    setUser(state, user: User | null) {
      if (user && "id" in user && "roles" in user && "profile" in user)
        state.user = user;
      else state.user = null;
    },
    // установка меню навигации
    setMenuKey(state, key: number | null) {
      if (typeof key !== "number") state.menuKey = -1;
      else state.menuKey = key;
    },
  },
  actions: {},
  modules: {},
});
