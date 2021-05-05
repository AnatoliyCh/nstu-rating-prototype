import { User } from "../index";
/** Группа */
export interface Group {
  /** ид в БД */
  id?: number | null;
  /** название */
  name?: string | null;
  /** участники */
  users?: User[];
  /** управляющие группой (староста и т.д.) */
  moderators?: User[];
}
