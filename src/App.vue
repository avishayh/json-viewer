/* Share link button styles */
.share-link-button {
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}
.share-link-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}
.share-link-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
  color: var(--text-secondary);
}
<template>
  <div class="app-container">
    <HistorySidebar
      :history="history"
      :get-history-title="getHistoryTitle"
      :format-timestamp="formatTimestamp"
      :get-preview="getPreview"
      @load="handleHistorySelect"
      @remove="removeFromHistory"
      @clear="clearHistory"
    />
    <div class="main-content">
      <div class="header">
        <div class="title-section">
          <h1>JSON Viewer</h1>
        </div>
        <div class="header-actions">
          <div class="action-buttons">
            <div class="examples-dropdown" @click="showExamples = !showExamples">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              <div v-if="showExamples" class="examples-popup">
                <div class="examples-content">
                  <h3>Load Examples</h3>
                  <button
                    v-for="example in examples"
                    :key="example.name"
                    @click="handleExampleLoad(JSON.stringify(example.data)); showExamples = false"
                    class="example-menu-button"
                    :title="`Load ${example.name} example`"
                  >
                    {{ example.name.toUpperCase() }}
                  </button>
                </div>
              </div>
            </div>
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
                  <p v-if="version">Version: {{ version }}</p>
                  <p v-else>Loading version...</p>
                  
                  <!-- Version Navigation -->
                  <div v-if="!isDev" class="version-navigation">
                    <!-- Always show current version status -->
                    <div v-if="latestVersion" class="version-links">
                      <p class="version-info">
                        <span v-if="!currentVersion || currentVersion === latestVersion">
                          You're viewing the latest version ({{ latestVersion }})
                        </span>
                        <span v-else>
                          You're viewing version {{ currentVersion }} (latest is {{ latestVersion }})
                        </span>
                      </p>
                    </div>
                    
                    <!-- Show "Go to Latest" when on older version -->
                    <div v-if="currentVersion && latestVersion && currentVersion !== latestVersion" class="version-links">
                      <a :href="getLatestUrl()" class="version-link latest-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="9,11 12,14 22,4"></polyline>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                        Go to Latest ({{ latestVersion }})
                      </a>
                    </div>
                    
                    <!-- Show "Previous Version" when on latest and previous exists -->
                    <div v-if="previousVersion && (!currentVersion || currentVersion === latestVersion)" class="version-links">
                      <a :href="getVersionUrl(previousVersion)" class="version-link previous-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                        Previous Version ({{ previousVersion }})
                      </a>
                    </div>
                    

                  </div>
                  
                  <!-- Development Mode Indicator -->
                  <div v-if="isDev" class="version-navigation">
                    <div class="version-links">
                      <p class="version-info">Development Mode</p>
                      <div class="version-link dev-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        Version navigation available in production
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-section">
        <div class="input-controls">
          <textarea
            v-model="jsonInput"
            placeholder="Paste your JSON here..."
            rows="4"
          ></textarea>
          <div class="controls-row">
            <div class="button-group">
              <button @click="handleParseJson" :disabled="!safeJsonInput.trim()" class="parse-button">
                Parse JSON
              </button>
              <button @click="handleShareLink" :title="shareButtonTitle" class="icon-button share-url-btn" :disabled="!safeJsonInput.trim()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </button>
              <button @click="clearInput" :disabled="!safeJsonInput.trim()" class="clear-button" title="Clear input">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
            <transition name="fade">
              <div v-if="shareStatus === 'copied' || shareStatus === 'shortened' || shareStatus === 'toolong'" class="share-copied-msg">
                <span v-if="shareStatus === 'copied'">Link copied!</span>
                <span v-else-if="shareStatus === 'shortened'">Shortened link copied!</span>
                <span v-else-if="shareStatus === 'toolong'">JSON too large to share as URL</span>
              </div>
            </transition>
          </div>
        </div>
      </div>
      
      <div v-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-if="parsedJson" class="content-wrapper">
        <div class="json-section">
          <PatternTabs 
            :json="parsedJson"
            :raw-json="rawJson"
            :highlight-path="highlightedPath"
            :get-original-value="getOriginalValue"
            :transform-enabled="transformEnabled"
            @load-payload="handleLoadPayload"
            @toggle-transform="handleTransformToggle"
          />
        </div>
        <TransformedValuesPanel
          :transformed-values="transformedValues"
          :transform-enabled="transformEnabled"
          @select-path="handlePathSelect"
          @toggle-transform="handleTransformToggle"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { copyToClipboard, compressJsonForUrl, decompressJsonFromUrl, isCompressedUrlTooLong } from './composables/useClipboardAndShortUrl'

