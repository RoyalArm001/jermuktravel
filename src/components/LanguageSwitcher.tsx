import { useEffect, useRef, useState } from 'react'
import { languageOptions } from '../content/media'
import type { Language } from '../types'

interface LanguageSwitcherProps {
  language: Language
  onChange: (language: Language) => void
  compact?: boolean
}

export function LanguageSwitcher({
  language,
  onChange,
  compact = false,
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const activeOption = languageOptions.find((option) => option.code === language) ?? languageOptions[0]

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  return (
    <div
      ref={rootRef}
      className={`language-switcher${compact ? ' compact' : ''}${open ? ' open' : ''}`}
    >
      <button
        type="button"
        className="switcher-trigger"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        aria-expanded={open}
        aria-label="Change language"
      >
        <img src={activeOption.flag} alt={activeOption.label} />
        <span>{compact ? activeOption.shortLabel : activeOption.label}</span>
        <span className="switcher-caret" aria-hidden="true">
          ▾
        </span>
      </button>

      {open ? (
        <div className="language-menu">
          {languageOptions
            .filter((option) => option.code !== language)
            .map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  onChange(option.code)
                  setOpen(false)
                }}
              >
                <img src={option.flag} alt={option.label} />
                <span>{compact ? option.shortLabel : option.label}</span>
              </button>
            ))}
        </div>
      ) : null}
    </div>
  )
}
