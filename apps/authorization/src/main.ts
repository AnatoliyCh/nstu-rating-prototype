import Vue from "vue";
import App from "./App.vue";
import Api from "../../common/types/api";

Vue.config.productionTip = false;
// подключение апи
// eslint-disable-next-line
Vue.prototype.$api = new Api(); // eslint-disable-next-line
// подключение контроллов
import "ant-design-vue/dist/antd.css";
import { Button, Input, Icon, Card } from "ant-design-vue";
Vue.use(Button);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Card);

new Vue({
  render: (h) => h(App),
}).$mount("#app-authorization");
