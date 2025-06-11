<template>
  <div class="raw-json-view">
    <CustomJsonViewer
      :data="json"
      :highlight-path="highlightedPath"
      :get-original-value="getOriginalValueOrDefault"
    />
  </div>
</template>

<script setup lang="ts">
import CustomJsonViewer from '../CustomJsonViewer.vue'

const props = defineProps<{
  json: any
  patternInfo?: any
  highlightedPath?: string
  getOriginalValue?: (obj: object) => string | undefined
}>()

// Provide a default implementation that returns undefined
const getOriginalValueOrDefault = (obj: object): string | undefined => {
  return props.getOriginalValue?.(obj)
}
</script>

<style scoped>
.raw-json-view {
  height: 100%;
  overflow: auto;
}
</style> 