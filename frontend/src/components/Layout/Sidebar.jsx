import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, CreditCard, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Invoices', path: '/invoices', icon: FileText },
  { name: 'Payments', path: '/payments', icon: CreditCard },
];

export default function Sidebar() {
  const handleLogout = () => {
    try {
      import('../../services/api').then(({ logout }) => {
        logout().catch(() => {}).finally(() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        });
      });
    } catch (e) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-white shadow-xl">
      <div className="flex h-16 items-center justify-center border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-wider text-blue-400">INVOICE CRM</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}
