// модуль auth
import { ApiError, UserObject } from "../types/api";
import * as http from "../api";

export async function getUsers(
  path: string
): Promise<[UserObject | undefined, ApiError | undefined]> {
  return await http.get<UserObject>(path, {
    headers: { accept: "application/json" },
  });
}
