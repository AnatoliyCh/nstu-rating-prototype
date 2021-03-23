// модуль auth
import { ApiError } from "../types/api";
import { Account, AccessKeys } from "../types/model";
import * as http from "../api";

export async function login(
  path: string,
  requestBody: Account
): Promise<[AccessKeys | undefined, ApiError | undefined]> {
  return await http.post<Account, AccessKeys>(path, requestBody, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
}
