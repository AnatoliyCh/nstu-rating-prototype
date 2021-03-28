import { Chat, Message } from "../model";
/** Список чатов */
export interface ChatObject {
  data: Chat[] | null;
  size?: number | number;
}
/** Список сообщений */
export interface MessageObject {
  data: Message[] | null;
  size?: number | number;
}
/** Объект для создания чата (тело запроса) */
export interface CreateChat {
  /** название чата */
  name?: string | null;
  /** id учатсников чата */
  users: number[];
  /** тип чата: 1 - пользователь-пользователь, 2 - групповой */
  chatType: 1 | 2;
}
