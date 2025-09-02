import React, { useEffect, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, AlertCircleIcon } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { Expense, MonthSummary, Bill, Income, MonthData, ViewMode } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import MonthSelector from './MonthSelector';
import ViewToggle from './ViewToggle';
import CalendarView from './CalendarView';
import TableView from './TableView';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [upcomingBills, setUpcomingBills] = useState<Bill[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  // Current selected month
  const [currentMonth, setCurrentMonth] = useState<MonthData>(() => {
    const now = new Date();
    return {
      month: now.getMonth(),
      year: now.getFullYear(),
      label: now.toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric'
      })
    };
  });
  useEffect(() => {
    fetchUserSettings();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchExpenses(), fetchIncome(), fetchBills(), fetchMonthlyData()]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentMonth]);
  const fetchUserSettings = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('user_settings').select('default_view').single();
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user settings:', error);
      }
      if (data && data.default_view) {
        setViewMode(data.default_view as ViewMode);
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };
  const fetchExpenses = async () => {
    try {
      const startDate = new Date(currentMonth.year, currentMonth.month, 1);
      const endDate = new Date(currentMonth.year, currentMonth.month + 1, 0);
      const {
        data,
        error
      } = await supabase.from('expenses').select('*').gte('date', startDate.toISOString().split('T')[0]).lte('date', endDate.toISOString().split('T')[0]);
      if (error) throw error;
      setExpenses(data || []);
      // Calculate total expenses
      const total = (data || []).reduce((sum, expense) => sum + expense.amount, 0);
      setTotalExpenses(total);
      // Prepare data for pie chart
      const categoryMap = new Map();
      (data || []).forEach(expense => {
        const current = categoryMap.get(expense.category) || 0;
        categoryMap.set(expense.category, current + expense.amount);
      });
      const chartData = Array.from(categoryMap.entries()).map(([name, value]) => ({
        name,
        value
      }));
      setCategoryData(chartData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };
  const fetchIncome = async () => {
    try {
      const startDate = new Date(currentMonth.year, currentMonth.month, 1);
      const endDate = new Date(currentMonth.year, currentMonth.month + 1, 0);
      const {
        data,
        error
      } = await supabase.from('income').select('*').gte('date', startDate.toISOString().split('T')[0]).lte('date', endDate.toISOString().split('T')[0]);
      if (error) throw error;
      setIncomes(data || []);
      // Calculate total income
      const total = (data || []).reduce((sum, income) => sum + income.amount, 0);
      setTotalIncome(total);
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };
  const fetchBills = async () => {
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      // Get all bills for the current month
      const startDate = new Date(currentMonth.year, currentMonth.month, 1);
      const endDate = new Date(currentMonth.year, currentMonth.month + 1, 0);
      const {
        data,
        error
      } = await supabase.from('bills').select('*').gte('due_date', startDate.toISOString().split('T')[0]).lte('due_date', endDate.toISOString().split('T')[0]).order('due_date', {
        ascending: true
      });
      if (error) throw error;
      setBills(data || []);
      // Filter for upcoming bills (next 7 days)
      const upcoming = (data || []).filter(bill => {
        if (bill.status === 'paid') return false;
        const dueDate = new Date(bill.due_date);
        return dueDate >= today && dueDate <= nextWeek;
      });
      setUpcomingBills(upcoming);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };
  const fetchMonthlyData = async () => {
    try {
      // Get last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentMonth.year, currentMonth.month - i, 1);
        months.push({
          month: date.toLocaleString('pt-BR', {
            month: 'short'
          }),
          year: date.getFullYear(),
          monthNum: date.getMonth() + 1
        });
      }
      const monthlyData = [];
      for (const monthData of months) {
        // Fetch expenses for this month
        const {
          data: expenseData,
          error: expenseError
        } = await supabase.from('expenses').select('amount').gte('date', `${monthData.year}-${monthData.monthNum.toString().padStart(2, '0')}-01`).lte('date', `${monthData.year}-${monthData.monthNum.toString().padStart(2, '0')}-31`);
        if (expenseError) throw expenseError;
        // Fetch income for this month
        const {
          data: incomeData,
          error: incomeError
        } = await supabase.from('income').select('amount').gte('date', `${monthData.year}-${monthData.monthNum.toString().padStart(2, '0')}-01`).lte('date', `${monthData.year}-${monthData.monthNum.toString().padStart(2, '0')}-31`);
        if (incomeError) throw incomeError;
        const totalExpense = (expenseData || []).reduce((sum, item) => sum + item.amount, 0);
        const totalIncome = (incomeData || []).reduce((sum, item) => sum + item.amount, 0);
        monthlyData.push({
          name: monthData.month,
          despesas: totalExpense,
          receitas: totalIncome
        });
      }
      setMonthlyData(monthlyData);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };
  const handleMonthChange = (newMonth: MonthData) => {
    setCurrentMonth(newMonth);
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  return <div className="p-4 pb-20 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
        Olá, USER!
      </h1>
      <MonthSelector currentMonth={currentMonth} onMonthChange={handleMonthChange} />
      <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
      {viewMode === 'calendar' ? <CalendarView currentMonth={currentMonth} /> : <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-600 dark:bg-blue-700 rounded-xl p-4 text-white shadow-md">
              <h2 className="text-xs opacity-80 mb-1">Gastos</h2>
              <div className="text-xl font-bold">
                {formatCurrency(totalExpenses)}
              </div>
            </div>
            <div className="bg-green-600 dark:bg-green-700 rounded-xl p-4 text-white shadow-md">
              <h2 className="text-xs opacity-80 mb-1">Receitas</h2>
              <div className="text-xl font-bold">
                {formatCurrency(totalIncome)}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">
              Saldo do Mês
            </h2>
            <div className="text-3xl font-bold mb-2 dark:text-white">
              {formatCurrency(totalIncome - totalExpenses)}
            </div>
            <div className="flex items-center text-sm">
              {totalIncome > totalExpenses ? <>
                  <ArrowUpIcon size={16} className="mr-1 text-green-500" />
                  <span className="text-green-500">Saldo positivo</span>
                </> : <>
                  <ArrowDownIcon size={16} className="mr-1 text-red-500" />
                  <span className="text-red-500">Saldo negativo</span>
                </>}
            </div>
          </div>
          {upcomingBills.length > 0 && <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-4 mb-6 shadow-sm border border-yellow-100 dark:border-yellow-900/50">
              <h2 className="text-lg font-semibold mb-2 flex items-center text-yellow-800 dark:text-yellow-200">
                <AlertCircleIcon size={20} className="mr-2" />
                Contas Próximas
              </h2>
              <div className="space-y-2">
                {upcomingBills.slice(0, 3).map(bill => <div key={bill.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium dark:text-white">
                        {bill.description}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Vence em{' '}
                        {new Date(bill.due_date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="font-semibold dark:text-white">
                      {formatCurrency(bill.amount)}
                    </div>
                  </div>)}
              </div>
            </div>}
          {viewMode === 'table' ? <TableView expenses={expenses} bills={bills} incomes={incomes} type="all" /> : <>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">
                  Distribuição de Gastos
                </h2>
                {loading ? <div className="flex justify-center py-8 dark:text-gray-300">
                    Carregando...
                  </div> : categoryData.length > 0 ? <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({
                  name,
                  percent
                }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                          {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div> : <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Nenhum dado disponível para exibição
                  </div>}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">
                  Histórico Mensal
                </h2>
                {loading ? <div className="flex justify-center py-8 dark:text-gray-300">
                    Carregando...
                  </div> : monthlyData.length > 0 ? <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={value => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="receitas" fill="#22c55e" name="Receitas" />
                        <Bar dataKey="despesas" fill="#3b82f6" name="Despesas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div> : <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Nenhum dado disponível para exibição
                  </div>}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">
                  Últimas Transações
                </h2>
                {loading ? <div className="flex justify-center py-4 dark:text-gray-300">
                    Carregando...
                  </div> : expenses.length > 0 ? <div className="space-y-3">
                    {expenses.slice(0, 3).map(expense => <div key={expense.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                            <DollarSignIcon size={20} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium dark:text-white">
                              {expense.description}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {expense.category} •{' '}
                              {new Date(expense.date).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold dark:text-white">
                          {formatCurrency(expense.amount)}
                        </div>
                      </div>)}
                  </div> : <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Nenhuma transação registrada este mês
                  </div>}
              </div>
            </>}
        </>}
    </div>;
};
export default Dashboard;