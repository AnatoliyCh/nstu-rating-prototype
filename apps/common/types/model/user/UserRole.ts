/** Информация об роли пользователя */
export interface UserRole {
  /** id роли */
  id?: number;
  /** вес (для сортировки) */
  cost?: number;
  /** цвет в блоках */
  color: string;
  /** название в RU */
  name: string;
}