const shareStatus = ref<'idle' | 'copied' | 'shortened' | 'error' | 'toolong'>('idle')
const shareButtonTitle = computed(() => {
  if (shareStatus.value === 'copied') return 'Link copied to clipboard!'
  if (shareStatus.value === 'shortened') return 'Shortened link copied!'
  if (shareStatus.value === 'error') return 'Error copying link'
  return 'Copy shareable link to clipboard'
})

// Defensive: avoid errors if jsonInput is null
const safeJsonInput = computed(() => jsonInput.value || '')


async function handleShareLink() {
  shareStatus.value = 'idle'
  try {
    if (isCompressedUrlTooLong(jsonInput.value)) {
      shareStatus.value = 'toolong'
      setTimeout(() => shareStatus.value = 'idle', 2000)
      return
    }
    // Compress JSON for URL
    const compressed = compressJsonForUrl(jsonInput.value)
    const baseUrl = window.location.origin + window.location.pathname
    const url = `${baseUrl}?json=${compressed}`
    await copyToClipboard(url)
    shareStatus.value = 'copied'
    setTimeout(() => shareStatus.value = 'idle', 2000)
  } catch (err) {
    shareStatus.value = 'error'
    setTimeout(() => shareStatus.value = 'idle', 2000)
    console.error('Share link error:', err)
  }
}
import { useJsonProcessor } from './composables/useJsonProcessor'
import { useHistory } from './composables/useHistory'
import { useTheme } from './composables/useTheme'
import TransformedValuesPanel from './components/TransformedValuesPanel.vue'
import PatternTabs from './components/PatternTabs/PatternTabs.vue'
import HistorySidebar from './components/HistorySidebar.vue'
import dsseExample from './examples/dsse.json'
import sigstoreExample from './examples/sigstore.json'
import intotoExample from './examples/intoto.json'
import transformationsExample from './examples/transformations.json'

interface Example {
  name: string
  data: any
}

const jsonInput = ref('')
const highlightedPath = ref<string | undefined>(undefined)
const showAbout = ref(false)
const showExamples = ref(false)
const version = ref<string | null>(null)
const latestVersion = ref<string | null>(null)

// Version navigation logic
const currentVersion = computed(() => {
  // Check if we're on a versioned path
  const path = window.location.pathname
  const versionMatch = path.match(/\/v\/(\d+\.\d+)/)
  return versionMatch ? versionMatch[1] : null
})

const isDev = computed(() => import.meta.env.DEV)

const isOnLatestVersion = computed(() => {
  // In development mode, always consider it latest
  if (isDev.value) {
    return true
  }
  return !currentVersion.value || currentVersion.value === latestVersion.value
})

const previousVersion = computed(() => {
  if (!latestVersion.value) return null
  
  const [latestMajor, latestMinor] = latestVersion.value.split('.').map(Number)
  
  // If we're on the latest version (no currentVersion or currentVersion === latestVersion)
  // Show the previous version (latestMinor - 1)
  if (!currentVersion.value || currentVersion.value === latestVersion.value) {
    if (latestMinor > 1) {
      return `${latestMajor}.${latestMinor - 1}`
    }
    return null
  }
  
  // If we're on an older version, show the next newer version
  const [currentMajor, currentMinor] = currentVersion.value.split('.').map(Number)
  if (currentMajor === latestMajor && currentMinor < latestMinor) {
    return `${currentMajor}.${currentMinor + 1}`
  }
  
  return null
})

const getVersionUrl = (version: string) => {
  const baseUrl = window.location.origin + window.location.pathname
  // Extract the base path (e.g., /json-viewer/) from the current URL
  const basePath = baseUrl.replace(/\/v\/\d+\.\d+.*$/, '').replace(/\/latest.*$/, '')
  return `${basePath}/v/${version}/`
}

const getLatestUrl = () => {
  const baseUrl = window.location.origin + window.location.pathname
  // Extract the base path (e.g., /json-viewer/) from the current URL
  const basePath = baseUrl.replace(/\/v\/\d+\.\d+.*$/, '').replace(/\/latest.*$/, '')
  return `${basePath}/latest/`
}

