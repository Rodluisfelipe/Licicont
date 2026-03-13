import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register web vitals for performance monitoring
if ('connection' in navigator) {
  const conn = (navigator as any).connection;
  if (conn?.saveData) {
    document.documentElement.classList.add('save-data');
  }
}
