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
  /** путь к приложению авторизации */
  pathAuthorization: string;

  public constructor() {
    const pathOrigin: string = (window as any).PATH_APP.origin;
    if (pathOrigin && typeof pathOrigin === "string") {
      this.basePath = PATH_BASE + pathOrigin;
      this.pathAuthorization =
        this.basePath + (window as any).PATH_APP.authorization;
    } else {
      this.basePath = PATH_BASE + PATH_HOST;
      this.pathAuthorization = PATH_BASE + PATH_HOST + "authorization";
    }
  }
  public auth = {
    login: async (requestBody: Account) => {
      return auth.login(this.basePath + "auth/api/v1/login", requestBody);
    },
    redirect: async (accessToken: string) => {
      return auth.redirect(accessToken, this.basePath + "app/by/role");
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
const api: Api = new Api();
export default api;
