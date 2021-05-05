/* eslint-disable */
//* модуль event
import {
  ApiError,
  EventObject,
  EventRequestObject,
  UserObject,
} from "../../../../common/types/api";
import { OutstudyEvent, TypeEvent } from "../../../../common/types/model";
import * as http from "../api";

/** получение типов мероприятия */
export async function getTypes(
  accessToken: string,
  path: string
): Promise<[TypeEvent[] | undefined, ApiError | undefined]> {
  return await http.get<TypeEvent[]>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** создание типа мероприятия */
export async function createType(
  accessToken: string,
  path: string,
  requestBody: TypeEvent
): Promise<[{ id: number } | undefined, ApiError | undefined]> {
  return await http.post<TypeEvent, { id: number }>(path, requestBody, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** удаление типа мероприятия */
export async function deleteEventType(
  accessToken: string,
  path: string
): Promise<[boolean | undefined, ApiError | undefined]> {
  const [response, error] = await http._delete(path, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
  return [response ? true : undefined, error];
}
/** получение списка мероприятий */
export async function getEvents(
  accessToken: string,
  path: string
): Promise<[EventObject | undefined, ApiError | undefined]> {
  return await http.get<EventObject>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** получение мероприятия по id */
export async function getEventById(
  accessToken: string,
  path: string
): Promise<[OutstudyEvent | undefined, ApiError | undefined]> {
  return await http.get<OutstudyEvent>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** создание мероприятия */
export async function createEvent(
  accessToken: string,
  path: string,
  requestBody: OutstudyEvent
): Promise<[{ id: number } | undefined, ApiError | undefined]> {
  return await http.post<OutstudyEvent, { id: number }>(path, requestBody, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** удаление мероприятия */
export async function deleteEvent(
  accessToken: string,
  path: string
): Promise<[any | undefined, ApiError | undefined]> {
  return await http._delete(path, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** получение списка участников по id мероприятия */
export async function getMembersEvent(
  accessToken: string,
  path: string
): Promise<[UserObject | undefined, ApiError | undefined]> {
  return await http.get<UserObject>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** получение списка заявок на участие по id мероприятия */
export async function getRequestsEvent(
  accessToken: string,
  path: string
): Promise<[EventRequestObject | undefined, ApiError | undefined]> {
  return await http.get<EventRequestObject>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** отправка заявки на участие в мероприятии */
export async function memberEventRegistration(
  accessToken: string,
  path: string
): Promise<[any | undefined, ApiError | undefined]> {
  return await http.post<undefined, any>(path, undefined, {
    headers: { accept: "*/*", Authorization: "Bearer " + accessToken },
  });
}
/** изменение статуса заявки участиника (принять/тклонить)*/
export async function memberEventRequestChange(
  accessToken: string,
  path: string,
  requestBody: { status: number }
): Promise<[any | undefined, ApiError | undefined]> {
  return await http.put<{ status: number }, any>(path, requestBody, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** награждение участников (пользовтелей) по критериям */
export async function membersReward(
  accessToken: string,
  path: string,
  requestBody: {
    data: [
      {
        criterionId: number;
        usersIds: number[];
      }
    ];
  }
): Promise<[any | undefined, ApiError | undefined]> {
  return await http.post<Parameters<typeof membersReward>[2], any>(
    path,
    requestBody,
    {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
}
