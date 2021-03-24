import Vue from "vue";
import Vuex from "vuex";
import { AccessKeys } from "../../../common/types/model";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // токены
    accessKeys: { accessToken: "", refreshToken: "" } as AccessKeys,
  },
  mutations: {
    // установка токенов
    setAccessToken(state, newAccessToken) {
      state.accessKeys.accessToken = newAccessToken;
    },
    setRefreshToken(state, newRefreshToken) {
      state.accessKeys.refreshToken = newRefreshToken;
    },
  },
  actions: {},
  modules: {},
});
