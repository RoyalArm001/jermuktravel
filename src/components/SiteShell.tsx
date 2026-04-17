import { useEffect, useMemo } from 'react'
import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { AIWidget } from './AIWidget'
import { Header } from './Header'
import { WeatherSkyBackground } from './WeatherSkyBackground'
import { useSite } from '../context/useSite'
import { isLanguage } from '../lib/storage'
import { useJermukWeather } from '../lib/useJermukWeather'
import { usePageViewAnalytics } from '../lib/useViewAnalytics'
import { buildLocalizedPath, buildPublicSeo, useSeo } from '../lib/seo'

export function SiteShell() {
  const { content, language, setLanguage } = useSite()
  const weather = useJermukWeather()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const views = usePageViewAnalytics(location.pathname, location.key ?? location.pathname)
  const copy = content[language]
  const urlLanguage = searchParams.get('lang')
  const viewLabelMap = {
    hy: 'Դիտումներ',
    en: 'Views',
    ru: 'Просмотры',
  } as const
  const footerBarCopy = {
    hy: {
      rights: 'Բոլոր իրավունքները պաշտպանված են։',
      terms: 'Պայմաններ',
      privacy: 'Գաղտնիություն',
      contact: 'Կապ',
      about: 'Քաղաքի մասին',
      email: 'Էլ. փոստ',
      phone: 'Զանգ',
      ai: 'Jermuk AI',
      routes: 'Երթուղիներ',
    },
    en: {
      rights: 'All rights reserved.',
      terms: 'Terms',
      privacy: 'Privacy',
      contact: 'Contact',
      about: 'About the city',
      email: 'Email',
      phone: 'Call',
      ai: 'Jermuk AI',
      routes: 'Routes',
    },
    ru: {
      rights: 'Все права защищены.',
      terms: 'Условия',
      privacy: 'Конфиденциальность',
      contact: 'Контакты',
      about: 'О городе',
      email: 'Почта',
      phone: 'Звонок',
      ai: 'Jermuk AI',
      routes: 'Маршруты',
    },
  } as const
  const footerCopy = footerBarCopy[language]
  const footerLinks = [
    { to: buildLocalizedPath('/terms', language), label: footerCopy.terms },
    { to: buildLocalizedPath('/privacy', language), label: footerCopy.privacy },
    { to: buildLocalizedPath('/contact', language), label: footerCopy.contact },
    { to: buildLocalizedPath('/about', language), label: footerCopy.about },
  ]
  const footerActions = [
    {
      href: 'mailto:info@jermuktravel.am',
      label: footerCopy.email,
      icon: <MailIcon />,
    },
    {
      href: 'tel:+37400000000',
      label: footerCopy.phone,
      icon: <PhoneIcon />,
    },
    {
      to: buildLocalizedPath('/ai', language),
      label: footerCopy.ai,
      icon: <SparkIcon />,
    },
    {
      to: buildLocalizedPath('/routes', language),
      label: footerCopy.routes,
      icon: <ArrowIcon />,
    },
  ] as const
  const seo = useMemo(
    () => buildPublicSeo({ pathname: location.pathname, language, copy }),
    [copy, language, location.pathname],
  )

  useSeo(seo)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (!isLanguage(urlLanguage) || urlLanguage === language) {
      return
    }

    setLanguage(urlLanguage)
  }, [language, setLanguage, urlLanguage])

  useEffect(() => {
    if (urlLanguage === language) {
      return
    }

    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('lang', language)
    setSearchParams(nextSearchParams, { replace: true })
  }, [language, searchParams, setSearchParams, urlLanguage])

  return (
    <div className="app-shell">
      <WeatherSkyBackground weather={weather} />
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="ambient ambient-c" />

      <Header
        copy={copy}
        language={language}
        weather={weather}
        onLanguageChange={setLanguage}
      />

      <main className="home-page">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div>
            <strong>{copy.footer.tagline}</strong>
            <p>{copy.footer.subline}</p>
          </div>

          <div className="footer-views">
            <strong>{viewLabelMap[language]}</strong>
            <p>{views.total.toLocaleString(language === 'hy' ? 'hy-AM' : language === 'ru' ? 'ru-RU' : 'en-US')}</p>
          </div>
        </div>

        <div className="footer-utility-bar">
          <div className="footer-legal">
            <span>&copy; Jermuk Travel.</span>
            <span>{footerCopy.rights}</span>
          </div>

          <div className="footer-link-row">
            {footerLinks.map((item) => (
              <Link key={item.to} className="footer-link" to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="footer-icon-row">
            {footerActions.map((item) =>
              'href' in item ? (
                <a
                  key={item.label}
                  className="footer-icon-link"
                  href={item.href}
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ) : (
                <Link
                  key={item.label}
                  className="footer-icon-link"
                  to={item.to}
                  aria-label={item.label}
                >
                  {item.icon}
                </Link>
              ),
            )}
          </div>
        </div>
      </footer>

      <AIWidget key={language} copy={copy} />
    </div>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6.75A1.75 1.75 0 0 1 5.75 5h12.5A1.75 1.75 0 0 1 20 6.75v10.5A1.75 1.75 0 0 1 18.25 19H5.75A1.75 1.75 0 0 1 4 17.25V6.75Zm2.08-.25L12 11.3l5.92-4.8H6.08Zm12.42 1.96-5.55 4.5a1.5 1.5 0 0 1-1.9 0L5.5 8.46v8.79c0 .14.11.25.25.25h12.5c.14 0 .25-.11.25-.25V8.46Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7.02 4.5h2.13c.34 0 .64.23.72.56l.67 2.67a.75.75 0 0 1-.21.72L9.1 9.69a11.52 11.52 0 0 0 5.2 5.2l1.24-1.23a.75.75 0 0 1 .72-.21l2.67.67c.33.08.56.38.56.72v2.13c0 .4-.31.73-.71.75l-1.06.05c-7.1 0-12.84-5.75-12.84-12.84l.05-1.06c.02-.4.35-.71.75-.71Zm1.54 1.5H6.98l-.02.32a11.34 11.34 0 0 0 10.72 10.72l.32-.02v-1.58l-1.42-.35-1.53 1.53a.75.75 0 0 1-.86.14 13.01 13.01 0 0 1-6.97-6.97.75.75 0 0 1 .14-.86l1.53-1.53L8.56 6Z"
        fill="currentColor"
      />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5a.75.75 0 0 1 .73.57l1.05 4.1 4.1 1.05a.75.75 0 0 1 0 1.46l-4.1 1.05-1.05 4.1a.75.75 0 0 1-1.46 0l-1.05-4.1-4.1-1.05a.75.75 0 0 1 0-1.46l4.1-1.05 1.05-4.1A.75.75 0 0 1 12 2.5Zm5.5 11a.75.75 0 0 1 .73.57l.42 1.65 1.65.42a.75.75 0 0 1 0 1.46l-1.65.42-.42 1.65a.75.75 0 0 1-1.46 0l-.42-1.65-1.65-.42a.75.75 0 0 1 0-1.46l1.65-.42.42-1.65a.75.75 0 0 1 .73-.57Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M18.78 5.47a.75.75 0 0 1 .75.75v11.56a.75.75 0 0 1-1.28.53l-3.06-3.06-3.33 3.33a.75.75 0 0 1-1.06 0L8.2 15.97l-4.67 4.67a.75.75 0 0 1-1.06-1.06l5.2-5.2a.75.75 0 0 1 1.06 0l2.6 2.6 2.8-2.8-3.06-3.06a.75.75 0 0 1 .53-1.28h6.18V6.22a.75.75 0 0 1 .75-.75Z"
        fill="currentColor"
      />
    </svg>
  )
}
