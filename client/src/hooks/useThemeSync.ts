import { useEffect } from 'react';
import { useRecipeStore } from '../features/recipes/stores/recipes.store';

export function useThemeSync() {
  const { darkMode, toggleDarkMode } = useRecipeStore();

  useEffect(() => {
    // Load saved theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' && !darkMode) {
      toggleDarkMode();
    }
  }, [darkMode, toggleDarkMode]);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    const body = document.body;
    
    if (darkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return { darkMode, toggleDarkMode };
}
