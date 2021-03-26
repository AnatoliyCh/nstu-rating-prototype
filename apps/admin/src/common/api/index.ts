export { get, post, put } from "./fetch";

import * as auth from "./auth";
import * as user from "./user";
import * as event from "./event";
import {
  Account,
  TypeEvent,
  OutstudyEvent,
} from "../../../../common/types/model";

// API
export const PATH_BASE = "http://";
export const PATH_PROXY = "https://cors-anywhere.herokuapp.com/"; // прокси для получения CORS
export const PATH_HOST = "5.130.14.37:8080/"; // сервер для запросов
export const PATH_PROXY_HOST = PATH_PROXY + PATH_HOST; // прокси + хост

export class Api {
  basePath: string;
  public constructor() {
    this.basePath = PATH_BASE + PATH_HOST;
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
    getEventTypes: async (accessToken: string) => {
      return event.getTypes(
        accessToken,
        this.basePath + `event/api/v1/outstudy-eventkind`
      );
    },
    createEventType: async (accessToken: string, requestBody: TypeEvent) => {
      return event.createType(
        accessToken,
        this.basePath + "event/api/v1/outstudy-eventkind",
        requestBody
      );
    },
    getEvents: async (accessToken: string, offset: number, limit: number) => {
      return event.getEvents(
        accessToken,
        this.basePath +
          `event/api/v1/outstudy-event?offset=${offset}&limit=${limit}`
      );
    },
    createEvent: async (accessToken: string, requestBody: OutstudyEvent) => {
      return event.createEvent(
        accessToken,
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
    memberEventRegistration: async (accessToken: string, idEvent: number) => {
      return event.memberEventRegistration(
        accessToken,
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
const api: Api = new Api();
export default api;
