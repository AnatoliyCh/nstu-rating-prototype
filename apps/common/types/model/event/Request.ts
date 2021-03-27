import { User } from "../../model";
/** Заявка на участие */
export interface Request {
  /** ид в БД */
  id: number | null;
  /** статус: 1: в процессе, 2: принято, 3: отказано */
  status: number | null;
  /** id мероприятия */
  outStudyEventId?: number | null;
  /** пользователь */
  user: User | null;
}
