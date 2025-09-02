import React from 'react';
import { CalendarIcon, LayoutGridIcon, TableIcon } from 'lucide-react';
import { ViewMode } from '../types';
import { supabase } from '../utils/supabase';
interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}
const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange
}) => {
  const handleViewChange = async (view: ViewMode) => {
    onViewChange(view);
    try {
      // Save preference to database
      const {
        error
      } = await supabase.from('user_settings').upsert({
        default_view: view,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
      if (error) {
        console.error('Error saving view preference:', error);
      }
    } catch (error) {
      console.error('Error saving view preference:', error);
    }
  };
  return <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-4">
      <button onClick={() => handleViewChange('cards')} className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'cards' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
        <LayoutGridIcon size={16} className="mr-1" />
        Cards
      </button>
      <button onClick={() => handleViewChange('table')} className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'table' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
        <TableIcon size={16} className="mr-1" />
        Tabela
      </button>
      <button onClick={() => handleViewChange('calendar')} className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'calendar' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
        <CalendarIcon size={16} className="mr-1" />
        Calendário
      </button>
    </div>;
};
export default ViewToggle;