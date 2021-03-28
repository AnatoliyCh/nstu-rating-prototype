import Vue from "vue";
import Vuex from "vuex";
import { AccessKeys, User, Profile } from "../../../common/types/model";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // токены
    accessKeys: { accessToken: "", refreshToken: "" } as AccessKeys,
    // пользователь
    user: {
      id: -1,
      roles: [] as number[],
      profile: {
        lastName: null, // ф
        firstName: null, // и
        middleName: null, // о
      } as Profile,
    },
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
    setUser(state, user: User) {
      state.user = user;
    },
  },
  actions: {},
  modules: {},
});
