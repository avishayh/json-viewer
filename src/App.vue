<template>
  <div class="app-container">
    <HistorySidebar
      :history="history"
      @load="loadFromHistory"
      @remove="removeFromHistory"
      @clear="clearHistory"
    />
    <div class="main-content">
      <div class="header">
        <h1>JSON Viewer</h1>
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
      <div class="input-section">
        <textarea
          v-model="jsonInput"
          placeholder="Paste your JSON here..."
          rows="6"
        ></textarea>
        <button @click="handleParse" :disabled="!jsonInput.trim()">
          Parse JSON
        </button>
      </div>
      <div v-if="error" class="error">
        {{ error }}
      </div>
      <div v-if="parsedJson" class="json-viewer">
        <vue-json-pretty
          :data="parsedJson"
          :deep="999"
          :show-double-quotes="true"
          :show-length="true"
          :collapsed-strings-length="50"
          :collapsed-on-click-brackets="true"
          :show-collapsed-on-click-brackets="true"
          :show-line="true"
          :show-icon="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import versionInfo from '../version.json'
import HistorySidebar from './components/HistorySidebar.vue'
import { useHistory } from './composables/useHistory'
import { useJsonProcessor } from './composables/useJsonProcessor'
import type { HistoryItem } from './composables/useHistory'

export default defineComponent({
  name: 'App',
  components: {
    VueJsonPretty,
    HistorySidebar
  },
  setup() {
    const {
      history,
      loadHistory,
      addToHistory,
      removeFromHistory,
      clearHistory
    } = useHistory()

    const {
      parsedJson,
      error,
      lastParsedJson,
      parseJson
    } = useJsonProcessor()

    return {
      history,
      loadHistory,
      addToHistory,
      removeFromHistory,
      clearHistory,
      parsedJson,
      error,
      lastParsedJson,
      parseJson
    }
  },
  data() {
    return {
      jsonInput: '',
      version: versionInfo.version,
      lastUpdated: new Date(versionInfo.lastUpdated).toLocaleString(),
      showAbout: false
    }
  },
  created() {
    this.loadHistory()
  },
  methods: {
    handleParse(): void {
      if (this.parseJson(this.jsonInput)) {
        this.addToHistory(this.jsonInput)
      }
    },
    loadFromHistory(item: HistoryItem): void {
      this.jsonInput = item.json
      this.parseJson(item.json)
    }
  }
})
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

.json-viewer {
  background-color: var(--surface-color);
  padding: 1.5rem;
  border-radius: 8px;
  overflow: auto;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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