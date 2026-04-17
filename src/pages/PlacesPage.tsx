import { ScrollReveal } from '../components/ScrollReveal'
import { useSite } from '../context/useSite'

export function PlacesPage() {
  const { content, language } = useSite()
  const copy = content[language]

  return (
    <section className="section">
      <ScrollReveal className="section-heading" direction="up" distance={54}>
        <span className="eyebrow">{copy.placesSection.eyebrow}</span>
        <h1>{copy.placesSection.title}</h1>
        <p>{copy.placesSection.description}</p>
      </ScrollReveal>

      <div className="places-grid">
        {copy.places.map((place, index) => (
          <ScrollReveal
            key={place.id}
            as="article"
            className="place-card"
            direction={index % 2 === 0 ? 'up' : 'scale'}
            distance={52}
            delay={index * 90}
          >
            <div className="place-image">
              <img src={place.image} alt={place.title} />
            </div>

            <div className="place-body">
              <span className="tag">{place.tag}</span>
              <h3>{place.title}</h3>
              <p>{place.description}</p>
              <strong>{place.detail}</strong>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
