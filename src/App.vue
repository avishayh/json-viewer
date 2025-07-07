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
            <div class="examples-dropdown" @click="showExamples = !showExamples">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              <div v-if="showExamples" class="examples-popup">
                <div class="examples-content">
                  <h3>Load Examples</h3>
                  <button
                    v-for="example in examples"
                    :key="example.name"
                    @click="handleExampleLoad(JSON.stringify(example.data)); showExamples = false"
                    class="example-menu-button"
                    :title="`Load ${example.name} example`"
                  >
                    {{ example.name.toUpperCase() }}
                  </button>
                </div>
              </div>
            </div>
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
                  <p v-if="version">Version: {{ version }}</p>
                  <p v-else>Loading version...</p>
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
            :json="parsedJson"
            :highlight-path="highlightedPath"
            :get-original-value="getOriginalValue"
            @load-payload="handleLoadPayload"
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useJsonProcessor } from './composables/useJsonProcessor'
import { useHistory } from './composables/useHistory'
import { useTheme } from './composables/useTheme'
import TransformedValuesPanel from './components/TransformedValuesPanel.vue'
import PatternTabs from './components/PatternTabs/PatternTabs.vue'
import HistorySidebar from './components/HistorySidebar.vue'
import dsseExample from './examples/dsse.json'
import sigstoreExample from './examples/sigstore.json'
import intotoExample from './examples/intoto.json'
import transformationsExample from './examples/transformations.json'

interface Example {
  name: string
  data: any
}

const jsonInput = ref('')
const highlightedPath = ref<string | undefined>(undefined)
const showAbout = ref(false)
const showExamples = ref(false)
const version = ref<string | null>(null)

const examples = ref<Example[]>([
  { name: 'dsse', data: dsseExample },
  { name: 'sigstore', data: sigstoreExample },
  { name: 'intoto', data: intotoExample },
  { name: 'transformations', data: transformationsExample }
])

const { toggleTheme, isDarkTheme } = useTheme()
const { history, loadHistory, addToHistory, removeFromHistory, clearHistory, getPreview, formatTimestamp, getHistoryTitle } = useHistory()

const {
  parsedJson,
  error,
  parseJson,
  transformedValues,
  getOriginalValue
} = useJsonProcessor()

onMounted(() => {
  loadHistory()
  fetch('version.json')
    .then(res => res.json())
    .then(data => {
      version.value = data.version || null
    })
    .catch(() => {
      version.value = null
    })
    
  // Add click outside handler to close popups
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  
  // Check if click is outside examples dropdown
  if (!target.closest('.examples-dropdown')) {
    showExamples.value = false
  }
  
  // Check if click is outside about popup
  if (!target.closest('.about-icon')) {
    showAbout.value = false
  }
}

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

const clearInput = () => {
  console.log('Before clear:', {
    jsonInput: jsonInput.value,
    parsedJson: parsedJson.value,
  });
  
  jsonInput.value = '';
  parseJson('');
  highlightedPath.value = undefined;
  error.value = ''; // Reset error state
  
  console.log('After clear:', {
    jsonInput: jsonInput.value,
    parsedJson: parsedJson.value,
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
  --bg-hover: #f1f5f9;
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
  --bg-hover: #44475a;
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
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.about-content {
  padding: 1rem;
  min-width: 200px;
}

.examples-dropdown {
  position: relative;
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

.examples-dropdown:hover {
  background-color: var(--bg-hover);
}

.examples-popup {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.examples-content {
  padding: 1rem;
  min-width: 200px;
}

.examples-content h3 {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.example-menu-button {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: var(--primary-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  color: white;
  margin-bottom: 0.5rem;
  text-align: left;
}

.example-menu-button:last-child {
  margin-bottom: 0;
}

.example-menu-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.example-menu-button:active {
  transform: translateY(0);
}

.input-section {
  padding: 1rem;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
}

.input-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-controls textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--surface-color);
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s;
}

.input-controls textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.parse-button,
.clear-button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.parse-button {
  background-color: var(--primary-color);
  color: white;
}

.parse-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.parse-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
  color: var(--text-secondary);
}

.clear-button {
  background-color: var(--surface-color);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.clear-button:hover:not(:disabled) {
  background-color: var(--background-color);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.clear-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  color: var(--error-color);
  margin: 1rem;
  padding: 1rem;
  background-color: var(--error-bg);
  border-radius: 8px;
  border: 1px solid var(--error-color);
  font-size: 0.875rem;
}

.content-wrapper {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 300px);
}

.json-section {
  flex: 1;
  overflow: auto;
  background-color: var(--surface-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.input-section {
  padding: 1rem;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
}

.input-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-controls textarea {
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
  background-color: var(--surface-color);
  color: var(--text-primary);
  resize: vertical;
  transition: border-color 0.2s;
}

.input-controls textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-controls textarea::placeholder {
  color: var(--text-secondary);
}

.controls-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.parse-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.parse-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.parse-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
  color: var(--text-secondary);
}

.clear-button {
  padding: 0.5rem;
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-button:hover:not(:disabled) {
  background-color: var(--bg-hover);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.clear-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  color: var(--error-color);
  margin: 1rem;
  padding: 1rem;
  background-color: var(--error-bg);
  border-radius: 8px;
  border: 1px solid var(--error-color);
  font-size: 0.875rem;
}

.content-wrapper {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 300px);
}

.json-section {
  flex: 1;
  overflow: auto;
  background-color: var(--surface-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
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
</style>