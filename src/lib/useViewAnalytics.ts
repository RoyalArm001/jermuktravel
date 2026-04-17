import { useEffect, useState } from 'react'
import {
  fetchViewAnalytics,
  getCachedViewAnalytics,
  trackViewOnce,
  type ViewAnalytics,
} from './views'

export function usePageViewAnalytics(pathname: string, navigationKey: string) {
  const [analytics, setAnalytics] = useState<ViewAnalytics>(() =>
    getCachedViewAnalytics(),
  )

  useEffect(() => {
    let cancelled = false

    const syncView = async () => {
      try {
        const nextAnalytics = await trackViewOnce(pathname, navigationKey)

        if (!cancelled) {
          setAnalytics(nextAnalytics)
        }
      } catch {
        try {
          const fallbackAnalytics = await fetchViewAnalytics()

          if (!cancelled) {
            setAnalytics(fallbackAnalytics)
          }
        } catch {
          if (!cancelled) {
            setAnalytics(getCachedViewAnalytics())
          }
        }
      }
    }

    void syncView()

    return () => {
      cancelled = true
    }
  }, [navigationKey, pathname])

  return analytics
}

export function useStoredViewAnalytics(refreshIntervalMs = 0) {
  const [analytics, setAnalytics] = useState<ViewAnalytics>(() =>
    getCachedViewAnalytics(),
  )

  useEffect(() => {
    let cancelled = false

    const loadAnalytics = async () => {
      try {
        const nextAnalytics = await fetchViewAnalytics()

        if (!cancelled) {
          setAnalytics(nextAnalytics)
        }
      } catch {
        if (!cancelled) {
          setAnalytics(getCachedViewAnalytics())
        }
      }
    }

    void loadAnalytics()

    if (!refreshIntervalMs) {
      return () => {
        cancelled = true
      }
    }

    const interval = window.setInterval(() => {
      void loadAnalytics()
    }, refreshIntervalMs)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [refreshIntervalMs])

  return analytics
}
