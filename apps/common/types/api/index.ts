export { ApiError } from "./ApiError"; // ошибка сервера
export { CreateUser, UserObject } from "./user";
export { EventObject, EventRequestObject } from "./event";
export { ChatObject, MessageObject, CreateChat } from "./chat";
export { GroupObject, GroupCreate } from "./group";
export { DisciplineObject, DisciplineCreate } from "./discipline";
export { AchievementObject } from "./rating";

/** Объект получения списка объектов с указанием типа */
export interface ArrayObject<T> {
  data: T[] | null;
  size?: number | number;
}
