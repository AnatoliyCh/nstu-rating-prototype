import { OutstudyEvent, Criteria, Discipline } from "../index";
/** достижение студента */
export interface Achievement {
  /** ид в БД */
  id?: number | null;
  /** название (имя критерия сформированное на сервере) */
  name: string | null;
  /** всего баллов */
  score: number | null;
  /** остаток баллов */
  balanceScore?: number | null;
  /** мероприятие, где было получено достижение */
  event: OutstudyEvent;
  /** критерий */
  criterion: Criteria;
  /** дисциплины */
  discipline?: Discipline;
}
