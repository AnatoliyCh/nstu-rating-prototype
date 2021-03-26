/** фильтр времени */
export function viewTime(date: string | null): string {
  if (!date) return "";
  const currentDate = new Date(date);
  const minutes =
    currentDate.getMinutes() < 10
      ? "0" + currentDate.getMinutes()
      : currentDate.getMinutes();
  return `${currentDate.getHours()}:${minutes}`;
}

/** фильтр даты */
export function viewDate(
  date: string | null,
  time: boolean | undefined
): string {
  if (!date) return "";
  const currentDate = new Date(date);
  const month =
    currentDate.getMonth() + 1 < 10
      ? "0" + (currentDate.getMonth() + 1)
      : currentDate.getMonth() + 1;
  let viewDate = `${currentDate.getDate()}.${month}.${currentDate.getFullYear()}`;
  if (time) viewDate = `${viewDate} ${viewTime(date)}`;
  return viewDate;
}
