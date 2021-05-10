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
  /** остаток баллов */
  balanceScore?: number | null;
  /** мероприятие, где было получено достижение (при награждении от преподавателя - пусто) */
  event?: OutstudyEvent;
  /** страница журнала */
  gradebookPage?: GradebookPage;
  /** для history user (если свой id то прихожу я) */
  user?: User | null;
  /** кто наградил (при награждении от мероприятия - пусто) */
  awardedUser?: User | null;
}
