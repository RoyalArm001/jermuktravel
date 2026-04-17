export type ViewRoute = 'home' | 'places' | 'routes' | 'ai'

export interface ViewAnalytics {
  total: number
  pages: Record<ViewRoute, number>
  updatedAt: string | null
}

type AnalyticsWriteResult = 'ok' | 'conflict' | 'disabled'

const defaultViewAnalytics: ViewAnalytics = {
  total: 0,
  pages: {
    home: 0,
    places: 0,
    routes: 0,
    ai: 0,
  },
  updatedAt: null,
}

const trackedViewTasks = new Map<string, Promise<ViewAnalytics>>()
let cachedViewAnalytics = defaultViewAnalytics
let writeAnalyticsEnabled =
  import.meta.env.VITE_FIREBASE_RTDB_WRITE_ENABLED?.trim().toLowerCase() !==
  'false'
let hasWarnedWriteAnalyticsDisabled = false

function isUnauthorizedStatus(status: number) {
  return status === 401 || status === 403
}

function warnWriteAnalyticsDisabled(reason: 'config' | 'unauthorized') {
  if (hasWarnedWriteAnalyticsDisabled || !import.meta.env.DEV) {
    return
  }

  hasWarnedWriteAnalyticsDisabled = true

  const detail =
    reason === 'config'
      ? 'View analytics writes are disabled by configuration.'
      : 'Firebase Realtime Database rejected the analytics write, so the app switched to read-only analytics mode for this session.'

  console.warn(detail)
}

function getDatabaseBaseUrl() {
  return (
    import.meta.env.VITE_FIREBASE_RTDB_URL?.trim() ||
    'https://jermuk-travel-default-rtdb.firebaseio.com'
  )
}

function getDatabaseNode() {
  return (
    import.meta.env.VITE_FIREBASE_RTDB_NODE?.trim() ||
    'BlogID_2233888314157595317'
  )
}

function buildViewsUrl() {
  const baseUrl = getDatabaseBaseUrl().replace(/\/+$/, '')
  const nodePath = getDatabaseNode()
    .split('/')
    .filter(Boolean)
    .map((segment: string) => encodeURIComponent(segment))
    .join('/')

  return `${baseUrl}/${nodePath}/analytics/views.json`
}

function normalizeRoute(pathname: string): ViewRoute {
  if (pathname === '/places') {
    return 'places'
  }

  if (pathname === '/routes') {
    return 'routes'
  }

  if (pathname === '/ai') {
    return 'ai'
  }

  return 'home'
}

function toNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function normalizeAnalytics(payload: unknown): ViewAnalytics {
  if (!payload || typeof payload !== 'object') {
    return { ...defaultViewAnalytics }
  }

  const rawPayload = payload as Partial<ViewAnalytics> & {
    pages?: Partial<Record<ViewRoute, unknown>>
  }

  return {
    total: toNumber(rawPayload.total),
    pages: {
      home: toNumber(rawPayload.pages?.home),
      places: toNumber(rawPayload.pages?.places),
      routes: toNumber(rawPayload.pages?.routes),
      ai: toNumber(rawPayload.pages?.ai),
    },
    updatedAt:
      typeof rawPayload.updatedAt === 'string' ? rawPayload.updatedAt : null,
  }
}

function cloneAnalytics(analytics: ViewAnalytics): ViewAnalytics {
  return {
    total: analytics.total,
    pages: { ...analytics.pages },
    updatedAt: analytics.updatedAt,
  }
}

async function readAnalyticsWithEtag() {
  const response = await fetch(buildViewsUrl(), {
    headers: {
      'X-Firebase-ETag': 'true',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to read view analytics')
  }

  const payload = normalizeAnalytics(await response.json())
  const etag = response.headers.get('ETag')

  return { payload, etag }
}

async function writeAnalytics(
  analytics: ViewAnalytics,
  etag: string | null,
): Promise<AnalyticsWriteResult> {
  if (!writeAnalyticsEnabled) {
    warnWriteAnalyticsDisabled('config')
    return 'disabled'
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (etag) {
    headers['if-match'] = etag
  }

  const response = await fetch(buildViewsUrl(), {
    method: 'PUT',
    headers,
    body: JSON.stringify(analytics),
  })

  if (response.status === 412) {
    return 'conflict'
  }

  if (isUnauthorizedStatus(response.status)) {
    writeAnalyticsEnabled = false
    warnWriteAnalyticsDisabled('unauthorized')
    return 'disabled'
  }

  if (!response.ok) {
    throw new Error('Failed to write view analytics')
  }

  return 'ok'
}

export function getCachedViewAnalytics() {
  return cloneAnalytics(cachedViewAnalytics)
}

export async function fetchViewAnalytics() {
  const response = await fetch(buildViewsUrl())

  if (!response.ok) {
    throw new Error('Failed to load view analytics')
  }

  const analytics = normalizeAnalytics(await response.json())
  cachedViewAnalytics = analytics

  return cloneAnalytics(analytics)
}

export async function incrementViewAnalytics(pathname: string) {
  const route = normalizeRoute(pathname)

  if (!writeAnalyticsEnabled) {
    try {
      return await fetchViewAnalytics()
    } catch {
      return cloneAnalytics(cachedViewAnalytics)
    }
  }

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const { payload, etag } = await readAnalyticsWithEtag()
    const nextAnalytics: ViewAnalytics = {
      total: payload.total + 1,
      pages: {
        ...payload.pages,
        [route]: payload.pages[route] + 1,
      },
      updatedAt: new Date().toISOString(),
    }

    const writeResult = await writeAnalytics(nextAnalytics, etag)

    if (writeResult === 'ok') {
      cachedViewAnalytics = nextAnalytics
      return cloneAnalytics(nextAnalytics)
    }

    if (writeResult === 'disabled') {
      cachedViewAnalytics = payload

      try {
        return await fetchViewAnalytics()
      } catch {
        return cloneAnalytics(payload)
      }
    }
  }

  throw new Error('Could not persist view analytics')
}

export function trackViewOnce(pathname: string, navigationKey: string) {
  const route = normalizeRoute(pathname)
  const trackKey = `${navigationKey}:${route}`
  const existingTask = trackedViewTasks.get(trackKey)

  if (existingTask) {
    return existingTask
  }

  const task = incrementViewAnalytics(pathname).catch((error: unknown) => {
    trackedViewTasks.delete(trackKey)
    throw error
  })
  trackedViewTasks.set(trackKey, task)
  return task
}
