<script setup lang="ts">
import { ref } from "vue";
import { Backpack } from "../components/backpack";
import IconBackpack from "../components/icons/IconBackpack.vue";

const isBackpackOpen = ref<boolean>(false);
function toggleBackpack() {
  isBackpackOpen.value = !isBackpackOpen.value;
}
</script>

<template>
  <button
    class="backpack-toggler"
    v-if="!isBackpackOpen"
    @click="toggleBackpack"
  >
    <IconBackpack />
    <span>Backpack</span>
  </button>
  <Backpack v-model="isBackpackOpen" />
</template>

<style scoped>
.backpack-toggler {
  background: white;
  border: none;
  cursor: pointer;
}
</style>
