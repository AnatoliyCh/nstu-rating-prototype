import { Group } from "../model";
/** для списка групп */
export interface GroupObject {
  size?: number;
  data: Group[] | null;
}
/** создание группы */
export interface GroupCreate {
  name: string;
}
