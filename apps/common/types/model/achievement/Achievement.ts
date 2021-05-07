import { OutstudyEvent, Criteria } from "../index";
/** достижение студента */
export interface Achievement {
  /** ид в БД */
  id?: number | null;
  /** название (имя критерия сформированное на сервере) */
  name: string | null;
  /** всего баллов */
  score: number | null;
  /** остаток очков */
  balanceScore: number | null;
  /** мероприятие, где было получено достижение */
  event: OutstudyEvent;
  /** критерий */
  criterion: Criteria;
}
