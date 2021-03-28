/** Сообщение */
export interface Message {
  /** ид в БД */
  id?: number | null;
  /** сообщенее */
  text: string | null;
  /** время сообщения */
  dateTime: string | null;
  /** отправитель */
  sender: number | null;
  /** получатель: пользователь, чат(мероприятия) */
  receiver: number | null;
}
