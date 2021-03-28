export { get, post, put, _delete } from "./fetch";

import * as auth from "./auth";
import * as user from "./user";
import * as event from "./event";
import * as chat from "./chat";
import {
  Account,
  TypeEvent,
  OutstudyEvent,
} from "../../../../common/types/model";
import { CreateChat } from "../../../../common/types/api";

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
    getEventById: async (accessToken: string, id: number) => {
      return event.getEventById(
        accessToken,
        this.basePath + `event/api/v1/outstudy-event/${id}`
      );
    },
    createEvent: async (accessToken: string, requestBody: OutstudyEvent) => {
      return event.createEvent(
        accessToken,
        this.basePath + "event/api/v1/outstudy-event",
        requestBody
      );
    },
    deleteEvent: async (accessToken: string, id: number) => {
      return event.deleteEvent(
        accessToken,
        this.basePath + `event/api/v1/outstudy-event/${id}`
      );
    },
    getMembersEvent: async (accessToken: string, idEvent: number) => {
      return event.getMembersEvent(
        accessToken,
        this.basePath +
          `event/api/v1/outstudy-event/${idEvent}/members?offset=0&limit=99`
      );
    },
    getRequestsEvent: async (accessToken: string, idEvent: number) => {
      return event.getRequestsEvent(
        accessToken,
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
      accessToken: string,
      idEvent: number,
      idRequest: number,
      status: 1 | 2 | 3
    ) => {
      return event.memberEventRequestChange(
        accessToken,
        this.basePath +
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
        this.basePath + `event/api/v1/outstudy-event/${idEvent}/reward`,
        requestBody
      );
    },
  };
  public chat = {
    createChat: async (accessToken: string, requestBody: CreateChat) => {
      return chat.createChat(
        accessToken,
        this.basePath + "chat/api/v1/chat/create",
        requestBody
      );
    },
    getChats: async (accessToken: string, offset: number, limit: number) => {
      return chat.getChats(
        accessToken,
        this.basePath + `chat/api/v1/chat?offset=${offset}&limit=${limit}`
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
        this.basePath +
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
        this.basePath + `chat/api/v1/chat/${chatId}/user/message`,
        { text: message }
      );
    },
  };
}
const api: Api = new Api();
export default api;
