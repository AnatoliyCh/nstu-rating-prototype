<template>
  <div class="v-event-details-chat">
    <a-card>
      <a-list
        id="list"
        :data-source="tableData"
        :loading="isLoading"
        size="small"
        item-layout="horizontal"
        class="v-chat-details-body-list"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <a-comment
            :author="mapFullnameUsers.get(item.sender)"
            :datetime="item.dateTime"
            size="small"
          >
            <label slot="content">{{ item.text }}</label>
            <!-- файлы -->
            <template v-if="item.files.length">
              <template v-for="(file, index) in item.files">
                <!-- длинное название -->
                <a-tooltip
                  v-if="file.name.length > maxLengthFileName"
                  :key="index"
                  :title="file.name"
                >
                  <a-button
                    type="primary"
                    icon="download"
                    size="small"
                    @click="getFile(file.path)"
                  >
                    {{ `${file.name.slice(0, maxLengthFileName)}...` }}
                  </a-button>
                </a-tooltip>
                <!-- короткое название -->
                <a-button
                  v-else
                  :key="index"
                  type="primary"
                  icon="download"
                  size="small"
                  @click="getFile(file.path)"
                >
                  {{ file.name }}
                </a-button>
              </template>
            </template>
          </a-comment>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>
<script lang="ts">
import VEventApiMixin from "@/common/v-event-api-mixin";
import VBaseMixin from "@/common/v-base-mixin";
import Component, { mixins } from "vue-class-component";
import { Prop } from "vue-property-decorator";
import {
  OutstudyEvent,
  TypeEvent,
  Request,
  User,
  Message,
} from "../../../../../../common/types/model";
import api from "@/common/api";
import { viewFullName } from "@/common/filters";

@Component
export default class VEventDetailsChat extends mixins(
  VBaseMixin,
  VEventApiMixin
) {
  @Prop({ type: Number, default: null }) readonly chatId!: number | null;

  mapFullnameUsers = new Map(); // map id -> ФИО пользователя
  messages: Message[] = []; // список сообщений
  maxLengthFileName = 20;
  timerId: ReturnType<typeof setTimeout> | null = null; // id для setTimeout

  async created(): Promise<void> {
    await this.getChatById();
    await this.getMessages();
    this.timerId = setInterval(async () => await this.getMessages(), 20000); // каждые 10 секунд получаем сообщения
  }
  /** получение чата по id */
  async getChatById() {
    this.isLoading = true;
    if (!this.chatId) return;
    const [response, error] = await api.chat.getChatById(
      this.accessToken,
      this.chatId
    );
    if (response && !error) {
      for (const user of response.users ?? [])
        if ("profile" in user)
          this.mapFullnameUsers.set(user.id, viewFullName(user.profile, true));
    }
    this.isLoading = false;
  }
  /** получение списка сообщений */
  async getMessages(): Promise<void> {
    // this.isLoading = true;
    if (!this.chatId) return;
    const [response, error] = await api.chat.getMessages(
      this.accessToken,
      this.chatId,
      0,
      99999
    );
    if (!error && response && response.data) this.messages = response.data;
    else if (error && this.$router.currentRoute.name === "chat-details") {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
      if (!this.messages.length) this.routing("chat-list");
    }
    // this.isLoading = false;
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    this.messages.forEach(
      (item) =>
        item.dateTime &&
        (item.dateTime = `${new Date(
          item.dateTime
        ).toLocaleDateString()} ${new Date(
          item.dateTime
        ).toLocaleTimeString()}`)
    );
    return this.messages.reverse();
  }
  // получение файла
  getFile(path: string): void {
    window.open(`${api.pathBase}${path.slice(1, path.length)}`);
  }
}
</script>

<style lang="scss">
.v-event-details-chat {
  > div.ant-card.ant-card-bordered {
    height: calc(100vh - 7em);
    overflow: auto;
    border-top: none;
    border-radius: 0;
    .ant-card-body {
      padding: 0 !important;

      .ant-comment-inner {
        padding: 0px;
      }
      // блок с файлами
      .ant-comment-nested {
        > * {
          margin-right: 8px;
          margin-bottom: 4px;
        }
      }
    }
  }
}
</style>
