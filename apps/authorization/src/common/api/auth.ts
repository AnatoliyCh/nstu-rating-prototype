// модуль auth
import { ApiError } from "../../../../common/types/api";
import { Account, AccessKeys } from "../../../../common/types/model";
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
/** получение пути переадрисации */
export async function redirect(
  accessToken: string,
  path: string
): Promise<[boolean | undefined, ApiError | undefined]> {
  const [response, error] = await http.get<any>(path, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + accessToken,
    },
  });
  return [response ? true : undefined, error];
}
