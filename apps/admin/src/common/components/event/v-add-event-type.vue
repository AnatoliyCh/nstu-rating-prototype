<template>
  <div class="v-add-event-type">
    <a-row :gutter="16" class="vertical-margin-element-16">
      <a-col :span="6">
        <a-card title="Основная информация" hoverable>
          <div class="vertical-margin-element-24">
            <label class="required-label">Название </label>
            <a-input v-model="typeEvent.name" allowClear />
          </div>
          <div class="vertical-margin-element-24">
            <a-checkbox default-checked disabled>Видно всем </a-checkbox>
          </div>
          <div class="vertical-margin-element-24">
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
      <a-col :span="6">
        <a-card :title="criteriaTypeOneName" hoverable>
          <div class="vertical-margin-element-24">
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
              />
              <a-button @click="removeCriteria(1, index)" type="danger">
                X
              </a-button>
            </a-space>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :title="criteriaTypeTwoName" hoverable>
          <div class="vertical-margin-element-24">
            <a-button @click="addNewCriteria(2)" block>
              Добавить критерий
            </a-button>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :title="criteriaTypeThreeName" hoverable>
          <div class="vertical-margin-element-24">
            <a-button @click="addNewCriteria(3)" block>
              Добавить критерий
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import VBaseMixin from "@/common/v-base-mixin";
import { TypeEvent, Criteria } from "../../../../../common/types/model";
import api from "@/common/api";

@Component
export default class VAddEventType extends mixins(VBaseMixin) {
  typeEvent: TypeEvent = { name: null, criteria: null }; // модеоль типа критерия

  readonly criteriaTypeOneName =
    "Критерий: Фиксированное количество баллов за участие";
  criteriaTypeOne: Criteria[] = []; // за участие

  readonly criteriaTypeTwoName = "Критерий: Пропорционально занятому месту";
  criteriaTypeTwo: Criteria[] = []; // пропорционально занятому месту

  readonly criteriaTypeThreeName = "Критерий: По набранному баллу";
  criteriaTypeThree: Criteria[] = []; // по набранному баллу

  async created(): Promise<void> {
    console.log("v-event-list");
    const [response, error] = await api.event.getEvents(
      this.$store.state.accessKeys.accessToken,
      0,
      100
    );
    console.log([response, error]);
  }

  // блокировка кнопки
  get disabledButton(): boolean {
    return Boolean(this.typeEvent.name) && this.isLoading === false;
  }

  // добавление критерия
  addNewCriteria(typeId: number | null) {
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
          value: null,
          name: null,
        });
        break;

      default:
        break;
    }
  }
  // удаление критерия
  removeCriteria(typeId: number | null, id: number | null) {
    if (!typeId || (id !== 0 && !id)) return;
    if (typeId === 1) this.criteriaTypeOne.splice(id, 1);
    else if (typeId === 2) this.criteriaTypeTwo.splice(id, 1);
    else if (typeId === 3) this.criteriaTypeThree.splice(id, 1);
  }
  // создание типа мероприятия
  async createEventType() {
    this.isLoading = true;
    // объеденение списков критериев
    this.typeEvent.criteria = [
      ...this.criteriaTypeOne,
      ...this.criteriaTypeTwo,
      ...this.criteriaTypeThree,
    ];
    const [response, error] = await api.event.createEventType(this.typeEvent);
    if (response && !error) {
      console.log(response);
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
.v-add-event-type {
  padding: 16px;
  > .ant-row {
    .ant-card-head-title {
      text-align: center;
    }
  }
}
</style>
