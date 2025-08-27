<template>
  <div class="collapsible-section">
    <div 
      class="section-header" 
      @click="toggleSection"
      :class="{ 'collapsed': !isExpanded }"
    >
      <div class="header-content">
        <div class="title-container">
          <span class="section-title">{{ title }}</span>
          <span v-if="!isExpanded && summary" class="section-summary">{{ summary }}</span>
        </div>
        <div class="toggle-icon">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
            :class="{ 'rotated': isExpanded }"
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </div>
    </div>
    
    <div 
      class="section-content"
      :class="{ 'expanded': isExpanded }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  title: string
  summary?: string
  defaultExpanded?: boolean
  storageKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: true,
  summary: '',
  storageKey: ''
})

const emit = defineEmits<{
  (e: 'toggle', expanded: boolean): void
}>()

const isExpanded = ref(props.defaultExpanded)

// Load state from localStorage if storageKey is provided
if (props.storageKey) {
  const stored = localStorage.getItem(`collapsible-section-${props.storageKey}`)
  if (stored !== null) {
    isExpanded.value = JSON.parse(stored)
  }
}

const toggleSection = () => {
  isExpanded.value = !isExpanded.value
  
  // Save state to localStorage if storageKey is provided
  if (props.storageKey) {
    localStorage.setItem(`collapsible-section-${props.storageKey}`, JSON.stringify(isExpanded.value))
  }
  
  emit('toggle', isExpanded.value)
}

// Watch for external changes to defaultExpanded
watch(() => props.defaultExpanded, (newValue) => {
  if (!props.storageKey) {
    isExpanded.value = newValue
  }
})
</script>

<style scoped>
.collapsible-section {
  background-color: var(--bg-secondary);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 0.75rem;
  border: 1px solid var(--border-color);
}

.section-header {
  cursor: pointer;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}

.section-header:hover {
  background-color: var(--bg-hover);
}

.section-header.collapsed {
  border-bottom: none;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.title-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.section-summary {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 400;
}

.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  color: var(--text-secondary);
}

.toggle-icon svg {
  transition: transform 0.3s ease;
}

.toggle-icon svg.rotated {
  transform: rotate(180deg);
}

.section-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: 0 1rem;
}

.section-content.expanded {
  max-height: none; /* Allow content to determine height */
  padding: 1rem;
}

/* Ensure content is properly spaced when expanded */
.section-content.expanded > *:first-child {
  margin-top: 0;
}

.section-content.expanded > *:last-child {
  margin-bottom: 0;
}
</style>
