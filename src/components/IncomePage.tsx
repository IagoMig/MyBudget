import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrendingUpIcon } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { Income, MonthData, ViewMode } from '../types';
import MonthSelector from './MonthSelector';
import ViewToggle from './ViewToggle';
import TableView from './TableView';
const IncomePage: React.FC = () => {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
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
    fetchIncomes();
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
  const fetchIncomes = async () => {
    try {
      setLoading(true);
      // Get incomes for the selected month
      const startDate = new Date(currentMonth.year, currentMonth.month, 1);
      const endDate = new Date(currentMonth.year, currentMonth.month + 1, 0);
      const {
        data,
        error
      } = await supabase.from('income').select('*').gte('date', startDate.toISOString().split('T')[0]).lte('date', endDate.toISOString().split('T')[0]).order('date', {
        ascending: false
      });
      if (error) throw error;
      setIncomes(data || []);
      // Calculate total income
      const total = (data || []).reduce((sum, income) => sum + income.amount, 0);
      setTotalIncome(total);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
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
  const getSourceName = (sourceId: string) => {
    const sources: Record<string, string> = {
      salary: 'Salário',
      freelance: 'Freelance',
      investments: 'Investimentos',
      gifts: 'Presentes',
      other: 'Outros'
    };
    return sources[sourceId] || sourceId;
  };
  return <div className="p-4 pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Receitas
        </h1>
        <button onClick={() => navigate('/add-income')} className="p-2 rounded-full bg-green-600 text-white">
          <PlusIcon size={20} />
        </button>
      </div>
      <MonthSelector currentMonth={currentMonth} onMonthChange={handleMonthChange} />
      <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
      <div className="bg-green-600 dark:bg-green-700 rounded-xl p-5 text-white mb-6 shadow-md">
        <h2 className="text-sm opacity-80 mb-1">
          Receitas de {currentMonth.label}
        </h2>
        <div className="text-3xl font-bold mb-2">
          {formatCurrency(totalIncome)}
        </div>
      </div>
      {loading ? <div className="flex justify-center py-8 dark:text-gray-300">
          Carregando...
        </div> : incomes.length > 0 ? viewMode === 'table' ? <TableView expenses={[]} bills={[]} incomes={incomes} type="incomes" /> : <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              Histórico de Receitas
            </h2>
            <div className="space-y-3">
              {incomes.map(income => <div key={income.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-3">
                      <TrendingUpIcon size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium dark:text-white">
                        {income.description}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getSourceName(income.source)} •{' '}
                        {new Date(income.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(income.amount)}
                  </div>
                </div>)}
            </div>
          </div> : <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Nenhuma receita registrada
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Adicione suas receitas para acompanhar seus ganhos
          </p>
          <button onClick={() => navigate('/add-income')} className="bg-green-600 text-white px-4 py-2 rounded-lg">
            Adicionar Receita
          </button>
        </div>}
    </div>;
};
export default IncomePage;