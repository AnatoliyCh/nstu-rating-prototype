<template>
  <div class="v-group-gradebook-page">
    <a-page-header
      :title="titleName"
      class="v-group-gradebook-page-header-block"
      @back="goGroupDetails"
    >
      <template slot="extra">
        <a-button key="1" type="primary" @click="modalRequestsVisible = true">
          Заявки на распределение
        </a-button>
      </template>
    </a-page-header>
    <a-table
      :columns="columnsTable"
      :data-source="tableData"
      :loading="isDataLoading"
      :pagination="pagination"
      :scroll="{ x: 1000, y: 'calc(100vh - 16em)' }"
      bordered
      size="small"
      @change="changePagination"
    />
    <v-modal-change-achievement-request
      v-model="modalRequestsVisible"
      :requests="achievementRequests"
      @successful="getAchievementRequests"
    />
  </div>
</template>
<script lang="ts">
import VBaseMixin from "@/common/v-base-mixin";
import VPaginationMixin from "@/common/v-pagination-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { Achievement, GradebookPage } from "../../../../../common/types/model";
import { viewFullName } from "@/common/filters";
import { Dictionary } from "node_modules/vue-router/types/router";
import api from "@/common/api";
/** страница журнала успеваемости группы, по предмету */
@Component
export default class VGroupGradebookPage extends mixins(
  VBaseMixin,
  VPaginationMixin
) {
  gradebookPage: GradebookPage | null = null; // отображаемая сущность
  groupId = Number(this.$route.params["groupId"]);
  disciplineId = Number(this.$route.params["disciplineId"]);

  achievementRequests: Achievement[] = []; // список запросов на распределение баллов
  modalRequestsVisible = false; // видимость модального окна распределения запросов

  async created(): Promise<void> {
    this.menuKey = [4];
    if (!this.viewGradebookPage) {
      this.goGroupDetails();
      return;
    }
    this.isDataLoading = true;
    const [
      response,
      error,
    ] = await api.rating.getGradebookPageByDisciplineAndGroup(
      this.accessToken,
      this.disciplineId,
      this.groupId
    );
    if (response && !error) this.gradebookPage = response;
    // this.test();
    this.pagination.total = this.gradebookPage?.studentsMarks?.length ?? 0;
    await this.getAchievementRequests();
    this.isDataLoading = false;
  }
  /** получение всех запросов на распределение для этой дисциплины */
  async getAchievementRequests() {
    if (!this.gradebookPage?.id) return;
    const [response, error] = await api.rating.getAchievementRequests(
      this.accessToken,
      0,
      99999,
      undefined,
      this.gradebookPage.id
    );
    if (response && !error) this.achievementRequests = response.data ?? [];
  }
  /** доступ к этой странице */
  get viewGradebookPage(): boolean {
    const moderators =
      this.gradebookPage?.moderators?.map((item) => item.id) ?? [];
    return (
      this.userAccess.group.viewGradebookPage ||
      moderators.includes(this.currentUser?.id ?? -1)
    );
  }
  // переход на страницу просмотра группы
  goGroupDetails(): void {
    this.routing("group-details", { id: this.groupId.toString() });
  }
  // колонки таблицы
  // eslint-disable-next-line
  get columnsTable() {
    // eslint-disable-next-line
    const columns: any[] = [
      {
        title: "ФИО студента",
        dataIndex: "name",
        key: "name",
        width: 200,
        fixed: "left",
        align: "center",
      },
    ];
    // добавления колонок работ
    if (this.works.length)
      for (const [i, work] of this.works.entries()) {
        work.name &&
          columns.push({
            key: i,
            title: `${work.name}`,
            dataIndex: `${work.name}_${i}`,
            align: "center",
            width: this.works?.length > 10 ? 100 : null,
          });
      }
    columns.push(
      {
        title: "Бонусы",
        dataIndex: "bonusScore",
        key: "bonusScore",
        fixed: this.gradebookPage?.works?.length ? "right" : null,
        width: this.gradebookPage?.works?.length ? 100 : null,
        align: "center",
      },
      {
        title: "Сумма",
        dataIndex: "sum",
        key: "sum",
        width: 100,
        fixed: "right",
        align: "center",
      }
    );
    return columns;
  }
  // данные для таблицы
  // eslint-disable-next-line
  get tableData() {
    if (this.gradebookPage) {
      return this.studentsMarks.map((item, index) => {
        let sum = 0;
        const row: Dictionary<string> = {
          key: index.toString(),
          name: `${viewFullName(item.student?.profile ?? null, true)} `,
          bonusScore: `${item.bonusScore ?? 0}`,
        };
        for (let i = 0; i < this.works.length; i++) {
          const element = this.works[i];
          if (element.name) {
            const mark = (item.marks && item.marks[i]?.value) ?? 0;
            row[`${element.name}_${i}`] = mark.toString();
            sum += mark;
          }
        }
        sum += Number(row["bonusScore"]);
        row["sum"] = sum.toString();
        return row;
      });
    }
    return [];
  }
  // eslint-disable-next-line
  get studentsMarks() {
    return this.gradebookPage?.studentsMarks ?? [];
  }
  // eslint-disable-next-line
  get works() {
    return this.gradebookPage?.works ?? [];
  }
  /** название заголовка страницы */
  get titleName(): string {
    return `Просмотр: страница журнала дисциплины "${
      this.gradebookPage?.discipline?.name ?? ""
    }"`;
  }
  /** переключение страниц */
  changePagination(pagination: VPaginationMixin["pagination"]): void {
    this.pagination.current = pagination.current;
  }
  test(): void {
    this.gradebookPage = {
      id: 0,
      discipline: {
        id: 0,
        name: "discipline-test",
      },
      moderators: [],
      studentsMarks: [],
      works: [],
    };
    // for (let i = 0; i < 10; i++) {
    //   this.gradebookPage?.works?.push({
    //     id: i,
    //     name: `ЛР ${i}`,
    //     maxValue: i,
    //   });
    // }
    for (let i = 0; i < 30; i++) {
      this.gradebookPage?.studentsMarks?.push({
        student: {
          id: i,
          profile: {
            firstName: "firstName 0",
            lastName: "firstName 0",
            middleName: "firstName 0",
          },
        },
        marks: [
          { value: 1, date: "2005-08-09T18:31:42" },
          { value: 1, date: "2005-08-09T18:31:42" },
        ],
        bonusScore: i,
      });
    }
  }
}
</script>

<style lang="scss">
@import "src/common/main.scss";
.v-group-gradebook-page {
  &-header-block {
    border-block-end: 1px solid rgb(235, 237, 240);
    margin-bottom: 0px;
  }
}
</style>
