<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { getInventoryState } from "../../api";
import { TBackpackItemType, IBackpackItem } from "../../types";

import IconClose from "../icons/IconClose.vue";

import { BackpackFilter, BackpackFilterTitle } from "../backpack-filter";
import { BackpackItemsGrid, BackpackItem } from "../backpack-items";
import { backpackItems, useFilteredItems, useItemsGrid } from "./model";

import { startCooldownInterval, getCooldownRemaining } from "./cooldowns";

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
</script>

<template>
  <div class="backpack">
    <div class="tabs">
      <div class="tabs-item active">Backpack</div>
      <div class="tabs-item">Nexus</div>
      <div class="tabs-item close"><IconClose /></div>
    </div>
    <div class="tabs__content">
      <!-- Filters Aside -->
      <BackpackFilter v-model="currentFilter" />
      <div class="backpack__inventory">
        <!-- Filter Header -->
        <BackpackFilterTitle :current-filter="currentFilter" />
        <!-- Items -->
        <BackpackItemsGrid :disable-scroll="itemsGrid.length <= 40">
          <BackpackItem
            v-for="item in itemsGrid"
            :item="item"
            :remaining="getCooldownRemaining(item)"
          />
        </BackpackItemsGrid>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backpack {
  max-width: 562px;
  height: 864px;
  flex: 1 100%;
  justify-content: center;
  align-items: center;
  background-color: #454545;
  overflow: hidden;
}

.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tabs-item {
  flex: 1 100%;
  text-align: center;
  border: 1px solid #000000;
  height: 56px;
  font-size: 24px;
  font-weight: 400;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.47);
}

.tabs-item.active {
  background-color: #242223;
  color: white;
}

.tabs-item.close {
  flex: 1;
  width: 56px;
  padding: 15px;
  background: #242223;
}

.tabs__content {
  background-color: #242223;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}

.backpack__inventory {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.backpack__filters-header {
  text-transform: uppercase;
  color: white;
  font-size: 20px;
  font-weight: 400;
  margin: 12px 0 10px 15px;
}
</style>
