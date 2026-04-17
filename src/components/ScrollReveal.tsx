import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'

type RevealTag = 'div' | 'section' | 'article'
type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale'

interface ScrollRevealProps {
  as?: RevealTag
  children: ReactNode
  className?: string
  delay?: number
  direction?: RevealDirection
  distance?: number
  once?: boolean
  style?: CSSProperties
  threshold?: number
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function readRevealState(storageKey: string | null) {
  if (!storageKey || typeof window === 'undefined') {
    return false
  }

  try {
    return window.sessionStorage.getItem(storageKey) === '1'
  } catch {
    return false
  }
}

function persistRevealState(storageKey: string | null) {
  if (!storageKey || typeof window === 'undefined') {
    return
  }

  try {
    window.sessionStorage.setItem(storageKey, '1')
  } catch {
    // Ignore blocked storage access and continue with in-memory behavior.
  }
}

export function ScrollReveal({
  as = 'div',
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 56,
  once = true,
  style,
  threshold = 0.12,
}: ScrollRevealProps) {
  const location = useLocation()
  const componentId = useId()
  const reducedMotion = useMemo(() => prefersReducedMotion(), [])
  const nodeRef = useRef<HTMLElement | null>(null)
  const storageKey = useMemo(
    () =>
      once
        ? [
            'jermuk-travel.reveal.v1',
            location.pathname,
            componentId,
            direction,
            delay,
            distance,
            className ?? '',
          ].join(':')
        : null,
    [className, componentId, delay, direction, distance, location.pathname, once],
  )
  const persistedVisible = reducedMotion || readRevealState(storageKey)
  const [hasIntersected, setHasIntersected] = useState(persistedVisible)
  const isVisible = persistedVisible || hasIntersected

  useEffect(() => {
    const node = nodeRef.current

    if (!node) {
      return
    }

    if (persistedVisible) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (entry.isIntersecting) {
            setHasIntersected(true)
            persistRevealState(storageKey)
            observer.unobserve(node)
          }

          return
        }

        setHasIntersected(entry.isIntersecting)
      },
      {
        threshold,
        rootMargin: '0px 0px -4% 0px',
      },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [once, persistedVisible, storageKey, threshold])

  const revealStyle = useMemo(
    () =>
      ({
        '--reveal-delay': `${delay}ms`,
        '--reveal-distance': `${distance}px`,
        ...style,
      }) as CSSProperties,
    [delay, distance, style],
  )

  const revealClassName = [
    'scroll-reveal',
    `reveal-${direction}`,
    isVisible ? 'is-visible' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  if (as === 'section') {
    return (
      <section
        ref={(node) => {
          nodeRef.current = node
        }}
        className={revealClassName}
        style={revealStyle}
      >
        {children}
      </section>
    )
  }

  if (as === 'article') {
    return (
      <article
        ref={(node) => {
          nodeRef.current = node
        }}
        className={revealClassName}
        style={revealStyle}
      >
        {children}
      </article>
    )
  }

  return (
    <div
      ref={(node) => {
        nodeRef.current = node
      }}
      className={revealClassName}
      style={revealStyle}
    >
      {children}
    </div>
  )
}
