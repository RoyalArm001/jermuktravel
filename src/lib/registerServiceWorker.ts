export function registerAppServiceWorker() {
  if (import.meta.env.DEV || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  const swUrl = `/sw.js?v=${encodeURIComponent(__APP_VERSION__)}`
  const hadController = navigator.serviceWorker.controller !== null
  let didReloadForUpdate = false

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || didReloadForUpdate) {
      return
    }

    didReloadForUpdate = true
    window.location.reload()
  })

  const register = async () => {
    try {
      const registration = await navigator.serviceWorker.register(swUrl, { scope: '/' })
      void registration.update()
    } catch (error) {
      console.error('Service worker registration failed', error)
    }
  }

  if (document.readyState === 'complete') {
    void register()
    return
  }

  window.addEventListener('load', () => {
    void register()
  }, { once: true })
}
