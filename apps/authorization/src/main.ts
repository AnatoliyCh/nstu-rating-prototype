import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;
// подключение контроллов
import "ant-design-vue/dist/antd.css";
import {
  Button,
  Input,
  Icon,
  Card,
  notification,
  message,
} from "ant-design-vue";
Vue.use(Button);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Card);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
// подключение уведомлений
Vue.prototype.$notification = notification;
Vue.prototype.$message = message;
