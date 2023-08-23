<script setup lang="ts">
import { provide, ref } from "vue";
import IconClose from "../icons/IconClose.vue";

const slots = defineSlots();
const emit = defineEmits<{
  "click:close": [];
}>();

const tabs = ref(slots.default().map((tab) => tab.props.title));
const selectedTab = ref(null);
provide("selectedTab", selectedTab);
initTabs();

function initTabs() {
  selectedTab.value = tabs.value[0];
}
function selectTab(tab) {
  selectedTab.value = tab;
}

function checkCurrentTab(tab) {
  return selectedTab.value === tab;
}
</script>

<template>
  <div class="tabs">
    <ul class="tabs__header">
      <li
        v-for="title in tabs"
        :key="title"
        class="tabs-item"
        :class="{ active: checkCurrentTab(title) }"
        @click="selectTab(title)"
      >
        {{ title }}
      </li>

      <li class="tabs-item close" @click="emit('click:close')">
        <IconClose />
      </li>
    </ul>

    <slot />
  </div>
</template>

<style scoped>
.tabs {
  max-width: 562px;
  height: 864px;
  flex: 1 100%;
  justify-content: center;
  align-items: center;
  background-color: #454545;
  overflow: hidden;
}

.tabs__header {
  padding: 0;
  margin: 0;
  list-style: none;
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
  user-select: none;
  transition: all 0.05s linear;
}

.tabs-item:hover:not(.active) {
  background-color: #575556;
  cursor: pointer;
}

.tabs-item:active:hover:not(.active) {
  background-color: #3b3b3b;
  color: #dddbdb;
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

.tabs-item.close:hover {
  color: white;
}
</style>
