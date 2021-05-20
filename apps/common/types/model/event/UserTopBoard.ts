import { User } from "../../model";
/** Вид мероприятия */
export interface UserTopBoard {
  userPlace: { user: number; place: number }[];
  minBall: number;
  maxBall: number;
}
