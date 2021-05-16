/** Сообщение */
export interface Message {
  /** ид в БД */
  id?: number | null;
  /** сообщенее */
  text: string | null;
  /** прикрепленные файлы к сообщению */
  files?: {
    /** id файла */
    id?: number | null;
    /** путь на сервере */
    path?: string | null;
    /** название файла */
    name: string | null;
  };
  /** время сообщения */
  dateTime: string | null;
  /** отправитель */
  sender: number | null;
  /** получатель: пользователь, чат(мероприятия) */
  receiver: number | null;
}
