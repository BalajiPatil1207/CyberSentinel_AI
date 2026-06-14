import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');

    // Name check (only for registration)
    if (!isLogin && !name.trim()) {
      setNameError('Full name is required for registration.');
      isValid = false;
    }

    // Email checks
    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email.trim())) {
        setEmailError('Please enter a valid email address.');
        isValid = false;
      }
    }

    // Password checks
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    return isValid;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    if (isLogin) {
      const result = login(email, password);
      if (result.success) {
        // Redirection handled dynamically inside DashboardRedirect helper or role based
        const storedUsers = JSON.parse(localStorage.getItem("cs_users")) || [];
        const found = storedUsers.find(u => u.email === email);
        const activeRole = found ? found.role : (email === "admin@patilcybershield.com" ? "Super Admin" : "Employee");
        navigate(activeRole === 'Employee' ? '/phishing-detection' : '/dashboard');
      } else {
        setError(result.message);
      }
    } else {
      const result = register(name, email, password, role);
      if (result.success) {
        navigate(role === 'Employee' ? '/phishing-detection' : '/dashboard');
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-brand-cyan/10 p-4 rounded-full border border-brand-cyan/20">
            <Shield className="w-12 h-12 text-brand-cyan" />
          </div>
        </div>
        
        <Card className="backdrop-blur-xl bg-slate-900/80">
          <CardHeader className="text-center border-b-0 pb-2">
            <CardTitle className="text-2xl text-white">ABC Cyber Shield</CardTitle>
            <p className="text-slate-400 text-sm mt-2">
              {isLogin ? 'Sign in to access the control center' : 'Register a new security credential'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
              
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="text" 
                      placeholder="Security Analyst" 
                      className={`pl-10 ${nameError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {nameError && (
                    <span className="text-red-400 text-xs mt-1 block ml-1">{nameError}</span>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                  <Input 
                    type="email" 
                    placeholder="name@patilcybershield.com" 
                    className={`pl-10 ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {emailError && (
                  <span className="text-red-400 text-xs mt-1 block ml-1">{emailError}</span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-medium text-slate-400">Password</label>
                  {isLogin && (
                    <button type="button" className="text-xs text-brand-cyan hover:underline">Forgot password?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className={`pl-10 ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {passwordError && (
                  <span className="text-red-400 text-xs mt-1 block ml-1">{passwordError}</span>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Select Access Role</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <select
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan transition-colors"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="Employee" className="bg-slate-900 text-white">Employee (Scans & Alerts Only)</option>
                      <option value="Security Analyst" className="bg-slate-900 text-white">Security Analyst (Full Monitoring Access)</option>
                    </select>
                  </div>
                </div>
              )}

              <Button type="submit" variant="cyan" className="w-full mt-6">
                {isLogin ? 'Authenticate Securely' : 'Register New Credential'}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <button 
                type="button" 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setNameError('');
                  setEmailError('');
                  setPasswordError('');
                }}
                className="text-sm text-brand-cyan hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
              <p className="text-[10px] text-slate-600 mt-4">
                Authorized Personnel Only. All activities are monitored.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
