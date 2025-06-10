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
      // console.debug(`[JSON] Not a json in path: ${str}`)
      return null
    }
  }

  const processValue = (value: JsonValue, path: string): JsonValue => {
    if (typeof value !== 'string') return value
    
    console.log(`${path} : [Process] Processing value: ${value.substring(0, 50)}...`)
    
    const parsedJson = tryParseJson(value)
    if (parsedJson) {
      console.log(`${path} : [JSON] Processing`)
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
        console.log(`${path} : [Base64] Decoded: ${decoded.substring(0, 50)}...`)
        // Only process if the decoded string is readable text or valid JSON
        if (isReadableText(decoded)) {
          const parsed = tryParseJson(decoded)
          if (parsed) {
            console.log(`${path} : [Base64->JSON] Processing`)
            const processed = processObject(parsed, path)
            if (processed && typeof processed === 'object') {
              originalValues.set(processed, value)
              transformedValues.value.push({
                path,
                type: 'Base64',
                originalValue: value
              })
              console.log(`${path} : [Base64->JSON] Added to transforms`)
            }
            console.log(`${path} : [Base64->JSON] Processed`)
            return processed
          }
          console.log(`${path} : [Base64->JSON] Not a json`)
          // Add to transforms when returning decoded base64
          transformedValues.value.push({
            path,
            type: 'Base64',
            originalValue: value
          })
          console.log(`${path} : [Base64] Added to transforms`)
          return decoded
        }
        console.log(`${path} : [Base64] Not readable`)
        return value // Return original base64 if decoded string is not readable
      } catch (err) {
        console.log(`${path} : [Base64] Error`)
        return value
      }
    }
    
    return value
  }

  const processObject = (obj: JsonValue, parentPath: string = ''): JsonValue => {
    if (Array.isArray(obj)) {
      console.log(`${parentPath} : [Array] Processing`)
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