const adminSessionKey = 'jermuk-travel.admin-auth.v1'

export const defaultAdminUsername = import.meta.env.VITE_ADMIN_USERNAME?.trim() || 'admin'
export const defaultAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD?.trim() || 'jermuk2026'

function getExpectedUsername() {
  return defaultAdminUsername
}

function getExpectedPassword() {
  return defaultAdminPassword
}

export function isAdminAuthenticated() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.sessionStorage.getItem(adminSessionKey) === '1'
}

export function loginAdminSession(username: string, password: string) {
  if (typeof window === 'undefined') {
    return false
  }

  const isValid =
    username.trim() === getExpectedUsername() && password === getExpectedPassword()

  if (!isValid) {
    return false
  }

  window.sessionStorage.setItem(adminSessionKey, '1')
  return true
}

export function logoutAdminSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(adminSessionKey)
}
