import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ✅ Import the PWA service worker register
import { registerSW } from 'virtual:pwa-register'

// This will handle updates & offline ready state
const updateSW = registerSW({
  onNeedRefresh() {
    // you can show a toast/alert here if you want
    alert("New content available, please refresh.")
    console.log("New content available, please refresh.")
  },
  onOfflineReady() {
    alert("App ready to work offline")
    console.log("App ready to work offline")
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
