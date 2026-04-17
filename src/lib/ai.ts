import type { SiteLanguageContent } from '../types'

export interface AIHistoryMessage {
  role: 'user' | 'assistant'
  text: string
}

const endpoint = import.meta.env.VITE_AI_ENDPOINT?.trim()

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-zа-яա-ֆ0-9]+/iu)
    .filter((word) => word.length > 2)
}

function buildFallbackAnswer(question: string, copy: SiteLanguageContent) {
  const questionTokens = tokenize(question)

  const matchedPlace = copy.places.find((place) => {
    const source = tokenize(`${place.title} ${place.description} ${place.detail} ${place.tag}`)
    return questionTokens.some((token) =>
      source.some((word) => word.startsWith(token) || token.startsWith(word)),
    )
  })

  if (matchedPlace) {
    return `${matchedPlace.title}: ${matchedPlace.description} ${matchedPlace.detail}.`
  }

  const matchedRoute = copy.routes.find((route) => {
    const source = tokenize(
      `${route.title} ${route.description} ${route.duration} ${route.season} ${route.stops.join(' ')}`,
    )

    return questionTokens.some((token) =>
      source.some((word) => word.startsWith(token) || token.startsWith(word)),
    )
  })

  if (matchedRoute) {
    return `${matchedRoute.title}: ${matchedRoute.description} Stops: ${matchedRoute.stops.join(', ')}.`
  }

  if (
    questionTokens.some((token) =>
      ['route', 'երթուղ', 'маршрут', 'plan', 'պլան'].some(
        (needle) => needle.startsWith(token) || token.startsWith(needle),
      ),
    )
  ) {
    const route = copy.routes[0]
    return `${route.title}: ${route.description} Stops: ${route.stops.join(', ')}.`
  }

  if (
    questionTokens.some((token) =>
      ['spa', 'wellness', 'հանգիստ', 'отдых'].some(
        (needle) => needle.startsWith(token) || token.startsWith(needle),
      ),
    )
  ) {
    const place = copy.places.find((item) => item.id === 'wellness') ?? copy.places[0]
    return `${place.title}: ${place.description} ${place.detail}.`
  }

  return `${copy.ai.description} ${copy.places[0].title}, ${copy.places[1].title}, and ${copy.routes[0].title} are great places to start.`
}

export async function askJermukAI(
  question: string,
  copy: SiteLanguageContent,
  history: AIHistoryMessage[],
) {
  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
          context: {
            cityLine: copy.cityLine,
            places: copy.places,
            routes: copy.routes,
          },
        }),
      })

      if (response.ok) {
        const payload = (await response.json()) as {
          answer?: string
          message?: string
          output_text?: string
        }

        const remoteAnswer = payload.answer ?? payload.message ?? payload.output_text

        if (typeof remoteAnswer === 'string' && remoteAnswer.trim()) {
          return remoteAnswer.trim()
        }
      }
    } catch {
      return buildFallbackAnswer(question, copy)
    }
  }

  return buildFallbackAnswer(question, copy)
}
