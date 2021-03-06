<template>
  <div class="v-add-event-type">
    <a-page-header
      :title="headerName"
      class="header-block"
      @back="routing('event-type-list')"
    />
    <a-row :gutter="16" class="vertical-margin-element-16">
      <!-- основная информация -->
      <a-col :span="6">
        <a-card title="Основная информация" hoverable>
          <div class="vertical-margin-element-24">
            <label :class="[mode === 'add' ? 'required-label' : '']">
              Название
            </label>
            <a-input
              v-model="typeEvent.name"
              :disabled="!(mode === 'add')"
              allowClear
            />
          </div>
          <div v-if="mode === 'add'" class="vertical-margin-element-24">
            <a-button
              type="primary"
              :disabled="!disabledButton"
              @click="createEventType"
            >
              Создать
            </a-button>
          </div>
        </a-card>
      </a-col>
      <!-- 1 критерий -->
      <a-col :span="6">
        <a-card :title="criteriaTypeOneName" hoverable>
          <div
            v-if="isEdit && mode === 'add'"
            class="vertical-margin-element-24"
          >
            <a-button @click="addNewCriteria(1)" block>
              Добавить критерий
            </a-button>
          </div>
          <!-- список притериев -->
          <div
            v-for="(criteria, index) in criteriaTypeOne"
            :key="index"
            class="vertical-margin-element-24"
          >
            <a-space :size="24">
              <label>#{{ index + 1 }} Балл </label>
              <a-input-number
                v-model="criteria.value"
                :min="0"
                allowClear
                style="width: 100%"
                :disabled="!(mode === 'add')"
                :parser="(value) => value.replace(/\$\s?|([.\,,]*)/g, '')"
              />
              <a-button
                v-if="isEdit && mode === 'add'"
                @click="removeCriteria(1, index)"
                type="danger"
              >
                X
              </a-button>
            </a-space>
          </div>
        </a-card>
      </a-col>
      <!-- 2 критерий -->
      <a-col :span="6">
        <a-card :title="criteriaTypeTwoName" hoverable>
          <div
            v-if="isEdit && mode === 'add'"
            class="vertical-margin-element-24"
          >
            <a-button @click="addNewCriteria(2)" block>
              Добавить критерий
            </a-button>
          </div>
          <!-- список притериев -->
          <div
            v-for="(criteria, index) in criteriaTypeTwo"
            :key="index"
            class="vertical-margin-element-24"
          >
            <a-space :size="8">
              <label style="white-space: nowrap">#{{ index + 1 }} Балл </label>
              <a-input-number
                v-model="criteria.value"
                :min="0"
                style="width: 100%"
                :disabled="!(mode === 'add')"
                :parser="(value) => value.replace(/\$\s?|([.\,,]*)/g, '')"
              />
              <label style="white-space: nowrap">места c </label>
              <a-input-number
                v-model="criteria.topPlace"
                :min="1"
                style="width: 100%"
                :disabled="!(mode === 'add')"
                :parser="(value) => value.replace(/\$\s?|([.\,,]*)/g, '')"
              />
              <label style="white-space: nowrap">по </label>
              <a-input-number
                v-model="criteria.bottomPlace"
                :min="criteria.topPlace"
                style="width: 100%"
                :disabled="!(mode === 'add')"
                :parser="(value) => value.replace(/\$\s?|([.\,,]*)/g, '')"
              />
              <a-button
                v-if="isEdit && mode === 'add'"
                @click="removeCriteria(2, index)"
                type="danger"
              >
                X
              </a-button>
            </a-space>
          </div>
        </a-card>
      </a-col>
      <!-- 3 критерий -->
      <a-col :span="6">
        <a-card :title="criteriaTypeThreeName" hoverable>
          <div
            v-if="isEdit && mode === 'add'"
            class="vertical-margin-element-24"
          >
            <a-button @click="addNewCriteria(3)" block>
              Добавить критерий
            </a-button>
          </div>
          <!-- список притериев -->
          <div
            v-for="(criteria, index) in criteriaTypeThree"
            :key="index"
            class="vertical-margin-element-24"
          >
            <a-space :size="8">
              <label class="required-label" style="white-space: nowrap"
                >#{{ index + 1 }}
              </label>
              <a-input
                v-model="criteria.name"
                placeholder="задание"
                allowClear
                :disabled="!(mode === 'add')"
              />
              <a-input-number
                v-model="criteria.value"
                placeholder="балл"
                :min="0"
                style="width: 100%"
                :disabled="!(mode === 'add')"
                :parser="(value) => value.replace(/\$\s?|([.\,,]*)/g, '')"
              />
              <a-button
                v-if="isEdit && mode === 'add'"
                @click="removeCriteria(3, index)"
                type="danger"
                block
              >
                X
              </a-button>
            </a-space>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import api from "@/common/api";
