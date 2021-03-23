<template>
  <div id="app">
    <a-card class="card-authorization" title="Форма входа" hoverable>
      <form class="card-authorization-form" @submit.prevent="authorization">
        <a-input
          v-model="account.login"
          :disabled="isLoading"
          placeholder="Логин"
          autocomplete="on"
          allow-clear
        >
          <a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
        <a-input-password
          v-model="account.password"
          :disabled="isLoading"
          placeholder="Пароль"
          autocomplete="on"
          allow-clear
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input-password>
        <a-button
          :loading="isLoading"
          :disabled="disabledButton"
          type="primary"
          html-type="submit"
          block
        >
          Вход
        </a-button>
      </form>
    </a-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/common/api";
import { Account, AccessKeys } from "../../common/types/model";
import { ApiError } from "../../common/types/api";

@Component
export default class App extends Vue {
  account: Account = { login: null, password: null };
  accessKeys: AccessKeys | null = null;

  isLoading = false;

  async authorization() {
    this.isLoading = true;
    const [response, error] = await api.auth.login(this.account);
    if (response && !error) {
      this.accessKeys = response;
      // сохранение токенов для передачи
      this.accessKeys.accessToken &&
        localStorage.setItem("aT", this.accessKeys.accessToken);
      this.accessKeys.refreshToken &&
        localStorage.setItem("rT", this.accessKeys.refreshToken);
      // уведомление пользователей
      this.$message.loading("Переадресация..", 10);
    } else this.showError(error);
    this.isLoading = false;
  }

  // блокировка кнопок
  get disabledButton() {
    const loginLength = this.account.login?.toString().length;
    const passwordLength = this.account.password?.toString().length;
    // если оба поля заполненны или идет запрос
    if (!loginLength || !passwordLength || this.isLoading) return true;
    return false;
  }

  showError(error: ApiError | undefined) {
    console.error(error);
    // Неверный логин или пароль
    if (error?.status === 401) {
      this.$notification.error({
        message: "Ошибка авторизации",
        description: error.message ?? "",
      });
    } else {
      // другие ошибки
      this.$notification.error({
        message: "Cервис недоступен",
        description: "Попробуйте позже",
      });
    }
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  display: flex;
  flex-direction: column;
  // шрифты
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .card-authorization {
    width: 500px;
    margin: auto;

    .ant-card-head-title {
      text-align: center;
    }

    form.card-authorization-form {
      > * {
        margin-bottom: 24px;
        &:last-child {
          margin-bottom: 0px;
        }
      }
    }
  }
}
</style>
