<template>
  <div class="pattern-tabs">
    <div class="tabs-header">
      <div class="tabs-group">
        <button
          v-for="tab in availableTabs"
          :key="tab"
          :class="['tab-button', { active: activeTab === tab }]"
          @click="setActiveTab(tab)"
        >
          {{ tab }}
        </button>
      </div>
      <div class="tabs-spacer"></div>
      <button
        class="clipboard-btn"
        @click="copyJson"
        :title="copied ? 'Copied!' : 'Copy JSON'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span v-if="copied" class="copied-tooltip">Copied!</span>
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
const props = defineProps<{
  json: any
  rawJson: any
  getOriginalValue: (obj: object) => string | undefined
  transformEnabled: boolean
}>()
const emit = defineEmits<{
  (e: 'load-payload', payload: any): void
  (e: 'toggle-transform', enabled: boolean): void
}>()
import { usePatternRecognizer, type PatternType } from '../../composables/patternRecognizer'
import DsseView from './DsseView.vue'
import SigstoreView from './SigstoreView.vue'
import InTotoView from './InTotoView.vue'
import RawJsonView from './RawJsonView.vue'

type TabType = PatternType | 'RAW'

const { currentPattern, recognizePattern } = usePatternRecognizer()

const activeTab = ref<TabType>('UNKNOWN')
const lastRawJsonString = ref<string>('')

const availableTabs = computed(() => {
  const tabs: TabType[] = ['RAW']
  if (currentPattern.value.type !== 'UNKNOWN') {
    tabs.unshift(currentPattern.value.type)
  }
  return tabs
})

const patternInfo = computed(() => currentPattern.value)

watch(() => props.rawJson, (newRawJson) => {
  if (newRawJson) {
    const newRawJsonString = JSON.stringify(newRawJson)
    const isNewJson = newRawJsonString !== lastRawJsonString.value
    
    if (isNewJson) {
      // Only auto-switch tabs for genuinely new JSON
      const pattern = recognizePattern(newRawJson)
      if (pattern.type === 'UNKNOWN') {
        activeTab.value = 'RAW'
      } else {
        activeTab.value = pattern.type
      }
      lastRawJsonString.value = newRawJsonString
    }
    // If it's the same JSON (just transform toggle), keep current tab
  } else {
    activeTab.value = 'UNKNOWN'
    lastRawJsonString.value = ''
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

// Clipboard logic
const copied = ref(false)
const copyJson = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(props.json, null, 2))
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1200)
  } catch (e) {
    // Optionally handle error
  }
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
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.tabs-group {
  display: flex;
  gap: 0.5rem;
}

.tabs-spacer {
  flex: 1 1 auto;
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

.clipboard-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  color: var(--text-color);
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.clipboard-btn:hover {
  color: var(--primary-color);
  background: var(--bg-hover);
}

.clipboard-btn svg {
  display: block;
}

.copied-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--success-bg, #e6f9ed);
  color: var(--success-color, #28a745);
  font-size: 0.85rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  margin-top: 0.2rem;
  white-space: nowrap;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.tab-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}
</style> 