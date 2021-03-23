/** Критерии оценки бонусных баллов */
export interface Criteria {
  /** ид в БД */
  id?: number | null;
  /** название */
  name?: string | null;
  /** количество баллов */
  value: number | null;
  /** тип критерия */
  typeId: 1 | 2 | 3;
  /** начало диапозона */
  topPlace?: number | null;
  /** конец диапозона */
  bottomPlace?: number | null;
}
