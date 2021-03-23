import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

// подключение контроллов
import "ant-design-vue/dist/antd.css";
import { Button, Input, Icon, Checkbox, Card } from "ant-design-vue";
Vue.use(Button);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Checkbox);
Vue.use(Card);

new Vue({
  render: (h) => h(App),
}).$mount("#app-authorization");
