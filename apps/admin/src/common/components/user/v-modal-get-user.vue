<template>
  <a-modal
    :visible="value"
    @change="changeVisible"
    :footer="null"
    title="Выбрать пользователя"
    :width="600"
    centered
    class="v-modal-get-user"
  >
    <a-table
      :columns="columnsTable"
      :data-source="tableData"
      :loading="isDataLoading"
      :pagination="pagination"
      :scroll="{ y: 'calc(50vh)' }"
      @change="changePagination"
    >
      <div slot="title" class="table-footer">
        <!-- роли -->
        <a-dropdown v-model="dropdownVisible">
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            Выбрать роли <a-icon type="down" />
          </a>
          <a-menu slot="overlay" @click="dropdownVisible = true">
            <a-menu-item key="1">
              <a-checkbox @change="changeRole(1)"> преподаватель </a-checkbox>
            </a-menu-item>
            <a-menu-item key="2">
              <a-checkbox @change="changeRole(2)"> студент </a-checkbox>
            </a-menu-item>
            <a-menu-item key="3">
              <a-checkbox @change="changeRole(3)"> тьютор </a-checkbox>
            </a-menu-item>
            <a-menu-item key="4">
              <a-checkbox @change="changeRole(4)"> администратор </a-checkbox>
            </a-menu-item>
            <a-menu-item key="5">
              <a-checkbox @change="changeRole(5)"> организатор </a-checkbox>
            </a-menu-item>
            <a-menu-item key="6">
              <a-checkbox @change="changeRole(6)"> участник </a-checkbox>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <!-- поиск -->
        <a-input-search
          v-model="filterName"
          placeholder="поиск по названию..."
          allowClear
          enter-button
          @search="(pagination.current = 1) && getUsers()"
          style="width: 40%"
        />
      </div>
      <a slot="name" slot-scope="name, record" @click="getUser(record.user)">
        {{ name }}
      </a>
      <span slot="roles" slot-scope="item">
        <a-tag
          v-for="(role, index) in item.roles"
          :key="index"
          :color="role.color"
          style="ant-tag"
        >
          {{ role.name }}
        </a-tag>
      </span>
    </a-table>
  </a-modal>
</template>
<script lang="ts">
import api from "@/common/api";
import { viewFullName } from "@/common/filters";
import { getRolesByArrId } from "@/common/services/user";
import VBaseMixin from "@/common/v-base-mixin";
import VPaginationMixin from "@/common/v-pagination-mixin";
import { mixins } from "vue-class-component";
import { Component, Emit, Model } from "vue-property-decorator";
import { User } from "../../../../../common/types/model";

@Component
export default class VModalGetUser extends mixins(
  VPaginationMixin,
  VBaseMixin
) {
  /** видимость окна */
  @Model("change", { type: Boolean }) readonly value!: boolean;
  /** изменение видимости */
  @Emit("change")
  changeVisible(visible: boolean): boolean {
    return visible;
  }
  users: User[] = [];
  filterName = ""; // фильтр названия
  dropdownVisible = false;
  roles: number[] = []; // фильтh ролей

  async created(): Promise<void> {
    await this.getUsers();
  }
  /** получение списка пользователей */
  async getUsers(): Promise<void> {
    this.isDataLoading = true;
    const [response, error] = await api.user.getUsers(
      this.offset,
      this.pagination.pageSize,
      this.roles
    );
    if (response && !error) {
      this.users = response.data ?? [];
      this.pagination.total = response.size ?? 0;
    }
    this.isDataLoading = false;
  }
  /** возвращает дисциплину parent объекту */
  @Emit("click") getUser(value: User | null): User | null {
    return value;
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    let data = this.users.map((item) => ({
      key: item.id,
      name: viewFullName(item.profile, false),
      roles: getRolesByArrId(item.roles ?? []),
      user: item,
    }));
    return data;
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTable() {
    return [
      {
        title: "ФИО",
        dataIndex: "name",
        key: "name",
        width: 300,
        ellipsis: true,
        slots: { title: "customTitle" },
        scopedSlots: { customRender: "name" },
      },
      {
        title: "Роли",
        key: "roles",
        scopedSlots: { customRender: "roles" },
      },
    ];
  }
  /** переключение страниц */
  async changePagination(
    pagination: VPaginationMixin["pagination"]
  ): Promise<void> {
    this.pagination.current = pagination.current;
    await this.getUsers();
  }
  /** добавление/убирание ролей в список фильтра */
  async changeRole(value: number): Promise<void> {
    const find = this.roles.find((item) => item === value);
    if (find !== undefined)
      this.roles = this.roles.filter((item) => item !== value);
    else this.roles.push(value);
    await this.changePagination({ ...this.pagination, current: 1 });
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-modal-get-user {
  .ant-modal-body {
    padding: 0 !important;
    .table-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      > * {
        margin-right: 8px;
        &:last-child {
          margin-right: 4px;
        }
      }
    }
    .ant-tag {
      margin-bottom: 8px;
    }
  }
}
</style>
