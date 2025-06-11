<template>
  <div class="pattern-tabs">
    <div class="tabs-header">
      <button
        v-for="tab in availableTabs"
        :key="tab.id"
        :class="['tab-button', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tab-content">
      <component
        :is="currentTabComponent"
        :json="json"
        :pattern-info="patternInfo"
        :highlight-path="highlightedPath"
        :get-original-value="getOriginalValue"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePatternRecognizer, type PatternType } from '../../composables/usePatternRecognizer'
import RawJsonView from './RawJsonView.vue'
import DsseView from './DsseView.vue'
import SigstoreView from './SigstoreView.vue'
import InTotoView from './InTotoView.vue'

const props = defineProps<{
  json: any
  highlightedPath?: string
  getOriginalValue: (obj: object) => string | undefined
}>()

const { currentPattern, recognizePattern } = usePatternRecognizer()

const patternInfo = computed(() => {
  return recognizePattern(props.json)
})

const currentTab = ref('raw')

// Watch for pattern type changes and reset to raw JSON view
watch(() => patternInfo.value.type, () => {
  currentTab.value = 'raw'
})

const availableTabs = computed(() => {
  const tabs = [
    { id: 'raw', label: 'Raw JSON' }
  ]

  if (patternInfo.value.type === 'DSSE') {
    tabs.push({ id: 'dsse', label: 'DSSE View' })
  }

  if (patternInfo.value.type === 'SIGSTORE') {
    tabs.push({ id: 'sigstore', label: 'Sigstore View' })
  }

  if (patternInfo.value.type === 'INTOTO') {
    tabs.push({ id: 'intoto', label: 'In-toto View' })
  }

  return tabs
})

const currentTabComponent = computed(() => {
  switch (currentTab.value) {
    case 'raw':
      return RawJsonView
    case 'dsse':
      return DsseView
    case 'sigstore':
      return SigstoreView
    case 'intoto':
      return InTotoView
    default:
      return RawJsonView
  }
})
</script>

<style scoped>
.pattern-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tabs-header {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.tab-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: none;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button:hover {
  background-color: var(--bg-hover);
}

.tab-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.tab-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}
</style> 