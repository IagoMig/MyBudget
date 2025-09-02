import React, { useEffect, useState } from 'react';
import { Bill, Expense, Income, MonthData } from '../types';
import { supabase } from '../utils/supabase';
interface CalendarViewProps {
  currentMonth: MonthData;
}
interface CalendarDay {
  date: Date;
  expenses: Expense[];
  bills: Bill[];
  incomes: Income[];
  isCurrentMonth: boolean;
  isToday: boolean;
}
const CalendarView: React.FC<CalendarViewProps> = ({
  currentMonth
}) => {
  const [calendarDays, setCalendarDays] = useState<CalendarDay[][]>([]);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchExpenses(), fetchBills(), fetchIncomes()]);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentMonth]);
  useEffect(() => {
    generateCalendar();
  }, [expenses, bills, incomes, currentMonth]);
  const fetchExpenses = async () => {
    const startDate = new Date(currentMonth.year, currentMonth.month, 1);
    const endDate = new Date(currentMonth.year, currentMonth.month + 1, 0);
    const {
      data,
      error
    } = await supabase.from('expenses').select('*').gte('date', startDate.toISOString().split('T')[0]).lte('date', endDate.toISOString().split('T')[0]);
    if (error) throw error;
    setExpenses(data || []);
  };
  const fetchBills = async () => {
    const startDate = new Date(currentMonth.year, currentMonth.month, 1);
    const endDate = new Date(currentMonth.year, currentMonth.month + 1, 0);
    const {
      data,
      error
    } = await supabase.from('bills').select('*').gte('due_date', startDate.toISOString().split('T')[0]).lte('due_date', endDate.toISOString().split('T')[0]);
    if (error) throw error;
    setBills(data || []);
  };
  const fetchIncomes = async () => {
    const startDate = new Date(currentMonth.year, currentMonth.month, 1);
    const endDate = new Date(currentMonth.year, currentMonth.month + 1, 0);
    const {
      data,
      error
    } = await supabase.from('income').select('*').gte('date', startDate.toISOString().split('T')[0]).lte('date', endDate.toISOString().split('T')[0]);
    if (error) throw error;
    setIncomes(data || []);
  };
  const generateCalendar = () => {
    const today = new Date();
    const firstDay = new Date(currentMonth.year, currentMonth.month, 1);
    const lastDay = new Date(currentMonth.year, currentMonth.month + 1, 0);
    // Start from the first day of the week that contains the first day of the month
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    // End on the last day of the week that contains the last day of the month
    const endDate = new Date(lastDay);
    if (endDate.getDay() < 6) {
      endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    }
    const calendar: CalendarDay[][] = [];
    let week: CalendarDay[] = [];
    // Generate the calendar array
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayExpenses = expenses.filter(e => e.date === dateStr);
      const dayBills = bills.filter(b => b.due_date === dateStr);
      const dayIncomes = incomes.filter(i => i.date === dateStr);
      const isCurrentMonth = currentDate.getMonth() === currentMonth.month;
      const isToday = currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
      week.push({
        date: new Date(currentDate),
        expenses: dayExpenses,
        bills: dayBills,
        incomes: dayIncomes,
        isCurrentMonth,
        isToday
      });
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (week.length > 0) {
      calendar.push(week);
    }
    setCalendarDays(calendar);
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  const getTotalForDay = (day: CalendarDay) => {
    const expensesTotal = day.expenses.reduce((sum, e) => sum + e.amount, 0);
    const billsTotal = day.bills.reduce((sum, b) => sum + b.amount, 0);
    const incomesTotal = day.incomes.reduce((sum, i) => sum + i.amount, 0);
    return incomesTotal - expensesTotal - billsTotal;
  };
  if (loading) {
    return <div className="flex justify-center py-8">Carregando calendário...</div>;
  }
  return <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => <div key={index} className="text-center text-sm font-medium py-2 text-gray-600 dark:text-gray-300">
            {day}
          </div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.flat().map((day, index) => {
        const dayTotal = getTotalForDay(day);
        const hasTransactions = day.expenses.length > 0 || day.bills.length > 0 || day.incomes.length > 0;
        return <div key={index} className={`
                min-h-24 p-2 border rounded-lg relative
                ${day.isToday ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'}
                ${day.isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900 opacity-50'}
              `}>
              <div className={`
                text-right font-medium text-sm mb-1
                ${day.isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}
              `}>
                {day.date.getDate()}
              </div>
              {hasTransactions && <div className={`
                  text-xs font-semibold rounded-full px-2 py-1 mt-1 text-center
                  ${dayTotal >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}
                `}>
                  {formatCurrency(dayTotal)}
                </div>}
              <div className="mt-1 space-y-1">
                {day.incomes.length > 0 && <div className="flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      {day.incomes.length} receita(s)
                    </span>
                  </div>}
                {day.expenses.length > 0 && <div className="flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      {day.expenses.length} despesa(s)
                    </span>
                  </div>}
                {day.bills.length > 0 && <div className="flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      {day.bills.length} conta(s)
                    </span>
                  </div>}
              </div>
            </div>;
      })}
      </div>
    </div>;
};
export default CalendarView;