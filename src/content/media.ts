import armeniaFlag from '../assets/flags/armenia.svg'
import russiaFlag from '../assets/flags/russia.svg'
import ukFlag from '../assets/flags/uk.svg'
import heroScene from '../assets/scenes/hero-jermuk.svg'
import springsScene from '../assets/scenes/mineral-springs.svg'
import waterfallScene from '../assets/scenes/waterfall.svg'
import wellnessScene from '../assets/scenes/wellness.svg'
import type { Language } from '../types'

export const sceneImages = {
  hero: heroScene,
  waterfall: waterfallScene,
  springs: springsScene,
  wellness: wellnessScene,
} as const

export const languageOptions: Array<{
  code: Language
  label: string
  shortLabel: string
  flag: string
}> = [
  {
    code: 'hy',
    label: 'Հայերեն',
    shortLabel: 'HY',
    flag: armeniaFlag,
  },
  {
    code: 'en',
    label: 'English',
    shortLabel: 'EN',
    flag: ukFlag,
  },
  {
    code: 'ru',
    label: 'Русский',
    shortLabel: 'RU',
    flag: russiaFlag,
  },
]
