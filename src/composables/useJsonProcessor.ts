import { ref } from 'vue'
import dayjs from 'dayjs'

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

  const isEpochTimestamp = (str: string): boolean => {
    return /^(\d{10}|\d{13})$/.test(str)
  }

  const tryParseJson = (str: string): JsonValue | null => {
    try {
      return JSON.parse(str)
    } catch (err) {
      // console.debug(`[JSON] Not a json in path: ${str}`)
      return null
    }
  }

  const processValue = (value: JsonValue, path: string, parentTransformType?: string): JsonValue => {
    // Handle number values for epoch detection
    if (typeof value === 'number') {
      const strValue = value.toString()
      if (isEpochTimestamp(strValue)) {
        let date: dayjs.Dayjs
        if (strValue.length === 13) {
          date = dayjs(Number(strValue))
        } else {
          date = dayjs(Number(strValue) * 1000)
        }
        if (date.isValid()) {
          const humanReadable = date.format('YYYY-MM-DD HH:mm:ss')
          // Only add 'Epoch' if not part of a parent transform
          if (!parentTransformType) {
            transformedValues.value.push({
              path,
              type: 'Epoch',
              originalValue: strValue
            })
          }
          return humanReadable
        }
      }
      return value
    }
    if (typeof value !== 'string') return value
    
    console.log(`${path} : [Process] Processing value: ${value.substring(0, 50)}...`)

    // Epoch timestamp transform for string
    if (isEpochTimestamp(value)) {
      let date: dayjs.Dayjs
      if (value.length === 13) {
        date = dayjs(Number(value))
      } else {
        date = dayjs(Number(value) * 1000)
      }
      if (date.isValid()) {
        const humanReadable = date.format('YYYY-MM-DD HH:mm:ss')
        // Only add 'Epoch' if not part of a parent transform
        if (!parentTransformType) {
          transformedValues.value.push({
            path,
            type: 'Epoch',
            originalValue: value
          })
        }
        return humanReadable
      }
    }

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
        let decoded = atob(value)
        decoded = decoded.trim() // Trim whitespace and newlines
        console.log(`${path} : [Base64] Decoded: ${decoded.substring(0, 50)}...`)
        if (isReadableText(decoded)) {
          // Chain all transforms by passing decoded through processValue again
          const processed = processValue(decoded, path, 'Base64')
          if (processed !== decoded) {
            // If a transform occurred, record as Base64->...
            let type = 'Base64'
            if (typeof processed === 'string' && isEpochTimestamp(decoded)) {
              type = 'Base64->Epoch'
            } else if (typeof processed === 'object') {
              type = 'Base64->JSON'
            }
            transformedValues.value.push({
              path,
              type,
              originalValue: value
            })
            return processed
          }
          // If not transformed, just return decoded
          transformedValues.value.push({
            path,
            type: 'Base64',
            originalValue: value
          })
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
        if (typeof item === 'string' || typeof item === 'number') {
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
        if (typeof value === 'string' || typeof value === 'number') {
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
      
      // If input is empty, reset state and return
      if (!jsonInput.trim()) {
        parsedJson.value = null
        lastParsedJson.value = ''
        return true
      }
      
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