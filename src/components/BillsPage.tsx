import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircleIcon, CheckCircleIcon, ClockIcon, PlusIcon } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { Bill, MonthData, ViewMode } from '../types';
import MonthSelector from './MonthSelector';
import ViewToggle from './ViewToggle';
import TableView from './TableView';
const BillsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchBills();
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
  const fetchBills = async () => {
    try {
      setLoading(true);
      // Get bills for the selected month
      const startDate = new Date(currentMonth.year, currentMonth.month, 1);
      const endDate = new Date(currentMonth.year, currentMonth.month + 1, 0);
      const {
        data,
        error
      } = await supabase.from('bills').select('*').gte('due_date', startDate.toISOString().split('T')[0]).lte('due_date', endDate.toISOString().split('T')[0]).order('due_date', {
        ascending: true
      });
      if (error) throw error;
      // Update status based on due dates
      const today = new Date();
      const updatedBills = (data || []).map(bill => {
        const dueDate = new Date(bill.due_date);
        if (bill.status === 'paid') {
          return bill;
        } else if (dueDate < today && bill.status !== 'paid') {
          return {
            ...bill,
            status: 'overdue'
          };
        }
        return bill;
      });
      setBills(updatedBills);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleMonthChange = (newMonth: MonthData) => {
    setCurrentMonth(newMonth);
  };
  const markAsPaid = async (id: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const {
        error
      } = await supabase.from('bills').update({
        status: 'paid',
        payment_date: today
      }).eq('id', id);
      if (error) throw error;
      // Update local state
      setBills(bills.map(bill => bill.id === id ? {
        ...bill,
        status: 'paid',
        payment_date: today
      } : bill));
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircleIcon size={20} className="text-green-500" />;
      case 'overdue':
        return <AlertCircleIcon size={20} className="text-red-500" />;
      default:
        return <ClockIcon size={20} className="text-yellow-500" />;
    }
  };
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'overdue':
        return 'Atrasado';
      default:
        return 'Pendente';
    }
  };
  return <div className="p-4 pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Contas a Pagar
        </h1>
        <button onClick={() => navigate('/add-bill')} className="p-2 rounded-full bg-blue-600 text-white">
          <PlusIcon size={20} />
        </button>
      </div>
      <MonthSelector currentMonth={currentMonth} onMonthChange={handleMonthChange} />
      <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
      {loading ? <div className="flex justify-center py-8 dark:text-gray-300">
          Carregando...
        </div> : bills.length > 0 ? viewMode === 'table' ? <TableView expenses={[]} bills={bills} incomes={[]} type="bills" /> : <div className="space-y-4">
            {bills.map(bill => <div key={bill.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold dark:text-white">
                      {bill.description}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Vencimento:{' '}
                      {new Date(bill.due_date).toLocaleDateString('pt-BR')}
                    </p>
                    {bill.recurrent && <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 px-2 py-1 rounded-full mt-1 inline-block">
                        Recorrente {bill.recurrence_period}
                      </span>}
                  </div>
                  <div className="text-right">
                    <div className="font-bold dark:text-white">
                      {formatCurrency(bill.amount)}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center mt-1 ${getStatusClass(bill.status)}`}>
                      {getStatusIcon(bill.status)}
                      <span className="ml-1">{getStatusText(bill.status)}</span>
                    </span>
                  </div>
                </div>
                {bill.status !== 'paid' && <button onClick={() => markAsPaid(bill.id)} className="w-full mt-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-900/50 rounded-lg py-2 text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                    Marcar como Pago
                  </button>}
              </div>)}
          </div> : <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Nenhuma conta a pagar
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Adicione suas contas para acompanhar os vencimentos
          </p>
          <button onClick={() => navigate('/add-bill')} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Adicionar Conta
          </button>
        </div>}
    </div>;
};
export default BillsPage;