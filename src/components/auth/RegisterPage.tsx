import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { LockIcon, MailIcon, UserIcon, AlertCircleIcon, ArrowRightIcon } from 'lucide-react';
import { WalletIcon } from 'lucide-react';
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }
    try {
      // Register user with Supabase Auth
      const {
        data: authData,
        error: authError
      } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      });
      if (authError) throw authError;
      // Create default user settings
      if (authData.user) {
        const {
          error: settingsError
        } = await supabase.from('user_settings').insert([{
          user_id: authData.user.id,
          theme: 'light',
          default_view: 'cards',
          notifications_enabled: true
        }]);
        if (settingsError) {
          console.error('Error creating user settings:', settingsError);
        }
      }
      // Show success message and redirect to login
      alert('Conta criada com sucesso! Verifique seu email para confirmar o cadastro.');
      navigate('/login');
    } catch (error: any) {
      console.error('Error registering:', error);
      setError(error.message || 'Erro ao criar conta. Tente novamente.');
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
            Crie sua conta e comece a gerenciar suas finanças
          </p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-700 dark:text-red-300">
            <AlertCircleIcon size={18} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-5 border border-gray-100 dark:border-gray-700">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Seu nome completo" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="seu@email.com" />
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
              <input id="password" name="password" type="password" autoComplete="new-password" required value={formData.password} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Mínimo de 6 caracteres
            </p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirmar Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required value={formData.confirmPassword} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            {loading ? <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando conta...
              </span> : <span className="flex items-center">
                Criar conta
                <ArrowRightIcon size={18} className="ml-2" />
              </span>}
          </button>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>;
};
export default RegisterPage;