<template>
  <div class="sigstore-view">
    <div class="metadata-section">
      <h3>Sigstore Bundle Metadata</h3>
      <div class="metadata-grid">
        <div class="metadata-item">
          <span class="label">Media Type:</span>
          <span class="value">{{ patternInfo.metadata.mediaType }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">TLog Entries:</span>
          <span class="value">{{ patternInfo.metadata.tlogEntryCount }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Certificate Chain:</span>
          <span class="value" :class="{ 'has-value': patternInfo.metadata.hasCertificateChain }">
            {{ patternInfo.metadata.hasCertificateChain ? 'Present' : 'Not Present' }}
          </span>
        </div>
        <div class="metadata-item">
          <span class="label">Signed Timestamp:</span>
          <span class="value" :class="{ 'has-value': patternInfo.metadata.hasTimestamp }">
            {{ patternInfo.metadata.hasTimestamp ? 'Present' : 'Not Present' }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="!hasDsseEnvelope" class="content-section">
      <h3>Content</h3>
      <div class="content-type">
        <span class="label">Type:</span>
        <span class="value">{{ contentType }}</span>
      </div>
      <div class="content-preview">
        <pre><code>{{ formattedContent }}</code></pre>
      </div>
    </div>

    <div v-else class="content-section">
      <button @click="viewDsseContent" class="action-button">
        View DSSE Content
      </button>
    </div>

    <div class="verification-section" v-if="patternInfo.metadata.hasVerificationMaterial">
      <h3>Verification Material</h3>
      <div class="verification-content">
        <pre><code>{{ formattedVerification }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PatternInfo } from '../../composables/patternRecognizer'

interface SigstoreMetadata {
  mediaType?: string
  tlogEntryCount?: number
  hasCertificateChain?: boolean
  hasRekorEntry?: boolean
  hasBundle?: boolean
  hasProducts?: boolean
  hasTimestamp?: boolean
  hasVerificationMaterial?: boolean
}

const props = defineProps<{
  json: any
  patternInfo: PatternInfo & { metadata: SigstoreMetadata }
}>()

const emit = defineEmits<{
  (e: 'load-payload', payload: string): void
}>()

const contentType = computed(() => {
  if (props.json.content?.messageSignature) return 'Message Signature'
  if (props.json.content?.dsseEnvelope) return 'DSSE Envelope'
  if (props.json.dsseEnvelope) return 'DSSE Envelope'
  if (props.json.content?.bundle) return 'Bundle'
  return 'Unknown'
})

const hasDsseEnvelope = computed(() => {
  return !!props.json.dsseEnvelope || !!props.json.content?.dsseEnvelope
})

const viewDsseContent = () => {
  const dsseEnvelope = props.json.dsseEnvelope || props.json.content?.dsseEnvelope
  if (dsseEnvelope) {
    emit('load-payload', JSON.stringify(dsseEnvelope))
  }
}

const formattedContent = computed(() => {
  try {
    const content = props.json.content?.messageSignature || 
                   props.json.content?.dsseEnvelope || 
                   props.json.dsseEnvelope ||
                   props.json.content?.bundle
    if (!content) return 'No content available'

    // If it's a DSSE envelope, try to decode the payload
    if (props.json.dsseEnvelope?.payload || props.json.content?.dsseEnvelope?.payload) {
      const payload = props.json.dsseEnvelope?.payload || props.json.content?.dsseEnvelope?.payload
      try {
        // First try to parse as JSON directly
        try {
          const parsed = JSON.parse(payload)
          return JSON.stringify(parsed, null, 2)
        } catch {
          // If not valid JSON, try base64 decoding
          try {
            // Check if the string is base64 encoded
            const isBase64 = /^[A-Za-z0-9+/=]+$/.test(payload)
            if (!isBase64) {
              return payload
            }

            const decoded = decodeURIComponent(escape(atob(payload)))
            try {
              // Try to parse as JSON
              const parsed = JSON.parse(decoded)
              return JSON.stringify(parsed, null, 2)
            } catch {
              // If not valid JSON, return the decoded string
              return decoded
            }
          } catch (e) {
            console.error('Error decoding DSSE payload:', e)
            return payload
          }
        }
      } catch (e) {
        console.error('Error processing DSSE payload:', e)
        return 'Unable to process DSSE payload'
      }
    }

    // For message signatures, try to decode the message
    if (props.json.content?.messageSignature?.message) {
      try {
        // First try to parse as JSON directly
        try {
          const parsed = JSON.parse(props.json.content.messageSignature.message)
          return JSON.stringify(parsed, null, 2)
        } catch {
          // If not valid JSON, try base64 decoding
          try {
            // Check if the string is base64 encoded
            const isBase64 = /^[A-Za-z0-9+/=]+$/.test(props.json.content.messageSignature.message)
            if (!isBase64) {
              return props.json.content.messageSignature.message
            }

            const decoded = decodeURIComponent(escape(atob(props.json.content.messageSignature.message)))
            try {
              // Try to parse as JSON
              const parsed = JSON.parse(decoded)
              return JSON.stringify(parsed, null, 2)
            } catch {
              // If not valid JSON, return the decoded string
              return decoded
            }
          } catch (e) {
            console.error('Error decoding message:', e)
            return props.json.content.messageSignature.message
          }
        }
      } catch (e) {
        console.error('Error processing message:', e)
        return 'Unable to process message'
      }
    }

    // For bundle content
    if (props.json.content?.bundle) {
      return JSON.stringify(props.json.content.bundle, null, 2)
    }

    return JSON.stringify(content, null, 2)
  } catch (e) {
    console.error('Error formatting content:', e)
    return 'Unable to format content'
  }
})

const formattedVerification = computed(() => {
  try {
    if (!props.json.verificationMaterial) return 'No verification material available'
    return JSON.stringify(props.json.verificationMaterial, null, 2)
  } catch (e) {
    console.error('Error formatting verification material:', e)
    return 'Unable to format verification material'
  }
})
</script>

<style scoped>
.sigstore-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  overflow: auto;
  padding: 1rem;
}

.metadata-section,
.content-section,
.verification-section {
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 1rem 0;
  color: var(--text-color);
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
  padding: 0.75rem;
  background-color: var(--bg-primary);
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.value {
  font-family: monospace;
  word-break: break-all;
  color: var(--text-color);
  font-size: 0.95rem;
}

.value.has-value {
  color: var(--success-color);
  font-weight: 500;
}

.content-type {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: var(--bg-primary);
  border-radius: 4px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.content-preview,
.verification-content {
  background-color: var(--bg-primary);
  border-radius: 4px;
  padding: 1rem;
  overflow: auto;
  border: 1px solid var(--border-color);
  max-height: 400px;
}

pre {
  margin: 0;
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 0.95rem;
  line-height: 1.5;
}

code {
  color: var(--text-color);
}

.content-section {
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button {
  width: 100%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-button:hover {
  background-color: var(--primary-hover);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 