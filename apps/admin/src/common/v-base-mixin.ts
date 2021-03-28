import { Vue } from "vue-property-decorator";
import Component from "vue-class-component";

@Component
export default class VBaseMixin extends Vue {
  isLoading = false; // состояние

  get accessToken() {
    return this.$store.state.accessKeys.accessToken;
  }
  get refreshToken() {
    return this.$store.state.accessKeys.refreshToken;
  }
  get currentUserId() {
    return this.$store.state.user.id ?? null;
  }
  // перенаправление
  async routing(namePath: string | null) {
    if (!namePath || this.$router.currentRoute.name === namePath) return;
    await this.$router.push({ name: namePath });
  }
}
