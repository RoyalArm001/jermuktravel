import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerAppServiceWorker } from './lib/registerServiceWorker'

createRoot(document.getElementById('root')!).render(<App />)

registerAppServiceWorker()
