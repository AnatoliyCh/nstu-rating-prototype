import { User } from "../../model";
/** Внеучебное мероприятие */
export interface OutstudyEvent {
  /** ид в БД */
  id?: number | null;
  /** название */
  name: string | null;
  /** id типа мероприятия */
  outstudyEventKindId: number | null;
  eventKindId?: number | null; //TODO: удалить (разные id)
  /** статус */
  status: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** дата начала */
  dateStart: string | null;
  /** дата окончания */
  dateEnd: string | null;
  /** вид участия (свободный/подтверждение) */
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
}
