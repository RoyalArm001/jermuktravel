import type { Language } from '../types'

export type WeatherCategory =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'thunder'

export interface LiveWeather {
  temperature: number
  weatherCode: number
  windSpeed: number
  precipitation: number
  rain: number
  showers: number
  snowfall: number
  isDay: boolean
  category: WeatherCategory
}

const weatherLabelMap: Record<Language, Record<WeatherCategory, string>> = {
  hy: {
    clear: 'Արևոտ',
    'partly-cloudy': 'Մասամբ ամպամած',
    cloudy: 'Ամպամած',
    fog: 'Մառախուղ',
    rain: 'Անձրև',
    snow: 'Ձյուն',
    thunder: 'Ամպրոպ',
  },
  en: {
    clear: 'Sunny',
    'partly-cloudy': 'Partly cloudy',
    cloudy: 'Cloudy',
    fog: 'Fog',
    rain: 'Rain',
    snow: 'Snow',
    thunder: 'Thunder',
  },
  ru: {
    clear: 'Солнечно',
    'partly-cloudy': 'Переменная облачность',
    cloudy: 'Облачно',
    fog: 'Туман',
    rain: 'Дождь',
    snow: 'Снег',
    thunder: 'Гроза',
  },
}

export const fallbackJermukWeather: LiveWeather = {
  temperature: 17,
  weatherCode: 1,
  windSpeed: 5,
  precipitation: 0,
  rain: 0,
  showers: 0,
  snowfall: 0,
  isDay: true,
  category: 'partly-cloudy',
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number
    weather_code?: number
    wind_speed_10m?: number
    precipitation?: number
    rain?: number
    showers?: number
    snowfall?: number
    is_day?: number
  }
  current_weather?: {
    temperature?: number
    weathercode?: number
    windspeed?: number
    is_day?: number
  }
}

function mapWeatherCodeToCategory(code: number): WeatherCategory {
  if (code === 0) {
    return 'clear'
  }

  if (code === 1 || code === 2) {
    return 'partly-cloudy'
  }

  if (code === 3) {
    return 'cloudy'
  }

  if (code === 45 || code === 48) {
    return 'fog'
  }

  if (
    code === 51 ||
    code === 53 ||
    code === 55 ||
    code === 56 ||
    code === 57 ||
    code === 61 ||
    code === 63 ||
    code === 65 ||
    code === 66 ||
    code === 67 ||
    code === 80 ||
    code === 81 ||
    code === 82
  ) {
    return 'rain'
  }

  if (
    code === 71 ||
    code === 73 ||
    code === 75 ||
    code === 77 ||
    code === 85 ||
    code === 86
  ) {
    return 'snow'
  }

  return 'thunder'
}

function resolveWeatherCategory({
  code,
  temperature,
  precipitation,
  rain,
  showers,
  snowfall,
}: {
  code: number
  temperature: number
  precipitation: number
  rain: number
  showers: number
  snowfall: number
}): WeatherCategory {
  if (snowfall > 0) {
    return 'snow'
  }

  if (rain > 0 || showers > 0) {
    return 'rain'
  }

  if (precipitation > 0) {
    return temperature <= 1.5 ? 'snow' : 'rain'
  }

  return mapWeatherCodeToCategory(code)
}

export function getWeatherLabel(language: Language, category: WeatherCategory): string {
  return weatherLabelMap[language][category]
}

export async function fetchJermukWeather(): Promise<LiveWeather> {
  const response = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=39.8406&longitude=45.6739&current=temperature_2m,weather_code,is_day,wind_speed_10m,precipitation,rain,showers,snowfall&timezone=Asia%2FYerevan',
  )

  if (!response.ok) {
    throw new Error('Failed to load weather')
  }

  const payload = (await response.json()) as OpenMeteoResponse
  const current = payload.current

  if (
    current &&
    typeof current.weather_code === 'number' &&
    typeof current.temperature_2m === 'number'
  ) {
    const precipitation =
      typeof current.precipitation === 'number' ? current.precipitation : 0
    const rain = typeof current.rain === 'number' ? current.rain : 0
    const showers = typeof current.showers === 'number' ? current.showers : 0
    const snowfall = typeof current.snowfall === 'number' ? current.snowfall : 0

    return {
      temperature: current.temperature_2m,
      weatherCode: current.weather_code,
      windSpeed:
        typeof current.wind_speed_10m === 'number' ? current.wind_speed_10m : 0,
      precipitation,
      rain,
      showers,
      snowfall,
      isDay: current.is_day === 1,
      category: resolveWeatherCategory({
        code: current.weather_code,
        temperature: current.temperature_2m,
        precipitation,
        rain,
        showers,
        snowfall,
      }),
    }
  }

  const legacyCurrent = payload.current_weather

  if (
    !legacyCurrent ||
    typeof legacyCurrent.weathercode !== 'number' ||
    typeof legacyCurrent.temperature !== 'number'
  ) {
    throw new Error('Invalid weather payload')
  }

  return {
    temperature: legacyCurrent.temperature,
    weatherCode: legacyCurrent.weathercode,
    windSpeed: typeof legacyCurrent.windspeed === 'number' ? legacyCurrent.windspeed : 0,
    precipitation: 0,
    rain: 0,
    showers: 0,
    snowfall: 0,
    isDay: legacyCurrent.is_day === 1,
    category: mapWeatherCodeToCategory(legacyCurrent.weathercode),
  }
}
