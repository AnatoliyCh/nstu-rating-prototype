<template>
  <div class="v-chat-list">
    <a-page-header title="Список: чаты" class="v-chat-list-header-block" />
    <a-list
      item-layout="horizontal"
      :data-source="chatList"
      class="v-chat-list-body"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta :description="getLastMessage(item)">
          <a slot="title" @click="goChatDetails(item)">{{
            getChatName(item)
          }}</a>
        </a-list-item-meta>
        <a-badge
          v-if="getCountNotVisible(item)"
          :count="getCountNotVisible(item)"
        >
        </a-badge>
      </a-list-item>
    </a-list>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { Chat } from "../../../../../common/types/model";

@Component
export default class VChatList extends mixins(VBaseMixin) {
  chatList: Chat[] = [];
  totalSize = 0;
  async created(): Promise<void> {
    await this.getChats();
  }
  // получение списка чатов
  async getChats(): Promise<void> {
    this.isLoading = true;
    const [response, error] = await api.chat.getChats(this.accessToken, 0, 999);
    if (!error && response && response.data) {
      this.chatList = response.data;
      response.size && (this.totalSize = response.size);
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoading = false;
  }
  // с кем чат
  getChatName(chat: Chat | null): string {
    return chat?.name ? chat?.name : "пусто: chat.name";
  }
  // последнее сообщение
  getLastMessage(chat: Chat | null): string {
    return chat?.lastMessage?.text ? chat?.lastMessage?.text : "пусто";
  }
  // кол-во непрочитанных
  getCountNotVisible(chat: Chat | null): number {
    return chat?.userInfo?.sizeOfUnreadMessages
      ? chat?.userInfo?.sizeOfUnreadMessages
      : 0;
  }
  // переход на страницу чата
  goChatDetails(chat: Chat | null): void {
    if (!chat?.id) return;
    this.$router.push({
      name: "chat-details",
      params: { id: chat.id.toString() },
    });
  }
}
</script>

<style lang="scss">
.v-chat-list {
  &-header-block {
    border-block-end: 1px solid rgb(235, 237, 240);
    margin-bottom: 0px;
  }
  &-body {
    padding: 0px 16px;
  }
}
</style>
