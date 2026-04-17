import { useEffect, useRef, useState } from 'react'

const yandexConstructorSrc =
  'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Aa07b20691e30d2a7b23670433111da9066c189e3b4084f294140fe3b2101481c&width=100%25&height=503&lang=en_FR&scroll=true'

export function YandexConstructorMap() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const shellRef = useRef<HTMLDivElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (shouldLoad) {
      return
    }

    const shell = shellRef.current

    if (!shell) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        setShouldLoad(true)
        observer.disconnect()
      },
      {
        rootMargin: '160px 0px',
        threshold: 0.01,
      },
    )

    observer.observe(shell)

    return () => {
      observer.disconnect()
    }
  }, [shouldLoad])

  useEffect(() => {
    if (!shouldLoad) {
      return
    }

    const container = containerRef.current

    if (!container) {
      return
    }

    container.innerHTML = ''

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.async = true
    script.src = yandexConstructorSrc

    container.appendChild(script)

    return () => {
      container.innerHTML = ''
    }
  }, [shouldLoad])

  return (
    <div ref={shellRef} className="yandex-map-shell">
      <div ref={containerRef} className={`yandex-map-embed${shouldLoad ? ' is-loaded' : ''}`}>
        {!shouldLoad ? <div className="yandex-map-placeholder" aria-hidden="true" /> : null}
      </div>

      <a
        className="yandex-map-link"
        href="https://yandex.com/maps"
        target="_blank"
        rel="noreferrer"
      >
        Open Yandex Maps
      </a>
    </div>
  )
}
