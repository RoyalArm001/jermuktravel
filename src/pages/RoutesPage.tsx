import { ScrollReveal } from '../components/ScrollReveal'
import { YandexConstructorMap } from '../components/YandexConstructorMap'
import { useSite } from '../context/useSite'

export function RoutesPage() {
  const { content, language } = useSite()
  const copy = content[language]
  const mapCopy = {
    hy: {
      label: 'Live Route Map',
      title: 'Ճանապարհների ինտերակտիվ քարտեզ',
      description:
        'Այստեղ բացվում է առանձին քարտեզային էջը, որտեղ կարող եք տեսնել ուղղությունները և արագ կողմնորոշվել Ջերմուկում։',
      listTitle: 'Պատրաստ երթուղիներ',
    },
    en: {
      label: 'Live Route Map',
      title: 'Interactive route map',
      description:
        'This separate page opens the map view so visitors can quickly understand directions and move around Jermuk.',
      listTitle: 'Ready routes',
    },
    ru: {
      label: 'Live Route Map',
      title: 'Интерактивная карта маршрутов',
      description:
        'Здесь открывается отдельная страница с картой, где можно быстро посмотреть направления и удобнее ориентироваться в Джермуке.',
      listTitle: 'Готовые маршруты',
    },
  } as const
  const routeMapCopy = mapCopy[language]

  return (
    <>
      <section className="section routes-page">
        <ScrollReveal className="section-heading route-map-heading" direction="up" distance={54}>
          <span className="eyebrow">{routeMapCopy.label}</span>
          <h1>{routeMapCopy.title}</h1>
          <p>{routeMapCopy.description}</p>
        </ScrollReveal>

        <ScrollReveal className="route-map-card" direction="up" distance={60} delay={80}>
          <YandexConstructorMap />
        </ScrollReveal>
      </section>

      <section className="section route-directory">
        <ScrollReveal className="section-heading" direction="up" distance={54}>
          <span className="eyebrow">{copy.routesSection.eyebrow}</span>
          <h2>{routeMapCopy.listTitle}</h2>
          <p>{copy.routesSection.description}</p>
        </ScrollReveal>

        <div className="routes-grid">
          {copy.routes.map((route, index) => (
            <ScrollReveal
              key={route.id}
              as="article"
              className="route-card"
              direction="up"
              distance={54}
              delay={index * 100}
            >
              <div className="route-topline">
                <span>{`${String(index + 1).padStart(2, '0')}`}</span>
                <span>{route.duration}</span>
              </div>

              <h3>{route.title}</h3>
              <p>{route.description}</p>

              <div className="route-meta">
                <strong>{route.season}</strong>
              </div>

              <div className="route-stops">
                {route.stops.map((stop) => (
                  <span key={stop}>{stop}</span>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  )
}
