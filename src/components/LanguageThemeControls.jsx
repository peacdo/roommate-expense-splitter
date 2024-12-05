import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useLanguage } from '@/contexts/language-context';

const LanguageThemeControls = () => {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-4">
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-background border rounded-md px-2 py-1 text-sm"
                aria-label="Select language"
            >
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
            </select>

            <button
                onClick={toggleTheme}
                className="p-2 hover:bg-accent rounded-md"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                ) : (
                    <Moon className="h-5 w-5" />
                )}
            </button>
        </div>
    );
};

export default LanguageThemeControls;