<template>
  <div class="history-sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="history-header">
      <h2 v-if="!isCollapsed">History</h2>
      <div class="header-actions">
        <button 
          class="collapse-button" 
          @click="toggleCollapse" 
          :title="isCollapsed ? 'Expand History' : 'Collapse History'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path v-if="isCollapsed" d="M9 18l6-6-6-6"></path>
            <path v-else d="M15 18l-6-6 6-6"></path>
          </svg>
        </button>
        <button 
          v-if="!isCollapsed"
          class="clear-button" 
          @click="$emit('clear')" 
          :disabled="!history.length" 
          title="Clear History"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Expanded content -->
    <div v-if="!isCollapsed" class="history-list">
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
          <div class="history-item-title-container">
            <svg v-if="item.patternType === 'DSSE'" class="pattern-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <svg v-else-if="item.patternType === 'SIGSTORE'" class="pattern-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <svg v-else-if="item.patternType === 'INTOTO'" class="pattern-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <h3 class="history-item-title">{{ getHistoryTitle(item, index) }}</h3>
          </div>
          <span class="history-item-timestamp">{{ formatTimestamp(item.timestamp) }}</span>
        </div>
        <div class="history-item-preview">{{ getPreview(item) }}</div>
        <button class="remove-button" @click.stop="$emit('remove', index)" title="Remove from history">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Collapsed content -->
    <div v-else class="collapsed-content">
      <div class="collapsed-items">
        <div
          v-for="(item, index) in history.slice(0, 5)"
          :key="index"
          class="collapsed-item"
          @click="$emit('load', item)"
          :title="getHistoryTitle(item, index)"
        >
          <svg v-if="item.patternType === 'DSSE'" class="collapsed-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <svg v-else-if="item.patternType === 'SIGSTORE'" class="collapsed-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <svg v-else-if="item.patternType === 'INTOTO'" class="collapsed-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <svg v-else class="collapsed-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
          </svg>
        </div>
        <div v-if="history.length > 5" class="more-indicator">
          +{{ history.length - 5 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from 'vue'
import type { HistoryItem } from '../composables/useHistory'
import { useHistory } from '../composables/useHistory'

export default defineComponent({
  name: 'HistorySidebar',
  props: {
    history: {
      type: Array as PropType<HistoryItem[]>,
      required: true
    },
    getHistoryTitle: {
      type: Function as PropType<(item: HistoryItem, index: number) => string>,
      required: true
    },
    formatTimestamp: {
      type: Function as PropType<(timestamp: number) => string>,
      required: true
    },
    getPreview: {
      type: Function as PropType<(item: HistoryItem) => string>,
      required: true
    }
  },
  emits: ['load', 'remove', 'clear'],
  setup(_, { emit }) {
    const { clearHistory } = useHistory()
    const isCollapsed = ref(false)

    // Load saved collapse state
    onMounted(() => {
      const savedState = localStorage.getItem('historySidebarCollapsed')
      if (savedState !== null) {
        isCollapsed.value = JSON.parse(savedState)
      }
    })

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
      // Save collapse state to localStorage
      localStorage.setItem('historySidebarCollapsed', JSON.stringify(isCollapsed.value))
    }

    const handleLoad = (json: string) => {
      emit('load', json)
    }

    const handleRemove = (index: number) => {
      emit('remove', index)
    }

    const handleClear = () => {
      clearHistory()
    }

    return {
      isCollapsed,
      toggleCollapse,
      handleLoad,
      handleRemove,
      handleClear
    }
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
  transition: width 0.3s ease, min-width 0.3s ease;
}

.history-sidebar.collapsed {
  width: 60px;
  min-width: 60px;
}

.history-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 48px;
}

.history-sidebar.collapsed .history-header {
  justify-content: center;
  padding: 0.75rem 0.5rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.history-sidebar.collapsed .header-actions {
  flex-direction: column;
  gap: 0.25rem;
}

.collapse-button {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.collapse-button:hover {
  color: var(--primary-color);
  background-color: var(--bg-hover);
}

.history-header h2 {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  transition: opacity 0.2s;
}

.clear-button {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.clear-button:hover {
  color: var(--error-color);
  background-color: var(--bg-hover);
}

.clear-button svg {
  width: 16px;
  height: 16px;
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

.history-item-title-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.pattern-icon {
  flex-shrink: 0;
  color: var(--primary-color);
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
  line-clamp: 2;
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

/* Collapsed state styles */
.collapsed-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.collapsed-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 0.5rem;
}

.collapsed-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--surface-color);
  border: 1px solid transparent;
}

.collapsed-item:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-color);
  transform: translateY(-1px);
}

.collapsed-icon {
  color: var(--primary-color);
  width: 18px;
  height: 18px;
}

.more-indicator {
  text-align: center;
  font-size: 0.7rem;
  color: var(--text-secondary);
  padding: 0.5rem;
  background-color: var(--bg-hover);
  border-radius: 4px;
  margin-top: 0.25rem;
}

/* Animation for smooth transitions */
@media (prefers-reduced-motion: no-preference) {
  .history-sidebar * {
    transition-duration: 0.2s;
  }
}
</style> 