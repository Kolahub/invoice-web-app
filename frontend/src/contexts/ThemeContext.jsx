import { useState, useEffect } from 'react';
import { getUserTheme, updateUserTheme } from '../utils/http';
import { ThemeContext } from './theme-context';

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for system preference as fallback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (localStorage.getItem('theme') === null) {
          setIsDarkMode(mediaQuery.matches);
          document.documentElement.classList.toggle('dark', mediaQuery.matches);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Fetch theme preference from backend on mount
  useEffect(() => {
    const fetchThemePreference = async () => {
      try {
        const theme = await getUserTheme();
        if (theme === 'dark' || theme === 'light') {
          setIsDarkMode(theme === 'dark');
          document.documentElement.classList.toggle('dark', theme === 'dark');
          return;
        }
        
        // Fallback to local storage if API fails
        const localTheme = localStorage.getItem('theme');
        if (localTheme === 'dark' || localTheme === 'light') {
          setIsDarkMode(localTheme === 'dark');
          document.documentElement.classList.toggle('dark', localTheme === 'dark');
          // Save to backend for next time
          await updateUserTheme(localTheme);
        }
      } catch (error) {
        console.error('Error handling theme preference:', error);
        // Use system preference as final fallback
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemePreference();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    const themeValue = newTheme ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', themeValue);
    
    try {
      await updateUserTheme(themeValue);
    } catch (error) {
      console.error('Failed to save theme preference to server:', error);
    } 
    // Revert if there's an error and we can't save to backend
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}
