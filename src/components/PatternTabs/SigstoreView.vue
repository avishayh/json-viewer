<template>
  <div class="sigstore-panel">
    <!-- Horizontal tabs taking full width -->
    <div class="panel-tabs">
      <button 
        v-for="tab in availableTabs" 
        :key="tab.key"
        :class="['panel-tab', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Full-height content area -->
    <div class="panel-content">
      <!-- Bundle Metadata Tab -->
      <div v-if="activeTab === 'metadata'" class="tab-content">
        <div class="metadata-section">
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
      </div>

      <!-- Verification Material Tab -->
      <div v-if="activeTab === 'verification'" class="tab-content">
        <div class="verification-section">
          <div class="verification-content">
            <pre><code>{{ formattedVerification }}</code></pre>
          </div>
        </div>
      </div>

      <!-- DSSE Envelope Tab -->
      <div v-if="activeTab === 'dsse'" class="tab-content">
        <div class="dsse-section">
          <SigstoreDsseSection :dsse-envelope="dsseEnvelope" />
        </div>
      </div>

      <!-- In-toto Statement Tab -->
      <div v-if="activeTab === 'intoto'" class="tab-content">
        <div class="intoto-section">
          <SigstoreInTotoSection 
            v-if="showInTotoSection" 
            :in-toto-data="inTotoData" 
          />
          <div v-else class="no-intoto">
            <p>In-toto statement not available. Enable transformations to view In-toto data.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SigstoreDsseSection from '../SigstoreDsseSection.vue'
import SigstoreInTotoSection from '../SigstoreInTotoSection.vue'
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
  transformEnabled: boolean
}>()

// Active tab state
const activeTab = ref('metadata')

// Available tabs based on data and settings
const availableTabs = computed(() => {
  const tabs = [
    { key: 'metadata', label: 'Metadata' }
  ]
  
  // Add Verification Material tab if it exists
  if (props.patternInfo.metadata.hasVerificationMaterial) {
    tabs.push({ key: 'verification', label: 'Verification Material' })
  }
  
  // Add DSSE tab if DSSE envelope exists
  if (hasDsseEnvelope.value) {
    tabs.push({ key: 'dsse', label: 'DSSE Envelope' })
  }
  
  // Add In-toto tab if transformations enabled and data exists
  if (props.transformEnabled && showInTotoSection.value) {
    tabs.push({ key: 'intoto', label: 'In-toto Statement' })
  }
  
  return tabs
})

// Extract DSSE envelope from Sigstore bundle
const dsseEnvelope = computed(() => {
  return props.json.dsseEnvelope || props.json.content?.dsseEnvelope
})

const hasDsseEnvelope = computed(() => {
  return !!dsseEnvelope.value
})

// In-toto data extraction
const inTotoData = computed(() => {
  if (!dsseEnvelope.value?.payload) return null
  
  const rawPayload = dsseEnvelope.value.payload
  let parsedPayload = null
  
  // Check if payload is already an object
  if (typeof rawPayload === 'object' && rawPayload !== null) {
    parsedPayload = rawPayload
  } else if (typeof rawPayload === 'string') {
    // Try to parse as JSON first
    try {
      parsedPayload = JSON.parse(rawPayload)
    } catch {
      // If JSON parsing fails, try base64 decoding
      try {
        const decoded = atob(rawPayload)
        parsedPayload = JSON.parse(decoded)
      } catch {
        // Try with decodeURIComponent fallback
        try {
          const decoded = decodeURIComponent(escape(atob(rawPayload)))
          parsedPayload = JSON.parse(decoded)
        } catch {
          return null
        }
      }
    }
  }
  
  // Check if it's an In-toto statement
  if (parsedPayload?._type === 'https://in-toto.io/Statement/v1') {
    return parsedPayload
  }
  
  return null
})

// Show In-toto section condition
const showInTotoSection = computed(() => {
  return props.transformEnabled && inTotoData.value !== null
})

// Format verification material
const formattedVerification = computed(() => {
  const verificationMaterial = props.json.verificationMaterial
  if (!verificationMaterial) return 'No verification material available'
  return JSON.stringify(verificationMaterial, null, 2)
})
</script>

<style scoped>
.sigstore-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.panel-tabs {
  display: flex;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  border-radius: 4px 4px 0 0;
}

.panel-tab {
  flex: 1;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 0;
  white-space: nowrap;
}

.panel-tab:hover {
  background-color: var(--bg-hover);
  color: var(--text-primary);
}

.panel-tab.active {
  color: var(--text-primary);
  border-bottom-color: var(--primary-color);
  background-color: var(--bg-primary);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  background-color: var(--bg-primary);
  border-radius: 0 0 4px 4px;
}

.tab-content {
  height: 100%;
  padding: 1.5rem;
}

.metadata-section,
.verification-section,
.dsse-section,
.intoto-section {
  height: 100%;
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

.value.has-value {
  color: var(--success-color);
}

.verification-content {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1.5rem;
}

.verification-content pre {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-primary);
}

.verification-content code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.no-intoto {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-secondary);
  font-style: italic;
  font-size: 1.1rem;
}
</style> 