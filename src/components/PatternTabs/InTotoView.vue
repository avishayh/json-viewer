<template>
  <div class="intoto-view">
    <div class="metadata-section">
      <h3>In-toto Statement Metadata</h3>
      <div class="metadata-grid">
        <div class="metadata-item">
          <span class="label">Statement Type:</span>
          <span class="value">{{ patternInfo.metadata.statementType }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Subject Count:</span>
          <span class="value">{{ patternInfo.metadata.subjectCount }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Predicate Type:</span>
          <span class="value">{{ patternInfo.metadata.predicateType }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Materials:</span>
          <span class="value" :class="{ 'has-value': patternInfo.metadata.hasMaterials }">
            {{ patternInfo.metadata.hasMaterials ? 'Present' : 'Not Present' }}
          </span>
        </div>
        <div class="metadata-item">
          <span class="label">Products:</span>
          <span class="value" :class="{ 'has-value': patternInfo.metadata.hasProducts }">
            {{ patternInfo.metadata.hasProducts ? 'Present' : 'Not Present' }}
          </span>
        </div>
      </div>
    </div>

    <div class="content-section">
      <h3>Statement Content</h3>
      <div class="content-preview">
        <pre><code>{{ formattedContent }}</code></pre>
      </div>
    </div>

    <div class="subjects-section" v-if="json.subject?.length">
      <h3>Subjects</h3>
      <div class="subjects-list">
        <div v-for="(subject, index) in json.subject" :key="index" class="subject-item">
          <div class="subject-header">
            <span class="subject-name">{{ subject.name }}</span>
            <span class="subject-digest">Digest: {{ formatDigest(subject.digest) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="predicate-section" v-if="json.predicate">
      <h3>Predicate</h3>
      <div class="predicate-content">
        <pre><code>{{ formattedPredicate }}</code></pre>
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

const formattedContent = computed(() => {
  try {
    return JSON.stringify(props.json, null, 2)
  } catch (e) {
    console.error('Error formatting content:', e)
    return 'Unable to format content'
  }
})

const formattedPredicate = computed(() => {
  try {
    return JSON.stringify(props.json.predicate, null, 2)
  } catch (e) {
    console.error('Error formatting predicate:', e)
    return 'Unable to format predicate'
  }
})

const formatDigest = (digest: Record<string, string>) => {
  return Object.entries(digest)
    .map(([algo, value]) => `${algo}:${value.substring(0, 12)}...`)
    .join(', ')
}
</script>

<style scoped>
.intoto-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  overflow: auto;
  padding: 1rem;
}

.metadata-section,
.content-section,
.subjects-section,
.predicate-section {
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

.content-preview,
.predicate-content {
  background-color: var(--bg-primary);
  border-radius: 4px;
  padding: 1rem;
  overflow: auto;
  border: 1px solid var(--border-color);
  max-height: 400px;
}

.subjects-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.subject-item {
  background-color: var(--bg-primary);
  border-radius: 4px;
  padding: 1rem;
  border: 1px solid var(--border-color);
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.subject-name {
  font-weight: 500;
  color: var(--text-color);
}

.subject-digest {
  font-family: monospace;
  color: var(--text-secondary);
  font-size: 0.9rem;
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
</style> 