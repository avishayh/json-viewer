<template>
  <div class="app-container">
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
          <div class="history-content" @click="loadFromHistory(item)">
            <div class="history-preview">{{ getPreview(item) }}</div>
            <div class="history-timestamp">{{ formatTimestamp(item.timestamp) }}</div>
          </div>
          <button class="remove-button" @click.stop="removeFromHistory(index)">×</button>
        </div>
      </div>
    </div>
    <div class="main-content">
      <h1>JSON Viewer</h1>
      <div class="version-info">
        Version: {{ version }} | Last updated: {{ lastUpdated }}
      </div>
      <div class="input-section">
        <textarea
          v-model="jsonInput"
          placeholder="Paste your JSON here..."
          rows="6"
        ></textarea>
        <button @click="parseJson" :disabled="!jsonInput.trim()">
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

type JsonValue = string | number | boolean | null | JsonObject | JsonArray
interface JsonObject { [key: string]: JsonValue }
type JsonArray = JsonValue[]

interface HistoryItem {
  json: string
  timestamp: number
}

export default defineComponent({
  name: 'App',
  components: {
    VueJsonPretty
  },
  data() {
    return {
      jsonInput: '',
      parsedJson: null as JsonValue | null,
      error: '',
      version: versionInfo.version,
      lastUpdated: new Date(versionInfo.lastUpdated).toLocaleString(),
      history: [] as HistoryItem[],
      lastParsedJson: ''
    }
  },
  created() {
    this.loadHistory()
  },
  methods: {
    parseJson(): void {
      try {
        this.error = ''
        const jsonData = JSON.parse(this.jsonInput)
        this.parsedJson = this.processObject(jsonData)
        
        if (this.jsonInput !== this.lastParsedJson) {
          this.addToHistory(this.jsonInput)
          this.lastParsedJson = this.jsonInput
        }
      } catch (err) {
        this.error = 'Invalid JSON format'
        this.parsedJson = null
      }
    },
    loadHistory(): void {
      const savedHistory = localStorage.getItem('jsonViewerHistory')
      if (savedHistory) {
        try {
          this.history = JSON.parse(savedHistory)
        } catch {
          this.history = []
        }
      }
    },
    saveHistory(): void {
      localStorage.setItem('jsonViewerHistory', JSON.stringify(this.history))
    },
    addToHistory(json: string): void {
      const newItem: HistoryItem = {
        json,
        timestamp: Date.now()
      }
      
      this.history.unshift(newItem)
      
      if (this.history.length > 20) {
        this.history = this.history.slice(0, 20)
      }
      
      this.saveHistory()
    },
    loadFromHistory(item: HistoryItem): void {
      this.jsonInput = item.json
      this.lastParsedJson = item.json
      this.parseJson()
    },
    clearHistory(): void {
      this.history = []
      this.saveHistory()
    },
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
    isBase64(str: string): boolean {
      try {
        return btoa(atob(str)) === str
      } catch (err) {
        return false
      }
    },
    tryParseJson(str: string): JsonValue | null {
      try {
        return JSON.parse(str)
      } catch (err) {
        return null
      }
    },
    processValue(value: JsonValue): JsonValue {
      if (typeof value !== 'string') return value
      
      const parsedJson = this.tryParseJson(value)
      if (parsedJson) {
        return this.processObject(parsedJson)
      }
      
      if (this.isBase64(value)) {
        try {
          const decoded = atob(value)
          const parsed = this.tryParseJson(decoded)
          if (parsed) {
            return this.processObject(parsed)
          }
          return this.processValue(decoded)
        } catch (err) {
          return value
        }
      }
      
      return value
    },
    processObject(obj: JsonValue): JsonValue {
      if (Array.isArray(obj)) {
        return obj.map(item => this.processObject(item))
      }
      
      if (obj && typeof obj === 'object') {
        const result: JsonObject = {}
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string') {
            result[key] = this.processValue(value)
          } else {
            result[key] = this.processObject(value)
          }
        }
        return result
      }
      
      return obj
    },
    removeFromHistory(index: number): void {
      this.history.splice(index, 1)
      this.saveHistory()
    }
  }
})
</script>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

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

.history-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: white;
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.version-info {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.input-section {
  margin-bottom: 2rem;
}

textarea {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: monospace;
  resize: vertical;
}

button {
  display: block;
  margin: 0 auto;
  padding: 0.5rem 2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #ff0000;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #ffebee;
  border-radius: 4px;
}

.json-viewer {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow: auto;
}

.history-content {
  flex: 1;
  cursor: pointer;
}

.history-content:hover {
  background-color: #f8f9fa;
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