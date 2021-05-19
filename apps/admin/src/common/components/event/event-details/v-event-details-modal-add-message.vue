<template>
  <a-modal
    :visible="value"
    @change="changeVisible"
    title="Новая запись в ленту"
    centered
    @cancel="modalCancel"
    :cancel-button-props="{ props: { disabled: Boolean(isLoading) } }"
    :footer="null"
    class="v-event-details-modal-add-message"
  >
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
            :loading="isLoading"
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
  </a-modal>
</template>
<script lang="ts">
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component, Emit, Model, Prop } from "vue-property-decorator";
import { User, Discipline } from "../../../../../../common/types/model";
import { GradebookPageCreate } from "../../../../../../common/types/api";
import { viewFullName } from "@/common/filters";
import api from "@/common/api";
/** новая записьв ленту мероприятия */
@Component
export default class VEventDetailsModalAddMessage extends mixins(VBaseMixin) {
  /** видимость окна */
  @Model("change", { type: Boolean }) readonly value!: boolean;
  /** изменение видимости */
  @Emit("change")
  changeVisible(visible: boolean): boolean {
    return visible;
  }
  @Prop({ type: Number, default: null }) readonly chatId!: number | null;

  message = ""; // сообщение
  files: File[] = []; // список выбранных файлов

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
  }
  /** отправка сообщений */
  async sendMessage(): Promise<void> {
    const newMessage = this.message;
    if (!this.chatId) return;
    this.isLoading = true;
    const [response, error] = await api.chat.sendMessage(
      this.accessToken,
      this.chatId,
      newMessage,
      this.files
    );
    if (!error && response) {
      this.$emit("newMessage");
      this.modalCancel();
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoading = false;
  }
  /** скрытие окна  */
  modalCancel(): void {
    this.changeVisible(false);
    setTimeout(() => {
      if (!this.value) {
        this.message = "";
        this.files = [];
      }
    }, 2000);
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-event-details-modal-add-message {
  .ant-modal-body {
    padding: 0 24px;
  }
  .ant-row.ant-form-item {
    margin: 0;
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
