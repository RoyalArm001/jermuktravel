import { directoryMenuContent } from './directoryMenu'
import { sceneImages } from './media'
import { morePagesContent } from './morePages'
import type { SiteContent } from '../types'

export const defaultSiteContent: SiteContent = {
  hy: {
    brand: 'Jermuk Travel',
    cityLine: 'Ջերմուկի գեղեցիկ թվային ուղեցույց',
    navigation: {
      discover: 'Քաղաքը',
      places: 'Վայրեր',
      routes: 'Երթուղիներ',
      ai: 'Jermuk AI',
      more: 'Ավելին',
      help: 'Օգնություն',
      faq: 'Հաճախ տրվող հարցեր',
      about: 'Մեր մասին',
      contact: 'Կապ',
      admin: 'Admin',
    },
    directoryMenu: directoryMenuContent.hy,
    hero: {
      eyebrow: 'Ջերմուկ Թրավել',
      title: 'Բարի գալուստ Ջերմուկ',
      subtitle: 'Հրաշալի բնություն, բուժիչ ջուր և խաղաղ հանգիստ։',
      primaryAction: 'Բացահայտել վայրերը',
      secondaryAction: 'Բացել CMS',
      metrics: [
        { value: '30+', label: 'բուժիչ աղբյուր' },
        { value: '3', label: 'ակտիվ լեզու' },
        { value: '24/7', label: 'AI օգնական' },
      ],
    },
    overview: {
      eyebrow: 'Պարզ կառուցվածք',
      title: 'Քաղաքի ամբողջ փորձառությունը մեկ հոսքի մեջ',
      description:
        'Landing էջը կառուցված է այնպես, որ և՛ զբոսաշրջիկը, և՛ տեղացին արագ հասկանան ուր գնալ, ինչ տեսնել և ինչ հարցնել Jermuk AI-ին։',
      cards: [
        {
          id: 'maps',
          title: 'Տեղերի ուղեցույց',
          description:
            'Տեսարժան վայրերը, հանգստի գոտիները և հիմնական կանգառները ներկայացված են մաքուր քարտերով։',
        },
        {
          id: 'seasons',
          title: 'Սեզոնային տրամադրություն',
          description:
            'Յուրաքանչյուր երթուղի ցույց է տալիս տարվա որ հատվածում է ամենահարմար այցելելը։',
        },
        {
          id: 'editing',
          title: 'Թարմացվող բովանդակություն',
          description:
            'Կայքի բաժինները կառուցված են այնպես, որ հետո հեշտ թարմացվեն ու զարգանան առանց բարդ փոփոխությունների։',
        },
      ],
    },
    placesSection: {
      eyebrow: 'Հիմնական կանգառներ',
      title: 'Վայրեր, որոնք պետք է բաց չթողնել',
      description:
        'Յուրաքանչյուր քարտ ներկայացնում է իրական վայր, կարճ նկարագրություն և օգտակար մանրուք, որ այցելուի որոշումը լինի արագ։',
    },
    places: [
      {
        id: 'waterfall',
        title: 'Ջերմուկի ջրվեժ',
        description:
          'Քաղաքի ամենահայտնի բնական տեսարանը, որտեղ քարքարոտ պատի միջով ջուրն ընկնում է թեթև մառախուղ ստեղծելով։',
        detail: 'Կենտրոնից մոտ 5 րոպե մեքենայով',
        tag: 'Բնություն',
        image: sceneImages.waterfall,
      },
      {
        id: 'springs',
        title: 'Հանքային ջրի պատկերասրահ',
        description:
          'Բուժիչ ջրերի փորձառությունը կարելի է ներկայացնել էլեգանտ, առողջարար և վստահելի ոճով։',
        detail: 'Լավ է առավոտյան կամ երեկոյան հանգիստ շրջայցի համար',
        tag: 'Բուժիչ ջուր',
        image: sceneImages.springs,
      },
      {
        id: 'wellness',
        title: 'Սանատորիա և հանգիստ',
        description:
          'Ջերմուկը պետք է զգացվի որպես վերականգնման քաղաք, ոչ միայն տեսարժան վայրերի հավաքածու։',
        detail: 'Հարմար wellness, spa և երկար հանգստի բովանդակության համար',
        tag: 'Հանգիստ',
        image: sceneImages.wellness,
      },
    ],
    routesSection: {
      eyebrow: 'Պատրաստ երթուղիներ',
      title: 'Արագ պլանավորիր օրը կամ ամբողջ շաբաթավերջը',
      description:
        'Յուրաքանչյուր երթուղի նախատեսված է պարզ UX-ով ներկայացնելու մարդկանց համար, ովքեր ուզում են անմիջապես հասկանալ քայլերը։',
    },
    routes: [
      {
        id: 'soft-day',
        title: '1-օրյա մեղմ երթուղի',
        description:
          'Սկսիր հանքային ջրի պատկերասրահից, հետո գնա ջրվեժ և ավարտիր օրը հանգիստ սրճարանում կամ spa միջավայրում։',
        duration: '4-6 ժամ',
        season: 'Գարուն • Ամառ',
        stops: ['Պատկերասրահ', 'Ջրվեժ', 'Քայլարշավային գոտի', 'Հանգիստ երեկո'],
      },
      {
        id: 'weekend',
        title: 'Շաբաթավերջի հանգիստ',
        description:
          'Բնակություն, wellness, բնության թեթև բացահայտում և երեկոյան տեսարաններ մեկ հավասարակշռված փաթեթում։',
        duration: '2 օր',
        season: 'Ամբողջ տարի',
        stops: ['Գրանցում', 'Բուժիչ ջուր', 'Սպա', 'Երեկոյան զբոսանք'],
      },
      {
        id: 'family',
        title: 'Ընտանեկան հարմար տարբերակ',
        description:
          'Հանգիստ տեմպ, քիչ քայլք, շատ տեսարան և հեշտ բացատրելի տեղաշարժեր mobile այցելուի համար։',
        duration: '3-5 ժամ',
        season: 'Ամառ • Աշուն',
        stops: ['Կենտրոն', 'Դիտակետ', 'Ջրվեժ', 'Թեթև ճաշ'],
      },
    ],
    aiSection: {
      eyebrow: 'Խելացի օգնական',
      title: 'Jermuk AI-ը միշտ պատրաստ է հարցերին',
      description:
        'Աջ անկյունի Jermuk AI-ը առաջարկում է արագ հարցեր և պատասխանում է ուղղությունների, տեսարժան վայրերի ու օրվա պլանավորման թեմաներով։',
    },
    ai: {
      title: 'Jermuk AI',
      description:
        'Հարցրու ուղղություն, տեսարժան վայր, spa, կամ խնդրիր կազմել կարճ երթուղի։',
      placeholder: 'Գրի՛ր հարցդ այստեղ...',
      prompts: [
        'Որտե՞ղ է Ջերմուկի ջրվեժը',
        'Առաջարկիր 1 օրվա երթուղի',
        'Ի՞նչ wellness տարբերակ կա',
      ],
      welcome:
        'Բարև, ես Jermuk AI-ն եմ։ Կարող եմ օգնել գտնել տեսարժան վայրեր, հանգստի գոտիներ և առաջարկել պարզ երթուղի։',
    },
    infoPages: morePagesContent.hy,
    footer: {
      tagline: 'Jermuk Travel',
      subline:
        'Jermuk Travel-ը համախմբում է քաղաքի բնությունը, առողջարար ուղղությունները և հարմար երթուղիները մեկ հարթակում։',
      exploreLabel: 'Վերադառնալ վայրերին',
      adminLabel: 'Մտնել Admin',
    },
  },
  en: {
    brand: 'Jermuk Travel',
    cityLine: 'A polished digital guide to Jermuk',
    navigation: {
      discover: 'City',
      places: 'Places',
      routes: 'Routes',
      ai: 'Jermuk AI',
      more: 'More',
      help: 'Help',
      faq: 'FAQ',
      about: 'About',
      contact: 'Contact',
      admin: 'Admin',
    },
    directoryMenu: directoryMenuContent.en,
    hero: {
      eyebrow: 'Jermuk Travel',
      title: 'Welcome to Jermuk',
      subtitle: 'Beautiful nature, mineral water, and a calm rhythm of rest.',
      primaryAction: 'Explore the places',
      secondaryAction: 'Open CMS',
      metrics: [
        { value: '30+', label: 'mineral springs' },
        { value: '3', label: 'active languages' },
        { value: '24/7', label: 'AI support point' },
      ],
    },
    overview: {
      eyebrow: 'Simple structure',
      title: 'The city experience in one clear flow',
      description:
        'The landing page is arranged so both travelers and locals can quickly understand where to go, what to visit, and what to ask Jermuk AI.',
      cards: [
        {
          id: 'maps',
          title: 'Guided places',
          description:
            'Key attractions, wellness areas, and essential stops are presented as clean visual cards.',
        },
        {
          id: 'seasons',
          title: 'Season-aware planning',
          description:
            'Each route hints at the best season so guests can decide faster on mobile or desktop.',
        },
        {
          id: 'editing',
          title: 'Flexible content flow',
          description:
            'The structure is prepared for easy content updates and future expansion without breaking the travel experience.',
        },
      ],
    },
    placesSection: {
      eyebrow: 'Key stops',
      title: 'Places your visitors should not miss',
      description:
        'Each card highlights a real stop with a clear summary and practical notes so visitors can decide quickly.',
    },
    places: [
      {
        id: 'waterfall',
        title: 'Jermuk Waterfall',
        description:
          'The citys signature natural view, with water dropping through a dramatic rock wall and a soft cloud of mist.',
        detail: 'Roughly 5 minutes by car from the center',
        tag: 'Nature',
        image: sceneImages.waterfall,
      },
      {
        id: 'springs',
        title: 'Mineral Water Gallery',
        description:
          'A core wellness landmark that can be presented in a calm, elegant, and trustworthy way for guests.',
        detail: 'Best for a gentle morning or evening visit',
        tag: 'Mineral water',
        image: sceneImages.springs,
      },
      {
        id: 'wellness',
        title: 'Sanatorium and spa stay',
        description:
          'Jermuk should feel like a recovery destination, not only a list of attractions, and this section supports that tone.',
        detail: 'Ideal for wellness, spa, and longer-stay storytelling',
        tag: 'Wellness',
        image: sceneImages.wellness,
      },
    ],
    routesSection: {
      eyebrow: 'Ready-made journeys',
      title: 'Plan a day or an entire weekend quickly',
      description:
        'Every route is shaped for clear UX so visitors instantly understand the order of stops and the rhythm of the day.',
    },
    routes: [
      {
        id: 'soft-day',
        title: 'Soft one-day route',
        description:
          'Start with the mineral gallery, continue to the waterfall, and finish with a calm cafe or spa moment.',
        duration: '4-6 hours',
        season: 'Spring • Summer',
        stops: ['Gallery', 'Waterfall', 'Walking zone', 'Slow evening'],
      },
      {
        id: 'weekend',
        title: 'Weekend recovery stay',
        description:
          'Accommodation, wellness, light nature discovery, and evening scenery in one balanced itinerary.',
        duration: '2 days',
        season: 'All year',
        stops: ['Arrival', 'Mineral water', 'Spa time', 'Evening walk'],
      },
      {
        id: 'family',
        title: 'Family-friendly option',
        description:
          'A softer pace with less walking, stronger views, and easy movement explanations for mobile visitors.',
        duration: '3-5 hours',
        season: 'Summer • Autumn',
        stops: ['Center', 'Viewpoint', 'Waterfall', 'Light lunch'],
      },
    ],
    aiSection: {
      eyebrow: 'Smart assistant',
      title: 'Jermuk AI is always ready for questions',
      description:
        'The assistant in the lower corner suggests quick prompts and answers practical questions about routes, places, and daily planning.',
    },
    ai: {
      title: 'Jermuk AI',
      description:
        'Ask about routes, attractions, wellness options, or request a short travel plan.',
      placeholder: 'Type your question...',
      prompts: [
        'Where is the waterfall?',
        'Suggest a one-day route',
        'What wellness options are available?',
      ],
      welcome:
        'Hello, I am Jermuk AI. I can guide visitors to places, wellness spots, and simple route ideas around the city.',
    },
    infoPages: morePagesContent.en,
    footer: {
      tagline: 'Jermuk Travel',
      subline:
        'Jermuk Travel brings nature, wellness, and route planning together in one clear city experience.',
      exploreLabel: 'Back to the places',
      adminLabel: 'Open Admin',
    },
  },
  ru: {
    brand: 'Jermuk Travel',
    cityLine: 'Современный цифровой гид по Джермуку',
    navigation: {
      discover: 'Город',
      places: 'Места',
      routes: 'Маршруты',
      ai: 'Jermuk AI',
      more: 'Еще',
      help: 'Помощь',
      faq: 'FAQ',
      about: 'О нас',
      contact: 'Контакты',
      admin: 'Admin',
    },
    directoryMenu: directoryMenuContent.ru,
    hero: {
      eyebrow: 'Jermuk Travel',
      title: 'Добро пожаловать в Джермук',
      subtitle: 'Красивая природа, минеральная вода и спокойный отдых.',
      primaryAction: 'Открыть места',
      secondaryAction: 'Открыть CMS',
      metrics: [
        { value: '30+', label: 'минеральных источников' },
        { value: '3', label: 'языка интерфейса' },
        { value: '24/7', label: 'точка AI помощи' },
      ],
    },
    overview: {
      eyebrow: 'Простая структура',
      title: 'Весь опыт города в одном понятном потоке',
      description:
        'Лендинг выстроен так, чтобы и турист, и житель быстро поняли, куда идти, что смотреть и о чем спросить Jermuk AI.',
      cards: [
        {
          id: 'maps',
          title: 'Гид по локациям',
          description:
            'Главные достопримечательности, wellness-зоны и ключевые остановки собраны в аккуратные карточки.',
        },
        {
          id: 'seasons',
          title: 'Сезонные подсказки',
          description:
            'Каждый маршрут показывает лучший период посещения, чтобы решение принималось быстрее.',
        },
        {
          id: 'editing',
          title: 'Гибкий контент',
          description:
            'Структура уже подготовлена для удобных обновлений контента и дальнейшего роста сайта.',
        },
      ],
    },
    placesSection: {
      eyebrow: 'Главные остановки',
      title: 'Места, которые стоит показать каждому гостю',
      description:
        'Каждая карточка показывает реальную локацию с кратким описанием и полезной деталью для быстрого выбора.',
    },
    places: [
      {
        id: 'waterfall',
        title: 'Джермукский водопад',
        description:
          'Самый узнаваемый природный образ города: вода падает вдоль каменной стены и создает мягкий туман.',
        detail: 'Около 5 минут на машине от центра',
        tag: 'Природа',
        image: sceneImages.waterfall,
      },
      {
        id: 'springs',
        title: 'Галерея минеральной воды',
        description:
          'Ключевая wellness-точка города, которую важно подать спокойно, красиво и с доверием.',
        detail: 'Лучше всего подходит для утренней или вечерней прогулки',
        tag: 'Минеральная вода',
        image: sceneImages.springs,
      },
      {
        id: 'wellness',
        title: 'Санаторий и отдых',
        description:
          'Джермук должен ощущаться как город восстановления, а не только как набор достопримечательностей.',
        detail: 'Подходит для разделов о spa, wellness и длительном проживании',
        tag: 'Отдых',
        image: sceneImages.wellness,
      },
    ],
    routesSection: {
      eyebrow: 'Готовые сценарии',
      title: 'Быстро спланируйте день или целые выходные',
      description:
        'Каждый маршрут оформлен так, чтобы человек сразу понял последовательность шагов и логику отдыха.',
    },
    routes: [
      {
        id: 'soft-day',
        title: 'Спокойный маршрут на 1 день',
        description:
          'Начните с галереи минеральной воды, затем перейдите к водопаду и завершите день в спокойном кафе или spa.',
        duration: '4-6 часов',
        season: 'Весна • Лето',
        stops: ['Галерея', 'Водопад', 'Прогулочная зона', 'Спокойный вечер'],
      },
      {
        id: 'weekend',
        title: 'Восстановление на выходные',
        description:
          'Проживание, wellness, легкое знакомство с природой и красивые вечерние виды в одном маршруте.',
        duration: '2 дня',
        season: 'Круглый год',
        stops: ['Заселение', 'Минеральная вода', 'Spa', 'Вечерняя прогулка'],
      },
      {
        id: 'family',
        title: 'Семейный вариант',
        description:
          'Мягкий темп, меньше ходьбы, больше видов и простые переходы, понятные посетителю со смартфона.',
        duration: '3-5 часов',
        season: 'Лето • Осень',
        stops: ['Центр', 'Смотровая точка', 'Водопад', 'Легкий обед'],
      },
    ],
    aiSection: {
      eyebrow: 'Умный помощник',
      title: 'Jermuk AI всегда готов отвечать',
      description:
        'Помощник в правом нижнем углу подсказывает быстрые вопросы и отвечает по маршрутам, локациям и плану дня.',
    },
    ai: {
      title: 'Jermuk AI',
      description:
        'Спросите про маршрут, достопримечательности, wellness или попросите короткий план поездки.',
      placeholder: 'Введите вопрос...',
      prompts: [
        'Где находится водопад?',
        'Предложи маршрут на 1 день',
        'Какие есть wellness варианты?',
      ],
      welcome:
        'Здравствуйте, я Jermuk AI. Я могу подсказать места, wellness-точки и простые идеи маршрутов по городу.',
    },
    infoPages: morePagesContent.ru,
    footer: {
      tagline: 'Jermuk Travel',
      subline:
        'Jermuk Travel объединяет природу, wellness-направления и удобные маршруты в одном городском сервисе.',
      exploreLabel: 'Вернуться к местам',
      adminLabel: 'Открыть Admin',
    },
  },
}
