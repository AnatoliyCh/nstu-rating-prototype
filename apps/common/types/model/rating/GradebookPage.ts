import { Discipline, User, Work } from "../index";
/** cтраница журнала */
export interface GradebookPage {
  /** ид в БД  */
  id?: number | null;
  /** дисциплина */
  discipline?: Discipline | null;
  /** те, кто могут управлять */
  moderators?: User[];
  /**  */
  studentsMarks?: {
    student?: User | null;
    marks?: {
      value: number;
      date: string;
    };
    bonusScore?: number;
  }[];
  /**  */
  works?: Work[];
}
