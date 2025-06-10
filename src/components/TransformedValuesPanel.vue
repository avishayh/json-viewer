<template>
  <div class="transformed-values-panel">
    <h3>Transformed Values</h3>
    <div class="values-list">
      <div
        v-for="(item, index) in transformedValues"
        :key="index"
        class="value-item"
        @click="$emit('select-path', item.path)"
      >
        <div class="value-header">
          <div class="value-path">{{ item.path }}</div>
          <button 
            class="copy-button" 
            @click.stop="copyToClipboard(item.originalValue)"
            :title="'Copy original value'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <span class="value-type">{{ item.type }}</span>
        <div class="value-preview">{{ getPreview(item.originalValue) }}</div>
      </div>
    </div>
    <div v-if="tooltipVisible" class="tooltip" :style="tooltipStyle">
      <pre>{{ tooltipContent }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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
      return value.length > 50 ? value.substring(0, 47) + '...' : value
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

    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch (err) {
        console.error('Failed to copy text: ', err)
      }
    }

    return {
      getPreview,
      showTooltip,
      hideTooltip,
      tooltipVisible,
      tooltipContent,
      tooltipStyle,
      copyToClipboard
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
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.value-item:hover {
  background-color: var(--background-color);
}

.value-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.value-path {
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-bottom: 4px;
  word-break: break-all;
  flex: 1;
}

.copy-button {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 4px;
}

.copy-button:hover {
  color: var(--primary-color);
  background-color: var(--background-color);
}

.value-type {
  display: inline-block;
  padding: 2px 6px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-bottom: 4px;
}

.value-preview {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 4px;
  word-break: break-all;
  max-height: 3em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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