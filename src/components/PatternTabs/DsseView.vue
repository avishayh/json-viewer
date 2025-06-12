<template>
  <div class="dsse-view">
    <div class="metadata-section">
      <h3>DSSE Metadata</h3>
      <div class="metadata-grid">
        <div class="metadata-item">
          <span class="label">Payload Type:</span>
          <span class="value">{{ (patternInfo.metadata as DsseMetadata).payloadType }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Signature Count:</span>
          <span class="value">{{ (patternInfo.metadata as DsseMetadata).signatureCount }}</span>
        </div>
        <div class="metadata-item" v-if="(patternInfo.metadata as DsseMetadata).digest">
          <span class="label">Digest:</span>
          <span class="value">{{ (patternInfo.metadata as DsseMetadata).digest }}</span>
        </div>
        <div class="metadata-item" v-if="(patternInfo.metadata as DsseMetadata).subjectName">
          <span class="label">Subject:</span>
          <span class="value">{{ (patternInfo.metadata as DsseMetadata).subjectName }}</span>
        </div>
      </div>
    </div>

    <div class="signatures-section" v-if="(patternInfo.metadata as DsseMetadata).signatures?.length">
      <h3>Signatures</h3>
      <div class="signature-list">
        <div v-for="(sig, index) in (patternInfo.metadata as DsseMetadata).signatures" :key="index" class="signature-item">
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

    <div v-if="isInTotoPayload" class="in-toto-section">
      <button @click="loadInTotoPayload" class="load-button">
        View In-toto Statement
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PatternInfo } from '../../composables/patternRecognizer'

interface DsseMetadata {
  payloadType?: string
  signatureCount?: number
  digest?: string
  subjectName?: string
  predicate?: any
  signatures?: Array<{
    keyid?: string
    hasCert?: boolean
  }>
}

const props = defineProps<{
  json: any
  patternInfo: PatternInfo
}>()

const emit = defineEmits<{
  (e: 'load-payload', payload: string): void
}>()

const isInTotoPayload = computed(() => {
  const metadata = props.patternInfo.metadata as DsseMetadata
  return metadata.payloadType === 'application/vnd.in-toto+json'
})

const loadInTotoPayload = () => {
  if (!props.json.payload) return

  try {
    // If payload is already an object, stringify it
    if (typeof props.json.payload === 'object') {
      emit('load-payload', JSON.stringify(props.json.payload, null, 2))
      return
    }

    // If payload is a string, try to parse it
    if (typeof props.json.payload === 'string') {
      try {
        // First try to parse as JSON
        const parsed = JSON.parse(props.json.payload)
        emit('load-payload', JSON.stringify(parsed, null, 2))
        return
      } catch {
        // If not valid JSON, try base64 decoding
        try {
          // Handle URL-safe base64
          const base64 = props.json.payload.replace(/-/g, '+').replace(/_/g, '/')
          const decoded = atob(base64)
          try {
            // Try to parse as JSON after decoding
            const parsed = JSON.parse(decoded)
            emit('load-payload', JSON.stringify(parsed, null, 2))
          } catch {
            // If not valid JSON, emit the decoded string
            emit('load-payload', decoded)
          }
        } catch (e) {
          console.error('Error decoding payload:', e)
          // If base64 decoding fails, try to use the original payload
          emit('load-payload', props.json.payload)
        }
      }
    }
  } catch (e) {
    console.error('Error processing payload:', e)
    emit('load-payload', JSON.stringify(props.json.payload, null, 2))
  }
}
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
.in-toto-section {
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

.load-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
}

.load-button:hover {
  background-color: var(--primary-hover);
}
</style> 