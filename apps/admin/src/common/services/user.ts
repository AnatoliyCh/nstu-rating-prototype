import { UserRole } from "../../../../common/types/model";

/** Список ролей и их информации */
const roles: { [key: number]: UserRole } = {
  1: {
    color: "#108ee9",
    name: "преподаватель",
  },
  2: {
    color: "#2db7f5",
    name: "студент",
  },
  3: {
    color: "#108ee9",
    name: "тьютор",
  },
  4: {
    color: "#f50",
    name: "администратор",
  },
  5: {
    color: "#108ee9",
    name: "организатор",
  },
  6: {
    color: "#87d068",
    name: "участник",
  },
};

/** Возвращает объект UserRole
 * @param id Id роли пользователя */
export function getRoleById(id: number): UserRole {
  return (
    roles[id] ?? {
      color: "",
      name: "?: " + id,
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
