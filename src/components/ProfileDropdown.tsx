import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
import { LogOutIcon, UserIcon, SettingsIcon } from 'lucide-react';
const ProfileDropdown: React.FC = () => {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Get user's name or email
  const displayName = user?.user_metadata?.name || user?.email || 'Usuário';
  const userInitials = displayName.charAt(0).toUpperCase();
  return <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="flex items-center focus:outline-none" aria-expanded={isOpen} aria-haspopup="true">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
          {userInitials}
        </div>
      </button>
      {isOpen && <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
          <a href="#" onClick={() => {
        setIsOpen(false);
        navigate('/profile');
      }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
            <UserIcon size={16} className="mr-2" />
            Perfil
          </a>
          <a href="#" onClick={() => {
        setIsOpen(false);
        navigate('/settings');
      }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
            <SettingsIcon size={16} className="mr-2" />
            Configurações
          </a>
          <a href="#" onClick={handleSignOut} className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
            <LogOutIcon size={16} className="mr-2" />
            Sair
          </a>
        </div>}
    </div>;
};
export default ProfileDropdown;