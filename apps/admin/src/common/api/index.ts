/* eslint-disable */
export { get, post, put, _delete } from "./fetch";

import {
  CreateChat,
  CreateUser,
  DisciplineCreate,
  GradebookPageCreate,
  GroupCreate,
} from "../../../../common/types/api";
import {
  Account,
  OutstudyEvent,
  TypeEvent,
  GradebookPage,
} from "../../../../common/types/model";
import * as auth from "./auth";
import * as chat from "./chat";
import * as discipline from "./discipline";
import * as event from "./event";
import * as group from "./group";
import * as rating from "./rating";
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
    getEvents: async (
      accessToken: string,
      offset: number,
      limit: number,
      dateStart: Date | null | undefined = undefined,
      dateEnd: Date | null | undefined = undefined,
      status: number | null | undefined = undefined,
      isConfirmed: boolean | undefined = undefined
    ) => {
      return event.getEvents(
        accessToken,
        this.pathBase +
          `event/api/v1/outstudy-event?offset=${offset}&limit=${limit}` +
          `${dateStart ? `&dateStart=${dateStart.toISOString()}` : ""}` +
          `${dateEnd ? `&dateEnd=${dateEnd.toISOString()}` : ""}` +
          `${status ? `&status=${status}` : ""}` +
          `${isConfirmed ? `&isConfirmed=${isConfirmed}` : ""}`
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
  public group = {
    getGroups: async (
      accessToken: string,
      offset: number,
      limit: number,
      search: string | undefined = undefined
    ) => {
      return group.getGroups(
        accessToken,
        this.pathBase +
          `group/api/v1/group?offset=${offset}&limit=${limit}${
            search ? "&search=" + search : ""
          }`
      );
    },
    createGroup: async (accessToken: string, requestBody: GroupCreate) => {
      return group.createGroup(
        accessToken,
        this.pathBase + "group/api/v1/group",
        requestBody
      );
    },
    getGroupById: async (accessToken: string, id: number) => {
      return group.getGroupById(
        accessToken,
        this.pathBase + `group/api/v1/group/${id}`
      );
    },
    сhangeGroup: async (
      accessToken: string,
      id: number,
      requestBody: GroupCreate
    ) => {
      return group.сhangeGroup(
        accessToken,
        this.pathBase + `group/api/v1/group/${id}`,
        requestBody
      );
    },
    deleteGroup: async (accessToken: string, id: number) => {
      return group.deleteGroup(
        accessToken,
        this.pathBase + `group/api/v1/group/${id}`
      );
    },
    addMembers: async (
      accessToken: string,
      id: number,
      requestBody: { users: number[]; moderators: number[] }
    ) => {
      return group.addMembers(
        accessToken,
        this.pathBase + `group/api/v1/group/${id}/members/`,
        requestBody
      );
    },
    deleteMembers: async (
      accessToken: string,
      id: number,
      requestBody: { users: number[]; moderators: number[] }
    ) => {
      return group.deleteMembers(
        accessToken,
        this.pathBase + `group/api/v1/group/${id}/members/`,
        requestBody
      );
    },
  };
  public discipline = {
    getDisciplines: async (
      accessToken: string,
      offset: number,
      limit: number,
      search: string | undefined = undefined
    ) => {
      return discipline.getDisciplines(
        accessToken,
        this.pathBase +
          `discipline/api/v1/discipline?offset=${offset}&limit=${limit}${
            search ? "&search=" + search : ""
          }`
      );
    },
    createDiscipline: async (
      accessToken: string,
      requestBody: DisciplineCreate
    ) => {
      return discipline.createDiscipline(
        accessToken,
        this.pathBase + "discipline/api/v1/discipline",
        requestBody
      );
    },
    getDisciplineById: async (accessToken: string, id: number) => {
      return discipline.getDisciplineById(
        accessToken,
        this.pathBase + `discipline/api/v1/discipline/${id}`
      );
    },
    сhangeDiscipline: async (
      accessToken: string,
      id: number,
      requestBody: DisciplineCreate
    ) => {
      return discipline.сhangeDiscipline(
        accessToken,
        this.pathBase + `discipline/api/v1/discipline/${id}`,
        requestBody
      );
    },
    deleteDiscipline: async (accessToken: string, id: number) => {
      return discipline.deleteDiscipline(
        accessToken,
        this.pathBase + `discipline/api/v1/discipline/${id}`
      );
    },
  };
  public rating = {
    getAchievements: async (
      accessToken: string,
      offset: number,
      limit: number
    ) => {
      return rating.getAchievements(
        accessToken,
        this.pathBase +
          `rating/api/v1/achievement?offset=${offset}&limit=${limit}`
      );
    },
    getAchievementsHistory: async (
      accessToken: string,
      offset: number,
      limit: number,
      userId: number | undefined = undefined
    ) => {
      return rating.getAchievementsHistory(
        accessToken,
        this.pathBase +
          `rating/api/v1/achievement/history?offset=${offset}&limit=${limit}` +
          `${userId ? `&userId=${userId}` : ""}`
      );
    },
    getAchievementRequests: async (
      accessToken: string,
      offset: number,
      limit: number,
      userId: number | undefined = undefined
    ) => {
      return rating.getAchievementRequests(
        accessToken,
        this.pathBase +
          `rating/api/v1/achievement/request?offset=${offset}&limit=${limit}` +
          `${userId ? `&userId=${userId}` : ""}`
      );
    },
    createAchievementRequest: async (
      accessToken: string,
      achievementId: number,
      gradebookPageId: number,
      score: number
    ) => {
      return rating.createAchievementRequest(
        accessToken,
        this.pathBase +
          `rating/api/v1/achievement/${achievementId}/gradebook/page/${gradebookPageId}/request`,
        { score: score }
      );
    },
    deleteAchievementRequest: async (
      accessToken: string,
      achievementId: number,
      gradebookPageId: number,
      requestId: number
    ) => {
      return rating.deleteAchievementRequest(
        accessToken,
        this.pathBase +
          `rating/api/v1/achievement/${achievementId}/radebook/page/${gradebookPageId}/request/${requestId}`
      );
    },
    //* gradebook
    createGradebookPage: async (
      accessToken: string,
      requestBody: GradebookPageCreate
    ) => {
      return rating.createGradebookPage(
        accessToken,
        this.pathBase + `rating/api/v1/gradebook/page`,
        requestBody
      );
    },
    сhangeGradebookPage: async (
      accessToken: string,
      gradebookPageId: number,
      moderators: number[]
    ) => {
      return rating.сhangeGradebookPage(
        accessToken,
        this.pathBase + `rating/api/v1/gradebook/page/${gradebookPageId}`,
        moderators
      );
    },
    deleteGradebookPage: async (
      accessToken: string,
      gradebookPageId: number
    ) => {
      return rating.deleteGradebookPage(
        accessToken,
        this.pathBase + `rating/api/v1/gradebook/page/${gradebookPageId}`
      );
    },
    getGradebookPageByDisciplineAndGroup: async (
      accessToken: string,
      disciplinId: number,
      groupId: number
    ) => {
      return rating.getGradebookPageByDisciplineAndGroup(
        accessToken,
        this.pathBase +
          `rating/api/v1/gradebook/page/disciplin/${disciplinId}/group/${groupId}`
      );
    },
    getGradebook: async (
      accessToken: string,
      offset: number,
      limit: number,
      studentId: number | undefined = undefined
    ) => {
      return rating.getGradebook(
        accessToken,
        this.pathBase +
          `rating/api/v1/gradebook?offset=${offset}&limit=${limit}` +
          `${studentId ? `&studentId=${studentId}` : ""}`
      );
    },
  };
}
const api: Api = new Api();
export default api;
