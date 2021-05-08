import {
  OutstudyEvent,
  Criteria,
  Discipline,
  User,
  GradebookPage,
} from "../index";
/** достижение студента */
export interface Achievement {
  /** ид в БД
   * для achievement/request это requestId */
  id?: number | null;
  /** название достижения (имя сформированное на сервере) */
  name: string | null;
  /** всего баллов */
  score: number | null;
  /** мероприятие, где было получено достижение */
  event: OutstudyEvent;
  /** критерий */
  criterion?: Criteria;
  /** страница журнала */
  gradebookPage?: GradebookPage;
  /** остаток баллов */
  balanceScore?: number | null;
  /** дисциплины */
  discipline?: Discipline;
  /** для history user (если свой id то прихожу я) */
  user?: User | null;
}
