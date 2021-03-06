import { User } from "../../model";
/** Внеучебное мероприятие */
export interface OutstudyEvent {
  /** ид в БД */
  id?: number | null;
  /** название */
  name: string | null;
  /** id типа мероприятия */
  outstudyEventKindId: number | null; // для создания
  eventKindId?: number | null; // при получении мероприятия
  /** статус
   * 10 - новое / анонс (ещё не началось)
   * 20 - в процессе
   * 30 - завершенное
   * 40 - архивное
   */
  status: number;
  /** дата начала */
  dateStart: string | null;
  /** дата окончания */
  dateEnd: string | null;
  /** вид участия (подтверждение/свободный) */
  isNeedMemberConfirmation: boolean;
  /** место проведения */
  address: string | null;
  /** описание */
  description?: string | null;
  /** минимальное количество участников */
  minMembers?: number | null;
  /** максимальное количество участников */
  maxMembers?: number | null;
  /** окончание даты регистрации */
  dateRegistrationEnd?: string | null;
  /** организатор */
  organizer?: { user: User | null };
  /** привязанный чат */
  chat?: { id?: number | null; name?: string | null; type?: number | null };
  /** количество учатников */
  membersSize?: number;
}
