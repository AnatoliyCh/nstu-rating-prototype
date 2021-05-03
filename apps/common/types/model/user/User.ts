import { Profile } from "../../model";
/** Пользователь */
export interface User {
  id: number;
  roles?: number[]; // роли
  profile: Profile; // профиль
}
