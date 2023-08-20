<script setup lang="ts">
import IconCooldown from "./icons/IconCooldown.vue";

import { computed } from "vue";

const props = defineProps({
  modelValue: String,
  item: Object,
  remaining: String,
});

const item = computed(() => props.item);
</script>

<template>
  <div class="backpack-item" v-tippy="item.name">
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
      <div class="backpack-item__shine" :class="{ [item.type]: true }" />

      <div class="backpack-item__loading-overlay" v-if="remaining">
        <IconCooldown class="backpack-item__cooldown-icon" />
        <div class="backpack-item__cooldown-timer">
          {{ remaining }}
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.backpack-item {
  position: relative;
  border: 1px solid #454545;
  background-color: #1a1a1a;
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
