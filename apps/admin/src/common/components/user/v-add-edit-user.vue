<template>
  <div class="v-add-edit-user">
    <a-page-header
      title="Создание: пользователь"
      class="header-block"
      @back="routing('user-list')"
    />
    <div class="v-add-edit-user-body">
      <a-row type="flex" justify="start" :gutter="16">
        <a-col :span="6">
          <a-card
            title="Новый пользователь"
            class="v-add-edit-user-card"
            hoverable
          >
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
              <label class="required-label">
                Пароль (длина: {{ newUser.account.password.length }})
              </label>
              <a-input v-model="newUser.account.password" allowClear>
                <a-tooltip
                  slot="suffix"
                  title="Длина пароля должна быть не меньше 6 символов"
                >
                  <a-icon
                    type="info-circle"
                    style="color: rgba(0, 0, 0, 0.45)"
                  />
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
        </a-col>
        <a-col :span="8">
          <a-card title="Роли" class="v-add-edit-user-card" hoverable>
            <a-checkbox-group @change="onChangeRoles">
              <a-row>
                <a-col v-for="(role, index) in roles" :key="index" :span="8">
                  <a-checkbox :value="role.id">
                    {{ role.name ? role.name : "" }}
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import { roles } from "@/common/services/user";
import VBaseMixin from "@/common/v-base-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { CreateUser } from "../../../../../common/types/api";
import { UserRole } from "../../../../../common/types/model";

@Component
export default class VAddEditUser extends mixins(VBaseMixin) {
  newUser: CreateUser = {
    profile: {
      lastName: "", // ф
      firstName: "", // и
      middleName: "", // о
    },
    roles: [], // роли
    account: {
      password: "",
      repeatPassword: "",
      login: "",
    },
  };
  created() {
    this.menuKey = [0];
  }
  // блокировка кнопки
  get disabledButton(): boolean {
    return (
      Boolean(this.newUser.profile.lastName) &&
      Boolean(this.newUser.profile.firstName) &&
      Boolean(this.newUser.profile.middleName) &&
      this.newUser.roles.length > 0 &&
      Boolean(this.newUser.account.password) &&
      this.newUser.account.password.length >= 6 &&
      Boolean(this.newUser.account.repeatPassword) &&
      Boolean(this.newUser.account.login) &&
      this.identicalPassword &&
      this.userAccess.user.create &&
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
  async createUser(): Promise<void> {
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
      this.routing("user-list");
    } else if (error) {
      console.warn(error);
      this.$notification.warning({
        message: error?.message ?? "",
        description: "",
      });
    } else console.error(error);
    this.isLoading = false;
  }
  // роли
  get roles(): UserRole[] {
    const newArrRoles: UserRole[] = [];
    Object.keys(roles).forEach((key) => {
      const role = roles[Number(key)];
      if ("color" in role && "name" in role) {
        role.id = Number(key);
        newArrRoles.push(role);
      }
    });
    return newArrRoles;
  }
  // изменение выбранных ролей
  onChangeRoles(values: number[]): void {
    this.newUser.roles = values;
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-add-edit-user {
  &-body {
    margin: 0px 16px;
    .v-add-edit-user-card {
      cursor: default;
    }
  }
}
</style>
