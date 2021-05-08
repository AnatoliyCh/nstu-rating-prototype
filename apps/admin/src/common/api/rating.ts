/* eslint-disable */
//* модуль rating
import { AchievementObject, ApiError } from "../../../../common/types/api";
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
