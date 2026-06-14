import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShieldAlert, Shield, Activity, 
  Search, AlertTriangle, MessageSquare, Bell, 
  FileText, Users, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../components/Card';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Super Admin', 'Security Analyst'] },
  { path: '/threat-monitoring', icon: Activity, label: 'Threat Monitoring', roles: ['Super Admin', 'Security Analyst'] },
  { path: '/phishing-detection', icon: ShieldAlert, label: 'Phishing Detection', roles: ['Super Admin', 'Security Analyst', 'Employee'] },
  { path: '/malware-analysis', icon: Search, label: 'Malware Analysis', roles: ['Super Admin', 'Security Analyst'] },
  { path: '/vulnerability-scanner', icon: Shield, label: 'Vulnerability Scanner', roles: ['Super Admin', 'Security Analyst'] },
  { path: '/incident-response', icon: AlertTriangle, label: 'Incident Response', roles: ['Super Admin', 'Security Analyst'] },
  { path: '/ai-assistant', icon: MessageSquare, label: 'AI Assistant', roles: ['Super Admin', 'Security Analyst', 'Employee'] },
  { path: '/alerts', icon: Bell, label: 'Alerts', roles: ['Super Admin', 'Security Analyst', 'Employee'] },
  { path: '/reports', icon: FileText, label: 'Reports', roles: ['Super Admin', 'Security Analyst'] },
  { path: '/users', icon: Users, label: 'User Management', roles: ['Super Admin'] },
  { path: '/settings', icon: Settings, label: 'Settings', roles: ['Super Admin', 'Security Analyst', 'Employee'] },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside className="w-64 h-screen glass-panel rounded-none border-t-0 border-b-0 border-l-0 fixed left-0 top-0 flex flex-col z-20">
      <div className="p-6 flex items-center gap-3">
        <Shield className="w-8 h-8 text-brand-cyan" />
        <span className="font-bold text-lg tracking-wide text-white">ABC Cyber Shield</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm",
                isActive 
                  ? "bg-brand-blue/20 text-brand-cyan border border-brand-blue/30" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
