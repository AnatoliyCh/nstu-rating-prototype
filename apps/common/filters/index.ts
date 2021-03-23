//* модуль фильтров
import Vue from "vue";
// фильтры даты и времени
import { viewDate, viewTime } from "./filter-date-time";
export { viewDate, viewTime } from "./filter-date-time";

Vue.filter("viewDate", viewDate);
Vue.filter("viewTime", viewTime);
// для USER
import { viewFullName } from "./filter-user";
export { viewFullName } from "./filter-user";

Vue.filter("viewFullName", viewFullName);
