<template>
  <div class="dsse-content">
    <!-- DSSE Metadata Grid -->
    <div class="dsse-metadata">
      <div class="metadata-grid">
        <div class="metadata-item">
          <span class="label">Payload Type:</span>
          <span class="value">{{ payloadType }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Signature Count:</span>
          <span class="value">{{ signatureCount }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Digest:</span>
          <span class="value">{{ digest }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Subject Name:</span>
          <span class="value">{{ subjectName }}</span>
        </div>
      </div>
    </div>

    <!-- Signatures -->
    <div class="signatures-section">
      <h4>Signatures ({{ signatureCount }})</h4>
      <div class="signatures-list">
        <div v-for="(signature, index) in signatures" :key="index" class="signature-item">
          <div class="signature-header">
            <span class="signature-title">Signature {{ index + 1 }}</span>
          </div>
          <div class="signature-details">
            <div class="detail-item">
              <span class="label">Signature:</span>
              <span class="value">{{ signature.sig?.substring(0, 50) }}...</span>
            </div>
            <div class="detail-item">
              <span class="label">Key ID:</span>
              <span class="value">{{ signature.keyid?.substring(0, 20) }}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payload Preview -->
    <div class="payload-section">
      <h4>Payload Preview</h4>
      <div class="payload-content">
        <pre><code>{{ formattedPayload }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  dsseEnvelope: any
}

const props = defineProps<Props>()

const payloadType = computed(() => {
  return props.dsseEnvelope?.payloadType || 'Unknown'
})

const signatureCount = computed(() => {
  return props.dsseEnvelope?.signatures?.length || 0
})

const signatures = computed(() => {
  return props.dsseEnvelope?.signatures || []
})

const digest = computed(() => {
  // Extract digest from payload or signatures
  const firstSignature = signatures.value[0]
  return firstSignature?.keyid?.substring(0, 20) + '...' || 'Unknown'
})

const subjectName = computed(() => {
  // Try to extract subject name from payload
  try {
    const payload = props.dsseEnvelope?.payload
    if (typeof payload === 'object' && payload?.subject?.[0]?.name) {
      return payload.subject[0].name
    }
    return 'Unknown'
  } catch {
    return 'Unknown'
  }
})

const formattedPayload = computed(() => {
  const payload = props.dsseEnvelope?.payload
  if (!payload) return 'No payload available'
  
  try {
    if (typeof payload === 'object') {
      return JSON.stringify(payload, null, 2)
    } else if (typeof payload === 'string') {
      // Try to parse and format
      const parsed = JSON.parse(payload)
      return JSON.stringify(parsed, null, 2)
    }
    return String(payload)
  } catch {
    return String(payload)
  }
})
</script>

<style scoped>
.dsse-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dsse-metadata {
  margin-bottom: 1rem;
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

.signatures-section h4,
.payload-section h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.signatures-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.signature-item {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.signature-header {
  padding: 1rem;
  background-color: var(--bg-hover);
  border-bottom: 1px solid var(--border-color);
}

.signature-title {
  font-weight: 600;
  color: var(--text-primary);
}

.signature-details {
  padding: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.detail-item:last-child {
  border-bottom: none;
}

.payload-content {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
}

.payload-content pre {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-primary);
}

.payload-content code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
