import { OutstudyEvent, Request } from "../model";
export interface EventObject {
  size?: number;
  data: OutstudyEvent[] | null;
}
export interface EventRequestObject {
  size?: number;
  data: Request[] | null;
}
