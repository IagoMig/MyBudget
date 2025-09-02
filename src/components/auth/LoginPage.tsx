import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { LockIcon, MailIcon, AlertCircleIcon, ArrowRightIcon } from 'lucide-react';
import { WalletIcon } from 'lucide-react';
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      if (error) throw error;
      // Redirect to dashboard on successful login
      navigate('/');
    } catch (error: any) {
      console.error('Error logging in:', error);
      setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4">
            <WalletIcon size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            MyBudget
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Faça login para acessar sua conta
          </p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-700 dark:text-red-300">
            <AlertCircleIcon size={18} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-5 border border-gray-100 dark:border-gray-700">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input id="email" name="email" type="email" autoComplete="email" required value={credentials.email} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="seu@email.com" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input id="password" name="password" type="password" autoComplete="current-password" required value={credentials.password} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Lembrar-me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                Esqueceu a senha?
              </a>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            {loading ? <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span> : <span className="flex items-center">
                Entrar
                <ArrowRightIcon size={18} className="ml-2" />
              </span>}
          </button>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>;
};
export default LoginPage;