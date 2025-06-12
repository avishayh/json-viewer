<template>
  <div class="app-container">
    <HistorySidebar
      :history="history"
      :get-history-title="getHistoryTitle"
      :format-timestamp="formatTimestamp"
      :get-preview="getPreview"
      @load="handleHistorySelect"
      @remove="removeFromHistory"
      @clear="clearHistory"
    />
    <div class="main-content">
      <div class="header">
        <div class="title-section">
          <h1>JSON Viewer</h1>
        </div>
        <div class="header-actions">
          <div class="action-buttons">
            <button class="theme-toggle" @click="toggleTheme" :title="getThemeTitle()">
              <svg v-if="isDarkTheme()" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
            <div class="about-icon" @click="showAbout = !showAbout">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div v-if="showAbout" class="about-popup">
                <div class="about-content">
                  <h3>About</h3>
                  <p>Version: {{ version }}</p>
                  <p>Last updated: {{ lastUpdated }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-section">
        <div class="input-controls">
          <textarea
            v-model="jsonInput"
            placeholder="Paste your JSON here..."
            rows="4"
          ></textarea>
          <div class="controls-row">
            <ExampleButtons @load-example="handleExampleLoad" />
            <div class="button-group">
              <button @click="handleParseJson" :disabled="!jsonInput.trim()" class="parse-button">
                Parse JSON
              </button>
              <button @click="clearInput" :disabled="!jsonInput.trim()" class="clear-button" title="Clear input">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-if="parsedJson" class="content-wrapper">
        <div class="json-section">
          <PatternTabs 
            v-if="hasPattern" 
            :json="parsedJson"
            :highlight-path="highlightedPath"
            :get-original-value="getOriginalValue"
            @load-payload="handleLoadPayload"
          />
          <CustomJsonViewer
            v-else
            :data="parsedJson"
            :highlight-path="highlightedPath"
            :get-original-value="getOriginalValue"
          />
        </div>
        <TransformedValuesPanel
          :transformed-values="transformedValues"
          @select-path="handlePathSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useJsonProcessor } from './composables/useJsonProcessor'
import { useHistory, type HistoryItem } from './composables/useHistory'
import { useTheme } from './composables/useTheme'
import { usePatternRecognizer } from './composables/patternRecognizer'
import CustomJsonViewer from './components/CustomJsonViewer.vue'
import TransformedValuesPanel from './components/TransformedValuesPanel.vue'
import PatternTabs from './components/PatternTabs/PatternTabs.vue'
import HistorySidebar from './components/HistorySidebar.vue'
import ExampleButtons from './components/ExampleButtons.vue'
import versionInfo from '../version.json'

const jsonInput = ref('')
const highlightedPath = ref<string | undefined>(undefined)
const showAbout = ref(false)
const version = versionInfo.version
const lastUpdated = new Date(versionInfo.lastUpdated).toLocaleString()

const { toggleTheme, isDarkTheme } = useTheme()
const { history, loadHistory, addToHistory, removeFromHistory, clearHistory, getPreview, formatTimestamp, getHistoryTitle } = useHistory()

const {
  parsedJson,
  error,
  parseJson,
  transformedValues,
  getOriginalValue
} = useJsonProcessor()

const { currentPattern, recognizePattern } = usePatternRecognizer()

const hasPattern = computed(() => {
  if (!parsedJson.value) return false
  const pattern = recognizePattern(parsedJson.value)
  return pattern.type !== 'UNKNOWN'
})

const getJsonPreview = (json: string): string => {
  try {
    const parsed = JSON.parse(json)
    const stringified = JSON.stringify(parsed)
    return stringified.length > 50 ? stringified.substring(0, 47) + '...' : stringified
  } catch {
    return json.length > 50 ? json.substring(0, 47) + '...' : json
  }
}

onMounted(() => {
  loadHistory()
})

const handleParseJson = () => {
  if (parseJson(jsonInput.value)) {
    addToHistory(jsonInput.value)
  }
}

const handleHistorySelect = (item: { json: string }) => {
  jsonInput.value = item.json
  parseJson(item.json)
}

const handlePathSelect = (path: string) => {
  highlightedPath.value = path
}

const handleExampleLoad = (json: string) => {
  jsonInput.value = json
  parseJson(json)
}

const getThemeTitle = () => {
  return isDarkTheme() ? 'Switch to Light Theme' : 'Switch to Dark Theme'
}

const getThemeToggleText = computed(() => {
  return isDarkTheme() ? 'Switch to Light Theme' : 'Switch to Dark Theme'
})

const loadExample = async (type: string) => {
  try {
    const response = await fetch(`/examples/${type}/example1.json`)
    const json = await response.json()
    jsonInput.value = json
    parseJson(json)
  } catch (error) {
    console.error('Error loading example:', error)
  }
}

const clearInput = () => {
  console.log('Before clear:', {
    jsonInput: jsonInput.value,
    parsedJson: parsedJson.value,
    hasPattern: hasPattern.value
  });
  
  jsonInput.value = '';
  parseJson('');
  highlightedPath.value = undefined;
  error.value = ''; // Reset error state
  
  console.log('After clear:', {
    jsonInput: jsonInput.value,
    parsedJson: parsedJson.value,
    hasPattern: hasPattern.value
  });
};

const handleLoadPayload = async (payload: string) => {
  jsonInput.value = payload
  await parseJson(payload)
  // Wait for next tick to ensure pattern recognition is complete
  await nextTick()
}
</script>

<style>
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --background-color: #f8fafc;
  --surface-color: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --error-color: #ef4444;
  --error-bg: #fef2f2;
}

