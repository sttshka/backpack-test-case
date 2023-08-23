<script setup lang="ts">
import { inject } from "vue";

withDefaults(defineProps<{ title: string }>(), {
  title: "Tab",
});

const selectedTab = inject("selectedTab");
</script>

<template>
  <div class="tabs-content" v-show="title == selectedTab">
    <slot />
  </div>
</template>

<style scoped>
.tabs-content {
  background-color: #242223;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: column;
  color: white;
  justify-content: center;
  align-items: center;
}
</style>
