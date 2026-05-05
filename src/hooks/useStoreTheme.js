import { useEffect } from 'react'

function useStoreTheme(store) {
  useEffect(() => {
    if (!store?.colors) return

    const root = document.documentElement

    root.style.setProperty('--color-primary', store.colors.primary)
    root.style.setProperty('--color-secondary', store.colors.secondary)
    root.style.setProperty('--color-background', store.colors.background)
    root.style.setProperty('--color-text', store.colors.text)

    document.title = store.title || store.name
  }, [store])
}

export default useStoreTheme