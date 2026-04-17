import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'
import {
  defaultAdminPassword,
  defaultAdminUsername,
  loginAdminSession,
} from '../lib/adminAuth'
import { buildAdminSeo, useSeo } from '../lib/seo'

const loginCopy = {
  eyebrow: 'Ադմին մուտք',
  title: 'Մուտք CMS համակարգ',
  subtitle: 'Մուտքագրեք ադմինի տվյալները, որպեսզի բացվի կառավարման վահանակը։',
  username: 'Մուտքանուն',
  password: 'Գաղտնաբառ',
  showPassword: 'Ցույց տալ',
  hidePassword: 'Թաքցնել',
  submit: 'Մուտք գործել',
  back: 'Վերադառնալ կայք',
  error: 'Սխալ մուտքանուն կամ գաղտնաբառ։',
} as const

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTarget =
    ((location.state as { from?: string } | null)?.from ?? '/admin')

  const [username, setUsername] = useState(defaultAdminUsername)
  const [password, setPassword] = useState(defaultAdminPassword)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useSeo(
    buildAdminSeo(
      'Ադմին մուտք | Jermuk Travel',
      'Մուտք դեպի Jermuk Travel-ի CMS կառավարման վահանակ։',
    ),
  )

  return (
    <div className="admin-login-page">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <div className="admin-login-card">
        <header className="admin-login-head">
          <div className="admin-login-brand">
            <BrandLogo className="admin-login-logo" alt="" />
            <strong>Jermuk Travel</strong>
          </div>
          <span className="eyebrow">{loginCopy.eyebrow}</span>
          <h1>{loginCopy.title}</h1>
          <p>{loginCopy.subtitle}</p>
        </header>

        <div className="admin-login-actions">
          <Link className="button ghost" to="/">
            {loginCopy.back}
          </Link>
        </div>

        <form
          className="admin-login-form"
          onSubmit={(event) => {
            event.preventDefault()

            if (!loginAdminSession(username, password)) {
              setError(loginCopy.error)
              return
            }

            setError('')
            navigate(redirectTarget, { replace: true })
          }}
        >
          <label>
            {loginCopy.username}
            <input
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label>
            {loginCopy.password}
            <div className="password-field">
              <input
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                type="button"
                className="password-visibility"
                onClick={() => setShowPassword((currentValue) => !currentValue)}
              >
                {showPassword ? loginCopy.hidePassword : loginCopy.showPassword}
              </button>
            </div>
          </label>

          {error ? <p className="admin-login-error">{error}</p> : null}

          <button type="submit" className="button primary">
            {loginCopy.submit}
          </button>
        </form>
      </div>
    </div>
  )
}
