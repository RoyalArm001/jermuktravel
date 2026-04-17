import { useEffect, useState } from 'react'
import { BrandLogo } from './BrandLogo'
import type { Language } from '../types'

interface DeferredPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

const installCopy: Record<
  Language,
  {
    ready: string
    title: string
  }
> = {
  hy: {
    ready: 'Ներբեռնել App',
    title: 'Jermuk Travel հավելված',
  },
  en: {
    ready: 'Download App',
    title: 'Jermuk Travel app',
  },
  ru: {
    ready: 'Скачать App',
    title: 'Приложение Jermuk Travel',
  },
}

const installCtaStorageKey = 'jermuk-travel.install-cta-hidden.v1'

function isIOSDevice() {
  if (typeof navigator === 'undefined') {
    return false
  }

  return /iPad|iPhone|iPod/i.test(navigator.userAgent)
}

function isStandaloneApp() {
  if (typeof window === 'undefined') {
    return false
  }

  const standaloneMedia = window.matchMedia?.('(display-mode: standalone)').matches
  const standaloneNavigator =
    typeof navigator !== 'undefined' && 'standalone' in navigator
      ? Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
      : false

  return standaloneMedia || standaloneNavigator
}

function hideInstallCta() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(installCtaStorageKey, '1')
}

export function InstallAppButton({ language }: { language: Language }) {
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredPromptEvent | null>(null)
  const [installed, setInstalled] = useState(() => isStandaloneApp())
  const [hidden, setHidden] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(installCtaStorageKey) === '1'
  })

  const copy = installCopy[language]
  const androidUrl = import.meta.env.VITE_ANDROID_APP_URL?.trim()
  const iosUrl = import.meta.env.VITE_IOS_APP_URL?.trim()

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as DeferredPromptEvent)
    }

    const handleInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
      setHidden(true)
      hideInstallCta()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const fallbackUrl = isIOSDevice()
    ? iosUrl || androidUrl
    : androidUrl || iosUrl

  if (hidden || installed || (!deferredPrompt && !fallbackUrl)) {
    return null
  }

  return (
    <button
      type="button"
      className="install-app-btn"
      title={copy.title}
      onClick={async () => {
        if (deferredPrompt) {
          await deferredPrompt.prompt()
          const choice = await deferredPrompt.userChoice
          setDeferredPrompt(null)

          if (choice.outcome === 'accepted') {
            setHidden(true)
            hideInstallCta()
          }

          return
        }

        if (fallbackUrl) {
          setHidden(true)
          hideInstallCta()
          window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
        }
      }}
    >
      <span className="install-app-logo" aria-hidden="true">
        <BrandLogo className="install-app-logo-image" alt="" />
      </span>
      <span>{copy.ready}</span>
    </button>
  )
}
