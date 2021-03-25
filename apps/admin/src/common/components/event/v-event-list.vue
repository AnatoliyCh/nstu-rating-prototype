<template>
  <div class="v-event-list"></div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/common/api";

@Component
export default class VEventList extends Vue {
  async created() {
    console.log("v-event-list");
    const [response, error] = await api.event.getEvents(0, 100);
    console.log([response, error]);
  }
}
</script>

<style lang="scss">
.v-event-list {
}
</style>
