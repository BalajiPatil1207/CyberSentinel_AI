import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, UserCircle, Search } from 'lucide-react';
import { useData } from '../context/DataContext';

export function Topbar() {
  const { user } = useAuth();
  const { alerts } = useData();
  const unreadAlerts = alerts.filter(a => !a.isRead).length;

  return (
    <header className="h-16 glass-panel rounded-none border-t-0 border-x-0 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-6">
      <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-full px-4 py-1.5 w-96">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search threats, IP addresses, or CVEs..." 
          className="bg-transparent border-none outline-none text-sm text-brand-text w-full placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-cyan text-slate-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
              {unreadAlerts}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-700">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-200 leading-none">{user?.name}</p>
            <p className="text-xs text-brand-cyan mt-1">{user?.role}</p>
          </div>
          <UserCircle className="w-8 h-8 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
