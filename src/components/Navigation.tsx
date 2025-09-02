import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, PieChartIcon, PlusCircleIcon, SettingsIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
const Navigation: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400';
  };
  return <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4 shadow-lg transition-colors duration-200">
      <div className="flex justify-around items-center">
        <Link to="/" className={`flex flex-col items-center ${isActive('/')}`}>
          <HomeIcon size={24} />
          <span className="text-xs mt-1">Início</span>
        </Link>
        <Link to="/bills" className={`flex flex-col items-center ${isActive('/bills')}`}>
          <CalendarIcon size={24} />
          <span className="text-xs mt-1">Contas</span>
        </Link>
        <Link to="/add-expense" className={`flex flex-col items-center ${isActive('/add-expense')}`}>
          <PlusCircleIcon size={24} />
          <span className="text-xs mt-1">Despesa</span>
        </Link>
        <Link to="/income" className={`flex flex-col items-center ${isActive('/income')}`}>
          <TrendingUpIcon size={24} />
          <span className="text-xs mt-1">Receitas</span>
        </Link>
        <Link to="/reports" className={`flex flex-col items-center ${isActive('/reports')}`}>
          <PieChartIcon size={24} />
          <span className="text-xs mt-1">Relatórios</span>
        </Link>
        <Link to="/settings" className={`flex flex-col items-center ${isActive('/settings')}`}>
          <SettingsIcon size={24} />
          <span className="text-xs mt-1">Config.</span>
        </Link>
      </div>
    </nav>;
};
export default Navigation;