/* eslint-disable */
//* модуль discipline
import {
  ApiError,
  DisciplineCreate,
  DisciplineObject,
} from "../../../../common/types/api";
import { Discipline } from "../../../../common/types/model";
import * as http from "../api";
/** получение дисциплины */
export async function getDisciplines(
  accessToken: string,
  path: string
): Promise<[DisciplineObject | undefined, ApiError | undefined]> {
  return await http.get<DisciplineObject>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** создание дисциплины */
export async function createDiscipline(
  accessToken: string,
  path: string,
  requestBody: DisciplineCreate
): Promise<[{ id: number } | undefined, ApiError | undefined]> {
  return await http.post<DisciplineCreate, { id: number }>(path, requestBody, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** получение дисциплины по id */
export async function getDisciplineById(
  accessToken: string,
  path: string
): Promise<[Discipline | undefined, ApiError | undefined]> {
  return await http.get<Discipline>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** редактирование дисциплины */
export async function сhangeDiscipline(
  accessToken: string,
  path: string,
  requestBody: DisciplineCreate
): Promise<[boolean | undefined, ApiError | undefined]> {
  const [response, error] = await http.put<DisciplineCreate, any>(
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
/** удаление дисциплины */
export async function deleteDiscipline(
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
