<template>
  <div class="container">
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
        :deep="2"
        :show-double-quotes="true"
        :show-length="true"
        :collapsed-strings-length="50"
      />
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
      lastUpdated: new Date(versionInfo.lastUpdated).toLocaleString()
    }
  },
  methods: {
    parseJson(): void {
      try {
        this.error = ''
        const jsonData = JSON.parse(this.jsonInput)
        this.parsedJson = this.processObject(jsonData)
      } catch (err) {
        this.error = 'Invalid JSON format'
        this.parsedJson = null
      }
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
      
      // Try to parse as JSON first
      const parsedJson = this.tryParseJson(value)
      if (parsedJson) {
        return this.processObject(parsedJson)
      }
      
      // Then try base64
      if (this.isBase64(value)) {
        try {
          const decoded = atob(value)
          // Try to parse the decoded value as JSON first
          const parsed = this.tryParseJson(decoded)
          if (parsed) {
            return this.processObject(parsed)
          }
          // If not JSON, recursively process the decoded string
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
    }
  }
})
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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