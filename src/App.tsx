import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminGuard } from './components/AdminGuard'
import { SiteProvider } from './context/SiteContext'
import { SiteShell } from './components/SiteShell'
import './App.css'

const CityPage = lazy(() => import('./pages/CityPage').then((module) => ({ default: module.CityPage })))
const PlacesPage = lazy(() => import('./pages/PlacesPage').then((module) => ({ default: module.PlacesPage })))
const RoutesPage = lazy(() => import('./pages/RoutesPage').then((module) => ({ default: module.RoutesPage })))
const AIPage = lazy(() => import('./pages/AIPage').then((module) => ({ default: module.AIPage })))
const MorePage = lazy(() => import('./pages/MorePage').then((module) => ({ default: module.MorePage })))
const AdminLoginPage = lazy(() =>
  import('./pages/AdminLoginPage').then((module) => ({ default: module.AdminLoginPage })),
)
const AdminPage = lazy(() => import('./pages/AdminPage').then((module) => ({ default: module.AdminPage })))

function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route element={<SiteShell />}>
              <Route path="/" element={<CityPage />} />
              <Route path="/places" element={<PlacesPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/ai" element={<AIPage />} />
              <Route path="/help" element={<MorePage page="help" />} />
              <Route path="/faq" element={<MorePage page="faq" />} />
              <Route path="/about" element={<MorePage page="about" />} />
              <Route path="/contact" element={<MorePage page="contact" />} />
              <Route path="/terms" element={<MorePage page="terms" />} />
              <Route path="/privacy" element={<MorePage page="privacy" />} />
            </Route>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminGuard />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </SiteProvider>
    </BrowserRouter>
  )
}

export default App
