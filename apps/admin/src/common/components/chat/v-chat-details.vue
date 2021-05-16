<template>
  <div class="v-chat-details">
    <a-page-header
      :title="headerChat"
      class="v-chat-details-header-block"
      @back="backRouting"
    />
    <div class="v-chat-details-body">
      <!-- сообщения -->
      <a-list
        id="list"
        :data-source="ViewModelMessges"
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
            <p slot="content">{{ item.text }}</p>
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
      <!-- создание сообщения -->
      <a-comment>
        <div slot="content">
          <a-form-item>
            <a-textarea
              :auto-size="{ minRows: 4, maxRows: 4 }"
              v-model="message"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              html-type="submit"
              :loading="isLoadingMessage"
              type="primary"
              @click="sendMessage"
            >
              Отправить
            </a-button>
            <a-upload
              :file-list="files"
              :before-upload="beforeUpload"
              :remove="handleRemove"
              multiple
              style="margin-left: 8px"
            >
              <a-button> <a-icon type="upload" /> Выбрать файлы </a-button>
            </a-upload>
          </a-form-item>
        </div>
      </a-comment>
    </div>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import { viewFullName } from "@/common/filters";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { Message } from "../../../../../common/types/model";

@Component
export default class VChatDetails extends mixins(VBaseMixin) {
  chatId = Number(this.$route.params["id"]); // id тек. чата
  eventName = this.$route.params["eventName"]; // чат меропрития
  eventId = Number(this.$route.params["eventId"]); // id меропрития
  // сообщения
  messageList: Message[] = []; // список сообщений
  message = ""; // сообщение
  isLoadingMessage = false; // анимация кнопки отправки сообщения
  timerId: ReturnType<typeof setTimeout> | null = null; // id для setTimeout

  mapFullnameUsers = new Map(); // map id -> ФИО пользователя

  files: File[] = []; // список выбранных файлов
  maxLengthFileName = 20;

  async created(): Promise<void> {
    this.menuKey = [3];
    await this.getChatById();
    await this.getMessages();
    this.timerId = setInterval(async () => await this.getMessages(), 10000); // каждые 10 секунд получаем сообщения
  }
  beforeDestroy(): void {
    // отписка от прослушивания получения сообщений
    this.timerId && clearTimeout(this.timerId);
  }
  // элемент списка, для прокрутки
  get elementList(): Element | null {
    return this.$el.querySelector("#list");
  }
  /** получение чата по id */
  async getChatById() {
    this.isLoading = true;
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
  // получение списка сообщений
  async getMessages(): Promise<void> {
    this.isLoading = true;
    const [response, error] = await api.chat.getMessages(
      this.accessToken,
      this.chatId,
      0,
      9999
    );
    if (!error && response && response.data) this.messageList = response.data;
    else if (error && this.$router.currentRoute.name === "chat-details") {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
      if (!this.messageList.length) this.routing("chat-list");
    }
    this.isLoading = false;
  }
  /** отправка сообщений */
  async sendMessage(): Promise<void> {
    const newMessage = this.message;
    this.isLoading = this.isLoadingMessage = true;
    const [response, error] = await api.chat.sendMessage(
      this.accessToken,
      this.chatId,
      newMessage,
      this.files
    );
    if (!error && response) {
      this.message = "";
      this.files = [];
      await this.getMessages();
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoading = this.isLoadingMessage = false;
    // прокрутка вниз, после отпраки сообщения
    this.elementList &&
      (this.elementList.scrollTop = this.elementList.scrollHeight);
  }
  // показываемые сообщения
  get ViewModelMessges(): Message[] {
    this.messageList.forEach(
      (item) =>
        item.dateTime &&
        (item.dateTime = `${new Date(
          item.dateTime
        ).toLocaleDateString()} ${new Date(
          item.dateTime
        ).toLocaleTimeString()}`)
    );
    return this.messageList.reverse();
  }
  /** название чата в зависимости от типа */
  get headerChat(): string {
    if (this.eventName) return `Чат меропрития: ${this.eventName}`;
    return "Чат";
  }
  /** возвращение к списку четов или меропрития */
  backRouting(): void {
    if (this.eventName) {
      this.routing("event-details", { id: this.eventId.toString() });
      return;
    }
    this.routing("chat-list");
  }
  //* файлы
  // добавление файлов в список
  beforeUpload(file: File): boolean {
    this.files = [...this.files, file];
    return false;
  }
  // удаление файлов из списка
  handleRemove(file: File): void {
    const index = this.files.indexOf(file);
    const newFileList = this.files.slice();
    newFileList.splice(index, 1);
    this.files = newFileList;
    // скачивание
    // var a = document.createElement("a"),
    //   url = URL.createObjectURL(file);
    // a.href = url;
    // a.download = file.name;
    // document.body.appendChild(a);
    // a.click();
  }
  // получение файла
  getFile(path: string): void {
    let newWindow = window.open(`${api.pathBase}${path.slice(1, path.length)}`);
    // setTimeout(() => {
    //   newWindow && newWindow.close();
    // }, 500);
  }
}
</script>

<style lang="scss">
.v-chat-details {
  height: calc(100% - 70px);
  max-height: calc(100% - 70px);
  &-header-block {
    border-block-end: 1px solid rgb(235, 237, 240);
    margin-bottom: 0px;
  }
  &-body {
    height: 100%;
    padding: 0px 16px;
    &-list {
      // 300px - размер блока собщения, при максимальном раскрытии
      height: 100%;
      max-height: calc(100% - 250px);
      overflow: auto;
    }
  }
  // ширина списка файлов
  .ant-upload-list.ant-upload-list-text {
    width: 25%;
  }
  // блок с файлами
  .ant-comment-nested {
    > * {
      margin-right: 8px;
      margin-bottom: 4px;
    }
  }
}
</style>
