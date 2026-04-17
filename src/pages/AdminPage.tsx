import {
  startTransition,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { languageOptions } from '../content/media'
import { useSite } from '../context/useSite'
import { logoutAdminSession } from '../lib/adminAuth'
import { deepClone } from '../lib/storage'
import { buildAdminSeo, buildLocalizedPath, useSeo } from '../lib/seo'
import { useStoredViewAnalytics } from '../lib/useViewAnalytics'
import type {
  GuideCard,
  Language,
  Metric,
  MorePageId,
  RouteCard,
  SiteLanguageContent,
  SpotlightCard,
} from '../types'

function createId(prefix: string) {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}`
}

type AdminSectionId =
  | 'dashboard'
  | 'navigation'
  | 'hero'
  | 'overview'
  | 'places'
  | 'routes'
  | 'ai'
  | 'pages'
  | 'footer'

const adminLanguageNames: Record<Language, string> = {
  hy: 'Հայերեն',
  en: 'Անգլերեն',
  ru: 'Ռուսերեն',
}

const infoPageMeta: Array<{ id: MorePageId; label: string; path: string }> = [
  { id: 'help', label: 'Help', path: '/help' },
  { id: 'faq', label: 'FAQ', path: '/faq' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'contact', label: 'Contact', path: '/contact' },
  { id: 'terms', label: 'Terms', path: '/terms' },
  { id: 'privacy', label: 'Privacy', path: '/privacy' },
]

const pageTypeLabels: Record<MorePageId, string> = {
  help: 'Օգնություն',
  faq: 'Հաճախ տրվող հարցեր',
  about: 'Մեր մասին',
  contact: 'Կապ',
  terms: 'Պայմաններ',
  privacy: 'Գաղտնիություն',
}

export function AdminPage() {
  const { content, replaceLanguageContent, resetContent } = useSite()
  const [editingLanguage, setEditingLanguage] = useState<Language>('hy')
  const [searchQuery, setSearchQuery] = useState('')
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [isPending, startUiTransition] = useTransition()
  const navigate = useNavigate()
  const viewAnalytics = useStoredViewAnalytics(15000)
  const sectionRefs = useRef<Partial<Record<AdminSectionId, HTMLElement | null>>>({})
  const draft = content[editingLanguage]

  useSeo(
    buildAdminSeo(
      'Ադմին CMS | Jermuk Travel',
      'Jermuk Travel կայքի կառավարման վահանակ ադմինների համար։',
    ),
  )

  const summary = useMemo(
    () => [
      `${draft.places.length} վայր`,
      `${draft.routes.length} երթուղի`,
      `${infoPageMeta.length} info էջ`,
      `${draft.ai.prompts.length} AI հարց`,
    ],
    [draft.ai.prompts.length, draft.places.length, draft.routes.length],
  )

  const updateDraft = (updater: (draftCopy: SiteLanguageContent) => void) => {
    startTransition(() => {
      startUiTransition(() => {
        const nextDraft = deepClone(content[editingLanguage])
        updater(nextDraft)
        replaceLanguageContent(editingLanguage, nextDraft)
      })
    })
  }

  const updateNavigationField = (
    key: keyof SiteLanguageContent['navigation'],
    value: string,
  ) => {
    updateDraft((draftCopy) => {
      draftCopy.navigation[key] = value
    })
  }

  const updateHeroField = (
    key: Exclude<keyof SiteLanguageContent['hero'], 'metrics'>,
    value: string,
  ) => {
    updateDraft((draftCopy) => {
      draftCopy.hero[key] = value
    })
  }

  const updateHeroMetric = (index: number, key: keyof Metric, value: string) => {
    updateDraft((draftCopy) => {
      draftCopy.hero.metrics[index][key] = value
    })
  }

  const updateOverviewCard = (index: number, key: keyof GuideCard, value: string) => {
    updateDraft((draftCopy) => {
      draftCopy.overview.cards[index][key] = value
    })
  }

  const updatePlace = (index: number, key: keyof SpotlightCard, value: string) => {
    updateDraft((draftCopy) => {
      draftCopy.places[index][key] = value
    })
  }

  const updateRoute = (
    index: number,
    key: keyof RouteCard,
    value: string | string[],
  ) => {
    updateDraft((draftCopy) => {
      if (key === 'stops') {
        draftCopy.routes[index].stops = value as string[]
        return
      }

      draftCopy.routes[index][key] = value as never
    })
  }

  const updateDirectoryMenuField = (
    key: keyof SiteLanguageContent['directoryMenu'],
    value: string,
  ) => {
    updateDraft((draftCopy) => {
      if (key === 'items') {
        return
      }

      draftCopy.directoryMenu[key] = value
    })
  }

  const updateDirectoryItem = (
    index: number,
    key: keyof SiteLanguageContent['directoryMenu']['items'][number],
    value: string,
  ) => {
    updateDraft((draftCopy) => {
      if (key === 'id') {
        return
      }

      draftCopy.directoryMenu.items[index][key] = value
    })
  }

  const updateInfoPageField = (
    page: MorePageId,
    key: 'eyebrow' | 'title' | 'description' | 'sideTitle' | 'sideDescription',
    value: string,
  ) => {
    updateDraft((draftCopy) => {
      draftCopy.infoPages[page][key] = value
    })
  }

  const updateInfoPageHighlights = (page: MorePageId, value: string) => {
    updateDraft((draftCopy) => {
      draftCopy.infoPages[page].highlights = value
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
    })
  }

  const updateInfoPageItem = (
    page: MorePageId,
    index: number,
    key: 'title' | 'description',
    value: string,
  ) => {
    updateDraft((draftCopy) => {
      draftCopy.infoPages[page].items[index][key] = value
    })
  }

  const updateFooterField = (key: keyof SiteLanguageContent['footer'], value: string) => {
    updateDraft((draftCopy) => {
      draftCopy.footer[key] = value
    })
  }

  const normalizedSearch = deferredSearchQuery.trim().toLocaleLowerCase()

  const cmsSections = useMemo(
    () =>
      [
        {
          id: 'dashboard',
          label: 'Վահանակ',
          description: 'Ամփոփում, պահպանում, դիտումներ',
          searchText: [
            'վահանակ dashboard summary views firebase autosave',
            ...summary,
            String(viewAnalytics.total),
          ].join(' '),
        },
        {
          id: 'navigation',
          label: 'Մենյու և հղումներ',
          description: 'Header, More menu, link-եր',
          searchText: [
            'navigation menu links header more mega menu',
            draft.brand,
            draft.cityLine,
            ...Object.values(draft.navigation),
            draft.directoryMenu.kicker,
            draft.directoryMenu.title,
            draft.directoryMenu.utilityLabel,
            ...draft.directoryMenu.items.flatMap((item) => [
              item.label,
              item.description,
              item.to,
            ]),
          ].join(' '),
        },
        {
          id: 'hero',
          label: 'Գլխավոր էջ',
          description: 'Hero տեքստ, կոճակներ, metric-ներ',
          searchText: [
            'hero home main գլխավոր էջ',
            draft.hero.eyebrow,
            draft.hero.title,
            draft.hero.subtitle,
            draft.hero.primaryAction,
            draft.hero.secondaryAction,
            ...draft.hero.metrics.flatMap((metric) => [metric.label, metric.value]),
          ].join(' '),
        },
        {
          id: 'overview',
          label: 'Ներածական բաժին',
          description: 'Overview intro և քարտեր',
          searchText: [
            'overview intro cards ներածություն քարտեր',
            draft.overview.eyebrow,
            draft.overview.title,
            draft.overview.description,
            ...draft.overview.cards.flatMap((card) => [card.title, card.description]),
          ].join(' '),
        },
        {
          id: 'places',
          label: 'Վայրեր',
          description: 'Places էջ և քարտեր',
          searchText: [
            'places վայրեր cards',
            draft.placesSection.eyebrow,
            draft.placesSection.title,
            draft.placesSection.description,
            ...draft.places.flatMap((place) => [
              place.title,
              place.description,
              place.tag,
              place.detail,
            ]),
          ].join(' '),
        },
        {
          id: 'routes',
          label: 'Երթուղիներ',
          description: 'Route էջ, քարտեզ, կանգառներ',
          searchText: [
            'routes routes map երթուղիներ քարտեզ կանգառներ',
            draft.routesSection.eyebrow,
            draft.routesSection.title,
            draft.routesSection.description,
            ...draft.routes.flatMap((route) => [
              route.title,
              route.description,
              route.duration,
              route.season,
              ...route.stops,
            ]),
          ].join(' '),
        },
        {
          id: 'ai',
          label: 'Jermuk AI',
          description: 'AI intro, welcome, prompt-եր',
          searchText: [
            'ai assistant prompts welcome',
            draft.aiSection.eyebrow,
            draft.aiSection.title,
            draft.aiSection.description,
            draft.ai.title,
            draft.ai.description,
            draft.ai.placeholder,
            draft.ai.welcome,
            ...draft.ai.prompts,
          ].join(' '),
        },
        {
          id: 'pages',
          label: 'Info էջեր',
          description: 'Help, FAQ, About, Contact, Terms, Privacy',
          searchText: [
            'pages info help faq about contact terms privacy էջեր',
            ...infoPageMeta.flatMap(({ id, label }) => [
              label,
              pageTypeLabels[id],
              draft.infoPages[id].title,
              draft.infoPages[id].description,
              draft.infoPages[id].sideTitle,
              draft.infoPages[id].sideDescription,
              ...draft.infoPages[id].highlights,
              ...draft.infoPages[id].items.flatMap((item) => [item.title, item.description]),
            ]),
          ].join(' '),
        },
        {
          id: 'footer',
          label: 'Բրենդ և footer',
          description: 'Footer copy և brand տվյալներ',
          searchText: [
            'footer brand tagline subline',
            draft.brand,
            draft.cityLine,
            draft.footer.tagline,
            draft.footer.subline,
            draft.footer.exploreLabel,
            draft.footer.adminLabel,
          ].join(' '),
        },
      ] satisfies Array<{
        id: AdminSectionId
        label: string
        description: string
        searchText: string
      }>,
    [draft, summary, viewAnalytics.total],
  )

  const visibleSections = useMemo(() => {
    if (!normalizedSearch) {
      return cmsSections
    }

    return cmsSections.filter((section) =>
      section.searchText.toLocaleLowerCase().includes(normalizedSearch),
    )
  }, [cmsSections, normalizedSearch])

  const visibleSectionIds = new Set(visibleSections.map((section) => section.id))

  const setSectionRef =
    (sectionId: AdminSectionId) => (node: HTMLElement | null) => {
      sectionRefs.current[sectionId] = node
    }

  const scrollToSection = (sectionId: AdminSectionId) => {
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const dashboardStats = useMemo(
    () => [
      {
        label: 'Պահպանման վիճակ',
        value: isPending ? 'Պահպանվում է...' : 'Ավտոմատ',
      },
      {
        label: 'Խմբագրվող լեզու',
        value: adminLanguageNames[editingLanguage],
      },
      {
        label: 'Firebase դիտումներ',
        value: viewAnalytics.total.toLocaleString('hy-AM'),
      },
      {
        label: 'CMS բաժիններ',
        value: String(cmsSections.length),
      },
    ],
    [cmsSections.length, editingLanguage, isPending, viewAnalytics.total],
  )

  return (
    <div className="admin-page admin-cms-page">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className="admin-cms-header">
        <div className="admin-cms-heading">
          <h1>Կայքի կառավարում</h1>
        </div>

        <div className="admin-cms-head-actions">
          <label className="admin-cms-language-select">
            <span>Լեզու</span>
            <select
              value={editingLanguage}
              onChange={(event) => {
                setEditingLanguage(event.target.value as Language)
              }}
            >
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {adminLanguageNames[option.code]}
                </option>
              ))}
            </select>
          </label>

          <div className="admin-cms-head-buttons">
            <Link className="button ghost" to={buildLocalizedPath('/', editingLanguage)}>
              Բացել public կայքը
            </Link>
            <button
              type="button"
              className="button subtle"
              onClick={() => {
                if (
                  window.confirm(
                    'Վերականգնե՞լ ամբողջ CMS բովանդակությունը սկզբնական տարբերակին։',
                  )
                ) {
                  resetContent()
                }
              }}
            >
              Վերականգնել
            </button>
            <button
              type="button"
              className="button ghost"
              onClick={() => {
                logoutAdminSession()
                navigate('/admin/login', { replace: true })
              }}
            >
              Դուրս գալ
            </button>
          </div>
        </div>
      </header>

      <section className="admin-cms-toolbar">
        <label className="admin-cms-search">
          <span>Որոնում</span>
          <input
            type="search"
            value={searchQuery}
            placeholder="Մենյու, FAQ, routes..."
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>

        <div className="admin-cms-toolbar-pills">
          <span className="admin-cms-pill">
            {isPending ? 'Փոփոխությունները պահպանվում են...' : 'Ավտոմատ պահպանում միացված է'}
          </span>
          <span className="admin-cms-pill">{`Լեզու՝ ${adminLanguageNames[editingLanguage]}`}</span>
          <span className="admin-cms-pill">{`Տեսանելի բաժիններ՝ ${visibleSections.length}/${cmsSections.length}`}</span>
        </div>
      </section>

      <main className="admin-cms-shell">
        <aside className="admin-cms-sidebar">
          <div className="admin-cms-sidebar-card">
            <strong>Ամփոփում</strong>
            <div className="admin-cms-stat-grid">
              {dashboardStats.map((item) => (
                <article key={item.label} className="admin-cms-stat-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </div>

          <div className="admin-cms-sidebar-card">
            <strong>Բաժիններ</strong>
            <div className="admin-cms-jump-list">
              {visibleSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className="admin-cms-jump"
                  onClick={() => scrollToSection(section.id)}
                >
                  <span>{section.label}</span>
                  <small>{section.description}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="admin-cms-sidebar-card">
            <strong>Հղումներ</strong>
            <div className="admin-cms-route-list">
              <span>{buildLocalizedPath('/', editingLanguage)}</span>
              <span>{buildLocalizedPath('/places', editingLanguage)}</span>
              <span>{buildLocalizedPath('/routes', editingLanguage)}</span>
              <span>{buildLocalizedPath('/ai', editingLanguage)}</span>
              {infoPageMeta.map((page) => (
                <span key={page.id}>{buildLocalizedPath(page.path, editingLanguage)}</span>
              ))}
            </div>
          </div>
        </aside>

        <section className="admin-cms-main">
          {visibleSectionIds.size === 0 ? (
            <article className="admin-cms-section admin-cms-empty">
              <h2>Ոչինչ չգտնվեց</h2>
              <p>Փոխիր որոնման բառը։</p>
            </article>
          ) : null}

          {visibleSectionIds.has('dashboard') ? (
            <article
              ref={setSectionRef('dashboard')}
              className="admin-cms-section"
              id="cms-dashboard"
            >
              <div className="admin-section-head">
                <div>
                  <h2>Վահանակ</h2>
                </div>
              </div>

              <div className="admin-cms-dashboard-grid">
                <div className="admin-cms-panel">
                  <strong>Բովանդակության ամփոփում</strong>
                  <div className="summary-list">
                    {summary.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </div>
                </div>

                <div className="admin-cms-panel">
                  <strong>Firebase դիտումներ ըստ էջի</strong>
                  <div className="summary-list">
                    <span>{`Գլխավոր ${viewAnalytics.pages.home}`}</span>
                    <span>{`Վայրեր ${viewAnalytics.pages.places}`}</span>
                    <span>{`Երթուղիներ ${viewAnalytics.pages.routes}`}</span>
                    <span>{`AI ${viewAnalytics.pages.ai}`}</span>
                  </div>
                </div>
              </div>
            </article>
          ) : null}

          {visibleSectionIds.has('navigation') ? (
            <article
              ref={setSectionRef('navigation')}
              className="admin-cms-section"
              id="cms-navigation"
            >
              <div className="admin-section-head">
                <div>
                  <h2>Մենյու և հղումներ</h2>
                </div>
              </div>

              <div className="field-grid">
                <label>
                  Brand անուն
                  <input
                    value={draft.brand}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.brand = event.target.value
                      })
                    }
                  />
                </label>

                <label>
                  Քաղաքի տող
                  <input
                    value={draft.cityLine}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.cityLine = event.target.value
                      })
                    }
                  />
                </label>

                <label>
                  Top menu - Քաղաքը
                  <input
                    value={draft.navigation.discover}
                    onChange={(event) =>
                      updateNavigationField('discover', event.target.value)
                    }
                  />
                </label>

                <label>
                  Top menu - Վայրեր
                  <input
                    value={draft.navigation.places}
                    onChange={(event) => updateNavigationField('places', event.target.value)}
                  />
                </label>

                <label>
                  Top menu - Երթուղիներ
                  <input
                    value={draft.navigation.routes}
                    onChange={(event) => updateNavigationField('routes', event.target.value)}
                  />
                </label>

                <label>
                  Top menu - Jermuk AI
                  <input
                    value={draft.navigation.ai}
                    onChange={(event) => updateNavigationField('ai', event.target.value)}
                  />
                </label>

                <label>
                  More կոճակ
                  <input
                    value={draft.navigation.more}
                    onChange={(event) => updateNavigationField('more', event.target.value)}
                  />
                </label>

                <label>
                  Utility - Help
                  <input
                    value={draft.navigation.help}
                    onChange={(event) => updateNavigationField('help', event.target.value)}
                  />
                </label>

                <label>
                  Utility - FAQ
                  <input
                    value={draft.navigation.faq}
                    onChange={(event) => updateNavigationField('faq', event.target.value)}
                  />
                </label>

                <label>
                  Utility - About
                  <input
                    value={draft.navigation.about}
                    onChange={(event) => updateNavigationField('about', event.target.value)}
                  />
                </label>

                <label>
                  Utility - Contact
                  <input
                    value={draft.navigation.contact}
                    onChange={(event) => updateNavigationField('contact', event.target.value)}
                  />
                </label>
              </div>

              <div className="field-grid">
                <label>
                  Mega menu kicker
                  <input
                    value={draft.directoryMenu.kicker}
                    onChange={(event) =>
                      updateDirectoryMenuField('kicker', event.target.value)
                    }
                  />
                </label>

                <label>
                  Mega menu title
                  <input
                    value={draft.directoryMenu.title}
                    onChange={(event) =>
                      updateDirectoryMenuField('title', event.target.value)
                    }
                  />
                </label>

                <label className="full">
                  Useful pages label
                  <input
                    value={draft.directoryMenu.utilityLabel}
                    onChange={(event) =>
                      updateDirectoryMenuField('utilityLabel', event.target.value)
                    }
                  />
                </label>
              </div>

              <div className="repeater">
                {draft.directoryMenu.items.map((item, index) => (
                  <div key={item.id} className="repeater-card">
                    <div className="repeater-head">
                      <strong>{item.label || `Բաժին ${index + 1}`}</strong>
                      <span className="admin-cms-inline-path">{item.id}</span>
                    </div>

                    <label>
                      Անվանում
                      <input
                        value={item.label}
                        onChange={(event) =>
                          updateDirectoryItem(index, 'label', event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Link
                      <input
                        value={item.to}
                        onChange={(event) =>
                          updateDirectoryItem(index, 'to', event.target.value)
                        }
                      />
                    </label>

                    <label className="full">
                      Ներքին նկարագրություն
                      <input
                        value={item.description}
                        onChange={(event) =>
                          updateDirectoryItem(index, 'description', event.target.value)
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          {visibleSectionIds.has('hero') ? (
            <article ref={setSectionRef('hero')} className="admin-cms-section" id="cms-hero">
              <div className="admin-section-head">
                <div>
                  <h2>Գլխավոր</h2>
                </div>
              </div>

              <div className="field-grid">
                <label>
                  Փոքր վերնագիր
                  <input
                    value={draft.hero.eyebrow}
                    onChange={(event) => updateHeroField('eyebrow', event.target.value)}
                  />
                </label>

                <label className="full">
                  Վերնագիր
                  <textarea
                    rows={3}
                    value={draft.hero.title}
                    onChange={(event) => updateHeroField('title', event.target.value)}
                  />
                </label>

                <label className="full">
                  Ենթավերնագիր
                  <textarea
                    rows={4}
                    value={draft.hero.subtitle}
                    onChange={(event) => updateHeroField('subtitle', event.target.value)}
                  />
                </label>

                <label>
                  Առաջին կոճակ
                  <input
                    value={draft.hero.primaryAction}
                    onChange={(event) =>
                      updateHeroField('primaryAction', event.target.value)
                    }
                  />
                </label>

                <label>
                  Երկրորդ կոճակ
                  <input
                    value={draft.hero.secondaryAction}
                    onChange={(event) =>
                      updateHeroField('secondaryAction', event.target.value)
                    }
                  />
                </label>
              </div>

              <div className="repeater">
                {draft.hero.metrics.map((metric, index) => (
                  <div key={`${metric.label}-${index}`} className="repeater-card">
                    <div className="repeater-head">
                      <strong>{`Metric ${index + 1}`}</strong>
                    </div>

                    <label>
                      Թիվ
                      <input
                        value={metric.value}
                        onChange={(event) =>
                          updateHeroMetric(index, 'value', event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Պիտակ
                      <input
                        value={metric.label}
                        onChange={(event) =>
                          updateHeroMetric(index, 'label', event.target.value)
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          {visibleSectionIds.has('overview') ? (
            <article
              ref={setSectionRef('overview')}
              className="admin-cms-section"
              id="cms-overview"
            >
              <div className="admin-section-head">
                <div>
                  <h2>Ներածական բաժին</h2>
                </div>
              </div>

              <div className="field-grid">
                <label>
                  Բաժնի փոքր վերնագիր
                  <input
                    value={draft.overview.eyebrow}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.overview.eyebrow = event.target.value
                      })
                    }
                  />
                </label>

                <label className="full">
                  Բաժնի վերնագիր
                  <input
                    value={draft.overview.title}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.overview.title = event.target.value
                      })
                    }
                  />
                </label>

                <label className="full">
                  Նկարագրություն
                  <textarea
                    rows={3}
                    value={draft.overview.description}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.overview.description = event.target.value
                      })
                    }
                  />
                </label>
              </div>

              <div className="repeater">
                {draft.overview.cards.map((card, index) => (
                  <div key={card.id} className="repeater-card">
                    <div className="repeater-head">
                      <strong>{card.title || `Քարտ ${index + 1}`}</strong>
                    </div>

                    <label>
                      Քարտի վերնագիր
                      <input
                        value={card.title}
                        onChange={(event) =>
                          updateOverviewCard(index, 'title', event.target.value)
                        }
                      />
                    </label>

                    <label className="full">
                      Քարտի տեքստ
                      <textarea
                        rows={3}
                        value={card.description}
                        onChange={(event) =>
                          updateOverviewCard(index, 'description', event.target.value)
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          {visibleSectionIds.has('places') ? (
            <article
              ref={setSectionRef('places')}
              className="admin-cms-section"
              id="cms-places"
            >
              <div className="admin-section-head">
                <div>
                  <h2>Վայրեր</h2>
                </div>

                <button
                  type="button"
                  className="button subtle"
                  onClick={() =>
                    updateDraft((draftCopy) => {
                      draftCopy.places.push({
                        id: createId('place'),
                        title: 'Նոր վայր',
                        description: 'Գրի՛ր վայրի կարճ նկարագրությունը։',
                        detail: 'Ավելացրու գործնական մանրուք',
                        tag: 'Նոր',
                        image: draftCopy.places[0]?.image ?? '',
                      })
                    })
                  }
                >
                  Ավելացնել վայր
                </button>
              </div>

              <div className="field-grid">
                <label>
                  Բաժնի փոքր վերնագիր
                  <input
                    value={draft.placesSection.eyebrow}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.placesSection.eyebrow = event.target.value
                      })
                    }
                  />
                </label>

                <label className="full">
                  Բաժնի վերնագիր
                  <input
                    value={draft.placesSection.title}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.placesSection.title = event.target.value
                      })
                    }
                  />
                </label>

                <label className="full">
                  Նկարագրություն
                  <textarea
                    rows={3}
                    value={draft.placesSection.description}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.placesSection.description = event.target.value
                      })
                    }
                  />
                </label>
              </div>

              <div className="repeater">
                {draft.places.map((place, index) => (
                  <div key={place.id} className="repeater-card">
                    <div className="repeater-head">
                      <strong>{place.title || `Վայր ${index + 1}`}</strong>
                      <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                          updateDraft((draftCopy) => {
                            draftCopy.places.splice(index, 1)
                          })
                        }
                      >
                        Ջնջել
                      </button>
                    </div>

                    <label>
                      Վերնագիր
                      <input
                        value={place.title}
                        onChange={(event) => updatePlace(index, 'title', event.target.value)}
                      />
                    </label>

                    <label>
                      Թեգ
                      <input
                        value={place.tag}
                        onChange={(event) => updatePlace(index, 'tag', event.target.value)}
                      />
                    </label>

                    <label>
                      Մանրուք
                      <input
                        value={place.detail}
                        onChange={(event) => updatePlace(index, 'detail', event.target.value)}
                      />
                    </label>

                    <label>
                      Նկարի հղում
                      <input
                        value={place.image}
                        onChange={(event) => updatePlace(index, 'image', event.target.value)}
                      />
                    </label>

                    <label className="full">
                      Նկարագրություն
                      <textarea
                        rows={4}
                        value={place.description}
                        onChange={(event) =>
                          updatePlace(index, 'description', event.target.value)
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          {visibleSectionIds.has('routes') ? (
            <article
              ref={setSectionRef('routes')}
              className="admin-cms-section"
              id="cms-routes"
            >
              <div className="admin-section-head">
                <div>
                  <h2>Երթուղիներ</h2>
                </div>

                <button
                  type="button"
                  className="button subtle"
                  onClick={() =>
                    updateDraft((draftCopy) => {
                      draftCopy.routes.push({
                        id: createId('route'),
                        title: 'Նոր երթուղի',
                        description: 'Բացատրիր, թե այցելուն ինչ փորձառություն է ստանալու։',
                        duration: '2-4 ժամ',
                        season: 'Ամբողջ տարի',
                        stops: ['Կանգառ 1', 'Կանգառ 2'],
                      })
                    })
                  }
                >
                  Ավելացնել երթուղի
                </button>
              </div>

              <div className="field-grid">
                <label>
                  Բաժնի փոքր վերնագիր
                  <input
                    value={draft.routesSection.eyebrow}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.routesSection.eyebrow = event.target.value
                      })
                    }
                  />
                </label>

                <label className="full">
                  Բաժնի վերնագիր
                  <input
                    value={draft.routesSection.title}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.routesSection.title = event.target.value
                      })
                    }
                  />
                </label>

                <label className="full">
                  Նկարագրություն
                  <textarea
                    rows={3}
                    value={draft.routesSection.description}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.routesSection.description = event.target.value
                      })
                    }
                  />
                </label>
              </div>

              <div className="repeater">
                {draft.routes.map((route, index) => (
                  <div key={route.id} className="repeater-card">
                    <div className="repeater-head">
                      <strong>{route.title || `Երթուղի ${index + 1}`}</strong>
                      <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                          updateDraft((draftCopy) => {
                            draftCopy.routes.splice(index, 1)
                          })
                        }
                      >
                        Ջնջել
                      </button>
                    </div>

                    <label>
                      Վերնագիր
                      <input
                        value={route.title}
                        onChange={(event) => updateRoute(index, 'title', event.target.value)}
                      />
                    </label>

                    <label>
                      Տևողություն
                      <input
                        value={route.duration}
                        onChange={(event) => updateRoute(index, 'duration', event.target.value)}
                      />
                    </label>

                    <label>
                      Սեզոն
                      <input
                        value={route.season}
                        onChange={(event) => updateRoute(index, 'season', event.target.value)}
                      />
                    </label>

                    <label className="full">
                      Նկարագրություն
                      <textarea
                        rows={4}
                        value={route.description}
                        onChange={(event) =>
                          updateRoute(index, 'description', event.target.value)
                        }
                      />
                    </label>

                    <label className="full">
                      Կանգառներ
                      <textarea
                        rows={4}
                        value={route.stops.join('\n')}
                        onChange={(event) =>
                          updateRoute(
                            index,
                            'stops',
                            event.target.value
                              .split('\n')
                              .map((item) => item.trim())
                              .filter(Boolean),
                          )
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          {visibleSectionIds.has('ai') ? (
            <article ref={setSectionRef('ai')} className="admin-cms-section" id="cms-ai">
              <div className="admin-section-head">
                <div>
                  <h2>Jermuk AI</h2>
                </div>
              </div>

              <div className="field-grid">
                <label>
                  AI բաժնի փոքր վերնագիր
                  <input
                    value={draft.aiSection.eyebrow}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.aiSection.eyebrow = event.target.value
                      })
                    }
                  />
                </label>

                <label className="full">
                  AI բաժնի վերնագիր
                  <input
                    value={draft.aiSection.title}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.aiSection.title = event.target.value
                      })
                    }
                  />
                </label>

                <label className="full">
                  AI բաժնի նկարագրություն
                  <textarea
                    rows={3}
                    value={draft.aiSection.description}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.aiSection.description = event.target.value
                      })
                    }
                  />
                </label>

                <label>
                  Վիջեթի վերնագիր
                  <input
                    value={draft.ai.title}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.ai.title = event.target.value
                      })
                    }
                  />
                </label>

                <label>
                  Input placeholder
                  <input
                    value={draft.ai.placeholder}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.ai.placeholder = event.target.value
                      })
                    }
                  />
                </label>

                <label className="full">
                  Widget նկարագրություն
                  <textarea
                    rows={3}
                    value={draft.ai.description}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.ai.description = event.target.value
                      })
                    }
                  />
                </label>

                <label className="full">
                  Welcome տեքստ
                  <textarea
                    rows={4}
                    value={draft.ai.welcome}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.ai.welcome = event.target.value
                      })
                    }
                  />
                </label>

                <label className="full">
                  Արագ հարցեր
                  <textarea
                    rows={4}
                    value={draft.ai.prompts.join('\n')}
                    onChange={(event) =>
                      updateDraft((draftCopy) => {
                        draftCopy.ai.prompts = event.target.value
                          .split('\n')
                          .map((line) => line.trim())
                          .filter(Boolean)
                      })
                    }
                  />
                </label>
              </div>
            </article>
          ) : null}

          {visibleSectionIds.has('pages') ? (
            <article ref={setSectionRef('pages')} className="admin-cms-section" id="cms-pages">
              <div className="admin-section-head">
                <div>
                  <h2>Info էջեր</h2>
                </div>
              </div>

              <div className="repeater">
                {infoPageMeta.map((pageMeta) => {
                  const page = draft.infoPages[pageMeta.id]

                  return (
                    <div key={pageMeta.id} className="repeater-card admin-info-page-card">
                      <div className="repeater-head">
                        <strong>{pageTypeLabels[pageMeta.id]}</strong>
                        <span className="admin-cms-inline-path">
                          {buildLocalizedPath(pageMeta.path, editingLanguage)}
                        </span>
                      </div>

                      <label>
                        Փոքր վերնագիր
                        <input
                          value={page.eyebrow}
                          onChange={(event) =>
                            updateInfoPageField(pageMeta.id, 'eyebrow', event.target.value)
                          }
                        />
                      </label>

                      <label>
                        Վերնագիր
                        <input
                          value={page.title}
                          onChange={(event) =>
                            updateInfoPageField(pageMeta.id, 'title', event.target.value)
                          }
                        />
                      </label>

                      <label className="full">
                        Hero նկարագրություն
                        <textarea
                          rows={3}
                          value={page.description}
                          onChange={(event) =>
                            updateInfoPageField(
                              pageMeta.id,
                              'description',
                              event.target.value,
                            )
                          }
                        />
                      </label>

                      <label>
                        Side title
                        <input
                          value={page.sideTitle}
                          onChange={(event) =>
                            updateInfoPageField(pageMeta.id, 'sideTitle', event.target.value)
                          }
                        />
                      </label>

                      <label className="full">
                        Side description
                        <textarea
                          rows={3}
                          value={page.sideDescription}
                          onChange={(event) =>
                            updateInfoPageField(
                              pageMeta.id,
                              'sideDescription',
                              event.target.value,
                            )
                          }
                        />
                      </label>

                      <label className="full">
                        Highlight-ներ
                        <textarea
                          rows={3}
                          value={page.highlights.join('\n')}
                          onChange={(event) =>
                            updateInfoPageHighlights(pageMeta.id, event.target.value)
                          }
                        />
                      </label>

                      <div className="admin-cms-sublist full">
                        {page.items.map((item, index) => (
                          <div key={`${pageMeta.id}-${index}`} className="admin-cms-subitem">
                            <label>
                              {`Item ${index + 1} վերնագիր`}
                              <input
                                value={item.title}
                                onChange={(event) =>
                                  updateInfoPageItem(
                                    pageMeta.id,
                                    index,
                                    'title',
                                    event.target.value,
                                  )
                                }
                              />
                            </label>

                            <label className="full">
                              {`Item ${index + 1} նկարագրություն`}
                              <textarea
                                rows={3}
                                value={item.description}
                                onChange={(event) =>
                                  updateInfoPageItem(
                                    pageMeta.id,
                                    index,
                                    'description',
                                    event.target.value,
                                  )
                                }
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </article>
          ) : null}

          {visibleSectionIds.has('footer') ? (
            <article
              ref={setSectionRef('footer')}
              className="admin-cms-section"
              id="cms-footer"
            >
              <div className="admin-section-head">
                <div>
                  <h2>Footer</h2>
                </div>
              </div>

              <div className="field-grid">
                <label>
                  Footer tagline
                  <input
                    value={draft.footer.tagline}
                    onChange={(event) =>
                      updateFooterField('tagline', event.target.value)
                    }
                  />
                </label>

                <label>
                  Explore button label
                  <input
                    value={draft.footer.exploreLabel}
                    onChange={(event) =>
                      updateFooterField('exploreLabel', event.target.value)
                    }
                  />
                </label>

                <label className="full">
                  Footer subline
                  <textarea
                    rows={4}
                    value={draft.footer.subline}
                    onChange={(event) =>
                      updateFooterField('subline', event.target.value)
                    }
                  />
                </label>

                <label>
                  Admin label
                  <input
                    value={draft.footer.adminLabel}
                    onChange={(event) =>
                      updateFooterField('adminLabel', event.target.value)
                    }
                  />
                </label>
              </div>
            </article>
          ) : null}
        </section>
      </main>
    </div>
  )
}
