<template>
  <div class="app-container">
    <HistorySidebar
      :history="history"
      @load="handleHistorySelect"
      @remove="removeFromHistory"
      @clear="clearHistory"
    />
    <div class="main-content">
      <div class="header">
        <h1>JSON Viewer</h1>
        <div class="header-actions">
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
      
      <div class="input-section">
        <textarea
          v-model="jsonInput"
          placeholder="Paste your JSON here..."
          rows="6"
        ></textarea>
        <button @click="handleParseJson" :disabled="!jsonInput.trim()">
          Parse JSON
        </button>
      </div>
      
      <div v-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-if="parsedJson" class="content-wrapper">
        <CustomJsonViewer
          :data="parsedJson"
          :highlight-path="highlightedPath"
          :get-original-value="getOriginalValue"
        />
        <TransformedValuesPanel
          :transformed-values="transformedValues"
          @select-path="handlePathSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useJsonProcessor } from './composables/useJsonProcessor'
import { useHistory } from './composables/useHistory'
import { useTheme } from './composables/useTheme'
import CustomJsonViewer from './components/CustomJsonViewer.vue'
import TransformedValuesPanel from './components/TransformedValuesPanel.vue'
import HistorySidebar from './components/HistorySidebar.vue'
import versionInfo from '../version.json'

const jsonInput = ref('')
const highlightedPath = ref<string | undefined>(undefined)
const showAbout = ref(false)
const version = versionInfo.version
const lastUpdated = new Date(versionInfo.lastUpdated).toLocaleString()

const { toggleTheme, isDarkTheme } = useTheme()
const { history, loadHistory, addToHistory, removeFromHistory, clearHistory } = useHistory()

const {
  parsedJson,
  error,
  parseJson,
  transformedValues,
  getOriginalValue
} = useJsonProcessor()

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

const getThemeTitle = () => {
  return isDarkTheme() ? 'Switch to Light Theme' : 'Switch to Dark Theme'
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
  padding: 2.5rem;
  overflow-y: auto;
  background-color: var(--surface-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  position: relative;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  color: var(--primary-color);
}

.theme-toggle svg {
  width: 24px;
  height: 24px;
}

.input-section {
  margin-bottom: 2.5rem;
  max-width: 800px;
}

textarea {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: var(--surface-color);
  color: var(--text-primary);
}

textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

button {
  padding: 0.75rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
}

button:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
  color: var(--text-secondary);
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
  flex: 1;
  min-height: 0;
  overflow: hidden;
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
</style> 