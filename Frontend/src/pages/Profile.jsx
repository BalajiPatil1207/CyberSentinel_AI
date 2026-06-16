import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { User, Mail, Shield, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Name and email are required');
      return;
    }
    
    setIsSaving(true);
    const result = await updateProfile(name, email);
    setIsSaving(false);

    if (result.success) {
      toast.success('Profile updated successfully!');
      setTimeout(() => navigate(-1), 1000);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1">
          <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-xl h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-brand-cyan/20 to-blue-600/20"></div>
            <CardContent className="pt-12 pb-6 px-6 flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 shadow-2xl flex items-center justify-center mb-4 relative">
                <User className="w-12 h-12 text-brand-cyan" />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
              </div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-sm text-slate-400 mb-4">{user?.email}</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-sm font-semibold shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Shield className="w-4 h-4" />
                {user?.role}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2">
          <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Edit Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400">Role</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      value={user?.role || ''} 
                      disabled 
                      className="pl-10 bg-slate-800/50 text-slate-400 cursor-not-allowed border-slate-700"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Roles can only be modified by a Super Admin.</p>
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t border-slate-800">
                  <Button type="button" variant="outline" onClick={() => { setName(user?.name||''); setEmail(user?.email||''); }} disabled={isSaving}>Cancel</Button>
                  <Button type="submit" variant="cyan" className="shadow-[0_0_15px_rgba(0,240,255,0.3)]" disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
