<template>
  <div class="v-add-event-type"></div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/common/api";

@Component
export default class VAddEventType extends Vue {
  async created() {
    console.log("v-event-list");
    const [response, error] = await api.event.getEvents(0, 100);
    console.log([response, error]);
  }
}
</script>

<style lang="scss">
.v-add-event-type {
}
</style>
