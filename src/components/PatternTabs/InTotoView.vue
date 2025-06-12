<template>
  <div class="in-toto-view">
    <div class="metadata-section">
      <h3>In-toto Metadata</h3>
      <div class="metadata-grid">
        <div class="metadata-item">
          <span class="label">Statement Type:</span>
          <span class="value">{{ (patternInfo.metadata as InTotoMetadata).statementType }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Subject Count:</span>
          <span class="value">{{ (patternInfo.metadata as InTotoMetadata).subjectCount }}</span>
        </div>
        <div class="metadata-item" v-if="(patternInfo.metadata as InTotoMetadata).subjectName">
          <span class="label">Subject Name:</span>
          <span class="value">{{ (patternInfo.metadata as InTotoMetadata).subjectName }}</span>
        </div>
        <div class="metadata-item" v-if="(patternInfo.metadata as InTotoMetadata).digest">
          <span class="label">Digest:</span>
          <span class="value">{{ (patternInfo.metadata as InTotoMetadata).digest }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Predicate Type:</span>
          <span class="value">{{ (patternInfo.metadata as InTotoMetadata).predicateType }}</span>
        </div>
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

    <div class="predicate-section">
      <h3>Predicate</h3>
      <div class="predicate-content">
        <pre><code>{{ formattedPredicate }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PatternInfo } from '../../composables/patternRecognizer'

interface InTotoMetadata {
  statementType?: string
  subjectCount?: number
  subjectName?: string
  digest?: string
  predicateType?: string
}

const props = defineProps<{
  json: any
  patternInfo: PatternInfo
}>()

const formattedPredicate = computed(() => {
  if (!props.json.predicate) return 'No predicate available'
  return JSON.stringify(props.json.predicate, null, 2)
})

const formatDigest = (digest: Record<string, string>) => {
  return Object.entries(digest)
    .map(([algo, value]) => `${algo}:${value.substring(0, 12)}...`)
    .join(', ')
}
</script>

<style scoped>
.in-toto-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  overflow: auto;
}

.metadata-section {
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

.subjects-section,
.predicate-section {
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.predicate-content {
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
</style> 