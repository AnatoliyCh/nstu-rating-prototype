import { Criteria } from "../../model";
/** Вид мероприятия */
export interface TypeEvent {
  /** ид в БД */
  id?: number | null;
  /** название */
  name: string | null;
  /** критерии данного типа мероприятия */
  criteria: Criteria[] | null;
}
