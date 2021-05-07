import { Achievement } from "../model";
/** список достижений студента */
export interface AchievementObject {
  size?: number;
  data: Achievement[] | null;
}
