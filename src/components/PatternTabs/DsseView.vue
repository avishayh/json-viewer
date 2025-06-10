<template>
  <div class="dsse-view">
    <div class="metadata-section">
      <h3>DSSE Metadata</h3>
      <div class="metadata-grid">
        <div class="metadata-item">
          <span class="label">Payload Type:</span>
          <span class="value">{{ patternInfo.metadata.payloadType }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Signature Count:</span>
          <span class="value">{{ patternInfo.metadata.signatureCount }}</span>
        </div>
      </div>
    </div>

    <div class="signatures-section" v-if="patternInfo.metadata.signatures?.length">
      <h3>Signatures</h3>
      <div class="signature-list">
        <div v-for="(sig, index) in patternInfo.metadata.signatures" :key="index" class="signature-item">
          <div class="signature-header">
            <span class="signature-index">Signature #{{ index + 1 }}</span>
            <div class="keyid-container">
              <span class="keyid-label">Key ID:</span>
              <span class="keyid-value">{{ sig.keyid || 'N/A' }}</span>
            </div>
          </div>
          <div class="signature-details">
            <span class="cert-status" :class="{ 'has-cert': sig.hasCert }">
              {{ sig.hasCert ? 'Certificate Present' : 'No Certificate' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="payload-section">
      <h3>Payload</h3>
      <div class="payload-content">
        <pre><code>{{ formattedPayload }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PatternInfo } from '../../composables/usePatternRecognizer'

const props = defineProps<{
  json: any
  patternInfo: PatternInfo
}>()

const formattedPayload = computed(() => {
  try {
    // First try to decode the base64 payload
    const decodedPayload = decodeURIComponent(escape(atob(props.json.payload)))
    
    // Try to parse as JSON
    try {
      const jsonPayload = JSON.parse(decodedPayload)
      return JSON.stringify(jsonPayload, null, 2)
    } catch {
      // If not JSON, return the decoded string
      return decodedPayload
    }
  } catch (e) {
    console.error('Error decoding payload:', e)
    return 'Unable to decode payload'
  }
})
</script>

<style scoped>
.dsse-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  overflow: auto;
}

.metadata-section,
.signatures-section,
.payload-section {
  background-color: var(--bg-secondary);
  border-radius: 4px;
  padding: 1rem;
}

h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.value {
  font-family: monospace;
  word-break: break-all;
  color: var(--text-primary);
}

.signature-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.signature-item {
  background-color: var(--bg-primary);
  border-radius: 4px;
  padding: 1rem;
  border: 1px solid var(--border-color);
}

.signature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.signature-index {
  font-weight: 600;
  color: var(--text-primary);
}

.keyid-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.keyid-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.keyid-value {
  font-family: monospace;
  color: var(--text-primary);
}

.cert-status {
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: var(--bg-secondary);
}

.cert-status.has-cert {
  color: var(--success-color);
  background-color: var(--success-bg);
}

.payload-content {
  background-color: var(--bg-primary);
  border-radius: 4px;
  padding: 1rem;
  overflow: auto;
  border: 1px solid var(--border-color);
}

pre {
  margin: 0;
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}

code {
  color: var(--text-primary);
}
</style> 