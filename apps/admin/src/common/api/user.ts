//* модуль user
import { ApiError, UserObject, CreateUser } from "../../../../common/types/api";
import * as http from "../api";

export async function getUsers(
  path: string
): Promise<[UserObject | undefined, ApiError | undefined]> {
  return await http.get<UserObject>(path, {
    headers: { accept: "application/json" },
  });
}
/** создание пользователя */
export async function createUser(
  accessToken: string,
  path: string,
  requestBody: CreateUser
): Promise<[{ id: number } | undefined, ApiError | undefined]> {
  return await http.post<CreateUser, { id: number }>(path, requestBody, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
}
