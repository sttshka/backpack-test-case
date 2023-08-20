<script setup lang="ts">
import { Filter, ItemType, filterTabs } from "../types/handbooks";

export interface Props {
  modelValue: ItemType;
}
const emit = defineEmits(["update:modelValue"]);
const props = withDefaults(defineProps<Props>(), {
  modelValue: "all",
});

const items: Filter[] = filterTabs;

const checkCurrentItem = ({ code }) => code === props.modelValue;
const handleSelectFilter = (value: ItemType): void => {
  emit("update:modelValue", value);
};
</script>

<template>
  <div class="backpack__filters">
    <div
      v-for="item in items"
      :key="item.code"
      class="backpack__filters-item"
      :class="{ active: checkCurrentItem(item) }"
      @click="handleSelectFilter(item.code)"
    >
      <component :is="item.icon" :key="item.code" />
    </div>
  </div>
</template>

<style scoped>
.backpack__filters {
  width: 100%;
  max-width: fit-content;
  max-height: min-content;
  background-color: #393839;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 33px;
  padding: 16px;
  color: #ffffff;
  overflow: hidden;
}

.backpack__filters-item {
  fill-opacity: 50%;
}

.backpack__filters-item:hover {
  fill-opacity: 80%;
}
.backpack__filters-item:active,
.backpack__filters-item.active {
  fill-opacity: 100%;
}
</style>
