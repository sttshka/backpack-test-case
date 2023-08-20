<script setup lang="ts">
import type { Ref } from "vue";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

import { ItemType, filterTabs, Product } from "../types/handbooks";
import { getInventoryState } from "../api";

import IconClose from "./icons/IconClose.vue";

import BackpackFilters from "./BackpackFilters.vue";
import BackpackItem from "./BackpackItem.vue";

const currentFilter: Ref<ItemType> = ref("all");

const filterTitle = computed(
  () =>
    filterTabs.find((tab) => tab.code === currentFilter.value)?.title ?? "Пусто"
);

const backpackCells = ref([]);
const emptyCells = ref([]);
fillCells();

const filteredCells = computed(() => {
  if (currentFilter.value === "all") {
    return backpackCells.value;
  } else {
    return backpackCells.value.filter(
      (item) => item.type === currentFilter.value
    );
  }
});

const mergedCells = computed(() => {
  if (filteredCells.value.length >= emptyCells.value.length) {
    const filteredCellsLength = filteredCells.value.length;
    const intMultipleFive = Math.floor((filteredCells.value.length / 5) * 5);

    if (filteredCellsLength === intMultipleFive) {
      const arr = [];
      for (let i = 0; i < intMultipleFive; i++) {
        if (filteredCells.value[i]) {
          arr.push(filteredCells.value[i]);
        } else {
          arr.push({ id: null });
        }
      }

      return arr;
    }

    return Math.floor((filteredCells.value.length / 5) * 5);
  }

  return emptyCells.value.map((item, index) =>
    filteredCells.value[index]?.id ? filteredCells.value[index] : item
  );
});

let cooldownsMap = ref(new Map());
const getCounter = (distance) => {
  if (distance / 1000 <= 60) {
    return `${dayjs(distance).format("s")}s`;
  } else {
    return `${dayjs(distance).format("m:ss")}m`;
  }
};

const startCooldownInterval = (list) => {
  const itemsWithCooldown = list.filter((item) => item.cooldown);

  cooldownsMap.value = new Map(
    itemsWithCooldown.map((item) => [
      item.id,
      {
        cooldown: item.cooldown,
        value: getCounter(item.cooldown - new Date().getTime()),
      },
    ])
  );

  const interval = setInterval(() => {
    const now = new Date().getTime();
    cooldownsMap.value.forEach(({ cooldown }, key) => {
      const distance = cooldown - now;

      if (distance <= 0) {
        cooldownsMap.value.delete(key);
        return null;
      }

      cooldownsMap.value.set(key, {
        ...cooldownsMap.value.get(key),
        value: getCounter(distance),
      });
    });
    if (cooldownsMap.value.size === 0) {
      clearInterval(interval);
    }
  }, 1000);
};

function getCooldownRemaining(item: Product): string | null {
  if (!item || (item && !item.cooldown)) {
    return null;
  }

  return cooldownsMap.value.get(item.id)?.value ?? null;
}
function fillCells() {
  for (let i = 0; i < 40; i++) {
    emptyCells.value.push({ id: null });
  }
}

const route = useRoute();

onMounted(async () => {
  const caseNumber = route.query.caseNumber;
  const result = await getInventoryState(`case=${caseNumber}`);
  const inventortyItems = result.inventory;
  backpackCells.value = inventortyItems;
  startCooldownInterval(inventortyItems);
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
      <BackpackFilters v-model="currentFilter" />
      <div class="backpack__inventory">
        <!-- Filter Header -->
        <div class="backpack__filters-header">{{ filterTitle }}</div>
        <!-- Items -->
        <div
          class="backpack__grid"
          :class="{
            scrollable: filteredCells.length > 40,
          }"
        >
          <BackpackItem
            v-for="item in mergedCells"
            :item="item"
            :remaining="getCooldownRemaining(item)"
          />
        </div>
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

.backpack__grid {
  margin: 0px 5px;
  padding: 0 5px;
  display: grid;
  grid-template-columns: repeat(5, 93px);
  grid-auto-rows: 93px;
  overflow: hidden;
}

.backpack__grid.scrollable {
  max-height: 750px;
  overflow-y: scroll;
}
</style>
