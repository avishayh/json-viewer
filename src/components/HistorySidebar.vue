<template>
  <div class="history-sidebar">
    <div class="history-header">
      <h2>History</h2>
      <button class="clear-button" @click="$emit('clear')" :disabled="!history.length" title="Clear History">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    </div>
    <div class="history-list">
      <div v-if="!history.length" class="empty-state">
        No history items
      </div>
      <div
        v-for="(item, index) in history"
        :key="index"
        class="history-item"
        @click="$emit('load', item)"
      >
        <div class="history-item-header">
          <h3 class="history-item-title">JSON {{ index + 1 }}</h3>
          <span class="history-item-timestamp">{{ formatTimestamp(item.timestamp) }}</span>
        </div>
        <div class="history-item-preview">{{ getPreview(item.json) }}</div>
        <button class="remove-button" @click.stop="$emit('remove', index)" title="Remove from history">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { HistoryItem } from '../composables/useHistory'

export default defineComponent({
  name: 'HistorySidebar',
  props: {
    history: {
      type: Array as PropType<HistoryItem[]>,
      required: true
    }
  },
  emits: ['load', 'remove', 'clear'],
  setup() {
    const formatTimestamp = (timestamp: number): string => {
      return new Date(timestamp).toLocaleString();
    };

    const getPreview = (json: string): string => {
      try {
        const parsed = JSON.parse(json);
        const stringified = JSON.stringify(parsed);
        return stringified.length > 50 ? stringified.substring(0, 47) + '...' : stringified;
      } catch {
        return json.length > 50 ? json.substring(0, 47) + '...' : json;
      }
    };

    return {
      formatTimestamp,
      getPreview
    };
  }
})
</script>

<style scoped>
.history-sidebar {
  width: 300px;
  min-width: 300px;
  background-color: var(--surface-color);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.history-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-header h2 {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  padding-left: 1rem;
}

.clear-button {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button:hover {
  color: var(--error-color);
}

.clear-button svg {
  width: 20px;
  height: 20px;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-track {
  background: var(--background-color);
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.history-item {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.history-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-right: 1.5rem;
}

.history-item-title {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item-timestamp {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.history-item-preview {
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 3em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.remove-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  transition: all 0.2s;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-item:hover .remove-button {
  opacity: 1;
}

.remove-button:hover {
  color: var(--error-color);
  transform: scale(1.1);
}

.remove-button svg {
  width: 16px;
  height: 16px;
}

.empty-state {
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem;
  font-size: 0.875rem;
}
</style> 