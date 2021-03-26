import { Profile } from "../../../../common/types/model";

/** фильтр для полного имени
 * @param profile профиль пользователя
 * @param reduction сокращение ИО */
export function viewFullName(
  profile: Profile | null,
  reduction: boolean | undefined
): string {
  if (!profile) return "";
  // фамилия
  let lastName = profile.lastName || "";
  lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
  // имя
  let firstName = profile.firstName || "";
  firstName = !reduction
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
    : firstName.substr(0, 1).toUpperCase() + ". ";
  // отчество
  let middleName = profile.middleName || "";
  middleName = !reduction
    ? middleName.charAt(0).toUpperCase() + middleName.slice(1)
    : middleName.substr(0, 1).toUpperCase() + ".";
  return `${lastName} ${firstName} ${middleName}`;
}
