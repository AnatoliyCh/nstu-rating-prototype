<template>
  <div class="v-add-edit-user">
    <a-page-header
      title="Создание: пользователь"
      class="header-block"
      @back="routing('user-list')"
    />
    <div class="v-add-edit-user-body">
      <a-card title="Новый пользователь" class="v-add-edit-user-card" hoverable>
        <div class="vertical-margin-element-8">
          <label class="required-label">Фамилия </label>
          <a-input v-model="newUser.profile.lastName" allowClear />
        </div>
        <div class="vertical-margin-element-8">
          <label class="required-label">Имя </label>
          <a-input v-model="newUser.profile.firstName" allowClear />
        </div>
        <div class="vertical-margin-element-8">
          <label class="required-label">Отчество </label>
          <a-input v-model="newUser.profile.middleName" allowClear />
        </div>
        <div class="vertical-margin-element-8">
          <label class="required-label">Логин </label>
          <a-input v-model="newUser.account.login" allowClear />
        </div>
        <div class="vertical-margin-element-8">
          <label class="required-label">Пароль </label>
          <a-input v-model="newUser.account.password" allowClear>
            <a-tooltip
              slot="suffix"
              title="Длина пароля должна быть не меньше 6 символов"
            >
              <a-icon type="info-circle" style="color: rgba(0, 0, 0, 0.45)" />
            </a-tooltip>
          </a-input>
        </div>
        <div class="vertical-margin-element-8">
          <label class="required-label">Повтор пароля </label>
          <a-input v-model="newUser.account.repeatPassword" allowClear>
            <a-icon
              v-if="identicalPassword"
              slot="suffix"
              type="check-circle"
              theme="twoTone"
              two-tone-color="#52c41a"
            />
          </a-input>
        </div>
        <div class="vertical-margin-element-8">
          <a-button
            type="primary"
            :disabled="!disabledButton"
            @click="createUser"
          >
            Создать
          </a-button>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { CreateUser } from "../../../../../common/types/api";

@Component
export default class VAddEditUser extends mixins(VBaseMixin) {
  newUser: CreateUser = {
    profile: {
      lastName: "", // ф
      firstName: "", // и
      middleName: "", // о
    },
    roles: [],
    account: {
      password: "",
      repeatPassword: "",
      login: "",
    },
  };
  // блокировка кнопки
  get disabledButton(): boolean {
    return (
      Boolean(this.newUser.profile.lastName) &&
      Boolean(this.newUser.profile.firstName) &&
      Boolean(this.newUser.profile.middleName) &&
      Boolean(this.newUser.account.password) &&
      this.newUser.account.password.length >= 6 &&
      Boolean(this.newUser.account.repeatPassword) &&
      Boolean(this.newUser.account.login) &&
      this.identicalPassword &&
      this.isLoading === false
    );
  }
  // пароль и повтор пароля одинаковы и не пустые
  get identicalPassword(): boolean {
    return (
      Boolean(this.newUser.account.password) &&
      Boolean(this.newUser.account.repeatPassword) &&
      this.newUser.account.password === this.newUser.account.repeatPassword
    );
  }
  // создание пользователя
  async createUser() {
    this.isLoading = true;
    const [response, error] = await api.user.createUser(
      this.accessToken,
      this.newUser
    );
    if (response && !error) {
      this.$notification.success({
        message: "Новый пользователь создан",
        description: "",
      });
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoading = false;
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-add-edit-user {
  &-body {
    display: flex;
    .v-add-edit-user-card {
      margin: auto;
      cursor: default;
    }
  }
}
</style>
