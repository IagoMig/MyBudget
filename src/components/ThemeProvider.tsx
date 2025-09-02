import React, { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './auth/AuthProvider';
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [loading, setLoading] = useState(true);
  const {
    user
  } = useAuth();
  useEffect(() => {
    // Try to get theme from localStorage first for immediate UI update
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check if user prefers dark mode
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDarkMode ? 'dark' : 'light');
    }
    // Then fetch from database if user is logged in
    if (user) {
      fetchThemeFromDatabase();
    } else {
      setLoading(false);
    }
  }, [user]);
  const fetchThemeFromDatabase = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('user_settings').select('theme').eq('user_id', user?.id).single();
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching theme:', error);
      }
      if (data) {
        setTheme(data.theme);
        localStorage.setItem('theme', data.theme);
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (user) {
      try {
        // Update in database
        const {
          error
        } = await supabase.from('user_settings').upsert({
          user_id: user.id,
          theme: newTheme,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        if (error) {
          console.error('Error saving theme preference:', error);
        }
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    }
  };
  if (loading) {
    return null;
  }
  return <ThemeContext.Provider value={{
    theme,
    toggleTheme
  }}>
      {children}
    </ThemeContext.Provider>;
};