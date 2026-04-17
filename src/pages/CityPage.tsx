import { Link } from 'react-router-dom'
import { ScrollReveal } from '../components/ScrollReveal'
import { sceneImages } from '../content/media'
import { useSite } from '../context/useSite'
import { buildLocalizedPath } from '../lib/seo'

function splitHeroTitle(title: string) {
  const parts = title.trim().split(/\s+/).filter(Boolean)

  if (parts.length < 2) {
    return {
      lead: title,
      accent: '',
    }
  }

  return {
    lead: parts.slice(0, -1).join(' '),
    accent: parts[parts.length - 1] ?? '',
  }
}

export function CityPage() {
  const { content, language } = useSite()
  const copy = content[language]
  const featuredPlaces = copy.places.slice(0, 3)
  const primaryRoute = copy.routes[0]
  const heroTitle = splitHeroTitle(copy.hero.title)
  const heroPills = [featuredPlaces[0]?.tag, primaryRoute?.season, copy.ai.title].filter(Boolean)

  return (
    <>
      <section className="hero-section section city-hero">
        <ScrollReveal className="hero-copy city-hero-copy" direction="left" distance={96}>
          <div className="city-hero-topline">
            <span className="eyebrow">{copy.hero.eyebrow}</span>
            <span className="city-hero-mark">{copy.brand}</span>
          </div>

          <h1 className="city-hero-title">
            <span className="city-hero-title-line">{heroTitle.lead}</span>
            {heroTitle.accent ? (
              <span className="city-hero-title-line city-hero-title-accent">{heroTitle.accent}</span>
            ) : null}
          </h1>

          <p className="hero-subtitle city-hero-subtitle">{copy.hero.subtitle}</p>

          <div className="city-hero-pills" aria-label={copy.hero.title}>
            {heroPills.map((pill) => (
              <span key={pill} className="city-hero-pill">
                {pill}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            <Link className="button primary" to={buildLocalizedPath('/places', language)}>
              {copy.hero.primaryAction}
            </Link>
            <Link className="button ghost" to={buildLocalizedPath('/routes', language)}>
              {copy.navigation.routes}
            </Link>
          </div>

          <div className="metric-row city-metric-row">
            {copy.hero.metrics.map((metric, index) => (
              <ScrollReveal
                key={metric.label}
                as="article"
                className="metric-card"
                direction="up"
                distance={36}
                delay={220 + index * 80}
              >
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal
          className="hero-visual city-hero-visual"
          direction="right"
          distance={90}
          delay={100}
        >
          <div className="city-hero-scene">
            <div className="hero-illustration city-hero-image">
              <img src={sceneImages.hero} alt={copy.hero.title} />
            </div>

            <div className="city-floating-card city-floating-card-top">
              <span>{featuredPlaces[0]?.tag}</span>
              <strong>{featuredPlaces[0]?.title}</strong>
              <small>{featuredPlaces[0]?.detail}</small>
            </div>

            <div className="city-floating-card city-floating-card-bottom">
              <span>{primaryRoute?.duration}</span>
              <strong>{primaryRoute?.title}</strong>
              <small>{primaryRoute?.season}</small>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="section home-overview-band">
        <ScrollReveal className="home-overview-intro" direction="up" distance={54}>
          <span className="eyebrow">{copy.overview.eyebrow}</span>
          <h2>{copy.overview.title}</h2>
          <p>{copy.overview.description}</p>
        </ScrollReveal>

        <div className="overview-grid home-overview-grid">
          {copy.overview.cards.map((card, index) => (
            <ScrollReveal
              key={card.id}
              as="article"
              className="overview-card home-overview-card"
              direction="up"
              distance={44}
              delay={index * 90}
            >
              <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="section home-places-preview">
        <ScrollReveal className="section-heading home-section-heading" direction="up" distance={54}>
          <span className="eyebrow">{copy.placesSection.eyebrow}</span>
          <h2>{copy.placesSection.title}</h2>
          <p>{copy.placesSection.description}</p>
        </ScrollReveal>

        <div className="home-places-layout">
          <ScrollReveal
            as="article"
            className="home-place-feature home-place-feature-main"
            direction="left"
            distance={72}
          >
            <Link className="home-place-link" to={buildLocalizedPath('/places', language)}>
              <div className="home-place-image">
                <img src={featuredPlaces[0].image} alt={featuredPlaces[0].title} />
              </div>

              <div className="home-place-copy">
                <span className="tag">{featuredPlaces[0].tag}</span>
                <h3>{featuredPlaces[0].title}</h3>
                <p>{featuredPlaces[0].description}</p>
                <strong>{featuredPlaces[0].detail}</strong>
              </div>
            </Link>
          </ScrollReveal>

          <div className="home-place-side">
            {featuredPlaces.slice(1).map((place, index) => (
              <ScrollReveal
                key={place.id}
                as="article"
                className="home-place-feature home-place-feature-side"
                direction="up"
                distance={52}
                delay={index * 100}
              >
                <Link className="home-place-link" to={buildLocalizedPath('/places', language)}>
                  <div className="home-place-image">
                    <img src={place.image} alt={place.title} />
                  </div>

                  <div className="home-place-copy">
                    <span className="tag">{place.tag}</span>
                    <h3>{place.title}</h3>
                    <p>{place.description}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-routes-preview">
        <ScrollReveal className="section-heading home-section-heading" direction="up" distance={54}>
          <span className="eyebrow">{copy.routesSection.eyebrow}</span>
          <h2>{copy.routesSection.title}</h2>
          <p>{copy.routesSection.description}</p>
        </ScrollReveal>

        <div className="home-routes-grid">
          {copy.routes.map((route, index) => (
            <ScrollReveal
              key={route.id}
              as="article"
              className="home-route-card"
              direction="up"
              distance={58}
              delay={index * 90}
            >
              <div className="home-route-topline">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{route.duration}</strong>
              </div>

              <h3>{route.title}</h3>
              <p>{route.description}</p>

              <div className="route-meta">
                <strong>{route.season}</strong>
              </div>

              <div className="route-stops home-route-stops">
                {route.stops.map((stop) => (
                  <span key={stop}>{stop}</span>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="section home-ai-preview">
        <ScrollReveal className="home-ai-layout" direction="up" distance={66}>
          <div className="home-ai-copy">
            <span className="eyebrow">{copy.aiSection.eyebrow}</span>
            <h2>{copy.aiSection.title}</h2>
            <p>{copy.aiSection.description}</p>

            <div className="hero-actions">
              <Link className="button subtle" to={buildLocalizedPath('/ai', language)}>
                {copy.navigation.ai}
              </Link>
            </div>
          </div>

          <div className="home-ai-prompts">
            {copy.ai.prompts.map((prompt, index) => (
              <ScrollReveal
                key={prompt}
                className="home-ai-prompt"
                direction="up"
                distance={34}
                delay={120 + index * 80}
              >
                <span>{prompt}</span>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
