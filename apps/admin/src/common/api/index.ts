/* eslint-disable */
export { get, post, put, _delete } from "./fetch";

import { CreateChat, CreateUser } from "../../../../common/types/api";
import {
  Account,
  OutstudyEvent,
  TypeEvent,
} from "../../../../common/types/model";
import * as auth from "./auth";
import * as chat from "./chat";
import * as event from "./event";
import * as user from "./user";

// API
export const PATH_BASE = "http://";
export const PATH_PROXY = "https://cors-anywhere.herokuapp.com/"; // прокси для получения CORS
export const PATH_HOST = "5.130.14.37:8080/"; // сервер для запросов
export const PATH_PROXY_HOST = PATH_PROXY + PATH_HOST; // прокси + хост

export class Api {
  pathBase: string;
  /** путь к приложению авторизации */
  pathAuthorization: string;

  public constructor() {
    const pathOrigin: string = (window as any).PATH_APP.origin;
    if (pathOrigin && typeof pathOrigin === "string") {
      this.pathBase = PATH_BASE + pathOrigin;
      this.pathAuthorization =
        this.pathBase + (window as any).PATH_APP.authorization;
    } else {
      this.pathBase = PATH_BASE + PATH_HOST;
      this.pathAuthorization = PATH_BASE + PATH_HOST + "authorization";
    }
  }
  public auth = {
    login: async (requestBody: Account) => {
      return auth.login(this.pathBase + "auth/api/v1/login", requestBody);
    },
  };
  public user = {
    getUsers: async (offset: number, limit: number) => {
      return user.getUsers(
        this.pathBase + `user/api/v1/user?offset=${offset}&limit=${limit}`
      );
    },
    createUser: async (accessToken: string, requestBody: CreateUser) => {
      return user.createUser(
        accessToken,
        this.pathBase + "user/api/v1/user",
        requestBody
      );
    },
    getUserById: async (accessToken: string, id: number) => {
      return user.getUserById(
        accessToken,
        this.pathBase + `user/api/v1/user/${id}`
      );
    },
  };
  public event = {
    getEventTypes: async (accessToken: string) => {
      return event.getTypes(
        accessToken,
        this.pathBase + `event/api/v1/outstudy-eventkind`
      );
    },
    createEventType: async (accessToken: string, requestBody: TypeEvent) => {
      return event.createType(
        accessToken,
        this.pathBase + "event/api/v1/outstudy-eventkind",
        requestBody
      );
    },
    deleteEventType: async (accessToken: string, id: number) => {
      return event.deleteEventType(
        accessToken,
        this.pathBase + `event/api/v1/outstudy-eventkind/${id}`
      );
    },
    getEvents: async (accessToken: string, offset: number, limit: number) => {
      return event.getEvents(
        accessToken,
        this.pathBase +
          `event/api/v1/outstudy-event?offset=${offset}&limit=${limit}`
      );
    },
    getEventById: async (accessToken: string, id: number) => {
      return event.getEventById(
        accessToken,
        this.pathBase + `event/api/v1/outstudy-event/${id}`
      );
    },
    createEvent: async (accessToken: string, requestBody: OutstudyEvent) => {
      return event.createEvent(
        accessToken,
        this.pathBase + "event/api/v1/outstudy-event",
        requestBody
      );
    },
    deleteEvent: async (accessToken: string, id: number) => {
      return event.deleteEvent(
        accessToken,
        this.pathBase + `event/api/v1/outstudy-event/${id}`
      );
    },
    getMembersEvent: async (accessToken: string, idEvent: number) => {
      return event.getMembersEvent(
        accessToken,
        this.pathBase +
          `event/api/v1/outstudy-event/${idEvent}/members?offset=0&limit=99`
      );
    },
    getRequestsEvent: async (accessToken: string, idEvent: number) => {
      return event.getRequestsEvent(
        accessToken,
        this.pathBase + `event/api/v1/outstudy-event/${idEvent}/request`
      );
    },
    memberEventRegistration: async (accessToken: string, idEvent: number) => {
      return event.memberEventRegistration(
        accessToken,
        this.pathBase + `event/api/v1/outstudy-event/${idEvent}/registration`
      );
    },
    memberEventRequestChange: async (
      accessToken: string,
      idEvent: number,
      idRequest: number,
      status: 1 | 2 | 3
    ) => {
      return event.memberEventRequestChange(
        accessToken,
        this.pathBase +
          `event/api/v1/outstudy-event/${idEvent}/request/${idRequest}`,
        { status: status }
      );
    },
    membersReward: async (
      accessToken: string,
      idEvent: number,
      requestBody: Parameters<typeof event.membersReward>[2]
    ) => {
      return event.membersReward(
        accessToken,
        this.pathBase + `event/api/v1/outstudy-event/${idEvent}/reward`,
        requestBody
      );
    },
  };
  public chat = {
    createChat: async (accessToken: string, requestBody: CreateChat) => {
      return chat.createChat(
        accessToken,
        this.pathBase + "chat/api/v1/chat/create",
        requestBody
      );
    },
    getChats: async (accessToken: string, offset: number, limit: number) => {
      return chat.getChats(
        accessToken,
        this.pathBase + `chat/api/v1/chat?offset=${offset}&limit=${limit}`
      );
    },
    getMessages: async (
      accessToken: string,
      idChat: number,
      offset: number,
      limit: number
    ) => {
      return chat.getMessages(
        accessToken,
        this.pathBase +
          `chat/api/v1/chat/${idChat}/messages?offset=${offset}&limit=${limit}`
      );
    },
    sendMessage: async (
      accessToken: string,
      chatId: number,
      message: string
    ) => {
      return chat.sendMessage(
        accessToken,
        this.pathBase + `chat/api/v1/chat/${chatId}/user/message`,
        { text: message }
      );
    },
  };
}
const api: Api = new Api();
export default api;
