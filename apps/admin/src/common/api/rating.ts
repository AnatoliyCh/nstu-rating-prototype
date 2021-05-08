/* eslint-disable */
//* модуль rating
import {
  AchievementObject,
  AchievementCreate,
  ApiError,
} from "../../../../common/types/api";
import * as http from "../api";
/** получение списка достижений */
export async function getAchievements(
  accessToken: string,
  path: string
): Promise<[AchievementObject | undefined, ApiError | undefined]> {
  return await http.get<AchievementObject>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** получение списка истории достижений */
export async function getAchievementsHistory(
  accessToken: string,
  path: string
): Promise<[AchievementObject | undefined, ApiError | undefined]> {
  return await http.get<AchievementObject>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** получение списка отправленных запросов на распределение баллов */
export async function getAchievementRequests(
  accessToken: string,
  path: string
): Promise<[AchievementObject | undefined, ApiError | undefined]> {
  return await http.get<AchievementObject>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** создание запроса на распределение */
export async function createAchievementRequest(
  accessToken: string,
  path: string,
  requestBody: AchievementCreate
): Promise<[{ id: number } | undefined, ApiError | undefined]> {
  return await http.post<AchievementCreate, { id: number }>(path, requestBody, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** удаление запроса на распределение */
export async function deleteAchievementRequest(
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
