import { ScrollReveal } from '../components/ScrollReveal'
import { useSite } from '../context/useSite'

export function AIPage() {
  const { content, language } = useSite()
  const copy = content[language]

  return (
    <section className="section ai-highlight">
      <ScrollReveal className="section-heading" direction="up" distance={54}>
        <span className="eyebrow">{copy.aiSection.eyebrow}</span>
        <h1>{copy.aiSection.title}</h1>
        <p>{copy.aiSection.description}</p>
      </ScrollReveal>

      <div className="ai-showcase">
        <ScrollReveal
          className="ai-showcase-copy"
          direction="left"
          distance={60}
        >
          <strong>{copy.ai.title}</strong>
          <p>{copy.ai.description}</p>
        </ScrollReveal>

        <div className="prompt-cloud">
          {copy.ai.prompts.map((prompt, index) => (
            <ScrollReveal
              key={prompt}
              as="div"
              className="prompt-reveal"
              direction="up"
              distance={34}
              delay={120 + index * 90}
            >
              <span>{prompt}</span>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
