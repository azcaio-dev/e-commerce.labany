import { useEffect } from 'react'
import { hexToFilter } from '../utils/hexToFilter' // linha nova

function useStoreTheme(store) {
  useEffect(() => {
    if (!store?.colors) return

    const root = document.documentElement

    root.style.setProperty('--color-primary', store.colors.primary)
    root.style.setProperty('--color-secondary', store.colors.secondary)
    root.style.setProperty('--color-background', store.colors.background)
    root.style.setProperty('--color-text', store.colors.text)
    root.style.setProperty('--icon-color-filter', hexToFilter(store.colors.text)) // linha nova

    document.title = store.title || store.name
  }, [store])
}

export default useStoreTheme