import VBaseMixin from "@/common/v-base-mixin";
import VEventApiMixin from "@/common/v-event-api-mixin";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { Criteria, TypeEvent } from "../../../../../../common/types/model";

@Component
export default class VAddEditDetailsEventType extends mixins(
  VBaseMixin,
  VEventApiMixin
) {
  typeEvent: TypeEvent = { name: null, criteria: null }; // модель типа критерия

  readonly criteriaTypeOneName =
    "Критерий: Фиксированное количество баллов за участие";
  criteriaTypeOne: Criteria[] = []; // за участие

  readonly criteriaTypeTwoName = "Критерий: Пропорционально занятому месту";
  criteriaTypeTwo: Criteria[] = []; // пропорционально занятому месту

  readonly criteriaTypeThreeName = "Критерий: По набранному баллу";
  criteriaTypeThree: Criteria[] = []; // по набранному баллу

  async created(): Promise<void> {
    this.isLoading = true;
    this.menuKey = [2];
    // если просто детальное представление
    if (["edit", "details"].includes(this.mode)) {
      const eventTypeId = Number(this.$route.params["id"]); // id тек. типа
      const eventTypes = await this.getEventTypes();
      const find = eventTypes.find((item) => item.id === eventTypeId);
      if (find) {
        this.typeEvent.id = eventTypeId;
        this.typeEvent.name = find.name;
        find.criteria?.forEach((item) => {
          switch (item.typeId) {
            case 1:
              this.criteriaTypeOne.push(item);
              break;
            case 2:
              this.criteriaTypeTwo.push(item);
              break;
            case 3:
              this.criteriaTypeThree.push(item);
              break;
            default:
              break;
          }
        });
      }
    }
    if (
      this.$router.currentRoute.name === "event-type-details" &&
      this.mode === "add"
    )
      this.routing("event-type-list");
    this.isLoading = false;
  }

  // блокировка кнопки
  get disabledButton(): boolean {
    return Boolean(this.typeEvent.name) && this.isLoading === false;
  }

  // добавление критерия
  addNewCriteria(typeId: number | null): void {
    if (!typeId) return;
    switch (typeId) {
      case 1:
        this.criteriaTypeOne.push({ typeId: typeId, value: 0 });
        break;
      case 2:
        this.criteriaTypeTwo.push({
          typeId: typeId,
          value: 0,
          topPlace: 1,
          bottomPlace: 1,
        });
        break;
      case 3:
        this.criteriaTypeThree.push({
          typeId: typeId,
          value: 0,
          name: null,
        });
        break;

      default:
        break;
    }
  }
  // удаление критерия
  removeCriteria(typeId: number | null, id: number | null): void {
    if (!typeId || (id !== 0 && !id)) return;
    if (typeId === 1) this.criteriaTypeOne.splice(id, 1);
    else if (typeId === 2) this.criteriaTypeTwo.splice(id, 1);
    else if (typeId === 3) this.criteriaTypeThree.splice(id, 1);
  }
  // создание типа мероприятия
  async createEventType(): Promise<void> {
    this.isLoading = true;
    // объеденение списков критериев
    this.typeEvent.criteria = [
      ...this.criteriaTypeOne,
      ...this.criteriaTypeTwo,
      ...this.criteriaTypeThree,
    ];
    const [response, error] = await api.event.createEventType(
      this.accessToken,
      this.typeEvent
    );
    if (response && !error) {
      console.info(response);
      this.$notification.success({
        message: "Тип мероприятия создан",
        description: `Название: ${this.typeEvent.name}`,
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
  // определение типа страницы (редакторование/добавление)
  get mode(): "add" | "edit" | "details" {
    const paramMode = this.$route.params["mode"];
    if (["add", "edit", "details"].includes(paramMode))
      return paramMode as "add" | "edit" | "details";
    return "add";
  }
  // название хедера
  get headerName(): string {
    return this.mode === "details"
      ? `Просмотр типа мероприятия: ${this.typeEvent.name}`
      : "Создание: тип мероприятия";
  }
  get isEdit(): boolean {
    return this.userAccess.eventType.create || this.userAccess.eventType.update;
  }
}
</script>

<style lang="scss">
.v-add-event-type {
  > .ant-row {
    padding: 0px 16px;
    .ant-card-head-title {
      text-align: center;
    }
    .ant-card {
      cursor: default;
    }
  }
}
</style>
