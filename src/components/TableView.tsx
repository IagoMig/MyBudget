import React from 'react';
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon } from 'lucide-react';
import { Expense, Bill, Income } from '../types';
interface TableViewProps {
  expenses: Expense[];
  bills: Bill[];
  incomes: Income[];
  type: 'expenses' | 'bills' | 'incomes' | 'all';
}
const TableView: React.FC<TableViewProps> = ({
  expenses,
  bills,
  incomes,
  type
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Pago
          </span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Pendente
          </span>;
      case 'overdue':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Atrasado
          </span>;
      default:
        return null;
    }
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
  const renderExpensesTable = () => <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Data
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Descrição
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Categoria
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Valor
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {expenses.length > 0 ? expenses.map(expense => <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <CalendarIcon size={14} className="mr-1" />
                  {formatDate(expense.date)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {expense.description}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {expense.category}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-red-600 dark:text-red-400">
                <div className="flex items-center justify-end">
                  <ArrowDownIcon size={14} className="mr-1" />
                  {formatCurrency(expense.amount)}
                </div>
              </td>
            </tr>) : <tr>
            <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
              Nenhuma despesa encontrada para este período
            </td>
          </tr>}
      </tbody>
    </table>;
  const renderBillsTable = () => <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Vencimento
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Descrição
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Status
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Valor
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {bills.length > 0 ? bills.map(bill => <tr key={bill.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <CalendarIcon size={14} className="mr-1" />
                  {formatDate(bill.due_date)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {bill.description}
                {bill.recurrent && <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-2 py-0.5 rounded-full">
                    Recorrente
                  </span>}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {getStatusBadge(bill.status)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-yellow-600 dark:text-yellow-400">
                {formatCurrency(bill.amount)}
              </td>
            </tr>) : <tr>
            <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
              Nenhuma conta encontrada para este período
            </td>
          </tr>}
      </tbody>
    </table>;
  const renderIncomesTable = () => <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Data
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Descrição
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Fonte
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Valor
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {incomes.length > 0 ? incomes.map(income => <tr key={income.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <CalendarIcon size={14} className="mr-1" />
                  {formatDate(income.date)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {income.description}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {getSourceName(income.source)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-green-600 dark:text-green-400">
                <div className="flex items-center justify-end">
                  <ArrowUpIcon size={14} className="mr-1" />
                  {formatCurrency(income.amount)}
                </div>
              </td>
            </tr>) : <tr>
            <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
              Nenhuma receita encontrada para este período
            </td>
          </tr>}
      </tbody>
    </table>;
  const renderAllTransactionsTable = () => {
    // Combine all transactions and sort by date
    const allTransactions = [...expenses.map(e => ({
      ...e,
      type: 'expense',
      transactionDate: e.date
    })), ...bills.map(b => ({
      ...b,
      type: 'bill',
      transactionDate: b.due_date
    })), ...incomes.map(i => ({
      ...i,
      type: 'income',
      transactionDate: i.date
    }))].sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
    return <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Data
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Valor
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {allTransactions.length > 0 ? allTransactions.map((transaction, index) => <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center">
                    <CalendarIcon size={14} className="mr-1" />
                    {formatDate(transaction.transactionDate)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.description}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {transaction.type === 'expense' && <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Despesa
                    </span>}
                  {transaction.type === 'bill' && <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Conta
                    </span>}
                  {transaction.type === 'income' && <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Receita
                    </span>}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <div className="flex items-center justify-end">
                    {transaction.type === 'income' ? <ArrowUpIcon size={14} className="mr-1" /> : <ArrowDownIcon size={14} className="mr-1" />}
                    {formatCurrency(transaction.amount)}
                  </div>
                </td>
              </tr>) : <tr>
              <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                Nenhuma transação encontrada para este período
              </td>
            </tr>}
        </tbody>
      </table>;
  };
  return <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto">
        {type === 'expenses' && renderExpensesTable()}
        {type === 'bills' && renderBillsTable()}
        {type === 'incomes' && renderIncomesTable()}
        {type === 'all' && renderAllTransactionsTable()}
      </div>
    </div>;
};
export default TableView;