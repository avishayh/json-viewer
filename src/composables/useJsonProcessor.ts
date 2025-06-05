import { ref } from 'vue'

type JsonValue = string | number | boolean | null | Record<string, any> | any[]

export function useJsonProcessor() {
  const parsedJson = ref<JsonValue | null>(null)
  const error = ref('')
  const lastParsedJson = ref('')

  const isBase64 = (str: string): boolean => {
    try {
      return btoa(atob(str)) === str
    } catch (err) {
      return false
    }
  }

  const tryParseJson = (str: string): JsonValue | null => {
    try {
      return JSON.parse(str)
    } catch (err) {
      return null
    }
  }

  const processValue = (value: JsonValue): JsonValue => {
    if (typeof value !== 'string') return value
    
    const parsedJson = tryParseJson(value)
    if (parsedJson) {
      return processObject(parsedJson)
    }
    
    if (isBase64(value)) {
      try {
        const decoded = atob(value)
        const parsed = tryParseJson(decoded)
        if (parsed) {
          return processObject(parsed)
        }
        return processValue(decoded)
      } catch (err) {
        return value
      }
    }
    
    return value
  }

  const processObject = (obj: JsonValue): JsonValue => {
    if (Array.isArray(obj)) {
      return obj.map(item => processObject(item))
    }
    
    if (obj && typeof obj === 'object') {
      const result: Record<string, any> = {}
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          result[key] = processValue(value)
        } else {
          result[key] = processObject(value)
        }
      }
      return result
    }
    
    return obj
  }

  const parseJson = (jsonInput: string): boolean => {
    try {
      error.value = ''
      const jsonData = JSON.parse(jsonInput)
      parsedJson.value = processObject(jsonData)
      lastParsedJson.value = jsonInput
      return true
    } catch (err) {
      error.value = 'Invalid JSON format'
      parsedJson.value = null
      return false
    }
  }

  return {
    parsedJson,
    error,
    lastParsedJson,
    parseJson
  }
} 