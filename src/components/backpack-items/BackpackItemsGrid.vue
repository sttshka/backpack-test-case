<script setup lang="ts">
withDefaults(defineProps<{ disableScroll: boolean }>(), {
  disableScroll: false,
});
</script>

<template>
  <div
    class="backpack-items-grid"
    :class="{
      scrollable: !disableScroll,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.backpack-items-grid {
  margin: 0px 5px;
  padding: 0 5px;
  display: grid;
  grid-template-columns: repeat(5, 93px);
  grid-auto-rows: 93px;
  overflow: hidden;
}

.backpack-items-grid.scrollable {
  max-height: 745px;
  overflow-y: scroll;
}
</style>
