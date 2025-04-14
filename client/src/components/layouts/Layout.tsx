import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isOpenFin } from '@/utils/openfin';
interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const Layout = ({ title, children }: LayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('ag-grid-demo-user');
    navigate('/login');
  };

  const openFin = isOpenFin();

  return (
    <div className="h-screen flex flex-col p-4">
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {!openFin && (
          <button
          onClick={handleLogout}
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 cursor-pointer"
        >
          Logout
        </button>
        )}
      </header>
      <main className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
        <div className="bg-white rounded-lg p-2 col-span-2 border border-gray-200 row-span-2">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 