import { getRolesByArrId } from "@/common/services/user";
import Component from "vue-class-component";
import { Vue } from "vue-property-decorator";
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
        roles: getRolesByArrId(user.roles),
        profile: user.profile,
      };
    return null;
  }
  // перенаправление
  async routing(namePath: string | null): Promise<void> {
    if (!namePath || this.$router.currentRoute.name === namePath) return;
    await this.$router.push({ name: namePath });
  }

  // получение пользователя по id
  async getUserById(id: number): Promise<User | null> {
    const [response, error] = await api.user.getUserById(this.accessToken, id);
    if (response && !error) {
      return response;
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: error?.statusText ?? "",
      });
    } else console.error(error);
    return null;
  }
}
