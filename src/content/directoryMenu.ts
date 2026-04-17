import type { DirectoryMenuContent, Language } from '../types'

export const directoryMenuContent: Record<Language, DirectoryMenuContent> = {
  hy: {
    kicker: 'Բաժիններ',
    title: 'Քաղաքի հիմնական բաժինները',
    utilityLabel: 'Օգտակար էջեր',
    items: [
      { id: 'stay', label: 'Բնակություն', description: 'Հյուրանոցներ, հյուրատներ, SPA', to: '' },
      { id: 'food', label: 'Սնունդ', description: 'Սրճարաններ, ռեստորաններ, սուրճ', to: '' },
      { id: 'leisure', label: 'Ժամանց', description: 'Հանգիստ, երեկո, ակտիվ օր', to: '' },
      { id: 'tours', label: 'Տուրեր', description: 'Պատրաստի ուղևորություններ ու գիդ', to: '' },
      { id: 'sights', label: 'Տեսարժան վայրեր', description: 'Բնություն, ջրվեժ, տեսարաններ', to: '' },
      { id: 'essentials', label: 'Անհրաժեշտ', description: 'Դեղատուն, ATM, օգտակար կետեր', to: '' },
      { id: 'shops', label: 'Խանութներ', description: 'Տեղական գնումներ և նվերներ', to: '' },
      { id: 'services', label: 'Սպասարկում', description: 'Աջակցություն, ամրագրում, ծառայություններ', to: '' },
      { id: 'auto', label: 'Ավտոմոբիլային ծառայություններ', description: 'Վառելիք, լվացում, սերվիս', to: '' },
    ],
  },
  en: {
    kicker: 'Sections',
    title: 'Main city categories',
    utilityLabel: 'Useful pages',
    items: [
      { id: 'stay', label: 'Accommodation', description: 'Hotels, guesthouses, spa stays', to: '' },
      { id: 'food', label: 'Food', description: 'Cafes, restaurants, coffee spots', to: '' },
      { id: 'leisure', label: 'Entertainment', description: 'Leisure, evening mood, activities', to: '' },
      { id: 'tours', label: 'Tours', description: 'Ready routes and guided trips', to: '' },
      { id: 'sights', label: 'Attractions', description: 'Nature, waterfall, viewpoints', to: '' },
      { id: 'essentials', label: 'Essentials', description: 'Pharmacy, ATM, useful stops', to: '' },
      { id: 'shops', label: 'Shops', description: 'Local shopping and gifts', to: '' },
      { id: 'services', label: 'Services', description: 'Support, booking, local help', to: '' },
      { id: 'auto', label: 'Auto services', description: 'Fuel, wash, roadside service', to: '' },
    ],
  },
  ru: {
    kicker: 'Разделы',
    title: 'Основные категории города',
    utilityLabel: 'Полезные страницы',
    items: [
      { id: 'stay', label: 'Проживание', description: 'Отели, гостевые дома, SPA', to: '' },
      { id: 'food', label: 'Еда', description: 'Кафе, рестораны, кофе', to: '' },
      { id: 'leisure', label: 'Досуг', description: 'Отдых, вечер, активный день', to: '' },
      { id: 'tours', label: 'Туры', description: 'Готовые маршруты и гиды', to: '' },
      { id: 'sights', label: 'Достопримечательности', description: 'Природа, водопад, виды', to: '' },
      { id: 'essentials', label: 'Необходимое', description: 'Аптека, банкомат, нужные точки', to: '' },
      { id: 'shops', label: 'Магазины', description: 'Покупки и местные подарки', to: '' },
      { id: 'services', label: 'Сервисы', description: 'Поддержка, бронирование, услуги', to: '' },
      { id: 'auto', label: 'Автосервисы', description: 'Топливо, мойка, сервис', to: '' },
    ],
  },
}
