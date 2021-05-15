import { Message } from "./Message";
import { User } from "../index";
/** Чат */
export interface Chat {
  /** ид в БД */
  id?: number | null;
  /** название */
  name?: string | null;
  /** участники чата */
  users?: User[];
  /** информация для пользователя */
  userInfo: UserInfo | null;
  /** последнее сообщение в чате */
  lastMessage: Message | null;
}
/** информация для пользователя */
export type UserInfo = {
  /** кол-во непрочитанных сообщений */
  sizeOfUnreadMessages: number | null;
};
