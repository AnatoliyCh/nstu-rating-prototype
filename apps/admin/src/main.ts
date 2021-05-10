import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
// подключение контроллов ant
import "ant-design-vue/dist/antd.css";
import Antd, { notification, message } from "ant-design-vue";
Vue.use(Antd);

// регистрация компонентов
import vLoading from "@/common/components/v-loading.vue";
Vue.component("v-loading", vLoading);
// таблица достижений пользователя
import VUserTableAchievements from "@/common/components/user/account/v-user-table-achievements.vue";
Vue.component("v-user-table-achievements", VUserTableAchievements);
// модальное окно получения пользователя
import VModalGetUser from "@/common/components/user/v-modal-get-user.vue";
Vue.component("v-modal-get-user", VModalGetUser);
// модальное окно получения дисциплины
import VModalGetDiscipline from "@/common/components/discipline/v-modal-get-discipline.vue";
Vue.component("v-modal-get-discipline", VModalGetDiscipline);
// модальное окно получения группы
import VModalgetGroup from "@/common/components/group/v-modal-get-group.vue";
Vue.component("v-modal-get-group", VModalgetGroup);
// модальное окно создания достижения (преп. для студента)
import VModalCreateAchievement from "@/common/components/rating/v-modal-create-achievement.vue";
Vue.component("v-modal-create-achievement", VModalCreateAchievement);
// модальное окно получения журанала
import VModalGetGradebook from "@/common/components/rating/v-modal-get-gradebook.vue";
Vue.component("v-modal-get-gradebook", VModalGetGradebook);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

// подключение уведомлений
Vue.prototype.$notification = notification;
Vue.prototype.$message = message;
