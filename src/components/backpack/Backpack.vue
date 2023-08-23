<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { getInventoryState } from "../../api";
import { TBackpackItemType, IBackpackItem } from "../../types";

import { BackpackFilter, BackpackFilterTitle } from "../backpack-filter";
import { BackpackItemsGrid, BackpackItem } from "../backpack-items";

import { TabsWrapper, TabsItem } from "../tabs";
import { backpackItems, useFilteredItems, useItemsGrid } from "./model";

import { startCooldownInterval, getCooldownRemaining } from "./cooldowns";

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
defineProps<{ modelValue: boolean }>();

// Filter
const currentFilter = ref<TBackpackItemType>("all");

/**
 * Backpack Items
 */
// Items filtered by current filter value
const filteredItems = computed<IBackpackItem[]>(() =>
  useFilteredItems(backpackItems.value, currentFilter.value)
);
// Items grid combined empty cells and real items
const itemsGrid = computed(() => useItemsGrid(filteredItems.value));

const route = useRoute();

onMounted(async () => {
  const caseNumber = route.query.caseNumber;
  if (!caseNumber) return null;
  const result = await getInventoryState(`case=${caseNumber}`);
  backpackItems.value = result.inventory;

  startCooldownInterval(result.inventory);
});
function closeBackpack() {
  emit("update:modelValue", false);

  // TODO close backpack
}
</script>

<template>
  <TabsWrapper v-if="modelValue" @click:close="closeBackpack">
    <TabsItem title="Backpack">
      <div class="backpack-content">
        <BackpackFilter v-model="currentFilter" />
        <div class="backpack-inventory">
          <BackpackFilterTitle :current-filter="currentFilter" />
          <BackpackItemsGrid :disable-scroll="itemsGrid.length <= 40">
            <BackpackItem
              v-for="item in itemsGrid"
              :item="item"
              :remaining="getCooldownRemaining(item)"
            />
          </BackpackItemsGrid>
        </div>
      </div>
    </TabsItem>
    <TabsItem title="Nexus">WORK IN PROGRESS</TabsItem>
  </TabsWrapper>
</template>

<style scoped>
.backpack-content {
  background-color: #242223;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}

.backpack-inventory {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
