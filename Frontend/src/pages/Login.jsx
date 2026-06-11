import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
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
            <p className="text-slate-400 text-sm mt-2">Sign in to access the control center</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                  <Input 
                    type="email" 
                    placeholder="admin@abccybershield.com" 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-medium text-slate-400">Password</label>
                  <button type="button" className="text-xs text-brand-cyan hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="cyan" className="w-full mt-6">
                Authenticate Securely
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500">
                Authorized Personnel Only. All activities are monitored.
              </p>
              <div className="mt-4 flex flex-col gap-2 text-xs text-slate-400">
                <p><strong>Demo Credentials:</strong></p>
                <p>admin@abccybershield.com | any password</p>
                <p>analyst@abccybershield.com | any password</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
