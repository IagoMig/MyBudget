import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveIcon, XIcon } from 'lucide-react';
import { supabase } from '../utils/supabase';

const incomeSources = [
  { id: 'salary', name: 'Salário' },
  { id: 'freelance', name: 'Freelance' },
  { id: 'investments', name: 'Investimentos' },
  { id: 'gifts', name: 'Presentes' },
  { id: 'other', name: 'Outros' },
];

const IncomeForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [income, setIncome] = useState({
    amount: '',
    source: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchUser = async () => {
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
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIncome((prev) => ({
      ...prev,
      [name]: value,
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
      const { data, error } = await supabase.from('income').insert([
        {
          user_id: userId,
          amount: parseFloat(income.amount),
          source: income.source,
          description: income.description,
          date: income.date,
        },
      ]);
      if (error) throw error;
      navigate('/income');
    } catch (error) {
      console.error('Error saving income:', error);
      alert('Erro ao salvar receita. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Nova Receita</h1>
        <button onClick={() => navigate('/income')} className="p-2 rounded-full bg-gray-100">
          <XIcon size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            required
            value={income.amount}
            onChange={handleChange}
            placeholder="0,00"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fonte</label>
          <select
            name="source"
            required
            value={income.source}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione uma fonte</option>
            {incomeSources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input
            type="text"
            name="description"
            required
            value={income.description}
            onChange={handleChange}
            placeholder="Ex: Salário Mensal"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <input
            type="date"
            name="date"
            required
            value={income.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
        >
          {loading ? (
            <span>Salvando...</span>
          ) : (
            <>
              <SaveIcon size={20} />
              <span>Salvar Receita</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default IncomeForm;
