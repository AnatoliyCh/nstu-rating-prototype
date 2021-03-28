//* модуль chat
import { ApiError, CreateChat } from "../../../../common/types/api";
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
