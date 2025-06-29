<template>
  <div class="transformed-values-view">
    <TransformedValuesPanel :transformed-values="[]" />
  </div>
</template>

<script setup lang="ts">
import TransformedValuesPanel from '../TransformedValuesPanel.vue'
</script>

<style scoped>
.transformed-values-view {
  height: 100%;
  overflow: auto;
}
</style> 