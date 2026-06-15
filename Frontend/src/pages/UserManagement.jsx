import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import { UserPlus, ShieldCheck, Mail, Lock, User as UserIcon, Eye, Edit2, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function UserManagement() {
  const { users, toggleUserStatus, deleteUser, fetchData } = useData();
  const { getAuthHeaders } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async (id, currentStatus) => {
    setError('');
    setSuccess('');
    const res = await toggleUserStatus(id, currentStatus);
    if (!res.success) {
      setError(res.message || 'Failed to update user status.');
    } else {
      setSuccess('User status updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setError('');
    setSuccess('');
    const res = await deleteUser(userToDelete._id || userToDelete.id);
    if (res.success) {
      setSuccess('User deleted successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(res.message || 'Failed to delete user.');
    }
    setUserToDelete(null);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSuccess('User created successfully!');
        setName('');
        setEmail('');
        setPassword('');
        setRole('Employee');
        setShowAddForm(false);
        // Refresh users list
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to create user.');
      }
    } catch (err) {
      setError('Network error while creating user.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage platform access and role permissions.</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus className="w-4 h-4 mr-2" />
          {showAddForm ? 'Cancel' : 'Add User'}
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
          {success}
        </div>
      )}

      {showAddForm && (
        <Card className="border-brand-cyan/30">
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="text" 
                      placeholder="User Name" 
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="email" 
                      placeholder="user@patilcybershield.com" 
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Access Role</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <select
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan transition-colors"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="Employee" className="bg-slate-900 text-white">Employee</option>
                      <option value="Security Analyst" className="bg-slate-900 text-white">Security Analyst</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="cyan" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id || user.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={user.role === 'Super Admin' ? 'purple' : user.role === 'Security Analyst' ? 'info' : 'default'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={user.status === 'Active' ? 'success' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          title="View Details"
                          className="p-1.5 h-auto text-slate-400 hover:text-brand-cyan hover:bg-slate-800/50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          title="Edit User"
                          className="p-1.5 h-auto text-slate-400 hover:text-blue-400 hover:bg-slate-800/50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          onClick={() => handleToggleStatus(user._id || user.id, user.status)}
                          className={`p-1.5 h-auto ${user.status === 'Active' ? 'text-slate-400 hover:text-orange-400' : 'text-slate-400 hover:text-green-400'} hover:bg-slate-800/50`}
                        >
                          {user.status === 'Active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          title="Delete User"
                          onClick={() => setUserToDelete(user)}
                          className="p-1.5 h-auto text-slate-400 hover:text-red-400 hover:bg-slate-800/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-900 border-red-500/30">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Delete User?</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Are you sure you want to delete <span className="text-white font-medium">{userToDelete.name}</span>? This action cannot be undone.
                  </p>
                </div>
                <div className="flex w-full gap-3 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setUserToDelete(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1 bg-red-500 hover:bg-red-600 border-0" onClick={confirmDelete}>
                    Yes, Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
