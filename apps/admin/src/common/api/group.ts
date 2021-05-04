/* eslint-disable */
//* модуль group
import {
  GroupObject,
  GroupCreate,
  ApiError,
} from "../../../../common/types/api";
import { Group } from "../../../../common/types/model";
import * as http from "../api";
/** получение групп */
export async function getGroups(
  accessToken: string,
  path: string
): Promise<[Group[] | undefined, ApiError | undefined]> {
  return await http.get<Group[]>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** создание группы */
export async function createGroup(
  accessToken: string,
  path: string,
  requestBody: GroupCreate
): Promise<[{ id: number } | undefined, ApiError | undefined]> {
  return await http.post<GroupCreate, { id: number }>(path, requestBody, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** получение группы по id */
export async function getGroupById(
  accessToken: string,
  path: string
): Promise<[Group | undefined, ApiError | undefined]> {
  return await http.get<Group>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** редактирование группы */
export async function сhangeGroup(
  accessToken: string,
  path: string,
  requestBody: GroupCreate
): Promise<[boolean | undefined, ApiError | undefined]> {
  const [response, error] = await http.put<GroupCreate, any>(
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
  return [response ? true : undefined, error];
}
/** удаление группы */
export async function deleteGroup(
  accessToken: string,
  path: string
): Promise<[boolean | undefined, ApiError | undefined]> {
  const [response, error] = await http._delete(path, {
    headers: {
      accept: "*/*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return [response ? true : undefined, error];
}
//* участники

/** добавление */
export async function addMembers(
  accessToken: string,
  path: string,
  requestBody: { users: number[]; moderators: number[] }
): Promise<[boolean | undefined, ApiError | undefined]> {
  const [response, error] = await http.post<
    { users: number[]; moderators: number[] },
    any
  >(path, requestBody, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
  return [response ? true : undefined, error];
}
/** удаление*/
export async function deleteMembers(
  accessToken: string,
  path: string,
  requestBody: { users: number[]; moderators: number[] }
): Promise<[boolean | undefined, ApiError | undefined]> {
  const [response, error] = await http._delete<{
    users: number[];
    moderators: number[];
  }>(path, requestBody, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
  return [response ? true : undefined, error];
}
