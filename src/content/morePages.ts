import type { Language, MorePageContent, MorePageId } from '../types'

export const morePagesContent: Record<
  Language,
  Record<MorePageId, MorePageContent>
> = {
  hy: {
    help: {
      eyebrow: 'Օգնություն',
      title: 'Օգնություն այցելուի համար',
      description:
        'Արագ ուղեցույց այն մարդկանց համար, ովքեր առաջին անգամ են օգտագործում Jermuk Travel-ը և ուզում են հասկանալ որտեղից սկսել։',
      sideTitle: 'Արագ մեկնարկ',
      sideDescription:
        'Սկսեք գլխավոր էջից, հետո բացեք Վայրեր կամ Երթուղիներ բաժինը, իսկ վերջում օգտագործեք Jermuk AI-ը։',
      highlights: ['Քայլ առ քայլ պարզ', 'Հարմար mobile-ի համար', 'Արագ կողմնորոշում'],
      items: [
        {
          title: 'Ինչպես օգտվել կայքից',
          description:
            'Գլխավոր էջից անցեք համապատասխան բաժին և ընտրեք այն վայրերը կամ երթուղիները, որոնք հետաքրքրում են ձեզ։',
        },
        {
          title: 'Ինչպես գտնել ուղղություն',
          description:
            'Բացեք Jermuk AI կամ համապատասխան վայրի քարտը, որպեսզի հասկանաք ինչպես հասնել տվյալ կետ։',
        },
        {
          title: 'Ինչպես պլանավորել օրը',
          description:
            'Երթուղիներ բաժինը ցույց է տալիս պատրաստ տարբերակներ, որ օրը հեշտ պլանավորեք առանց երկար որոնելու։',
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Հաճախ տրվող հարցեր',
      description:
        'Այստեղ հավաքված են ամենահաճախ տրվող հարցերը, որպեսզի մարդը արագ գտնի պատասխանը առանց երկար փնտրելու։',
      sideTitle: 'Ամենատարածված հարցերը',
      sideDescription:
        'Եթե պատասխանը այստեղ չկա, կարող եք գնալ Contact բաժին կամ հարցնել Jermuk AI-ին։',
      highlights: ['Արագ պատասխաններ', 'Պարզ լեզու', 'Օգտակար այցելուի համար'],
      items: [
        {
          title: 'Ե՞րբ է լավ ժամանակ այցելել Ջերմուկ',
          description:
            'Ջերմուկը գեղեցիկ է ամբողջ տարվա ընթացքում, բայց երթուղիներ բաժինը ցույց է տալիս ամենահարմար սեզոնը յուրաքանչյուր այցի համար։',
        },
        {
          title: 'Կարո՞ղ եմ օգտվել կայքից հեռախոսով',
          description:
            'Այո, կայքը կառուցված է mobile և desktop տարբերակների համար, որպեսզի հեշտ օգտագործվի ցանկացած սարքում։',
        },
        {
          title: 'Ինչի՞ համար է Jermuk AI-ը',
          description:
            'Jermuk AI-ը օգնում է արագ գտնել վայրեր, ուղղություններ և կազմել պարզ այցի պլան։',
        },
      ],
    },
    about: {
      eyebrow: 'Մեր մասին',
      title: 'Jermuk Travel-ի մասին',
      description:
        'Jermuk Travel-ը ստեղծվել է, որպեսզի Ջերմուկի մասին տեղեկությունը ներկայացվի գեղեցիկ, պարզ և ժամանակակից թվային ձևով։',
      sideTitle: 'Մեր նպատակն է',
      sideDescription:
        'Օգնել մարդկանց արագ հասկանալ, թե ինչ կա քաղաքում, ուր գնալ և ինչպես ավելի լավ անցկացնել իրենց ժամանակը Ջերմուկում։',
      highlights: ['Քաղաքային թվային ուղեցույց', 'Բազմալեզու միջավայր', 'AI աջակցություն'],
      items: [
        {
          title: 'Ինչու է ստեղծվել այս նախագիծը',
          description:
            'Որպեսզի քաղաքը ներկայացվի ոչ թե բարդ տեքստերով, այլ հասկանալի ու գեղեցիկ digital փորձառությամբ։',
        },
        {
          title: 'Ինչ է ներառում կայքը',
          description:
            'Վայրերի քարտեր, պատրաստ երթուղիներ, AI օգնական և հետագա app-ի հիմք։',
        },
        {
          title: 'Ինչպես է այն զարգանալու',
          description:
            'CMS-ի միջոցով բովանդակությունը հնարավոր է անընդհատ թարմացնել, ավելացնել նոր վայրեր, երթուղիներ և օգտակար տեղեկություն։',
        },
      ],
    },
    contact: {
      eyebrow: 'Կապ',
      title: 'Կապ մեզ հետ',
      description:
        'Եթե ցանկանում եք կապ հաստատել, առաջարկ անել կամ ճշտել տեղեկություն, այստեղ կարող եք արագ տեսնել հիմնական կապի ուղիները։',
      sideTitle: 'Հետադարձ կապ',
      sideDescription:
        'Կոնտակտային տվյալները կարող են հետագայում միացվել իրական էլ. փոստի, հեռախոսի կամ ֆորմայի հետ։',
      highlights: ['Արագ կապ', 'Առաջարկների ընդունում', 'Աջակցություն այցելուներին'],
      items: [
        {
          title: 'Էլ. փոստ',
          description: 'info@jermuktravel.am',
        },
        {
          title: 'Հեռախոս',
          description: '+374 00 000000',
        },
        {
          title: 'Հասցե',
          description: 'Ջերմուկ, Հայաստան',
        },
      ],
    },
    terms: {
      eyebrow: 'Պայմաններ',
      title: 'Կայքի օգտագործման պայմաններ',
      description:
        'Այս բաժինը ներկայացնում է կայքի օգտագործման հիմնական կանոնները, որպեսզի այցելուի համար ամեն ինչ հստակ և պարզ լինի։',
      sideTitle: 'Հիմնական դրույթներ',
      sideDescription:
        'Բովանդակությունը նախատեսված է որպես տեղեկատվական ուղեցույց և կարող է ժամանակ առ ժամանակ թարմացվել։',
      highlights: ['Պարզ ձևակերպումներ', 'Թափանցիկ օգտագործում', 'Թարմացվող կանոններ'],
      items: [
        {
          title: 'Տեղեկատվական նպատակ',
          description:
            'Jermuk Travel-ը ծառայում է որպես թվային ուղեցույց և օգնում է մարդկանց արագ գտնել անհրաժեշտ տեղեկությունը քաղաքի մասին։',
        },
        {
          title: 'Բովանդակության թարմացում',
          description:
            'Կայքի որոշ տվյալներ կարող են փոփոխվել կամ լրացվել CMS-ի միջոցով՝ առանց նախնական ծանուցման։',
        },
        {
          title: 'Օգտագործման պատասխանատվություն',
          description:
            'Այցելուն ինքն է որոշում ինչպես օգտագործել ներկայացված տեղեկությունը իր այցը պլանավորելիս։',
        },
      ],
    },
    privacy: {
      eyebrow: 'Գաղտնիություն',
      title: 'Գաղտնիության ամփոփ քաղաքականություն',
      description:
        'Այստեղ ներկայացված է, թե ինչպիսի հիմնական տվյալներ կարող են օգտագործվել կայքի աշխատանքի և վիճակագրության համար։',
      sideTitle: 'Ինչ է պահպանվում',
      sideDescription:
        'Կայքը պահպանում է միայն անհրաժեշտ տեխնիկական տվյալներ, օրինակ դիտումների հաշվարկը, որպեսզի փորձառությունը բարելավվի։',
      highlights: ['Թեթև analytics', 'Անվտանգ մոտեցում', 'Պարզ բացատրություն'],
      items: [
        {
          title: 'Դիտումների վիճակագրություն',
          description:
            'Այցերի քանակը կարող է պահպանվել ընդհանուր վիճակագրության տեսքով, որպեսզի հասկանալի լինի որ բաժիններն են ամենաշատ օգտագործվում։',
        },
        {
          title: 'Կոնտակտային տվյալներ',
          description:
            'Եթե հետագայում ավելացվեն ֆորմաներ կամ կապի դաշտեր, դրանք կօգտագործվեն միայն պատասխանելու և աջակցություն տրամադրելու համար։',
        },
        {
          title: 'Թարմացման հնարավորություն',
          description:
            'Գաղտնիության մոտեցումը կարող է թարմացվել կայքի զարգացմանը զուգահեռ, որպեսզի մնա արդիական և հստակ։',
        },
      ],
    },
  },
  en: {
    help: {
      eyebrow: 'Help',
      title: 'Help for Visitors',
      description:
        'A quick guide for people using Jermuk Travel for the first time and wanting to understand where to begin.',
      sideTitle: 'Quick Start',
      sideDescription:
        'Begin from the homepage, continue to Places or Routes, and use Jermuk AI for fast answers.',
      highlights: ['Simple steps', 'Mobile-friendly', 'Fast orientation'],
      items: [
        {
          title: 'How to use the site',
          description:
            'Start from the homepage and open the section that matches what you want to explore in Jermuk.',
        },
        {
          title: 'How to find directions',
          description:
            'Open Jermuk AI or the relevant place card to understand where the destination is and how to reach it.',
        },
        {
          title: 'How to plan a day',
          description:
            'Use the Routes section to quickly choose a ready-made flow for a calm day or weekend stay.',
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently Asked Questions',
      description:
        'Common visitor questions are collected here so people can find useful answers without searching too much.',
      sideTitle: 'Most Common',
      sideDescription:
        'If your question is not here, use the Contact page or ask Jermuk AI directly.',
      highlights: ['Quick answers', 'Clear language', 'Visitor-friendly'],
      items: [
        {
          title: 'When is the best time to visit Jermuk',
          description:
            'Jermuk is attractive all year, and the Routes section shows which season fits each kind of visit best.',
        },
        {
          title: 'Can I use the site on mobile',
          description:
            'Yes, the experience is designed for both mobile and desktop use.',
        },
        {
          title: 'What is Jermuk AI for',
          description:
            'Jermuk AI helps visitors quickly find places, routes, and simple planning support.',
        },
      ],
    },
    about: {
      eyebrow: 'About',
      title: 'About Jermuk Travel',
      description:
        'Jermuk Travel presents the city through a cleaner, calmer, and more modern digital experience.',
      sideTitle: 'Our Goal',
      sideDescription:
        'Help people quickly understand what exists in the city, where to go, and how to enjoy their time in Jermuk.',
      highlights: ['City guide', 'Multi-language', 'AI support'],
      items: [
        {
          title: 'Why this project exists',
          description:
            'To present Jermuk through a polished digital guide instead of heavy and confusing information blocks.',
        },
        {
          title: 'What the site includes',
          description:
            'Places, travel routes, AI guidance, and the foundation for a future mobile app.',
        },
        {
          title: 'How it will grow',
          description:
            'The CMS allows content to expand with new places, routes, and useful city information.',
        },
      ],
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Contact Us',
      description:
        'For questions, collaboration, or useful suggestions, these are the main contact details for the project.',
      sideTitle: 'Reach Out',
      sideDescription:
        'These details can later be connected to a real form, email inbox, or support channel.',
      highlights: ['Quick contact', 'Open for ideas', 'Visitor support'],
      items: [
        {
          title: 'Email',
          description: 'info@jermuktravel.am',
        },
        {
          title: 'Phone',
          description: '+374 00 000000',
        },
        {
          title: 'Address',
          description: 'Jermuk, Armenia',
        },
      ],
    },
    terms: {
      eyebrow: 'Terms',
      title: 'Website Terms of Use',
      description:
        'This page outlines the main terms for using the site so visitors understand the experience in a clear and simple way.',
      sideTitle: 'Key Points',
      sideDescription:
        'The website acts as an informational city guide, and content may be refined over time as the project grows.',
      highlights: ['Clear wording', 'Transparent use', 'Flexible updates'],
      items: [
        {
          title: 'Informational purpose',
          description:
            'Jermuk Travel is designed as a digital guide to help visitors quickly discover places, routes, and useful city details.',
        },
        {
          title: 'Content updates',
          description:
            'Some content may be updated or expanded through the CMS without prior notice as the project evolves.',
        },
        {
          title: 'Visitor responsibility',
          description:
            'Visitors decide how to use the information on the site while planning their own experience in Jermuk.',
        },
      ],
    },
    privacy: {
      eyebrow: 'Privacy',
      title: 'Privacy Overview',
      description:
        'This page explains what basic data may be used to support the site experience and general analytics.',
      sideTitle: 'What Is Stored',
      sideDescription:
        'Only lightweight technical information is used when needed, such as view statistics, to improve the experience.',
      highlights: ['Light analytics', 'Safer handling', 'Simple explanation'],
      items: [
        {
          title: 'View analytics',
          description:
            'General page-view counts may be stored to understand which parts of the website are used most often.',
        },
        {
          title: 'Contact details',
          description:
            'If contact forms are added later, submitted details would be used only to respond and provide support.',
        },
        {
          title: 'Policy updates',
          description:
            'The privacy approach may be updated as the website grows, keeping the explanation current and clear.',
        },
      ],
    },
  },
  ru: {
    help: {
      eyebrow: 'Помощь',
      title: 'Помощь для посетителей',
      description:
        'Краткий гид для тех, кто впервые пользуется Jermuk Travel и хочет быстро понять, с чего начать.',
      sideTitle: 'Быстрый старт',
      sideDescription:
        'Начните с главной страницы, затем откройте Места или Маршруты и при необходимости используйте Jermuk AI.',
      highlights: ['Понятные шаги', 'Удобно на телефоне', 'Быстрая навигация'],
      items: [
        {
          title: 'Как пользоваться сайтом',
          description:
            'Откройте нужный раздел и переходите к местам или маршрутам, которые интересуют именно вас.',
        },
        {
          title: 'Как найти направление',
          description:
            'Используйте Jermuk AI или карточку нужного места, чтобы быстрее понять, куда идти.',
        },
        {
          title: 'Как спланировать день',
          description:
            'Раздел маршрутов помогает быстро выбрать готовый вариант для спокойного дня или выходных.',
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Часто задаваемые вопросы',
      description:
        'Здесь собраны самые частые вопросы, чтобы посетитель быстро находил нужный ответ.',
      sideTitle: 'Популярные вопросы',
      sideDescription:
        'Если нужного ответа здесь нет, можно перейти в Contact или спросить Jermuk AI.',
      highlights: ['Быстрые ответы', 'Простой язык', 'Полезно гостям города'],
      items: [
        {
          title: 'Когда лучше ехать в Джермук',
          description:
            'Город интересен круглый год, а раздел маршрутов подсказывает, какой сезон лучше подходит для каждой поездки.',
        },
        {
          title: 'Можно ли пользоваться сайтом с телефона',
          description:
            'Да, сайт адаптирован и для мобильных устройств, и для компьютеров.',
        },
        {
          title: 'Для чего нужен Jermuk AI',
          description:
            'Он помогает быстро найти места, маршруты и получить простые рекомендации по посещению города.',
        },
      ],
    },
    about: {
      eyebrow: 'О нас',
      title: 'О Jermuk Travel',
      description:
        'Jermuk Travel создан для того, чтобы представить город в современной, красивой и понятной цифровой форме.',
      sideTitle: 'Наша цель',
      sideDescription:
        'Помочь людям быстро понять, что есть в городе, куда идти и как лучше провести время в Джермуке.',
      highlights: ['Цифровой гид', 'Несколько языков', 'AI поддержка'],
      items: [
        {
          title: 'Зачем создан этот проект',
          description:
            'Чтобы рассказать о Джермуке через удобный и красивый цифровой опыт, а не через перегруженные тексты.',
        },
        {
          title: 'Что входит в сайт',
          description:
            'Карточки мест, готовые маршруты, AI-помощник и база для будущего мобильного приложения.',
        },
        {
          title: 'Как проект будет расти',
          description:
            'Через CMS можно добавлять новые места, маршруты и полезную информацию о городе.',
        },
      ],
    },
    contact: {
      eyebrow: 'Контакты',
      title: 'Связаться с нами',
      description:
        'Если вы хотите задать вопрос, предложить идею или уточнить информацию, здесь собраны основные контакты.',
      sideTitle: 'Обратная связь',
      sideDescription:
        'Позже эти контакты можно связать с реальной формой, почтой или каналом поддержки.',
      highlights: ['Быстрая связь', 'Открыты к идеям', 'Поддержка гостей'],
      items: [
        {
          title: 'Email',
          description: 'info@jermuktravel.am',
        },
        {
          title: 'Телефон',
          description: '+374 00 000000',
        },
        {
          title: 'Адрес',
          description: 'Джермук, Армения',
        },
      ],
    },
    terms: {
      eyebrow: 'Условия',
      title: 'Условия использования сайта',
      description:
        'На этой странице собраны основные условия использования сайта, чтобы для посетителя все было понятно и прозрачно.',
      sideTitle: 'Главные положения',
      sideDescription:
        'Сайт работает как информационный гид по городу, а его содержание может постепенно обновляться.',
      highlights: ['Понятные формулировки', 'Прозрачное использование', 'Актуальные обновления'],
      items: [
        {
          title: 'Информационный формат',
          description:
            'Jermuk Travel создан как цифровой гид, который помогает быстро находить места, маршруты и полезную информацию о городе.',
        },
        {
          title: 'Обновление контента',
          description:
            'Некоторые материалы могут обновляться или дополняться через CMS без отдельного уведомления.',
        },
        {
          title: 'Ответственность посетителя',
          description:
            'Посетитель сам решает, как использовать информацию сайта при планировании своего отдыха в Джермуке.',
        },
      ],
    },
    privacy: {
      eyebrow: 'Конфиденциальность',
      title: 'Краткая политика конфиденциальности',
      description:
        'Здесь кратко объясняется, какие базовые данные могут использоваться для работы сайта и общей статистики.',
      sideTitle: 'Что сохраняется',
      sideDescription:
        'При необходимости используются только базовые технические данные, например статистика просмотров страниц.',
      highlights: ['Легкая аналитика', 'Более безопасный подход', 'Простое объяснение'],
      items: [
        {
          title: 'Статистика просмотров',
          description:
            'Общее количество посещений может сохраняться для понимания того, какие разделы сайта наиболее востребованы.',
        },
        {
          title: 'Контактные данные',
          description:
            'Если позже появятся формы связи, введенные данные будут использоваться только для ответа и поддержки.',
        },
        {
          title: 'Обновление политики',
          description:
            'Подход к конфиденциальности может обновляться по мере развития сайта, чтобы оставаться понятным и актуальным.',
        },
      ],
    },
  },
}
