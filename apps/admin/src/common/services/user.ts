import { UserRole } from "../../../../common/types/model";

/** Список ролей и их информации */
export const roles: { [key: number]: UserRole } = {
  1: {
    cost: 600,
    color: "#108ee9",
    name: "преподаватель",
  },
  2: {
    cost: 100,
    color: "#2db7f5",
    name: "студент",
  },
  3: {
    cost: 800,
    color: "#108ee9",
    name: "тьютор",
  },
  4: {
    cost: 999,
    color: "#f50",
    name: "администратор",
  },
  5: {
    cost: 700,
    color: "#108ee9",
    name: "организатор",
  },
  6: {
    cost: 200,
    color: "#87d068",
    name: "участник",
  },
};

/** Возвращает объект UserRole
 * @param id Id роли пользователя */
export function getRoleById(id: number): UserRole {
  return (
    roles[id] ?? {
      id: id,
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
  userRoles.sort((a, b) => (a.cost && b.cost && a.cost > b.cost ? -1 : 1));
  return userRoles;
}
