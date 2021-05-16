import { getRolesByArrId } from "@/common/services/user";
import Component from "vue-class-component";
import { Vue } from "vue-property-decorator";
import { Dictionary } from "vue-router/types/router";
import { Profile, User, UserRole } from "../../../common/types/model";
import api from "./api";

type ViewUser = {
  id: number;
  roles: UserRole[]; // роли
  profile: Profile; // профиль
};

@Component
export default class VBaseMixin extends Vue {
  isLoading = false; // состояние

  get accessToken(): string {
    return this.$store.state.accessKeys.accessToken;
  }
  get refreshToken(): string {
    return this.$store.state.accessKeys.refreshToken;
  }
  get currentUser(): ViewUser | null {
    const user: User | null = this.$store.state.user;
    if (user)
      return {
        id: user.id,
        roles: getRolesByArrId(user.roles ?? []),
        profile: user.profile,
      };
    return null;
  }
  get menuKey(): number[] {
    const key = this.$store.state.menuKey;
    if (typeof key === "number") return [key];
    return [-1];
  }
  set menuKey(value: number[]) {
    this.$store.commit("setMenuKey", value[0]);
  }

  /** доступы к фунциям приложения */
  // eslint-disable-next-line
  get userAccess() {
    return {
      user: {
        viewList: true,
        create: this.getIsContainsAccessRole(["администратор", "тьютор"]),
        view: true,
        delete: false,
        /** личный кабинет */
        space: this.getIsContainsAccessRole(["студент"]),
      },
      event: {
        viewList: true,
        create: this.getIsContainsAccessRole([
          "администратор",
          "тьютор",
          "организатор",
        ]),
        view: true,
        delete: this.getIsContainsAccessRole([
          "администратор",
          "тьютор",
          "организатор",
        ]),
        membersConfirmation: this.getIsContainsAccessRole([
          "администратор",
          "тьютор",
          "организатор",
        ]),
        createAchievement: this.getIsContainsAccessRole([
          "администратор",
          "тьютор",
          "организатор",
          "преподаватель",
        ]),
        // присоединиться
        join: this.getIsContainsAccessRole(["участник"]),
        // награждение
        reward: this.getIsContainsAccessRole([
          "администратор",
          "тьютор",
          "организатор",
          "преподаватель",
        ]),
      },
      eventType: {
        viewList: true,
        create: this.getIsContainsAccessRole([
          "администратор",
          "тьютор",
          "организатор",
          "преподаватель",
        ]),
        view: true,
        delete: this.getIsContainsAccessRole([
          "администратор",
          "тьютор",
          "организатор",
          "преподаватель",
        ]),
        update: this.getIsContainsAccessRole([
          "администратор",
          "тьютор",
          "организатор",
          "преподаватель",
        ]),
      },
      group: {
        viewList: true,
        view: true,
        create: this.getIsContainsAccessRole(["администратор", "тьютор"]),
        update: this.getIsContainsAccessRole(["администратор", "тьютор"]),
        delete: this.getIsContainsAccessRole(["администратор", "тьютор"]),
        viewGradebookPage: this.getIsContainsAccessRole([
          "администратор",
          "тьютор",
          "преподаватель",
        ]),
      },
      discipline: {
        viewList: true,
        view: true,
        create: this.getIsContainsAccessRole(["администратор", "тьютор"]),
        update: this.getIsContainsAccessRole(["администратор", "тьютор"]),
        delete: this.getIsContainsAccessRole(["администратор", "тьютор"]),
      },
    };
  }

  // перенаправление
  async routing(
    namePath: string | null,
    params: Dictionary<string> | undefined = undefined
  ): Promise<void> {
    if (!namePath || this.$router.currentRoute.name === namePath) return;
    await this.$router.push({ name: namePath, params: params });
  }
  // получение пользователя по id
  async getUserById(id: number, isNotification: boolean): Promise<User | null> {
    const [response, error] = await api.user.getUserById(this.accessToken, id);
    if (response && !error) {
      return response;
    } else if (error) {
      console.warn(error);
      isNotification &&
        this.$notification.warning({
          message: error?.message ?? "",
          description: error?.statusText ?? "",
        });
    } else console.error(error);
    return null;
  }
  /** имеется ли роль доступа */
  getIsContainsAccessRole(accessRoles: string[] | null): boolean {
    if (!accessRoles) return false;
    // if (this.isAdmin) return true;
    for (const role of this.currentUser?.roles ?? []) {
      if (accessRoles.includes(role.name)) return true;
    }
    return false;
  }
  get isAdmin(): boolean {
    return process.env.NODE_ENV === "development";
  }
}
