<template>
  <div class="intoto-content">
    <!-- In-toto Metadata Grid -->
    <div class="intoto-metadata">
      <div class="metadata-grid">
        <div class="metadata-item">
          <span class="label">Statement Type:</span>
          <span class="value">{{ statementType }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Subject Count:</span>
          <span class="value">{{ subjectCount }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Subject Name:</span>
          <span class="value">{{ subjectName }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Digest:</span>
          <span class="value">{{ digest }}</span>
        </div>
        <div class="metadata-item">
          <span class="label">Predicate Type:</span>
          <span class="value">{{ predicateType }}</span>
        </div>
      </div>
    </div>

    <!-- Subjects -->
    <div class="subjects-section">
      <h4>Subjects ({{ subjectCount }})</h4>
      <div class="subjects-list">
        <div v-for="(subject, index) in inTotoData.subject" :key="index" class="subject-item">
          <div class="subject-header">
            <span class="subject-title">Subject {{ index + 1 }}</span>
          </div>
          <div class="subject-details">
            <div class="detail-item">
              <span class="label">Name:</span>
              <span class="value">{{ subject.name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">SHA256:</span>
              <span class="value">{{ subject.digest?.sha256?.substring(0, 20) }}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Predicate -->
    <div class="predicate-section">
      <h4>Predicate Content</h4>
      <div class="predicate-content">
        <pre><code>{{ formattedPredicate }}</code></pre>
      </div>
      <div class="scroll-indicator" v-if="formattedPredicate.length > 500">
        <span>📜 Scroll to see full predicate content ({{ formattedPredicate.length }} characters)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  inTotoData: any
}

const props = defineProps<Props>()

const statementType = computed(() => {
  return props.inTotoData?._type || 'Unknown'
})

const subjectCount = computed(() => {
  return props.inTotoData?.subject?.length || 0
})

const subjectName = computed(() => {
  return props.inTotoData?.subject?.[0]?.name || 'Unknown'
})

const digest = computed(() => {
  return props.inTotoData?.subject?.[0]?.digest?.sha256?.substring(0, 20) + '...' || 'Unknown'
})

const predicateType = computed(() => {
  return props.inTotoData?.predicateType || 'Unknown'
})

const formattedPredicate = computed(() => {
  if (!props.inTotoData?.predicate) return 'No predicate available'
  return JSON.stringify(props.inTotoData.predicate, null, 2)
})
</script>

<style scoped>
.intoto-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.intoto-metadata {
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

.subjects-section h4,
.predicate-section h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.subjects-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subject-item {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.subject-header {
  padding: 1rem;
  background-color: var(--bg-hover);
  border-bottom: 1px solid var(--border-color);
}

.subject-title {
  font-weight: 600;
  color: var(--text-primary);
}

.subject-details {
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

.predicate-content {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
  position: relative;
}

/* Custom scrollbar styling */
.predicate-content::-webkit-scrollbar {
  width: 8px;
}

.predicate-content::-webkit-scrollbar-track {
  background: var(--bg-primary);
  border-radius: 4px;
}

.predicate-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.predicate-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.predicate-content pre {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-primary);
}

.predicate-content code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.scroll-indicator {
  margin-top: 0.75rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-style: italic;
}
</style>
