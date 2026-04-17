import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'
import { InstallAppButton } from './InstallAppButton'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { DirectoryCategoryId, Language, SiteLanguageContent } from '../types'
import { buildLocalizedPath } from '../lib/seo'
import { getWeatherLabel, type LiveWeather } from '../lib/weather'

type HeaderIconName =
  | 'home'
  | 'places'
  | 'routes'
  | 'ai'
  | 'more'
  | 'help'
  | 'faq'
  | 'about'
  | 'contact'

interface HeaderProps {
  copy: SiteLanguageContent
  language: Language
  weather: LiveWeather
  onLanguageChange: (language: Language) => void
}

type DirectoryLinkTarget =
  | {
      kind: 'internal'
      to: string
    }
  | {
      kind: 'external'
      href: string
      external: boolean
    }

export function Header({
  copy,
  language,
  weather,
  onLanguageChange,
}: HeaderProps) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [directoryOpen, setDirectoryOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const directoryMenuRef = useRef<HTMLDivElement | null>(null)
  const moreMenuRef = useRef<HTMLDivElement | null>(null)
  const weatherLabel = getWeatherLabel(language, weather.category)
  const temperature = `${Math.round(weather.temperature)}°C`
  const directoryMenu = copy.directoryMenu
  const navItems: Array<{
    path: string
    to: string
    label: string
    icon: HeaderIconName
    end?: boolean
  }> = [
    { path: '/', to: buildLocalizedPath('/', language), label: copy.navigation.discover, end: true, icon: 'home' },
    { path: '/places', to: buildLocalizedPath('/places', language), label: copy.navigation.places, icon: 'places' },
    { path: '/routes', to: buildLocalizedPath('/routes', language), label: copy.navigation.routes, icon: 'routes' },
    { path: '/ai', to: buildLocalizedPath('/ai', language), label: copy.navigation.ai, icon: 'ai' },
  ]
  const moreItems: Array<{
    path: string
    to: string
    label: string
    icon: HeaderIconName
  }> = [
    { path: '/help', to: buildLocalizedPath('/help', language), label: copy.navigation.help, icon: 'help' },
    { path: '/faq', to: buildLocalizedPath('/faq', language), label: copy.navigation.faq, icon: 'faq' },
    { path: '/about', to: buildLocalizedPath('/about', language), label: copy.navigation.about, icon: 'about' },
    { path: '/contact', to: buildLocalizedPath('/contact', language), label: copy.navigation.contact, icon: 'contact' },
  ]
  const isMoreRoute = moreItems.some((item) => item.path === location.pathname)
  const mobileActiveIndex = isMoreRoute || menuOpen
    ? navItems.length
    : Math.max(
        navItems.findIndex((item) =>
          item.end ? location.pathname === item.path : location.pathname === item.path,
        ),
        0,
      )
  const mobileTabStyle = {
    '--mobile-tab-index': mobileActiveIndex,
  } as CSSProperties
  const mobileMoreActive = isMoreRoute || menuOpen

  const closeMenus = () => {
    setMenuOpen(false)
    setDirectoryOpen(false)
    setMoreOpen(false)
  }

  const toggleMobileMore = () => {
    const shouldOpen = !(menuOpen && moreOpen)
    setMenuOpen(shouldOpen)
    setMoreOpen(shouldOpen)
  }

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1440 && menuOpen) {
        setMenuOpen(false)
        setDirectoryOpen(false)
        setMoreOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!directoryOpen && !moreOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target

      if (!(target instanceof Node)) {
        return
      }

      const insideDirectory = directoryMenuRef.current?.contains(target) ?? false
      const insideMore = moreMenuRef.current?.contains(target) ?? false

      if (!insideDirectory && !insideMore) {
        setDirectoryOpen(false)
        setMoreOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDirectoryOpen(false)
        setMoreOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [directoryOpen, moreOpen])

  return (
    <>
      <div
        className={`menu-backdrop${menuOpen ? ' is-open' : ''}`}
        onClick={closeMenus}
        aria-hidden="true"
      />

      <header className="site-header">
        <Link className="brand-mark" to={buildLocalizedPath('/', language)} onClick={closeMenus}>
          <span className="brand-pill">
            <BrandLogo className="brand-logo-image" alt="" />
          </span>
          <span className="brand-copy">
            <strong>{copy.brand}</strong>
            <small>{copy.cityLine}</small>
          </span>
        </Link>

        <button
          type="button"
          className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
          onClick={() => {
            setMenuOpen((open) => !open)
            setDirectoryOpen(false)
            setMoreOpen(false)
          }}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`header-panel${menuOpen ? ' is-open' : ''}`}>
          <div className="header-panel-head">
            <div className="header-panel-brand">
              <span className="brand-pill brand-pill-compact">
                <BrandLogo className="brand-logo-image" alt="" />
              </span>
              <div className="header-panel-copy">
                <strong>{copy.brand}</strong>
                <small>{copy.cityLine}</small>
              </div>
            </div>

            <button
              type="button"
              className="menu-close"
              onClick={closeMenus}
              aria-label="Close menu"
            >
              x
            </button>
          </div>

          <nav className="site-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                onClick={closeMenus}
              >
                {({ isActive }) => (
                  <>
                    <HeaderNavIcon
                      className="nav-link-icon"
                      name={item.icon}
                      active={isActive}
                    />
                    <span className="nav-link-label">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}

            <div
              ref={directoryMenuRef}
              className={`nav-more nav-directory-dropdown${directoryOpen ? ' is-open' : ''}`}
            >
              <button
                type="button"
                className={`nav-more-trigger${directoryOpen ? ' active' : ''}`}
                aria-expanded={directoryOpen}
                aria-haspopup="true"
                onClick={() => {
                  setDirectoryOpen((open) => !open)
                  setMoreOpen(false)
                }}
              >
                <HeaderNavIcon
                  className="nav-link-icon"
                  name="places"
                  active={directoryOpen}
                />
                <span className="nav-link-label">{directoryMenu.kicker}</span>
                <span className="nav-more-caret" aria-hidden="true">
                  ▾
                </span>
              </button>

              <div className="nav-more-menu nav-directory-menu">
                <div className="nav-directory-block">
                  <div className="nav-directory-grid">
                    {directoryMenu.items.map((item) => {
                      const linkTarget = getDirectoryLinkTarget(item.to, language)
                      const cardContent = (
                        <>
                          <span className="nav-directory-icon-shell" aria-hidden="true">
                            <DirectoryCardIcon name={item.id} />
                          </span>

                          <span className="nav-directory-copy">
                            <span className="nav-directory-label">{item.label}</span>
                          </span>

                          <span className="nav-directory-arrow" aria-hidden="true">
                            →
                          </span>
                        </>
                      )

                      return linkTarget ? (
                        linkTarget.kind === 'internal' ? (
                          <Link
                            key={item.id}
                            className="nav-directory-card"
                            data-directory-tone={item.id}
                            to={linkTarget.to}
                            onClick={closeMenus}
                          >
                            {cardContent}
                          </Link>
                        ) : (
                          <a
                            key={item.id}
                            className="nav-directory-card"
                            data-directory-tone={item.id}
                            href={linkTarget.href}
                            onClick={closeMenus}
                            {...(linkTarget.external
                              ? { target: '_blank', rel: 'noreferrer' }
                              : {})}
                          >
                            {cardContent}
                          </a>
                        )
                      ) : (
                        <div
                          key={item.id}
                          className="nav-directory-card nav-directory-card-placeholder"
                          data-directory-tone={item.id}
                        >
                          {cardContent}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={moreMenuRef}
              className={`nav-more${moreOpen ? ' is-open' : ''}${isMoreRoute ? ' is-active' : ''}`}
            >
              <button
                type="button"
                className={`nav-more-trigger${isMoreRoute ? ' active' : ''}`}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                onClick={() => {
                  setMoreOpen((open) => !open)
                  setDirectoryOpen(false)
                }}
              >
                <HeaderNavIcon
                  className="nav-link-icon"
                  name="more"
                  active={isMoreRoute || moreOpen}
                />
                <span className="nav-link-label">{copy.navigation.more}</span>
                <span className="nav-more-caret" aria-hidden="true">
                  ▾
                </span>
              </button>

              <div className="nav-more-menu nav-utility-menu">
                <div className="nav-more-links">
                  {moreItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.to}
                      className={({ isActive }) => (isActive ? 'active' : undefined)}
                      onClick={closeMenus}
                    >
                      {({ isActive }) => (
                        <>
                          <HeaderNavIcon
                            className="nav-link-icon"
                            name={item.icon}
                            active={isActive}
                          />
                          <span className="nav-link-label">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="header-actions">
            <div
              className={`header-weather weather-${weather.category}`}
              aria-live="polite"
              aria-label={`Jermuk weather: ${weatherLabel}, ${temperature}`}
            >
              <span className="header-weather-dot" aria-hidden="true" />
              <span className="header-weather-label">{weatherLabel}</span>
              <strong>{temperature}</strong>
            </div>
            <InstallAppButton language={language} />
            <LanguageSwitcher
              language={language}
              onChange={(nextLanguage) => {
                onLanguageChange(nextLanguage)
                closeMenus()
              }}
              compact
            />
          </div>
        </div>
      </header>

      <nav className="mobile-tabbar" style={mobileTabStyle} aria-label="Mobile navigation">
        <div className="mobile-tabbar-shell">
          <span className="mobile-tab-indicator" aria-hidden="true" />

          <ul className="mobile-tabbar-list">
            <li>
              <NavLink
                to={buildLocalizedPath('/', language)}
                end
                className={({ isActive }) => `mobile-tab-link${isActive ? ' active' : ''}`}
                onClick={closeMenus}
                aria-label={copy.navigation.discover}
              >
                {({ isActive }) => (
                  <>
                    <MobileTabIcon name="home" active={isActive} />
                    <span className="sr-only">{copy.navigation.discover}</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to={buildLocalizedPath('/places', language)}
                className={({ isActive }) => `mobile-tab-link${isActive ? ' active' : ''}`}
                onClick={closeMenus}
                aria-label={copy.navigation.places}
              >
                {({ isActive }) => (
                  <>
                    <MobileTabIcon name="places" active={isActive} />
                    <span className="sr-only">{copy.navigation.places}</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to={buildLocalizedPath('/routes', language)}
                className={({ isActive }) => `mobile-tab-link${isActive ? ' active' : ''}`}
                onClick={closeMenus}
                aria-label={copy.navigation.routes}
              >
                {({ isActive }) => (
                  <>
                    <MobileTabIcon name="routes" active={isActive} />
                    <span className="sr-only">{copy.navigation.routes}</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to={buildLocalizedPath('/ai', language)}
                className={({ isActive }) => `mobile-tab-link${isActive ? ' active' : ''}`}
                onClick={closeMenus}
                aria-label={copy.navigation.ai}
              >
                {({ isActive }) => (
                  <>
                    <MobileTabIcon name="ai" active={isActive} />
                    <span className="sr-only">{copy.navigation.ai}</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <button
                type="button"
                className={`mobile-tab-button${mobileMoreActive ? ' active' : ''}`}
                onClick={toggleMobileMore}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                aria-label={copy.navigation.more}
              >
                <MobileTabIcon name="more" active={mobileMoreActive} />
                <span className="sr-only">{copy.navigation.more}</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}

function MobileTabIcon({
  name,
  active,
}: {
  name: HeaderIconName
  active: boolean
}) {
  return <HeaderNavIcon className="mobile-tab-icon" name={name} active={active} />
}

function getDirectoryLinkTarget(
  path: string,
  language: Language,
): DirectoryLinkTarget | null {
  const trimmedPath = path.trim()

  if (!trimmedPath) {
    return null
  }

  if (/^(https?:|mailto:|tel:)/i.test(trimmedPath)) {
    return {
      kind: 'external',
      href: trimmedPath,
      external: /^https?:/i.test(trimmedPath),
    }
  }

  const normalizedPath = trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`
  const [pathname, queryString = ''] = normalizedPath.split('?')
  const params = new URLSearchParams(queryString)
  params.set('lang', language)

  return {
    kind: 'internal',
    to: `${pathname}?${params.toString()}`,
  }
}

function DirectoryCardIcon({ name }: { name: DirectoryCategoryId }) {
  const sharedProps = {
    className: 'nav-directory-icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  } as const

  if (name === 'stay') {
    return (
      <svg {...sharedProps}>
        <path
          d="M4 12.75V8.5A1.5 1.5 0 0 1 5.5 7H7a2.5 2.5 0 0 1 5 0h4.5A1.5 1.5 0 0 1 18 8.5V12.75M4 12.75H18M4 12.75V16.5M18 12.75V16.5M6.5 16.5V14.75M15.5 16.5V14.75"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === 'food') {
    return (
      <svg {...sharedProps}>
        <path
          d="M7 4.5V11M10 4.5V11M8.5 11V19M15.5 4.5V10.5C15.5 11.8807 16.6193 13 18 13V19"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === 'leisure') {
    return (
      <svg {...sharedProps}>
        <path
          d="M12 4.5L13.9 8.35L18 10L13.9 11.65L12 15.5L10.1 11.65L6 10L10.1 8.35L12 4.5ZM18 15.25L18.75 16.75L20.25 17.5L18.75 18.25L18 19.75L17.25 18.25L15.75 17.5L17.25 16.75L18 15.25Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === 'tours') {
    return (
      <svg {...sharedProps}>
        <path
          d="M12 19.25C15.4518 19.25 18.25 16.4518 18.25 13C18.25 9.54822 15.4518 6.75 12 6.75C8.54822 6.75 5.75 9.54822 5.75 13C5.75 16.4518 8.54822 19.25 12 19.25ZM12 6.75V3.75M12 13L15.5 9.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === 'sights') {
    return (
      <svg {...sharedProps}>
        <path
          d="M4.5 18.25L9.1 11.75L12.35 15.5L14.85 12.75L19.5 18.25M8 8.25A1.25 1.25 0 1 0 8 5.75A1.25 1.25 0 0 0 8 8.25Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === 'essentials') {
    return (
      <svg {...sharedProps}>
        <path
          d="M12 6.25V17.75M6.25 12H17.75M6.75 4.75H17.25A2 2 0 0 1 19.25 6.75V17.25A2 2 0 0 1 17.25 19.25H6.75A2 2 0 0 1 4.75 17.25V6.75A2 2 0 0 1 6.75 4.75Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === 'shops') {
    return (
      <svg {...sharedProps}>
        <path
          d="M6 8.25H18L17 18.25H7L6 8.25ZM9 8.25V7.25A3 3 0 0 1 15 7.25V8.25"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === 'services') {
    return (
      <svg {...sharedProps}>
        <path
          d="M7.75 8.25A2.5 2.5 0 1 0 7.75 13.25A2.5 2.5 0 0 0 7.75 8.25ZM16.25 10.75A2.5 2.5 0 1 0 16.25 15.75A2.5 2.5 0 0 0 16.25 10.75ZM10 11.1L14 12.9M8.9 13.9L12.1 17.25M15.1 8.25L12.5 10.4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg {...sharedProps}>
      <path
        d="M5 15.25L7.75 10.75H16.5L19 15.25M8.25 15.25H15.75M8.25 18.25V16.75M15.75 18.25V16.75M9 10.75L10.25 6.75H14L15.25 10.75"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HeaderNavIcon({
  name,
  active,
  className,
}: {
  name: HeaderIconName
  active: boolean
  className?: string
}) {
  const sharedProps = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
  } as const

  if (name === 'home') {
    return active ? (
      <svg {...sharedProps}>
        <path
          d="M20.9992 11.8484L21 20.7181C21 21.1638 20.9536 21.3255 20.8664 21.4884C20.7793 21.6514 20.6514 21.7793 20.4884 21.8664C20.3255 21.9536 20.1638 22 19.7181 22H15.2819C14.8362 22 14.6745 21.9536 14.5116 21.8664C14.3486 21.7793 14.2207 21.6514 14.1336 21.4884C14.0464 21.3255 14 21.1638 14 20.7181V16.2819C14 15.8362 13.9536 15.6745 13.8664 15.5116C13.7793 15.3486 13.6514 15.2207 13.4884 15.1336C13.3255 15.0464 13.1638 15 12.7181 15H11.2819C10.8362 15 10.6745 15.0464 10.5116 15.1336C10.3486 15.2207 10.2207 15.3486 10.1336 15.5116C10.0464 15.6745 10 15.8362 10 16.2819V20.7181C10 21.1638 9.95359 21.3255 9.86643 21.4884C9.77928 21.6514 9.65139 21.7793 9.48842 21.8664C9.32546 21.9536 9.16382 22 8.71806 22H4.28194C3.83618 22 3.67454 21.9536 3.51158 21.8664C3.34861 21.7793 3.22072 21.6514 3.13357 21.4884C3.04641 21.3255 3 21.1638 3 20.7181V12.0465C3 11.2101 3.03626 10.9164 3.12103 10.5932C3.20581 10.2699 3.3391 9.98532 3.53316 9.71325L3.63288 9.58016C3.80691 9.36035 4.0367 9.13609 4.5722 8.68983L11.1575 3.20211C11.465 2.94583 11.5992 2.87958 11.7594 2.836C11.9195 2.79241 12.0805 2.79241 12.2406 2.836C12.4008 2.87958 12.535 2.94583 12.8425 3.20211L19.4278 8.68983C20.0704 9.22534 20.2728 9.44118 20.4668 9.71325C20.6609 9.98532 20.7942 10.2699 20.879 10.5932C20.9567 10.8895 20.9936 11.1609 20.9992 11.8484Z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg {...sharedProps}>
        <path
          d="M11.5358 2.91088C11.8081 2.69637 12.1919 2.69637 12.4642 2.91088L19.5708 8.51003C20.4733 9.2211 21 10.3067 21 11.4556V20.75C21 21.4404 20.4404 22 19.75 22H14.75C14.0596 22 13.5 21.4404 13.5 20.75V15.75C13.5 15.6119 13.3881 15.5 13.25 15.5H10.75C10.6119 15.5 10.5 15.6119 10.5 15.75V20.75C10.5 21.4404 9.94036 22 9.25 22H4.25C3.55964 22 3 21.4404 3 20.75V11.4556C3 10.3067 3.52672 9.2211 4.42923 8.51003L11.5358 2.91088ZM12 4.45482L5.35754 9.68827C4.81603 10.1149 4.5 10.7662 4.5 11.4556V20.5H9V15.75C9 14.7835 9.7835 14 10.75 14H13.25C14.2165 14 15 14.7835 15 15.75V20.5H19.5V11.4556C19.5 10.7662 19.184 10.1149 18.6425 9.68827L12 4.45482Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name === 'places') {
    return active ? (
      <svg {...sharedProps}>
        <path
          d="M13.821 6.5H19.75C20.8867 6.5 21.8266 7.34297 21.9785 8.43788L21.9948 8.59595L22 8.75V17.75C22 18.9409 21.0748 19.9156 19.904 19.9948L19.75 20H4.25C3.05914 20 2.08436 19.0748 2.00519 17.904L2 17.75V10.499L8.20693 10.5L8.40335 10.4914C8.79396 10.4572 9.16896 10.3214 9.49094 10.0977L9.64734 9.9785L13.821 6.5ZM8.20693 4C8.66749 4 9.1153 4.14129 9.49094 4.40235L9.64734 4.5215L11.75 6.273L8.68706 8.82617L8.60221 8.88738C8.51363 8.94232 8.41452 8.9782 8.31129 8.9927L8.20693 9L2 8.999V6.25C2 5.05914 2.92516 4.08436 4.09595 4.00519L4.25 4H8.20693Z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg {...sharedProps}>
        <path
          d="M8.20693 4C8.66749 4 9.1153 4.14129 9.49094 4.40235L9.64734 4.5215L12.022 6.5H19.75C20.8867 6.5 21.8266 7.34297 21.9785 8.43788L21.9948 8.59595L22 8.75V17.75C22 18.9409 21.0748 19.9156 19.904 19.9948L19.75 20H4.25C3.05914 20 2.08436 19.0748 2.00519 17.904L2 17.75V6.25C2 5.05914 2.92516 4.08436 4.09595 4.00519L4.25 4H8.20693ZM9.64734 9.9785C9.29353 10.2733 8.85906 10.4515 8.40335 10.4914L8.20693 10.5L3.5 10.499V17.75C3.5 18.1297 3.78215 18.4435 4.14823 18.4932L4.25 18.5H19.75C20.1297 18.5 20.4435 18.2178 20.4932 17.8518L20.5 17.75V8.75C20.5 8.3703 20.2178 8.05651 19.8518 8.00685L19.75 8H12.021L9.64734 9.9785ZM8.20693 5.5H4.25C3.8703 5.5 3.55651 5.78215 3.50685 6.14823L3.5 6.25V8.999L8.20693 9C8.34729 9 8.4841 8.96063 8.60221 8.88738L8.68706 8.82617L10.578 7.249L8.68706 5.67383C8.57923 5.58398 8.44893 5.52664 8.31129 5.5073L8.20693 5.5Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name === 'routes') {
    return active ? (
      <svg {...sharedProps}>
        <path
          d="M7 4.5A2.5 2.5 0 1 1 7 9.5A2.5 2.5 0 0 1 7 4.5ZM7 16.5A2.5 2.5 0 1 1 7 21.5A2.5 2.5 0 0 1 7 16.5ZM17 10.5A2.5 2.5 0 1 1 17 15.5A2.5 2.5 0 0 1 17 10.5ZM7 8.25C10.55 8.25 12.75 9.35 14.17 11.53L14.39 11.88C14.85 12.64 15.47 13 17 13V15C14.92 15 13.62 14.33 12.76 13.13L12.47 12.68C11.49 11.07 9.93 10.25 7 10.25V8.25ZM17 11.5C18.1 11.5 19 12.4 19 13.5C19 14.6 18.1 15.5 17 15.5C15.9 15.5 15 14.6 15 13.5C15 12.4 15.9 11.5 17 11.5Z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg {...sharedProps}>
        <path
          d="M7 4.75A2.25 2.25 0 1 0 7 9.25A2.25 2.25 0 0 0 7 4.75ZM2.75 7A4.25 4.25 0 1 1 11.25 7A4.25 4.25 0 0 1 2.75 7ZM17 10.75A2.25 2.25 0 1 0 17 15.25A2.25 2.25 0 0 0 17 10.75ZM12.75 13A4.25 4.25 0 1 1 21.25 13A4.25 4.25 0 0 1 12.75 13ZM7 16.75A2.25 2.25 0 1 0 7 21.25A2.25 2.25 0 0 0 7 16.75ZM2.75 19A4.25 4.25 0 1 1 11.25 19A4.25 4.25 0 0 1 2.75 19ZM7 9.75C10.348 9.75 12.385 10.8026 13.6947 12.7801C14.3006 13.6949 15.0956 14 17 14V12C15.6544 12 15.4494 11.8051 15.3603 11.6701C13.635 9.06588 10.902 7.75 7 7.75V9.75ZM8 12.5C8 12.2239 7.77614 12 7.5 12C7.22386 12 7 12.2239 7 12.5V13.087C7 14.2512 6.35598 15.3197 5.32745 15.8624L4.75 16.1671L5.68246 17.9368L6.25991 17.6321C7.94235 16.7444 9 15.0095 9 13.087V12.5H8Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name === 'ai') {
    return active ? (
      <svg {...sharedProps}>
        <path
          d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.3596 22 8.77516 21.6039 7.35578 20.8583L3.06538 21.9753C2.6111 22.0937 2.1469 21.8213 2.02858 21.367C1.99199 21.2266 1.99198 21.0791 2.02855 20.9386L3.1449 16.6502C2.3972 15.2294 2 13.6428 2 12C2 6.47715 6.47715 2 12 2ZM13.2517 13H8.75L8.64823 13.0068C8.28215 13.0565 8 13.3703 8 13.75C8 14.1297 8.28215 14.4435 8.64823 14.4932L8.75 14.5H13.2517L13.3535 14.4932C13.7196 14.4435 14.0017 14.1297 14.0017 13.75C14.0017 13.3703 13.7196 13.0565 13.3535 13.0068L13.2517 13ZM15.25 9.5H8.75L8.64823 9.50685C8.28215 9.55651 8 9.8703 8 10.25C8 10.6297 8.28215 10.9435 8.64823 10.9932L8.75 11H15.25L15.3518 10.9932C15.7178 10.9435 16 10.6297 16 10.25C16 9.8703 15.7178 9.55651 15.3518 9.50685L15.25 9.5Z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg {...sharedProps}>
        <path
          d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.3817 22 8.81782 21.6146 7.41286 20.888L3.58704 21.9553C2.92212 22.141 2.23258 21.7525 2.04691 21.0876C1.98546 20.8676 1.98549 20.6349 2.04695 20.4151L3.11461 16.5922C2.38637 15.186 2 13.6203 2 12C2 6.47715 6.47715 2 12 2ZM12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 13.4696 3.87277 14.8834 4.57303 16.1375L4.72368 16.4072L3.61096 20.3914L7.59755 19.2792L7.86709 19.4295C9.12006 20.1281 10.5322 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM8.75 13H13.2483C13.6625 13 13.9983 13.3358 13.9983 13.75C13.9983 14.1297 13.7161 14.4435 13.35 14.4932L13.2483 14.5H8.75C8.33579 14.5 8 14.1642 8 13.75C8 13.3703 8.28215 13.0565 8.64823 13.0068L8.75 13H13.2483H8.75ZM8.75 9.5H15.2545C15.6687 9.5 16.0045 9.83579 16.0045 10.25C16.0045 10.6297 15.7223 10.9435 15.3563 10.9932L15.2545 11H8.75C8.33579 11 8 10.6642 8 10.25C8 9.8703 8.28215 9.55651 8.64823 9.50685L8.75 9.5H15.2545H8.75Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name === 'help') {
    return (
      <svg {...sharedProps}>
        <path
          d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19.25C7.99 19.25 4.75 16.01 4.75 12C4.75 7.99 7.99 4.75 12 4.75C16.01 4.75 19.25 7.99 19.25 12C19.25 16.01 16.01 19.25 12 19.25ZM12.08 7.5C10.29 7.5 9.02 8.62 8.86 10.24H10.66C10.77 9.54 11.32 9.14 12.04 9.14C12.87 9.14 13.43 9.59 13.43 10.34C13.43 10.96 13.08 11.33 12.33 11.77C11.21 12.43 10.82 12.99 10.82 14.16V14.4H12.56V14.2C12.56 13.52 12.77 13.25 13.57 12.75C14.55 12.14 15.18 11.43 15.18 10.28C15.18 8.58 13.82 7.5 12.08 7.5ZM11.61 16.91C12.27 16.91 12.78 16.42 12.78 15.76C12.78 15.09 12.27 14.61 11.61 14.61C10.95 14.61 10.45 15.09 10.45 15.76C10.45 16.42 10.95 16.91 11.61 16.91Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name === 'faq') {
    return active ? (
      <svg {...sharedProps}>
        <path
          d="M12 2C17.52 2 22 6.02 22 10.98C22 15.95 17.52 19.97 12 19.97C10.99 19.97 10.03 19.83 9.13 19.57L4.56 21.77A.77.77 0 0 1 3.5 21.08L4.08 16.78C2.77 15.18 2 13.16 2 10.98C2 6.02 6.48 2 12 2ZM8.4 9.9H15.6V8.3H8.4V9.9ZM8.4 13.05H13.45V11.45H8.4V13.05Z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg {...sharedProps}>
        <path
          d="M12 2.75C6.92 2.75 2.75 6.47 2.75 10.98C2.75 13.01 3.6 14.89 5.03 16.33L5.26 16.56L4.76 20.28L8.73 18.37L9 18.45C9.92 18.73 10.93 18.88 12 18.88C17.08 18.88 21.25 15.16 21.25 10.65C21.25 6.15 17.08 2.75 12 2.75ZM1.25 10.98C1.25 5.58 6.09 1.25 12 1.25C17.91 1.25 22.75 5.56 22.75 10.98C22.75 16.38 17.91 20.38 12 20.38C10.96 20.38 9.95 20.26 9.01 20.02L4.29 22.28A.75.75 0 0 1 3.22 21.52L3.83 16.95C2.17 15.26 1.25 13.18 1.25 10.98ZM8.4 9.9H15.6V8.3H8.4V9.9ZM8.4 13.05H13.45V11.45H8.4V13.05Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name === 'about') {
    return active ? (
      <svg {...sharedProps}>
        <path
          d="M12 2.5A9.5 9.5 0 1 0 12 21.5A9.5 9.5 0 0 0 12 2.5ZM12 7.2A1.2 1.2 0 1 1 12 9.6A1.2 1.2 0 0 1 12 7.2ZM10.95 11H13.05V16.8H10.95V11Z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg {...sharedProps}>
        <path
          d="M12 2.75A9.25 9.25 0 1 0 12 21.25A9.25 9.25 0 0 0 12 2.75ZM4.25 12A7.75 7.75 0 1 1 19.75 12A7.75 7.75 0 0 1 4.25 12ZM12 7.1A1.1 1.1 0 1 0 12 9.3A1.1 1.1 0 0 0 12 7.1ZM11.25 10.75H12.75C13.03 10.75 13.25 10.97 13.25 11.25V16.5H11.75V12.25H11.25V10.75Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name === 'contact') {
    return active ? (
      <svg {...sharedProps}>
        <path
          d="M7.02 4.5h2.13c.34 0 .64.23.72.56l.67 2.67a.75.75 0 0 1-.21.72L9.1 9.69a11.52 11.52 0 0 0 5.2 5.2l1.24-1.23a.75.75 0 0 1 .72-.21l2.67.67c.33.08.56.38.56.72v2.13c0 .4-.31.73-.71.75l-1.06.05c-7.1 0-12.84-5.75-12.84-12.84l.05-1.06c.02-.4.35-.71.75-.71Z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg {...sharedProps}>
        <path
          d="M7.02 4.5h2.13c.34 0 .64.23.72.56l.67 2.67a.75.75 0 0 1-.21.72L9.1 9.69a11.52 11.52 0 0 0 5.2 5.2l1.24-1.23a.75.75 0 0 1 .72-.21l2.67.67c.33.08.56.38.56.72v2.13c0 .4-.31.73-.71.75l-1.06.05c-7.1 0-12.84-5.75-12.84-12.84l.05-1.06c.02-.4.35-.71.75-.71Zm1.54 1.5H6.98l-.02.32a11.34 11.34 0 0 0 10.72 10.72l.32-.02v-1.58l-1.42-.35-1.53 1.53a.75.75 0 0 1-.86.14 13.01 13.01 0 0 1-6.97-6.97.75.75 0 0 1 .14-.86l1.53-1.53L8.56 6Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name === 'more') {
    return active ? (
      <svg {...sharedProps}>
        <path
          d="M6 10A2 2 0 1 1 6 14A2 2 0 0 1 6 10ZM12 10A2 2 0 1 1 12 14A2 2 0 0 1 12 10ZM18 10A2 2 0 1 1 18 14A2 2 0 0 1 18 10Z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg {...sharedProps}>
        <path
          d="M6 10.75A1.25 1.25 0 1 0 6 13.25A1.25 1.25 0 0 0 6 10.75ZM3.25 12A2.75 2.75 0 1 1 8.75 12A2.75 2.75 0 0 1 3.25 12ZM12 10.75A1.25 1.25 0 1 0 12 13.25A1.25 1.25 0 0 0 12 10.75ZM9.25 12A2.75 2.75 0 1 1 14.75 12A2.75 2.75 0 0 1 9.25 12ZM18 10.75A1.25 1.25 0 1 0 18 13.25A1.25 1.25 0 0 0 18 10.75ZM15.25 12A2.75 2.75 0 1 1 20.75 12A2.75 2.75 0 0 1 15.25 12Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  return active ? (
    <svg {...sharedProps}>
      <path
        d="M17.7545 13.9999C18.9966 13.9999 20.0034 15.0068 20.0034 16.2488V17.1673C20.0034 17.7406 19.8242 18.2996 19.4908 18.7661C17.9449 20.9294 15.4206 22.0011 12.0004 22.0011C8.5794 22.0011 6.05643 20.9289 4.51427 18.7646C4.18231 18.2987 4.00391 17.7408 4.00391 17.1688V16.2488C4.00391 15.0068 5.01076 13.9999 6.25278 13.9999H17.7545ZM12.0004 2.00462C14.7618 2.00462 17.0004 4.2432 17.0004 7.00462C17.0004 9.76605 14.7618 12.0046 12.0004 12.0046C9.23894 12.0046 7.00036 9.76605 7.00036 7.00462C7.00036 4.2432 9.23894 2.00462 12.0004 2.00462Z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg {...sharedProps}>
      <path
        d="M17.7545 13.9999C18.9966 13.9999 20.0034 15.0068 20.0034 16.2488V16.8242C20.0034 17.7185 19.6838 18.5833 19.1023 19.2627C17.5329 21.0962 15.1457 22.0011 12.0004 22.0011C8.8545 22.0011 6.46849 21.0959 4.90219 19.2617C4.32242 18.5827 4.00391 17.7193 4.00391 16.8265V16.2488C4.00391 15.0068 5.01076 13.9999 6.25278 13.9999H17.7545ZM17.7545 15.4999H6.25278C5.83919 15.4999 5.50391 15.8352 5.50391 16.2488V16.8265C5.50391 17.3621 5.69502 17.8802 6.04287 18.2876C7.29618 19.7553 9.26206 20.5011 12.0004 20.5011C14.7387 20.5011 16.7063 19.7552 17.9627 18.2873C18.3117 17.8797 18.5034 17.3608 18.5034 16.8242V16.2488C18.5034 15.8352 18.1681 15.4999 17.7545 15.4999ZM12.0004 2.00462C14.7618 2.00462 17.0004 4.2432 17.0004 7.00462C17.0004 9.76605 14.7618 12.0046 12.0004 12.0046C9.23894 12.0046 7.00036 9.76605 7.00036 7.00462C7.00036 4.2432 9.23894 2.00462 12.0004 2.00462ZM12.0004 3.50462C10.0674 3.50462 8.50036 5.07163 8.50036 7.00462C8.50036 8.93762 10.0674 10.5046 12.0004 10.5046C13.9334 10.5046 15.5004 8.93762 15.5004 7.00462C15.5004 5.07163 13.9334 3.50462 12.0004 3.50462Z"
        fill="currentColor"
      />
    </svg>
  )
}
