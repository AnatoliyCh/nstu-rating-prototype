<template>
  <div id="app-authorization">
    <a-card class="card-authorization" title="Форма входа" hoverable>
      <form class="card-authorization-form" @submit.prevent="authorization">
        <a-input placeholder="Логин" allow-clear>
          <a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
        <a-input-password placeholder="Пароль" allow-clear>
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input-password>
        <a-button type="primary" html-type="submit" block> Вход </a-button>
      </form>
    </a-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "../../common/api";
import { Account, AccessKeys } from "../../common/types/model";

@Component
export default class App extends Vue {
  account: Account = { login: null, password: null };
  accessKeys: AccessKeys | null = null;

  isLoading = false;

  async authorization() {
    this.isLoading = true;
    // const [response, error] = await api.auth.login(this.account);
    // if (response && !error) {
    //   this.accessKeys = response;
    //   // this.$router.push({ name: "admin" });
    // } else console.error(error);
    this.isLoading = false;
  }
}
</script>

<style lang="scss">
#app-authorization {
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
