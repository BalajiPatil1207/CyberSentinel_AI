import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, UserCircle, Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const { user } = useAuth();
  const { alerts } = useData();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const unreadAlerts = alerts.filter(a => !a.isRead).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 glass-panel rounded-none border-t-0 border-x-0 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-6">
      {/* Search Input Removed */}
      <div className="flex-1"></div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-slate-400 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-cyan text-slate-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                <button onClick={() => { setShowNotifications(false); navigate('/alerts'); }} className="text-xs text-brand-cyan hover:underline">
                  View All
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No new notifications
                  </div>
                ) : (
                  alerts.slice(0, 5).map(alert => (
                    <div 
                      key={alert._id || alert.id} 
                      className={`p-3 border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer ${!alert.isRead ? 'bg-slate-800/20' : ''}`}
                      onClick={() => { setShowNotifications(false); navigate('/alerts'); }}
                    >
                      <p className={`text-sm ${!alert.isRead ? 'text-white' : 'text-slate-400'} line-clamp-2`}>
                        {alert.message}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {new Date(alert.timestamp || alert.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 pl-6 border-l border-slate-700 hover:opacity-80 transition-opacity text-left cursor-pointer"
        >
          <div className="text-right">
            <p className="text-sm font-medium text-slate-200 leading-none">{user?.name}</p>
            <p className="text-xs text-brand-cyan mt-1">{user?.role}</p>
          </div>
          <UserCircle className="w-8 h-8 text-slate-400 hover:text-brand-cyan transition-colors" />
        </button>
      </div>
    </header>
  );
}
