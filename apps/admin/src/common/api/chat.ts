//* модуль chat
import {
  ApiError,
  ChatObject,
  CreateChat,
  MessageObject,
} from "../../../../common/types/api";
import { Chat } from "../../../../common/types/model";
import * as http from "../api";

/** создание чата */
export async function createChat(
  accessToken: string,
  path: string,
  requestBody: CreateChat
): Promise<[{ id: number } | undefined, ApiError | undefined]> {
  return await http.post<CreateChat, { id: number }>(path, requestBody, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** получение чатов */
export async function getChats(
  accessToken: string,
  path: string
): Promise<[ChatObject | undefined, ApiError | undefined]> {
  return await http.get<ChatObject>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** получение чата по id */
export async function getChatById(
  accessToken: string,
  path: string
): Promise<[Chat | undefined, ApiError | undefined]> {
  return await http.get<Chat>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** получение сообщений для чата */
export async function getMessages(
  accessToken: string,
  path: string
): Promise<[MessageObject | undefined, ApiError | undefined]> {
  return await http.get<MessageObject>(path, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
}
/** отправка сообщений */
export async function sendMessage(
  accessToken: string,
  path: string,
  requestBody: { text: string },
  files: File[] | null = null
): Promise<[{ id: number } | undefined, ApiError | undefined]> {
  // сообщзение с файлами
  if (files?.length) {
    const formData = new FormData();
    // добавление файлов
    for (const file of files) formData.append("files", file, file.name);
    formData.append("text", requestBody.text);
    return await http.post<FormData, { id: number }>(path, formData, {
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });
  }
  // просто текст
  return await http.post<Parameters<typeof sendMessage>[2], { id: number }>(
    path,
    requestBody,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
}
