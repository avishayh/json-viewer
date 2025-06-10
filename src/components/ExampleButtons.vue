<template>
  <div class="example-buttons">
    <span class="example-label">Examples:</span>
    <button
      v-for="example in examples"
      :key="example.name"
      @click="loadExample(example)"
      class="example-button"
      :title="`Load ${example.name} example`"
    >
      {{ example.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dsseExample from '../examples/dsse.json'
import sigstoreExample from '../examples/sigstore.json'

interface Example {
  name: string
  data: any
}

const examples = ref<Example[]>([
  { name: 'dsse', data: dsseExample },
  { name: 'sigstore', data: sigstoreExample }
])

const emit = defineEmits<{
  (e: 'load-example', path: string): void
}>()

const loadExample = (example: Example) => {
  emit('load-example', JSON.stringify(example.data))
}
</script>

<style scoped>
.example-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: var(--surface-color);
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.example-label {
  font-weight: 500;
  color: var(--text-primary);
}

.example-button {
  padding: 0.25rem 0.75rem;
  background-color: var(--primary-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  color: white;
}

.example-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.example-button:active {
  transform: translateY(0);
}
</style> 