import Component from "vue-class-component";
import { Vue } from "vue-property-decorator";

@Component
export default class VPaginationMixin extends Vue {
  isDataLoading = false; // загрузка данных для таблицы
  // настройки пагинации
  pagination = {
    position: "top",
    total: 0,
    current: 1,
    pageSize: 20,
    hideOnSinglePage: true, // прятать если всего 1 страница
    showQuickJumper: true, // ручной переход к нужной
  };

  /** отступ для запроса данных */
  get offset(): number {
    const numPage = this.pagination.current;
    const step = this.pagination.pageSize;
    const offset = numPage === 1 ? 0 : (numPage - 1) * step;
    return offset;
  }
}
