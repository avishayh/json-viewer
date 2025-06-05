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

  const isReadableText = (str: string): boolean => {
    // Check if the string contains mostly printable ASCII characters
    const printableChars = str.split('').filter(char => {
      const code = char.charCodeAt(0)
      return (code >= 32 && code <= 126) || code === 9 || code === 10 || code === 13
    }).length
    const ratio = printableChars / str.length
    return ratio > 0.8 // If more than 80% of characters are printable, consider it readable
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
        // Only process if the decoded string is readable text or valid JSON
        if (isReadableText(decoded)) {
          const parsed = tryParseJson(decoded)
          if (parsed) {
            return processObject(parsed)
          }
          return processValue(decoded)
        }
        return value // Return original base64 if decoded string is not readable
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