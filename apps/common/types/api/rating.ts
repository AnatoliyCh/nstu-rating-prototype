import { Achievement, Gradebook, GradebookPage } from "../model";
/** список достижений студента */
export interface AchievementObject {
  size?: number;
  data: Achievement[] | null;
}
/** создание достижения (лично преподавателем) */
export interface AchievementCreate {
  /** зачисляемые очки */
  score: number;
  /** название достижения */
  name: string;
  /** тот, кому начилсяют */
  userId: number;
}
/** создание запроса на распределение */
export interface AchievementRequestCreate {
  score: number;
}
/** список журналов успеваемости */
export interface GradebookObject {
  size?: number;
  data: Gradebook[] | null;
}
/** создание страницы журнала успеваемости */
export interface GradebookPageCreate {
  groupId: number;
  moderators: number[];
  disciplineId: number;
}
