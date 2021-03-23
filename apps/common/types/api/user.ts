import { User } from "../model";
export interface UserObject {
  data: User[] | null;
  size?: number;
}
