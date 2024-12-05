import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastProvider } from '@/components/ui/use-toast.jsx'
import { ThemeProvider } from '@/contexts/theme-context'
import { LanguageProvider } from '@/contexts/language-context'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <LanguageProvider>
                <ToastProvider>
                    <App />
                </ToastProvider>
            </LanguageProvider>
        </ThemeProvider>
    </StrictMode>,
)