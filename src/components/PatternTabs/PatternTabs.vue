<template>
  <div class="pattern-tabs">
    <div class="tabs-header">
      <button
        v-for="tab in availableTabs"
        :key="tab"
        :class="['tab-button', { active: activeTab === tab }]"
        @click="setActiveTab(tab)"
      >
        {{ tab }}
      </button>
    </div>

    <div class="tab-content">
      <DsseView
        v-if="activeTab === 'DSSE'"
        :json="json"
        :pattern-info="patternInfo"
        @load-payload="handleLoadPayload"
      />
      <SigstoreView
        v-if="activeTab === 'SIGSTORE'"
        :json="json"
        :pattern-info="patternInfo"
        @load-payload="handleLoadPayload"
      />
      <InTotoView
        v-if="activeTab === 'INTOTO'"
        :json="json"
        :pattern-info="patternInfo"
      />
      <RawJsonView
        v-if="activeTab === 'RAW'"
        :json="json"
        :get-original-value="getOriginalValue"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePatternRecognizer, type PatternType } from '../../composables/patternRecognizer'
import DsseView from './DsseView.vue'
import SigstoreView from './SigstoreView.vue'
import InTotoView from './InTotoView.vue'
import RawJsonView from './RawJsonView.vue'

type TabType = PatternType | 'RAW'

const props = defineProps<{
  json: any
  getOriginalValue: (path: string) => any
}>()

const emit = defineEmits<{
  (e: 'load-payload', payload: any): void
}>()

const { currentPattern, recognizePattern } = usePatternRecognizer()

const activeTab = ref<TabType>('UNKNOWN')

const availableTabs = computed(() => {
  const tabs: TabType[] = ['RAW']
  if (currentPattern.value.type !== 'UNKNOWN') {
    tabs.unshift(currentPattern.value.type)
  }
  return tabs
})

const patternInfo = computed(() => currentPattern.value)

watch(() => props.json, (newJson) => {
  if (newJson) {
    const pattern = recognizePattern(newJson)
    activeTab.value = pattern.type
  } else {
    activeTab.value = 'UNKNOWN'
  }
}, { immediate: true })

const setActiveTab = (tab: TabType) => {
  activeTab.value = tab
}

const handleLoadPayload = (payload: any) => {
  emit('load-payload', payload)
  // After emitting, switch to DSSE tab
  activeTab.value = 'DSSE'
}
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