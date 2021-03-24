import { ApiError } from "../../../../common/types/api";

/**
 * Базовая функция для http запроса
 * @param path путь запроса
 * @param config настройки запроса (хедеры, cors..)
 */
async function http<T>(
  path: string,
  config: RequestInit
): Promise<[T | undefined, ApiError | undefined]> {
  try {
    const request = new Request(path, config);
    const response = await fetch(request);
    const apiError: ApiError | undefined = {
      status: response.status,
      statusText: response.statusText,
      message: null,
    };
    let responseData: [T | undefined, ApiError | undefined];
    if (!response.ok) {
      const body = await response.json(); // получение тела ошибки
      apiError.message = body.message;
      responseData = [undefined, apiError];
    } else responseData = [await response.json().catch(() => ({})), undefined];
    return responseData;
  } catch (error) {
    const newError: ApiError = {
      status: null,
      statusText: null,
      message: null,
    };
    // 503 Service Unavailable («сервис недоступен»)
    if (error === "TypeError: Failed to fetch") {
      newError.status = 503;
      newError.statusText = "Сервис недоступен";
      return [undefined, newError];
    }
    console.error(error);
    return [undefined, undefined];
  }
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
