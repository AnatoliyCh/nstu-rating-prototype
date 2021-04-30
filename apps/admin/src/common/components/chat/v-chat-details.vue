<template>
  <div class="v-chat-details">
    <a-page-header
      title="Чат"
      class="v-chat-details-header-block"
      @back="routing('chat-list')"
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
            :author="item.sender"
            :content="item.text"
            :datetime="item.dateTime"
            size="small"
          />
        </a-list-item>
      </a-list>
      <!-- создание сообщения -->
      <a-comment>
        <div slot="content">
          <a-form-item>
            <a-textarea
              :auto-size="{ minRows: 4, maxRows: 8 }"
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
          </a-form-item>
        </div>
      </a-comment>
    </div>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { Message } from "../../../../../common/types/model";

@Component
export default class VChatDetails extends mixins(VBaseMixin) {
  chatId = Number(this.$route.params["id"]); // id тек. чата
  messageList: Message[] = []; // список сообщений
  message = ""; // сообщение
  isLoadingMessage = false; // анимация кнопки отправки сообщения
  timerId: ReturnType<typeof setTimeout> | null = null; // id для setTimeout

  async created(): Promise<void> {
    this.menuKey = [3];
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
  // получение списка сообщений
  async getMessages(): Promise<void> {
    this.isLoading = true;
    const [response, error] = await api.chat.getMessages(
      this.accessToken,
      this.chatId,
      0,
      999
    );
    if (!error && response && response.data) this.messageList = response.data;
    else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoading = false;
  }
  /** отправка сообщений */
  async sendMessage(): Promise<void> {
    const newMessage = this.message;
    this.isLoading = this.isLoadingMessage = true;
    const [response, error] = await api.chat.sendMessage(
      this.accessToken,
      this.chatId,
      newMessage
    );
    if (!error && response) {
      this.message = "";
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
    return this.messageList.reverse();
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
      max-height: calc(100% - 300px);
      overflow: auto;
    }
  }
}
</style>
