import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { MonthData } from '../types';
interface MonthSelectorProps {
  currentMonth: MonthData;
  onMonthChange: (month: MonthData) => void;
}
const MonthSelector: React.FC<MonthSelectorProps> = ({
  currentMonth,
  onMonthChange
}) => {
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth.year, currentMonth.month - 1, 1);
    onMonthChange({
      month: prevMonth.getMonth(),
      year: prevMonth.getFullYear(),
      label: prevMonth.toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric'
      })
    });
  };
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth.year, currentMonth.month + 1, 1);
    onMonthChange({
      month: nextMonth.getMonth(),
      year: nextMonth.getFullYear(),
      label: nextMonth.toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric'
      })
    });
  };
  const goToCurrentMonth = () => {
    const now = new Date();
    onMonthChange({
      month: now.getMonth(),
      year: now.getFullYear(),
      label: now.toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric'
      })
    });
  };
  return <div className="flex items-center justify-between mb-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
      <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
        <ChevronLeftIcon size={20} className="text-gray-600 dark:text-gray-300" />
      </button>
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold capitalize text-gray-800 dark:text-white">
          {currentMonth.label}
        </h2>
        <button onClick={goToCurrentMonth} className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          Ir para mês atual
        </button>
      </div>
      <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
        <ChevronRightIcon size={20} className="text-gray-600 dark:text-gray-300" />
      </button>
    </div>;
};
export default MonthSelector;