import { Achievement } from "../model";
/** список достижений студента */
export interface AchievementObject {
  size?: number;
  data: Achievement[] | null;
}
/** создание запроса на распределение */
export interface AchievementCreate {
  score: number;
}
