import Component from "vue-class-component";
import { Vue } from "vue-property-decorator";
import { TypeEvent } from "../../../common/types/model";
import api from "./api";

@Component
export default class VEventApiMixin extends Vue {
  get accessToken(): string {
    return this.$store.state.accessKeys.accessToken;
  }
  get refreshToken(): string {
    return this.$store.state.accessKeys.refreshToken;
  }
  // получение типов мероприятия
  async getEventTypes(): Promise<TypeEvent[]> {
    const currentRouter = this.$router.currentRoute.name;
    const [eventTypes, error] = await api.event.getEventTypes(this.accessToken);
    if (eventTypes && !error) return eventTypes;
    else if (error && this.$router.currentRoute.name === currentRouter) {
      console.warn(error);
      this.$notification.error({
        message: "Не удалось загрузить типы мероприятия",
        description: "",
      });
    } else console.error(error);
    return [];
  }
}
