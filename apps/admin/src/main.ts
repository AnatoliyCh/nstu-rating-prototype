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

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

// подключение уведомлений
Vue.prototype.$notification = notification;
Vue.prototype.$message = message;
