import RoommateExpenses from './components/RoommateExpenses'
import { Toaster } from '@/components/ui/toaster'
import LanguageThemeControls from '@/components/LanguageThemeControls'
import { useLanguage } from '@/contexts/language-context'
import './App.css'

function App() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="max-w-4xl mx-auto py-4 px-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
                        <LanguageThemeControls />
                    </div>
                </div>
            </header>
            <main className="max-w-4xl mx-auto p-4">
                <RoommateExpenses />
            </main>
            <Toaster />
        </div>
    )
}

export default App