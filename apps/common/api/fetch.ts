import { ApiError } from "../types/api";
import { logFetch } from "../services/loger";

/**
 * Базовая функция для http запроса
 * @param path путь запроса
 * @param config настройки запроса (хедеры, cors..)
 */
async function http<T>(
  path: string,
  config: RequestInit
): Promise<[T | undefined, ApiError | undefined]> {
  const request = new Request(path, config);
  const response = await fetch(request);
  const apiError: ApiError | undefined = {
    status: response.status,
    statusText: response.statusText,
  };
  let responseData: [T | undefined, ApiError | undefined];
  if (!response.ok) responseData = [undefined, apiError];
  else responseData = [await response.json().catch(() => ({})), undefined];
  // logFetch(request, responseData); // логирование
  return responseData;
}

export async function get<T>(
  path: string,
  config?: RequestInit
): Promise<[T | undefined, ApiError | undefined]> {
  const init = { method: "get", ...config };
  return await http<T>(path, init);
}
export async function post<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<[U | undefined, ApiError | undefined]> {
  const init = { method: "post", body: JSON.stringify(body), ...config };
  return await http<U>(path, init);
}
export async function put<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<[U | undefined, ApiError | undefined]> {
  const init = { method: "put", body: JSON.stringify(body), ...config };
  return await http<U>(path, init);
}
