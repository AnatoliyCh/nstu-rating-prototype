import { Profile, User } from "../model";
/** Объект для создания пользователя (тело запроса) */
export interface CreateUser {
  /** профиль (ФИО) */
  profile: Profile;
  /** ids ролей нового пользователя */
  roles: number[];
  /** пароли и логин */
  account: {
    password: string;
    repeatPassword: string;
    login: string;
  };
}
export interface UserObject {
  data: User[] | null;
  size?: number;
}
