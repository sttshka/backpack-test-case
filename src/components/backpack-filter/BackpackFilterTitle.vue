<script setup lang="ts">
import { computed } from "vue";
import { filterItems } from "../../handbooks";
const props = defineProps({
  currentFilter: String,
});

const title = computed(
  () =>
    filterItems.find((tab) => tab.code === props.currentFilter)?.title ??
    "Empty"
);
</script>

<template>
  <div class="backpack__filter-header">{{ title }}</div>
</template>

<style scoped>
.backpack__filter-header {
  text-transform: uppercase;
  color: white;
  font-size: 20px;
  font-weight: 400;
  margin: 12px 0 10px 15px;
}
</style>
