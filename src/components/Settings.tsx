import React, { useEffect, useState } from 'react';
import { InfoIcon, UserIcon, DatabaseIcon, SunIcon, MoonIcon, LayoutGridIcon, TableIcon, CalendarIcon, BellIcon, BellOffIcon } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useTheme } from './ThemeProvider';
import { UserSettings, ViewMode } from '../types';
const Settings: React.FC = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const [settings, setSettings] = useState<Partial<UserSettings>>({
    default_view: 'cards',
    notifications_enabled: true
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchSettings();
  }, []);
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('user_settings').select('*').single();
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
      }
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };
  const updateSetting = async (key: keyof UserSettings, value: any) => {
    try {
      const updatedSettings = {
        ...settings,
        [key]: value,
        updated_at: new Date().toISOString()
      };
      setSettings(updatedSettings);
      const {
        error
      } = await supabase.from('user_settings').upsert(updatedSettings, {
        onConflict: 'user_id'
      });
      if (error) {
        console.error(`Error updating ${key}:`, error);
      }
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
  };
  const handleViewChange = (view: ViewMode) => {
    updateSetting('default_view', view);
  };
  const toggleNotifications = () => {
    updateSetting('notifications_enabled', !settings.notifications_enabled);
  };
  return <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        Configurações
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-3">
            <UserIcon size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold dark:text-white">Perfil</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              User
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-6 dark:text-white">
          Aparência
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {theme === 'light' ? <SunIcon size={20} className="text-yellow-500 mr-3" /> : <MoonIcon size={20} className="text-indigo-400 mr-3" />}
              <div>
                <h3 className="font-medium dark:text-white">Tema</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {theme === 'light' ? 'Modo claro' : 'Modo escuro'}
                </p>
              </div>
            </div>
            <button onClick={toggleTheme} className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
              <span className={`${theme === 'dark' ? 'translate-x-6 bg-indigo-500' : 'translate-x-1 bg-white'} inline-block h-4 w-4 transform rounded-full transition`} />
            </button>
          </div>
          <div>
            <h3 className="font-medium mb-3 dark:text-white">
              Visualização padrão
            </h3>
            <div className="flex space-x-2">
              <button onClick={() => handleViewChange('cards')} className={`flex items-center px-3 py-2 rounded-md text-sm ${settings.default_view === 'cards' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                <LayoutGridIcon size={16} className="mr-1" />
                Cards
              </button>
              <button onClick={() => handleViewChange('table')} className={`flex items-center px-3 py-2 rounded-md text-sm ${settings.default_view === 'table' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                <TableIcon size={16} className="mr-1" />
                Tabela
              </button>
              <button onClick={() => handleViewChange('calendar')} className={`flex items-center px-3 py-2 rounded-md text-sm ${settings.default_view === 'calendar' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                <CalendarIcon size={16} className="mr-1" />
                Calendário
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {settings.notifications_enabled ? <BellIcon size={20} className="text-blue-500 mr-3" /> : <BellOffIcon size={20} className="text-gray-500 mr-3" />}
              <div>
                <h3 className="font-medium dark:text-white">Notificações</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {settings.notifications_enabled ? 'Ativadas' : 'Desativadas'}
                </p>
              </div>
            </div>
            <button onClick={toggleNotifications} className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
              <span className={`${settings.notifications_enabled ? 'translate-x-6 bg-blue-500' : 'translate-x-1 bg-white'} inline-block h-4 w-4 transform rounded-full transition`} />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-3">
            <DatabaseIcon size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold dark:text-white">
              Banco de Dados
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Supabase</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-3">
            <InfoIcon size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold dark:text-white">Sobre</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              MyBudget v1.0.0
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          <p>Desenvolvido exclusivamente por Iago Miguel.</p>
          <p className="mt-2">
            © 2025 Iago Miguel. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>;
};
export default Settings;