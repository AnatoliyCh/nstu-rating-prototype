/* eslint-disable */
//* модуль rating
import {
  AchievementObject,
  AchievementCreate,
  AchievementRequestCreate,
  GradebookObject,
  GradebookPageCreate,
  ApiError,
} from "../../../../common/types/api";
import { GradebookPage } from "../../../../common/types/model";
import * as http from "../api";

//* достижения

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
/** создание достижения (преп. для студента) */
export async function createAchievement(
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
/** создание запроса на распределение */
export async function createAchievementRequest(
  accessToken: string,
  path: string,
  requestBody: AchievementRequestCreate
): Promise<[{ id: number } | undefined, ApiError | undefined]> {
  return await http.post<AchievementRequestCreate, { id: number }>(
    path,
    requestBody,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
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
/** изменение статуса заявки на распределение*/
export async function changeAchievementRequest(
  accessToken: string,
  path: string,
  requestBody: { status: number }
): Promise<[boolean | undefined, ApiError | undefined]> {
  const [response, error] = await http.put<{ status: number }, any>(
    path,
    requestBody,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  return [response ? true : undefined, error];
}

//* журнал успеваемости

/** создание страницы журнала (группа-дисциплина с теми кто может редактировать) */
export async function createGradebookPage(
  accessToken: string,
  path: string,
  requestBody: GradebookPageCreate
): Promise<[{ id: number } | undefined, ApiError | undefined]> {
  return await http.post<GradebookPageCreate, { id: number }>(
    path,
    requestBody,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
}
/** редактирование страницы журнала */
export async function сhangeGradebookPage(
  accessToken: string,
  path: string,
  requestBody: number[]
): Promise<[boolean | undefined, ApiError | undefined]> {
  const [response, error] = await http.put<number[], any>(path, requestBody, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
  return [response ? true : undefined, error];
}
/** удаление страницы журнала */
export async function deleteGradebookPage(
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
/** получение страницы журнала по дисциплине и группе */
export async function getGradebookPageByDisciplineAndGroup(
  accessToken: string,
  path: string
): Promise<[GradebookPage | undefined, ApiError | undefined]> {
  return await http.get<GradebookPage>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** получение страницы журнала по дисциплине и студенту */
export async function getGradebookPageByDisciplineAndStudent(
  accessToken: string,
  path: string
): Promise<[GradebookPage | undefined, ApiError | undefined]> {
  return await http.get<GradebookPage>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** получение журнала со страницами */
export async function getGradebook(
  accessToken: string,
  path: string
): Promise<[GradebookObject | undefined, ApiError | undefined]> {
  return await http.get<GradebookObject>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
