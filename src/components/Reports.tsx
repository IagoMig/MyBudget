import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { DownloadIcon, FileTextIcon, BarChart2Icon } from 'lucide-react';
import { Expense } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
const Reports: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('expenses').select('*').order('date', {
          ascending: false
        });
        if (error) throw error;
        setExpenses(data || []);
        // Prepare data for monthly chart
        const monthMap = new Map();
        (data || []).forEach(expense => {
          const month = expense.date.substring(0, 7); // YYYY-MM
          const current = monthMap.get(month) || 0;
          monthMap.set(month, current + expense.amount);
        });
        const monthlyChartData = Array.from(monthMap.entries()).map(([month, total]) => {
          const date = new Date(month + '-01');
          return {
            month: date.toLocaleString('pt-BR', {
              month: 'short',
              year: '2-digit'
            }),
            total
          };
        }).sort((a, b) => {
          const monthA = new Date(a.month);
          const monthB = new Date(b.month);
          return monthA.getTime() - monthB.getTime();
        });
        setMonthlyData(monthlyChartData);
        // Prepare data for category chart
        const categoryMap = new Map();
        (data || []).forEach(expense => {
          const current = categoryMap.get(expense.category) || 0;
          categoryMap.set(expense.category, current + expense.amount);
        });
        const categoryChartData = Array.from(categoryMap.entries()).map(([category, total]) => ({
          category,
          total
        }));
        setCategoryData(categoryChartData);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  const downloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = imgProps.height * pdfWidth / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('mybudget-relatorio.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };
  return <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Relatórios</h1>
        <button onClick={downloadPDF} className="p-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2">
          <DownloadIcon size={18} />
          <span>PDF</span>
        </button>
      </div>
      <div id="report-content">
        <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2Icon size={20} className="mr-2 text-blue-600" />
            Gastos Mensais
          </h2>
          {loading ? <div className="flex justify-center py-8">Carregando...</div> : monthlyData.length > 0 ? <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={value => `R$${value}`} />
                  <Tooltip formatter={value => formatCurrency(value as number)} />
                  <Bar dataKey="total" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div> : <div className="text-center py-8 text-gray-500">
              Nenhum dado disponível para exibição
            </div>}
        </div>
        <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FileTextIcon size={20} className="mr-2 text-blue-600" />
            Tabela de Despesas
          </h2>
          {loading ? <div className="flex justify-center py-4">Carregando...</div> : expenses.length > 0 ? <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map(expense => <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div> : <div className="text-center py-4 text-gray-500">
              Nenhuma despesa registrada
            </div>}
        </div>
      </div>
    </div>;
};
export default Reports;