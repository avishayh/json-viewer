import { ref, watch } from 'vue'

const THEME_KEY = 'json-viewer-theme'
const DARCULA_THEME = 'darcula'
const LIGHT_THEME = 'light'

const currentTheme = ref(localStorage.getItem(THEME_KEY) || LIGHT_THEME)

export function useTheme() {
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === LIGHT_THEME ? DARCULA_THEME : LIGHT_THEME
  }

  watch(currentTheme, (newTheme) => {
    localStorage.setItem(THEME_KEY, newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }, { immediate: true })

  return {
    currentTheme,
    toggleTheme,
    isDarkTheme: () => currentTheme.value === DARCULA_THEME
  }
} 