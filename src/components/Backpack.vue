<script setup lang="ts">
import dayjs from "dayjs";
import { computed, handleError, onMounted, ref } from "vue";
import type { Ref } from "vue";
import IconClose from "./icons/IconClose.vue";
import IconCooldown from "./icons/IconCooldown.vue";

import BackpackFilters from "./BackpackFilters.vue";
import { FilterType, filterTabs } from "../types/handbooks";
import { useRoute, useRouter } from "vue-router";

const currentFilter: Ref<FilterType> = ref("all");

const filterTitle = computed(
  () =>
    filterTabs.find((tab) => tab.code === currentFilter.value)?.title ?? "Пусто"
);

const API_URL =
  "https://us-central1-seven-seven-bit-inhouse-helper.cloudfunctions.net/vueDevTestTask-getInventoryState";
async function getBackpackItems(caseNumber) {
  return fetch(`${API_URL}?case=${caseNumber}`);
}

const backpackCells = ref([]);

const emptyCells = ref([]);
fillCells();
function fillCells() {
  for (let i = 0; i < 40; i++) {
    emptyCells.value.push({ id: null });
  }
}

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
  return emptyCells.value.map((item, index) =>
    filteredCells.value[index]?.id ? filteredCells.value[index] : item
  );
});

const route = useRoute();
onMounted(async () => {
  const caseNumber = route.query.caseNumber;
  const result = await getBackpackItems(caseNumber).then(
    async (res) => await res.json()
  );
  const inventortyItems = result.inventory;

  backpackCells.value = inventortyItems;
  startCooldownInterval(inventortyItems);
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

const getCooldownRemaining = (item) => {
  if (!item || !item?.cooldown) {
    return null;
  }

  return cooldownsMap.value.get(item.id)?.value ?? null;
};

function getName(item) {
  return item.name;
}
</script>

<template>
  <div class="backpack">
    <div class="tabs">
      <div class="tabs-item active">Backpack</div>
      <div class="tabs-item">Nexus</div>
      <div class="tabs-item close"><IconClose /></div>
    </div>
    <div class="tabs__content">
      <BackpackFilters v-model="currentFilter" />
      <div class="backpack__inventory">
        <div class="backpack__filters-header">{{ filterTitle }}</div>
        <div class="backpack__grid">
          <div
            v-for="item in mergedCells"
            class="backpack-item"
            v-tippy="getName(item)"
          >
            <template v-if="item.id">
              <div
                class="backpack-item__icon"
                :style="{
                  background: `url(
                    ${item.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  width: '75px',
                  height: '75px',
                }"
              />
              <div
                class="backpack-item__counters"
                :class="{
                  'only-count': !item.charges || !item.maxCharges,
                }"
              >
                <div
                  class="backpack-item__charges"
                  v-if="item.charges && item.maxCharges"
                >
                  {{ item.charges }}/{{ item.maxCharges }}
                </div>

                <div class="backpack-item__count single" v-if="item.count">
                  x{{ item.count }}
                </div>
              </div>
              <div
                class="backpack-item__shine"
                :class="{ [item.type]: true }"
              />

              <div
                class="backpack-item__loading-overlay"
                v-if="getCooldownRemaining(item)"
              >
                <IconCooldown class="backpack-item__cooldown-icon" />
                <div class="backpack-item__cooldown-timer">
                  {{ getCooldownRemaining(item) }}
                </div>
              </div>
            </template>
          </div>
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
  margin: 0px 15px;
  display: grid;
  grid-template-columns: repeat(5, 93px);
  grid-auto-rows: 93px;
  background-color: #1a1a1a;
  overflow-y: scroll;
}

.backpack-item {
  position: relative;
  border: 1px solid #454545;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.backpack-item__icon {
  position: relative;
  z-index: 2;
  display: block;
  background-size: "cover";
  background-position: "center";
  background-repeat: "no-repeat";
  width: "100%";
  height: "100%";
}

.backpack-item__counters {
  z-index: 3;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2px;
}

.backpack-item__counters.only-count {
  flex-direction: column-reverse;
}

.backpack-item__count {
  color: #ffffff;
  font-size: 17px;
  font-weight: 500;
  font-family: "JetBrains Mono", monospace;
  align-self: flex-end;
}

.backpack-item__charges {
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  font-family: "JetBrains Mono", monospace;
  align-self: flex-start;
}

.backpack-item__shine {
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
}

.backpack-item__shine.weapon {
  background: radial-gradient(
      59.14% 59.14% at 50% 50%,
      #7f59ce 0%,
      rgba(127, 89, 206, 0) 100%
    ),
    #1a1a1a;
}
.backpack-item__shine.armor {
  background: radial-gradient(
      59.14% 59.14% at 50% 50%,
      #367cce 0%,
      rgba(0, 95, 206, 0) 100%
    ),
    #1a1a1a;
}

.backpack-item__loading-overlay {
  z-index: 4;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  backdrop-filter: brightness(37%);
}
.backpack-item__cooldown-timer {
  color: #fff;
  text-align: center;
  font-family: "Archivo Black", sans-serif;
  font-weight: 400;
}
</style>
