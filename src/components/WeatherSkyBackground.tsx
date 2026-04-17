import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { LiveWeather } from '../lib/weather'

interface WeatherSkyBackgroundProps {
  weather: LiveWeather
}

type SnowflakeStyle = CSSProperties & {
  '--snow-drift': string
}

const WEATHER_CALM_MODE_KEY = 'jermuk-travel.weather-calm.v1'

function createRainLayer(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    key: `rain-${count}-${index}`,
    style: {
      left: `${4 + ((index * 7.1) % 94)}%`,
      animationDelay: `-${(index % 8) * 0.21 + (index % 5) * 0.08}s`,
      animationDuration: `${0.88 + (index % 4) * 0.16}s`,
      opacity: 0.42 + (index % 5) * 0.11,
    } satisfies CSSProperties,
  }))
}

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function createSnowflakeLayer(
  count: number,
  prefix: string,
  sizeRange: [number, number],
  durationRange: [number, number],
  opacityRange: [number, number],
) {
  return Array.from({ length: count }, (_, index) => {
    const seed = index + prefix.length * 100
    const left = -18 + seededRandom(seed + 1) * 136
    const blur = seededRandom(seed + 2) * 1.6
    const flickerDuration = durationRange[0] * 0.16 + seededRandom(seed + 3) * 1.8
    const fallDuration =
      durationRange[0] + seededRandom(seed + 4) * (durationRange[1] - durationRange[0])
    const fallDelay = -seededRandom(seed + 5) * fallDuration
    const flickerDelay = -seededRandom(seed + 6) * flickerDuration
    const drift = 8 + seededRandom(seed + 7) * 22
    const size = sizeRange[0] + seededRandom(seed + 8) * (sizeRange[1] - sizeRange[0])
    const opacity =
      opacityRange[0] + seededRandom(seed + 9) * (opacityRange[1] - opacityRange[0])

    return {
      key: `${prefix}-${index}`,
      className: `snowflake ${prefix}`,
      style: {
        left: `${left}%`,
        filter: `blur(${blur.toFixed(2)}px)`,
        fontSize: `${size.toFixed(2)}px`,
        opacity: opacity.toFixed(2),
        animationDuration: `${flickerDuration.toFixed(2)}s, ${fallDuration.toFixed(2)}s`,
        animationDelay: `${flickerDelay.toFixed(2)}s, ${fallDelay.toFixed(2)}s`,
        '--snow-drift': `${drift.toFixed(2)}vw`,
      } satisfies SnowflakeStyle,
    }
  })
}

const rainDropsFull = createRainLayer(28)
const rainDropsCompact = createRainLayer(16)

const snowFlakesFull = createSnowflakeLayer(250, 'snowflake-sm', [9, 14], [10, 26], [0.26, 0.72])
const snowFlakesMdFull = createSnowflakeLayer(50, 'snowflake-md', [18, 26], [11, 24], [0.44, 0.84])
const snowFlakesLgFull = createSnowflakeLayer(50, 'snowflake-lg', [28, 38], [12, 22], [0.58, 0.94])

const snowFlakesCompact = createSnowflakeLayer(72, 'snowflake-sm', [9, 13], [11, 24], [0.28, 0.62])
const snowFlakesMdCompact = createSnowflakeLayer(18, 'snowflake-md', [16, 24], [12, 22], [0.4, 0.76])
const snowFlakesLgCompact = createSnowflakeLayer(10, 'snowflake-lg', [24, 32], [13, 20], [0.52, 0.88])

function createSparkles(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const size = 3 + (index % 3)

    return {
      key: `sparkle-${count}-${index}`,
      style: {
        left: `${10 + ((index * 11.2) % 80)}%`,
        top: `${12 + ((index * 7.4) % 36)}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `-${index * 0.35}s`,
        animationDuration: `${2.4 + (index % 4) * 0.45}s`,
      } satisfies CSSProperties,
    }
  })
}

const skySparklesFull = createSparkles(14)
const skySparklesCompact = createSparkles(6)

function createSunMotes(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const size = 6 + (index % 4) * 3

    return {
      key: `mote-${count}-${index}`,
      style: {
        left: `${12 + ((index * 6.8) % 72)}%`,
        top: `${10 + ((index * 5.9) % 32)}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `-${index * 0.45}s`,
        animationDuration: `${4.2 + (index % 4) * 0.6}s`,
      } satisfies CSSProperties,
    }
  })
}

const sunMotesFull = createSunMotes(12)
const sunMotesCompact = createSunMotes(5)
const starIndicesFull = Array.from({ length: 24 }, (_, index) => index)
const starIndicesCompact = Array.from({ length: 10 }, (_, index) => index)

function shouldUseCompactEffects() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia(
    '(max-width: 960px), (pointer: coarse), (prefers-reduced-motion: reduce)',
  ).matches
}

function hasStoredCalmMode() {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    return window.sessionStorage.getItem(WEATHER_CALM_MODE_KEY) === '1'
  } catch {
    return false
  }
}

function storeCalmMode() {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.sessionStorage.setItem(WEATHER_CALM_MODE_KEY, '1')
  } catch {
    // Ignore blocked storage access and keep the lighter mode in memory.
  }
}

