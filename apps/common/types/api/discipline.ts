import { Discipline } from "../model";
/** для списка дисциплин */
export interface DisciplineObject {
  size?: number;
  data: Discipline[] | null;
}
/** создание дисциплины */
export interface DisciplineCreate {
  name: string;
}
