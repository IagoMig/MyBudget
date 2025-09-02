import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveIcon, XIcon } from 'lucide-react';
import { supabase } from '../utils/supabase';

const BillForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [bill, setBill] = useState({
    description: '',
    amount: '',
    due_date: new Date().toISOString().split('T')[0],
    recurrent: false,
    recurrence_period: 'monthly',
  });

  // Pega userId quando o componente monta
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Erro ao obter usuário:', error);
        return;
      }
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setBill((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('Usuário não autenticado');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.from('bills').insert([
        {
          user_id: userId, // <-- importante
          description: bill.description,
          amount: parseFloat(bill.amount),
          due_date: bill.due_date,
          status: 'pending',
          recurrent: bill.recurrent,
          recurrence_period: bill.recurrent ? bill.recurrence_period : null,
        },
      ]);

      if (error) throw error;
      navigate('/bills');
    } catch (error) {
      console.error('Error saving bill:', error);
      alert('Erro ao salvar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Nova Conta a Pagar</h1>
        <button onClick={() => navigate('/bills')} className="p-2 rounded-full bg-gray-100">
          <XIcon size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input
            type="text"
            name="description"
            required
            value={bill.description}
            onChange={handleChange}
            placeholder="Ex: Conta de Luz"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            required
            value={bill.amount}
            onChange={handleChange}
            placeholder="0,00"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
          <input
            type="date"
            name="due_date"
            required
            value={bill.due_date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recurrent"
            name="recurrent"
            checked={bill.recurrent}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="recurrent" className="ml-2 block text-sm text-gray-700">
            Conta recorrente
          </label>
        </div>
        {bill.recurrent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Periodicidade</label>
            <select
              name="recurrence_period"
              value={bill.recurrence_period}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="weekly">Semanal</option>
              <option value="biweekly">Quinzenal</option>
              <option value="monthly">Mensal</option>
              <option value="quarterly">Trimestral</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          {loading ? (
            <span>Salvando...</span>
          ) : (
            <>
              <SaveIcon size={20} />
              <span>Salvar Conta</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BillForm;
