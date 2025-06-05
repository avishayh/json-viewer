<template>
  <div class="app-container">
    <HistorySidebar
      :history="history"
      @load="loadFromHistory"
      @remove="removeFromHistory"
      @clear="clearHistory"
    />
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
      lastUpdated: new Date(versionInfo.lastUpdated).toLocaleString()
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
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
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
</style> 