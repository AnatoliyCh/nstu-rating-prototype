export { ApiError } from "./ApiError"; // ошибка сервера
export { UserObject } from "./user";
export { EventObject, EventRequestObject } from "./event";
export { ChatObject, MessageObject, CreateChat } from "./chat";

/** Объект получения списка объектов с указанием типа */
export interface ArrayObject<T> {
  data: T[] | null;
  size?: number | number;
}
