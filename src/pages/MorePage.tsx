import { Link } from 'react-router-dom'
import { ScrollReveal } from '../components/ScrollReveal'
import { useSite } from '../context/useSite'
import { buildLocalizedPath } from '../lib/seo'
import type { MorePageId } from '../types'

interface MorePageProps {
  page: MorePageId
}

export function MorePage({ page }: MorePageProps) {
  const { content, language } = useSite()
  const copy = content[language]
  const pageContent = copy.infoPages[page]

  return (
    <>
      <section className="section info-page-hero">
        <ScrollReveal className="info-page-intro" direction="up" distance={56}>
          <span className="eyebrow">{pageContent.eyebrow}</span>
          <h1>{pageContent.title}</h1>
          <p>{pageContent.description}</p>

          <div className="hero-actions info-page-actions">
            <Link className="button primary" to={buildLocalizedPath('/places', language)}>
              {copy.navigation.places}
            </Link>
            <Link className="button subtle" to={buildLocalizedPath('/ai', language)}>
              {copy.navigation.ai}
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <section className="section info-page-shell">
        <div className="info-page-layout">
          <ScrollReveal className="info-side" direction="left" distance={72}>
            <span className="info-side-label">{copy.brand}</span>
            <h2>{pageContent.sideTitle}</h2>
            <p>{pageContent.sideDescription}</p>

            <div className="info-highlights">
              {pageContent.highlights.map((highlight, index) => (
                <span key={highlight}>
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  {highlight}
                </span>
              ))}
            </div>
          </ScrollReveal>

          <div className="info-card-grid">
            {pageContent.items.map((item, index) => (
              <ScrollReveal
                key={item.title}
                as="article"
                className="info-card"
                direction="up"
                distance={44}
                delay={index * 90}
              >
                <span className="info-card-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
