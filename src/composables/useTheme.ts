import { ref, watch } from 'vue'

const THEME_KEY = 'json-viewer-theme'
const DARK_THEME = 'dark'
const LIGHT_THEME = 'light'

const currentTheme = ref(localStorage.getItem(THEME_KEY) || LIGHT_THEME)

export function useTheme() {
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === LIGHT_THEME ? DARK_THEME : LIGHT_THEME
  }

  watch(currentTheme, (newTheme) => {
    localStorage.setItem(THEME_KEY, newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }, { immediate: true })

  return {
    currentTheme,
    toggleTheme,
    isDarkTheme: () => currentTheme.value === DARK_THEME
  }
} 