export function WeatherSkyBackground({ weather }: WeatherSkyBackgroundProps) {
  const [compactEffects, setCompactEffects] = useState(shouldUseCompactEffects)
  const [runtimeCalmMode, setRuntimeCalmMode] = useState(hasStoredCalmMode)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(
      '(max-width: 960px), (pointer: coarse), (prefers-reduced-motion: reduce)',
    )
    const syncMode = () => {
      setCompactEffects(mediaQuery.matches)
    }

    syncMode()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncMode)

      return () => {
        mediaQuery.removeEventListener('change', syncMode)
      }
    }

    mediaQuery.addListener(syncMode)

    return () => {
      mediaQuery.removeListener(syncMode)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (compactEffects || runtimeCalmMode) {
      return
    }

    const activateCalmMode = () => {
      setRuntimeCalmMode((currentMode) => {
        if (currentMode) {
          return currentMode
        }

        storeCalmMode()
        return true
      })
    }

    const handleScroll = () => {
      if (window.scrollY > 120) {
        activateCalmMode()
      }
    }

    const calmTimer = window.setTimeout(activateCalmMode, 6500)

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.clearTimeout(calmTimer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [compactEffects, runtimeCalmMode])

  const calmMode = compactEffects || runtimeCalmMode

  const rainDrops = compactEffects ? rainDropsCompact : rainDropsFull
  const snowFlakes = compactEffects ? snowFlakesCompact : snowFlakesFull
  const snowFlakesMd = compactEffects ? snowFlakesMdCompact : snowFlakesMdFull
  const snowFlakesLg = compactEffects ? snowFlakesLgCompact : snowFlakesLgFull
  const skySparkles = compactEffects ? skySparklesCompact : skySparklesFull
  const sunMotes = compactEffects ? sunMotesCompact : sunMotesFull
  const starIndices = compactEffects ? starIndicesCompact : starIndicesFull
  const showMotes =
    !calmMode && weather.isDay && (weather.category === 'clear' || weather.category === 'partly-cloudy')
  const showClouds = weather.category !== 'clear'
  const showRain = !calmMode && (weather.category === 'rain' || weather.category === 'thunder')
  const showSnow = !calmMode && weather.category === 'snow'
  const showFog = weather.category === 'fog'
  const showLightning = !calmMode && weather.category === 'thunder'
  const showStars = !weather.isDay
  const showSparkles =
    !calmMode && weather.isDay && (weather.category === 'clear' || weather.category === 'partly-cloudy')

  const sceneClass = useMemo(
    () =>
      `weather-sky ${weather.isDay ? 'day' : 'night'} ${weather.category.replace(
        '-',
        '--',
      )}${compactEffects ? ' compact-effects' : ''}${calmMode ? ' calm-mode' : ''}`,
    [calmMode, compactEffects, weather.category, weather.isDay],
  )

  return (
    <div className={sceneClass} aria-hidden="true">
      <div className="sky-gradient" />
      <div className="sky-weather-wash" />
      <div className="sky-aura" />
      <div className="sky-day-bloom" />
      <div className="sky-night-veil" />
      <div className="sky-moonbeam" />
      <div className="sky-halo" />
      <div className="sky-rays" />
      <div className="sky-orb" />

      {showMotes ? (
        <div className="sky-motes">
          {sunMotes.map((mote) => (
            <i key={mote.key} style={mote.style} />
          ))}
        </div>
      ) : null}

      {showClouds ? (
        <>
          <div className="sky-clouds cloud-layer-one">
            <span />
            <span />
            <span />
          </div>

          <div className="sky-clouds cloud-layer-two">
            <span />
            <span />
          </div>

          {!compactEffects ? (
            <div className="sky-clouds cloud-layer-three">
              <span />
              <span />
              <span />
            </div>
          ) : null}
        </>
      ) : null}

      {showRain ? (
        <>
          <div className="sky-rain">
            {rainDrops.map((drop) => (
              <i key={drop.key} style={drop.style} />
            ))}
          </div>

          <div className="sky-rain-mist" />
        </>
      ) : null}

      {showSnow ? (
        <>
          <div className="sky-snow">
            <div className="snowflake-area">
              {snowFlakes.map((flake) => (
                <div key={flake.key} className={flake.className} style={flake.style}>
                  ❄
                </div>
              ))}

              {snowFlakesMd.map((flake) => (
                <div key={flake.key} className={flake.className} style={flake.style}>
                  ❄
                </div>
              ))}

              {snowFlakesLg.map((flake) => (
                <div key={flake.key} className={flake.className} style={flake.style}>
                  ❄
                </div>
              ))}
            </div>
          </div>

          <div className="sky-snow-glow" />
        </>
      ) : null}

      {showFog ? (
        <div className="sky-fog">
          <span />
          <span />
          <span />
        </div>
      ) : null}

      {showLightning ? (
        <div className="sky-lightning">
          <span className="bolt bolt-a" />
          <span className="bolt bolt-b" />
        </div>
      ) : null}

      {showStars ? (
        <div className="sky-stars">
          {starIndices.map((index) => (
            <i key={`star-${index}`} />
          ))}
        </div>
      ) : null}

      {showSparkles ? (
        <div className="sky-sparkles">
          {skySparkles.map((sparkle) => (
            <i key={sparkle.key} style={sparkle.style} />
          ))}
        </div>
      ) : null}

      <div className="sky-landscape">
        <span className="ridge ridge-back" />
        <span className="ridge ridge-mid" />
        <span className="ridge ridge-front" />
      </div>
    </div>
  )
}
