import { ref } from 'vue'

type JsonValue = string | number | boolean | null | Record<string, any> | any[]

export interface TransformedValue {
  path: string
  type: string
  originalValue: string
}

export function useJsonProcessor() {
  const parsedJson = ref<JsonValue | null>(null)
  const error = ref('')
  const lastParsedJson = ref('')
  const originalValues = new WeakMap<object, string>()
  const transformedValues = ref<TransformedValue[]>([])

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
      console.debug(`[JSON] Not a json in path: ${str}`)
      return null
    }
  }

  const processValue = (value: JsonValue, path: string): JsonValue => {
    if (typeof value !== 'string') return value
    
    const parsedJson = tryParseJson(value)
    if (parsedJson) {
      console.log(`[JSON] Processing path: ${path}`)
      const processed = processObject(parsedJson, path)
      if (processed && typeof processed === 'object') {
        originalValues.set(processed, value)
        transformedValues.value.push({
          path,
          type: 'JSON',
          originalValue: value
        })
      }
      return processed
    }
    
    if (isBase64(value)) {
      try {
        const decoded = atob(value)
        // Only process if the decoded string is readable text or valid JSON
        if (isReadableText(decoded)) {
          const parsed = tryParseJson(decoded)
          if (parsed) {
            console.log(`[Base64->JSON] Processing path: ${path}`)
            const processed = processObject(parsed, path)
            if (processed && typeof processed === 'object') {
              originalValues.set(processed, value)
              transformedValues.value.push({
                path,
                type: 'Base64',
                originalValue: value
              })
            }
            console.log(`[Base64->JSON] Processed path: ${path}`)
            return processed
          }
          console.log(`[Base64->JSON] Not a json in path: ${path}`)
          return decoded
        }
        console.log(`[Base64] Not readable at path: ${path}`)
        return value // Return original base64 if decoded string is not readable
      } catch (err) {
        console.log(`[Base64] Error at path: ${path}`)
        return value
      }
    }
    
    return value
  }

  const processObject = (obj: JsonValue, parentPath: string = ''): JsonValue => {
    if (Array.isArray(obj)) {
      console.log(`[Array] Processing path: ${parentPath}`)
      return obj.map((item, index) => {
        const currentPath = `${parentPath}[${index}]`
        if (typeof item === 'string') {
          const processed = processValue(item, currentPath)
          if (processed && typeof processed === 'object') {
            originalValues.set(processed, item)
          }
          return processed
        } else {
          return processObject(item, currentPath)
        }
      })
    }
    
    if (obj && typeof obj === 'object') {
      const result: Record<string, any> = {}
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = parentPath ? `${parentPath}.${key}` : key
        if (typeof value === 'string') {
          const processed = processValue(value, currentPath)
          result[key] = processed
          if (processed && typeof processed === 'object') {
            originalValues.set(processed, value)
          }
        } else {
          result[key] = processObject(value, currentPath)
        }
      }
      return result
    }
    
    return obj
  }

  const getOriginalValue = (obj: object): string | undefined => {
    return originalValues.get(obj)
  }

  const parseJson = (jsonInput: string): boolean => {
    try {
      error.value = ''
      transformedValues.value = []
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
    parseJson,
    getOriginalValue,
    transformedValues
  }
} 