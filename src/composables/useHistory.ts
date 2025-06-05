import { ref } from 'vue'

export interface HistoryItem {
  json: string
  timestamp: number
}

export function useHistory() {
  const history = ref<HistoryItem[]>([])

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
    const newItem: HistoryItem = {
      json,
      timestamp: Date.now()
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

  return {
    history,
    loadHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getPreview,
    formatTimestamp
  }
} 