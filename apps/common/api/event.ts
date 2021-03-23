//* модуль event
import {
  ApiError,
  EventObject,
  EventRequestObject,
  UserObject,
} from "../types/api";
import { TypeEvent, OutstudyEvent } from "../types/model";
import * as http from "../api";

/** получение типов мероприятия */
export async function getTypes(
  path: string
): Promise<[TypeEvent[] | undefined, ApiError | undefined]> {
  return await http.get<TypeEvent[]>(path, {
    headers: { accept: "application/json" },
  });
}
/** создание типа мероприятия */
export async function createType(
  path: string,
  requestBody: TypeEvent
): Promise<[{ id: number } | undefined, ApiError | undefined]> {
  return await http.post<TypeEvent, { id: number }>(path, requestBody, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
}
/** получение списка мероприятий */
export async function getEvents(
  path: string
): Promise<[EventObject | undefined, ApiError | undefined]> {
  return await http.get<EventObject>(path, {
    headers: { accept: "application/json" },
  });
}
/** создание мероприятия */
export async function createEvent(
  path: string,
  requestBody: OutstudyEvent
): Promise<[{ id: number } | undefined, ApiError | undefined]> {
  return await http.post<OutstudyEvent, { id: number }>(path, requestBody, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
}
/** получение списка участников по id мероприятия */
export async function getMembersEvent(
  path: string
): Promise<[UserObject | undefined, ApiError | undefined]> {
  return await http.get<UserObject>(path, {
    headers: { accept: "application/json" },
  });
}
/** получение списка заявок на участие по id мероприятия */
export async function getRequestsEvent(
  path: string
): Promise<[EventRequestObject | undefined, ApiError | undefined]> {
  return await http.get<EventRequestObject>(path, {
    headers: { accept: "application/json" },
  });
}
/** отправка заявки на участие в мероприятии */
export async function memberEventRegistration(
  path: string
): Promise<[any | undefined, ApiError | undefined]> {
  return await http.post<undefined, any>(path, undefined, {
    headers: { accept: "*/*" },
  });
}
/** изменение статуса заявки участиника (принять/тклонить)*/
export async function memberEventRequestChange(
  path: string,
  requestBody: { status: number }
): Promise<[any | undefined, ApiError | undefined]> {
  return await http.put<{ status: number }, any>(path, requestBody, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
}
