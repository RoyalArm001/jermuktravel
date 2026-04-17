import { useEffect, useState } from 'react'
import {
  fallbackJermukWeather,
  fetchJermukWeather,
  type LiveWeather,
} from './weather'

const WEATHER_REFRESH_MS = 1000 * 60 * 15
const WEATHER_CACHE_MAX_AGE_MS = 1000 * 60 * 45
const weatherStorageKey = 'jermuk-travel.live-weather.v1'

interface StoredWeatherPayload {
  value: LiveWeather
  savedAt: number
}

function readCachedWeather() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(weatherStorageKey)

    if (!raw) {
      return null
    }

    const payload = JSON.parse(raw) as Partial<StoredWeatherPayload>

    if (
      !payload ||
      typeof payload !== 'object' ||
      !payload.value ||
      typeof payload.savedAt !== 'number'
    ) {
      return null
    }

    if (Date.now() - payload.savedAt > WEATHER_CACHE_MAX_AGE_MS) {
      return null
    }

    return payload.value
  } catch {
    return null
  }
}

function writeCachedWeather(weather: LiveWeather) {
  if (typeof window === 'undefined') {
    return
  }

  const payload: StoredWeatherPayload = {
    value: weather,
    savedAt: Date.now(),
  }

  try {
    window.localStorage.setItem(weatherStorageKey, JSON.stringify(payload))
  } catch {
    // Ignore storage failures and keep live weather in memory only.
  }
}

export function useJermukWeather() {
  const [weather, setWeather] = useState<LiveWeather>(() => readCachedWeather() ?? fallbackJermukWeather)

  useEffect(() => {
    let cancelled = false

    const loadWeather = async () => {
      try {
        const liveWeather = await fetchJermukWeather()

        if (!cancelled) {
          setWeather(liveWeather)
          writeCachedWeather(liveWeather)
        }
      } catch {
        if (!cancelled) {
          setWeather((previousWeather) => previousWeather)
        }
      }
    }

    void loadWeather()
    const interval = window.setInterval(() => {
      void loadWeather()
    }, WEATHER_REFRESH_MS)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [])

  return weather
}