[data-theme="dark"] {
  --primary-color: #61afef;
  --primary-hover: #528bcc;
  --background-color: #282a36;
  --surface-color: #1e1f29;
  --text-primary: #f8f8f2;
  --text-secondary: #a5a5a5;
  --border-color: #44475a;
  --error-color: #ff5555;
  --error-bg: #2d1e1e;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: var(--text-primary);
  line-height: 1.5;
}

.app-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--background-color);
}

.main-content {
  flex: 1;
  padding: 0;
  overflow-y: auto;
  background-color: var(--surface-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  height: 48px;
  box-sizing: border-box;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
}

.title-section h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle,
.about-icon {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.theme-toggle:hover,
.about-icon:hover {
  background-color: var(--bg-hover);
}

.about-icon {
  position: relative;
}

.about-popup {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.about-content {
  padding: 1rem;
  min-width: 200px;
}

.about-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.about-content p {
  margin: 0.25rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.input-section {
  padding: 1rem;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.input-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-family: monospace;
  resize: vertical;
  min-height: 100px;
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

button:hover:not(:disabled) {
  background-color: var(--bg-hover);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.parse-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.parse-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.clear-button {
  background-color: #dc2626;
  color: white;
  border: none;
}

.clear-button:hover:not(:disabled) {
  background-color: #ef4444;
}

.clear-button:disabled {
  background-color: #9ca3af;
}

.error {
  color: var(--error-color);
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: var(--error-bg);
  border-radius: 8px;
  border: 1px solid var(--error-color);
  font-size: 0.875rem;
}

.content-wrapper {
  display: flex;
  gap: 1rem;
  height: calc(100vh - 300px);
}

.json-section {
  flex: 1;
  overflow: auto;
  background-color: var(--surface-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background-color);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.about-icon {
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s;
  position: relative;
}

.about-icon:hover {
  color: var(--primary-color);
}

.about-popup {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  min-width: 200px;
  z-index: 1000;
}

.about-content h3 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.about-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.examples {
  margin-top: 2.5rem;
  padding: 1rem;
  background-color: var(--surface-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.example-buttons {
  display: flex;
  gap: 0.75rem;
}

.example-buttons button {
  padding: 0.75rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
}

.example-buttons button:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.example-buttons button:active:not(:disabled) {
  transform: translateY(0);
}

.example-buttons button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
  color: var(--text-secondary);
}

.history-panel {
  width: 250px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.history-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  box-sizing: border-box;
}

.history-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}
</style> 