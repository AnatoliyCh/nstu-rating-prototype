declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
// для локализации
interface ruRU {
  [key: string]: any;
}
declare module "ant-design-vue/es/locale/ru_RU" {
  import ruRU from "ant-design-vue/es/locale/ru_RU";
  const ruRU: ruRU;

  export default ruRU;
}
