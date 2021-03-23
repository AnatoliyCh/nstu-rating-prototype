export { ApiError } from "./ApiError"; // ошибка сервера
export { UserObject } from "./user";
export { EventObject, EventRequestObject } from "./event";

import * as config from "../../config";
import * as auth from "../../api/auth";
import * as user from "../../api/user";
import * as event from "../../api/event";
import { Account, TypeEvent, OutstudyEvent } from "../model";

export default class Api {
  basePath: string;
  public constructor() {
    this.basePath = config.PATH_BASE + config.PATH_HOST;
  }
  public auth = {
    login: async (requestBody: Account) => {
      return auth.login(this.basePath + "auth/api/v1/login", requestBody);
    },
  };
  public user = {
    getUsers: async (offset: number, limit: number) => {
      return user.getUsers(
        this.basePath + `user/api/v1/user?offset=${offset}&limit=${limit}`
      );
    },
  };

  public event = {
    getEventTypes: async () => {
      return event.getTypes(this.basePath + `event/api/v1/outstudy-eventkind`);
    },
    createEventType: async (requestBody: TypeEvent) => {
      return event.createType(
        this.basePath + "event/api/v1/outstudy-eventkind",
        requestBody
      );
    },
    getEvents: async (offset: number, limit: number) => {
      return event.getEvents(
        this.basePath +
          `event/api/v1/outstudy-event?offset=${offset}&limit=${limit}`
      );
    },
    createEvent: async (requestBody: OutstudyEvent) => {
      return event.createEvent(
        this.basePath + "event/api/v1/outstudy-event",
        requestBody
      );
    },
    getMembersEvent: async (idEvent: number) => {
      return event.getMembersEvent(
        this.basePath + `event/api/v1/outstudy-event/${idEvent}/members`
      );
    },
    getRequestsEvent: async (idEvent: number) => {
      return event.getRequestsEvent(
        this.basePath + `event/api/v1/outstudy-event/${idEvent}/request`
      );
    },
    memberEventRegistration: async (idEvent: number) => {
      return event.memberEventRegistration(
        this.basePath + `event/api/v1/outstudy-event/${idEvent}/registration`
      );
    },
    memberEventRequestChange: async (
      idEvent: number,
      idRequest: number,
      status: 1 | 2 | 3
    ) => {
      return event.memberEventRequestChange(
        this.basePath +
          `event/api/v1/outstudy-event/${idEvent}/request/${idRequest}`,
        { status: status }
      );
    },
  };
}
