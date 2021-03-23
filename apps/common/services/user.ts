import { UserRole } from "../types/model";

/** Список ролей и их информации */
const roles: { [key: number]: UserRole } = {
  1: {
    color: "",
    nameRU: "преподаватель",
  },
  2: {
    color: "#add8e6",
    nameRU: "студент",
  },
  3: {
    color: "",
    nameRU: "тьютор",
  },
  4: {
    color: "#ffcccb",
    nameRU: "администратор",
  },
  5: {
    color: "",
    nameRU: "организатор",
  },
  6: {
    color: "",
    nameRU: "участник",
  },
};

/** Возвращает объект UserRole
 * @param id Id роли пользователя */
export function getRoleById(id: number): UserRole {
  return (
    roles[id] ?? {
      color: "",
      nameRU: "?: " + id,
    }
  );
}
/** Возвращает массив объектов UserRole
 * @param arrIds массив Id ролей пользователя */
export function getRolesByArrId(arrId: number[]): UserRole[] {
  const userRoles: UserRole[] = [];
  arrId.forEach((id) => userRoles.push(getRoleById(id)));
  return userRoles;
}
