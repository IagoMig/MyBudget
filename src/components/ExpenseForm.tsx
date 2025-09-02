import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { SaveIcon, XIcon } from 'lucide-react';
const categories = [{
  id: 'alimentacao',
  name: 'Alimentação'
}, {
  id: 'transporte',
  name: 'Transporte'
}, {
  id: 'moradia',
  name: 'Moradia'
}, {
  id: 'lazer',
  name: 'Lazer'
}, {
  id: 'saude',
  name: 'Saúde'
}, {
  id: 'educacao',
  name: 'Educação'
}, {
  id: 'outros',
  name: 'Outros'
}];
const ExpenseForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from('expenses').insert([{
        amount: parseFloat(expense.amount),
        category: expense.category,
        description: expense.description,
        date: expense.date
      }]);
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Erro ao salvar despesa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  return <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Nova Despesa</h1>
        <button onClick={() => navigate('/')} className="p-2 rounded-full bg-gray-100">
          <XIcon size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor (R$)
          </label>
          <input type="number" name="amount" step="0.01" required value={expense.amount} onChange={handleChange} placeholder="0,00" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select name="category" required value={expense.category} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Selecione uma categoria</option>
            {categories.map(category => <option key={category.id} value={category.id}>
                {category.name}
              </option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <input type="text" name="description" required value={expense.description} onChange={handleChange} placeholder="Ex: Supermercado" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data
          </label>
          <input type="date" name="date" required value={expense.date} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
          {loading ? <span>Salvando...</span> : <>
              <SaveIcon size={20} />
              <span>Salvar Despesa</span>
            </>}
        </button>
      </form>
    </div>;
};
export default ExpenseForm;