import { GradebookPage, Group } from "../index";
/** журнал успеваемости (имеет страницы) */
export interface Gradebook {
  /** ид в БД  */
  id?: number | null;
  /** от какой группы этот журнал */
  group: Group | null;
  /** страницы журнала */
  pages: GradebookPage[];
}
