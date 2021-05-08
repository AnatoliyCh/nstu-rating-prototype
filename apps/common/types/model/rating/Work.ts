/** работа (уч. ед.) */
export interface Work {
  /** ид в БД  */
  id?: number | null;
  /** название */
  name?: string | null;
  /** макс. балл */
  maxValue?: number | null;
}