const examples = ref<Example[]>([
  { name: 'dsse', data: dsseExample },
  { name: 'sigstore', data: sigstoreExample },
  { name: 'intoto', data: intotoExample },
  { name: 'transformations', data: transformationsExample }
])

const { toggleTheme, isDarkTheme } = useTheme()
const { history, loadHistory, addToHistory, removeFromHistory, clearHistory, getPreview, formatTimestamp, getHistoryTitle } = useHistory()

// Transformation toggle state for the app
const transformKey = 'json_viewer_transform_enabled'
const transformEnabled = ref(true)
if (localStorage.getItem(transformKey) !== null) {
  transformEnabled.value = localStorage.getItem(transformKey) === 'true'
}
function handleTransformToggle(val: boolean) {
  transformEnabled.value = val
  // Persist to localStorage
  localStorage.setItem(transformKey, String(val))
  // Re-parse JSON to update view
  parseJson(jsonInput.value)
}

const {
  parsedJson,
  rawJson,
  error,
  parseJson,
  transformedValues,
  getOriginalValue
} = useJsonProcessor(transformEnabled)


onMounted(() => {

  loadHistory()
  // Version check for cache busting
  fetch('version.json')
    .then(res => res.json())
    .then(data => {
      version.value = data.version || null
      const prevVersion = localStorage.getItem('app_version')
      if (prevVersion && prevVersion !== data.version) {
        localStorage.setItem('app_version', data.version)
        window.location.reload()
      } else {
        localStorage.setItem('app_version', data.version)
      }
    })
    .catch(() => {
      version.value = null
    })

  // Fetch latest version for navigation
  const fetchLatestVersion = async () => {
    try {
      // Try to fetch from current path + version.json first (production)
      const res = await fetch('./version.json')
      if (res.ok) {
        const data = await res.json()
        latestVersion.value = data.version || null
        return
      }
    } catch (error) {
      console.log('Could not fetch from ./version.json')
    }
    
    try {
      // Fallback to /latest/version.json (production)
      const res = await fetch('/latest/version.json')
      if (res.ok) {
        const data = await res.json()
        latestVersion.value = data.version || null
        return
      }
    } catch (error) {
      console.log('Could not fetch from /latest/version.json')
    }
    
    try {
      // Fallback to root version.json (development)
      const res = await fetch('/version.json')
      if (res.ok) {
        const data = await res.json()
        latestVersion.value = data.version || null
        return
      }
    } catch (error) {
      console.log('Could not fetch from /version.json')
    }
    
    // Final fallback - use current version as latest in dev mode
    if (version.value && version.value !== 'dev') {
      latestVersion.value = version.value
    } else {
      latestVersion.value = 'dev'
    }
  }
  
  fetchLatestVersion().then(() => {
    console.log('Version info loaded:', {
      currentVersion: currentVersion.value,
      latestVersion: latestVersion.value,
      previousVersion: previousVersion.value,
      isOnLatestVersion: isOnLatestVersion.value,
      isDev: isDev.value,
      pathname: window.location.pathname,
      hostname: window.location.hostname
    })
  })

  // Add click outside handler to close popups
  document.addEventListener('click', handleClickOutside)

  // Check for ?json= param and load if present
  const params = new URLSearchParams(window.location.search)
  const jsonParam = params.get('json')
  if (jsonParam) {
    try {
      const decoded = decompressJsonFromUrl(jsonParam)
      jsonInput.value = decoded
      parseJson(decoded)
    } catch (err) {
      // ignore
      console.error('Decompression error:', err)
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  
  // Check if click is outside examples dropdown
  if (!target.closest('.examples-dropdown')) {
    showExamples.value = false
  }
  
  // Check if click is outside about popup
  if (!target.closest('.about-icon')) {
    showAbout.value = false
  }
}

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

const handleExampleLoad = (json: string) => {
  jsonInput.value = json
  parseJson(json)
}

const getThemeTitle = () => {
  return isDarkTheme() ? 'Switch to Light Theme' : 'Switch to Dark Theme'
}

const clearInput = () => {
  console.log('Before clear:', {
    jsonInput: jsonInput.value,
    parsedJson: parsedJson.value,
  });
  
  jsonInput.value = '';
  parseJson('');
  highlightedPath.value = undefined;
  error.value = ''; // Reset error state
  
  console.log('After clear:', {
    jsonInput: jsonInput.value,
    parsedJson: parsedJson.value,
  });
};

const handleLoadPayload = async (payload: string) => {
  jsonInput.value = payload
  await parseJson(payload)
  // Wait for next tick to ensure pattern recognition is complete
  await nextTick()
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
  --bg-hover: #f1f5f9;
  --success-color: #10b981;
  --success-hover: #059669;
  --bg-secondary: #f8fafc;
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
  --bg-hover: #44475a;
  --success-color: #50fa7b;
  --success-hover: #69ff94;
  --bg-secondary: #1e1f29;
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
  padding: 0;
  overflow-y: auto;
  background-color: var(--surface-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  height: 48px;
  box-sizing: border-box;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
}

.title-section h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle,
.about-icon {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.theme-toggle:hover,
.about-icon:hover {
  background-color: var(--bg-hover);
}

.about-icon {
  position: relative;
}

.about-popup {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.about-content {
  padding: 1rem;
  min-width: 250px;
}

.version-navigation {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.version-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.version-info {
  margin: 0 0 0.5rem 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

.version-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--bg-hover);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  text-decoration: none;
  color: var(--text-primary);
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.version-link:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.version-link svg {
  flex-shrink: 0;
}

.latest-link {
  background-color: var(--success-color);
  border-color: var(--success-color);
  color: white;
}

.latest-link:hover {
  background-color: var(--success-hover);
  border-color: var(--success-hover);
}

.previous-link {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
}

.previous-link:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.dev-link {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-secondary);
  cursor: default;
}

.dev-link:hover {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-secondary);
  transform: none;
}

.examples-dropdown {
  position: relative;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.examples-dropdown:hover {
  background-color: var(--bg-hover);
}

.examples-popup {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.examples-content {
  padding: 1rem;
  min-width: 200px;
}

.examples-content h3 {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.example-menu-button {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: var(--primary-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  color: white;
  margin-bottom: 0.5rem;
  text-align: left;
}

.example-menu-button:last-child {
  margin-bottom: 0;
}

.example-menu-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.example-menu-button:active {
  transform: translateY(0);
}

.input-section {
  padding: 1rem;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
}

.input-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-controls textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--surface-color);
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s;
}

.input-controls textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.parse-button,
.clear-button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.parse-button {
  background-color: var(--primary-color);
  color: white;
}

.parse-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.parse-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
  color: var(--text-secondary);
}

.clear-button {
  background-color: var(--surface-color);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.clear-button:hover:not(:disabled) {
  background-color: var(--background-color);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.clear-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  color: var(--error-color);
  margin: 1rem;
  padding: 1rem;
  background-color: var(--error-bg);
  border-radius: 8px;
  border: 1px solid var(--error-color);
  font-size: 0.875rem;
}

.content-wrapper {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 300px);
}

.json-section {
  flex: 1;
  overflow: auto;
  background-color: var(--surface-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.input-section {
  padding: 1rem;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
}

.input-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-controls textarea {
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
  background-color: var(--surface-color);
  color: var(--text-primary);
  resize: vertical;
  transition: border-color 0.2s;
}

.input-controls textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-controls textarea::placeholder {
  color: var(--text-secondary);
}

.controls-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.parse-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.parse-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.parse-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
  color: var(--text-secondary);
}

.clear-button {
  padding: 0.5rem;
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-button:hover:not(:disabled) {
  background-color: var(--bg-hover);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.clear-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  color: var(--error-color);
  margin: 1rem;
  padding: 1rem;
  background-color: var(--error-bg);
  border-radius: 8px;
  border: 1px solid var(--error-color);
  font-size: 0.875rem;
}

.content-wrapper {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 300px);
}

.json-section {
  flex: 1;
  overflow: auto;
  background-color: var(--surface-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

/* Icon button for share url */
.icon-button.share-url-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
.icon-button.share-url-btn:hover:not(:disabled) {
  background-color: var(--bg-hover);
  color: var(--primary-hover);
}
.icon-button.share-url-btn:disabled {
  color: var(--border-color);
  cursor: not-allowed;
}

.share-copied-msg {
  margin-left: 1rem;
  color: var(--primary-color);
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
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

.share-url-warning {
  color: var(--error-color);
  font-size: 0.95rem;
  margin-left: 1rem;
  font-weight: 500;
}
</style>