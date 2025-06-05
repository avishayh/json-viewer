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
        <div class="value-path" :title="value.path">{{ value.path }}</div>
        <div class="value-type">{{ value.type }}</div>
        <div class="value-preview" :title="value.originalValue">
          {{ getPreview(value.originalValue) }}
        </div>
      </div>
    </div>
    <div v-if="tooltipVisible" class="tooltip" :style="tooltipStyle">
      <pre>{{ tooltipContent }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { TransformedValue } from '../composables/useJsonProcessor'
import { PropType } from 'vue'

export default defineComponent({
  name: 'TransformedValuesPanel',
  props: {
    transformedValues: {
      type: Array as PropType<Array<{
        path: string;
        type: string;
        originalValue: string;
      }>>,
      required: true
    }
  },
  setup() {
    const tooltipVisible = ref(false);
    const tooltipContent = ref('');
    const tooltipStyle = ref({
      top: '0px',
      left: '0px'
    });

    const getPreview = (value: string): string => {
      if (value.length > 50) {
        return value.substring(0, 50) + '...';
      }
      return value;
    };

    const showTooltip = (event: MouseEvent, content: string) => {
      tooltipContent.value = content;
      tooltipVisible.value = true;
      tooltipStyle.value = {
        top: `${event.clientY + 10}px`,
        left: `${event.clientX + 10}px`
      };
    };

    const hideTooltip = () => {
      tooltipVisible.value = false;
    };

    return {
      getPreview,
      showTooltip,
      hideTooltip,
      tooltipVisible,
      tooltipContent,
      tooltipStyle
    };
  }
});
</script>

<style scoped>
.transformed-values-panel {
  width: 350px;
  min-width: 350px;
  border-left: 1px solid var(--border-color);
  padding: 1rem;
  background-color: var(--surface-color);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 300px);
}

.transformed-values-panel h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.values-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.values-list::-webkit-scrollbar {
  width: 6px;
}

.values-list::-webkit-scrollbar-track {
  background: var(--background-color);
  border-radius: 3px;
}

.values-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.values-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.value-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.value-item:hover {
  background-color: #f5f5f5;
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
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 4px;
  word-break: break-all;
}

.tooltip {
  position: fixed;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.875rem;
  max-width: 400px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tooltip pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--text-primary);
  background: var(--background-color);
  padding: 0.5rem;
  border-radius: 2px;
}
</style> 