import { ApiError } from "../types/api";

const styles = [
  "background: red",
  "background: orange",
  "background: gold",
  "background: yellowgreen",
  "background: skyblue",
  "background: steelblue",
  "background: darkviolet",
];
const baseColorLogFetch = "color: white; background: steelblue";

export function logFetch<T>(
  request: Request,
  response: [T | undefined, ApiError | undefined]
) {
  if (process.env.NODE_ENV === "development") {
    console.log("%c Request ", baseColorLogFetch, request);
    const resultText =
      "%c Response %c " + (response[0] ? "Successful" : "Error") + " ";
    const resultColor = "color: white;" + (response[0] ? styles[3] : styles[0]);
    console.log(resultText, baseColorLogFetch, resultColor, response);
  }
}
