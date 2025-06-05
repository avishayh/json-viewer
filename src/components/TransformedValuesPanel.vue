<template>
  <div class="transformed-values-panel">
    <h3>Transformed Values</h3>
    <div class="values-list">
      <div
        v-for="(value, index) in transformedValues"
        :key="index"
        class="value-item"
        @mouseover="showTooltip($event, value.originalValue)"
        @mouseleave="hideTooltip"
      >
        <div class="value-path">{{ value.path }}</div>
        <div class="value-type">{{ value.type }}</div>
        <div class="value-preview">{{ getPreview(value.originalValue) }}</div>
      </div>
    </div>
    <div v-if="tooltipVisible" class="tooltip" :style="tooltipStyle">
      <div class="tooltip-content">
        <pre>{{ tooltipContent }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { TransformedValue } from '../composables/useJsonProcessor'

export default defineComponent({
  name: 'TransformedValuesPanel',
  props: {
    transformedValues: {
      type: Array as () => TransformedValue[],
      required: true
    }
  },
  setup() {
    const tooltipVisible = ref(false)
    const tooltipContent = ref('')
    const tooltipStyle = ref({
      top: '0px',
      left: '0px'
    })

    const getPreview = (value: string): string => {
      try {
        const parsed = JSON.parse(value)
        const stringified = JSON.stringify(parsed)
        return stringified.length > 50 ? stringified.substring(0, 47) + '...' : stringified
      } catch {
        return value.length > 50 ? value.substring(0, 47) + '...' : value
      }
    }

    const showTooltip = (event: MouseEvent, content: string) => {
      tooltipContent.value = content
      tooltipStyle.value = {
        top: `${event.clientY + 10}px`,
        left: `${event.clientX + 10}px`
      }
      tooltipVisible.value = true
    }

    const hideTooltip = () => {
      tooltipVisible.value = false
    }

    return {
      tooltipVisible,
      tooltipContent,
      tooltipStyle,
      getPreview,
      showTooltip,
      hideTooltip
    }
  }
})
</script>

<style scoped>
.transformed-values-panel {
  width: 350px;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.values-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.value-item {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  transition: background-color 0.2s;
}

.value-item:hover {
  background-color: var(--background-color);
}

.value-path {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
  color: var(--text-primary);
  word-break: break-all;
  margin-bottom: 0.25rem;
}

.value-type {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: var(--background-color);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.value-preview {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-all;
}

.tooltip {
  position: fixed;
  z-index: 1000;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  max-height: 300px;
  overflow: auto;
  pointer-events: none;
}

.tooltip-content {
  padding: 0.75rem;
}

.tooltip-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 0.75rem;
  color: var(--text-primary);
  background: var(--background-color);
  padding: 0.5rem;
  border-radius: 2px;
}
</style> 