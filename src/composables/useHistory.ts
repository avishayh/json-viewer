import { ref } from 'vue'
import { usePatternRecognizer } from './patternRecognizer'

export interface HistoryItem {
  json: string
  timestamp: number
  patternType?: string
}

export function useHistory() {
  const history = ref<HistoryItem[]>([])
  const { recognizePattern } = usePatternRecognizer()

  const loadHistory = (): void => {
    const savedHistory = localStorage.getItem('jsonViewerHistory')
    if (savedHistory) {
      try {
        history.value = JSON.parse(savedHistory)
      } catch {
        history.value = []
      }
    }
  }

  const saveHistory = (): void => {
    localStorage.setItem('jsonViewerHistory', JSON.stringify(history.value))
  }

  const addToHistory = (json: string): void => {
    // Check if the same JSON already exists in history
    const isDuplicate = history.value.some(item => item.json === json)
    if (isDuplicate) {
      return
    }

    // Try to recognize the pattern
    let patternType: string | undefined
    try {
      const parsed = JSON.parse(json)
      const pattern = recognizePattern(parsed)
      if (pattern.type !== 'UNKNOWN') {
        patternType = pattern.type
      }
    } catch {
      // If JSON parsing fails, don't set a pattern type
    }

    const newItem: HistoryItem = {
      json,
      timestamp: Date.now(),
      patternType
    }
    
    history.value.unshift(newItem)
    
    if (history.value.length > 20) {
      history.value = history.value.slice(0, 20)
    }
    
    saveHistory()
  }

  const removeFromHistory = (index: number): void => {
    history.value.splice(index, 1)
    saveHistory()
  }

  const clearHistory = (): void => {
    history.value = []
    saveHistory()
  }

  const getPreview = (item: HistoryItem): string => {
    try {
      const parsed = JSON.parse(item.json)
      const stringified = JSON.stringify(parsed)
      return stringified.length > 50 ? stringified.substring(0, 47) + '...' : stringified
    } catch {
      return item.json.length > 50 ? item.json.substring(0, 47) + '...' : item.json
    }
  }

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const getHistoryTitle = (item: HistoryItem, index: number): string => {
    if (item.patternType) {
      return `${item.patternType} ${index + 1}`
    }
    return `JSON ${index + 1}`
  }

  return {
    history,
    loadHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getPreview,
    formatTimestamp,
    getHistoryTitle
  }
} 