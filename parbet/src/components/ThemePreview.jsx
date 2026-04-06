import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemePreview() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }, []);

    return (
        <button onClick={() => setIsDark(!isDark)} className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-[100] transition-colors ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
    );
}