<template>
  <div class="raw-json-view">
    <CustomJsonViewer
      :data="json"
      :highlight-path="highlightedPath"
      :get-original-value="getOriginalValue"
    />
  </div>
</template>

<script setup lang="ts">
import CustomJsonViewer from '../CustomJsonViewer.vue'

const props = defineProps<{
  json: any
  patternInfo?: any
}>()

// These props are needed to match the CustomJsonViewer interface
const highlightedPath = undefined
const getOriginalValue = undefined
</script>

<style scoped>
.raw-json-view {
  height: 100%;
  overflow: auto;
}
</style> 