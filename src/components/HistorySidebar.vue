<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>History</h2>
      <button class="clear-button" @click="clearHistory" :disabled="!history.length">
        Clear History
      </button>
    </div>
    <div class="history-list">
      <div
        v-for="(item, index) in history"
        :key="index"
        class="history-item"
      >
        <div class="history-content" @click="$emit('load', item)">
          <div class="history-preview">{{ getPreview(item) }}</div>
          <div class="history-timestamp">{{ formatTimestamp(item.timestamp) }}</div>
        </div>
        <button class="remove-button" @click.stop="$emit('remove', index)">×</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { HistoryItem } from '../composables/useHistory'

export default defineComponent({
  name: 'HistorySidebar',
  props: {
    history: {
      type: Array as () => HistoryItem[],
      required: true
    }
  },
  emits: ['load', 'remove', 'clear'],
  methods: {
    getPreview(item: HistoryItem): string {
      try {
        const parsed = JSON.parse(item.json)
        const stringified = JSON.stringify(parsed)
        return stringified.length > 50 ? stringified.substring(0, 47) + '...' : stringified
      } catch {
        return item.json.length > 50 ? item.json.substring(0, 47) + '...' : item.json
      }
    },
    formatTimestamp(timestamp: number): string {
      return new Date(timestamp).toLocaleTimeString()
    },
    clearHistory(): void {
      this.$emit('clear')
    }
  }
})
</script>

<style scoped>
.sidebar {
  width: 320px;
  background-color: white;
  padding: 1.5rem;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  margin-bottom: 1.5rem;
}

.sidebar-header h2 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.clear-button {
  width: 100%;
  padding: 0.5rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.clear-button:hover:not(:disabled) {
  background-color: #c82333;
}

.clear-button:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.history-item {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  background-color: white;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.history-content {
  flex: 1;
  cursor: pointer;
}

.history-content:hover {
  background-color: #f8f9fa;
}

.history-preview {
  font-family: monospace;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  word-break: break-all;
  color: #2c3e50;
  line-height: 1.4;
}

.history-timestamp {
  font-size: 0.8rem;
  color: #6c757d;
}

.remove-button {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.2rem;
  padding: 0 0.5rem;
  cursor: pointer;
  margin: 0;
  line-height: 1;
}

.remove-button:hover {
  color: #c82333;
}
</style> 