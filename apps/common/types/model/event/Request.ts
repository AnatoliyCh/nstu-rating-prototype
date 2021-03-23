import { User } from "../../model";
/** Заявка на участие */
export interface Request {
  /** ид в БД */
  id: number | null;
  /** статус */
  status: number | null;
  /** id мероприятия */
  outStudyEventId?: number | null;
  /** пользователь */
  user: User | null;
}
