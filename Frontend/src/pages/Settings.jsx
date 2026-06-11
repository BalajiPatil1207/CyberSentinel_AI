import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Save } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure global platform preferences and security policies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400 mb-1 block">Company Name</label>
              <Input defaultValue="ABC Corporation" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 mb-1 block">Support Email</label>
              <Input defaultValue="security@abccybershield.com" />
            </div>
            <Button variant="primary" className="mt-4">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
              <div>
                <p className="font-medium text-white text-sm">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-slate-500">Require 2FA for all administrative accounts.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cyan"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
              <div>
                <p className="font-medium text-white text-sm">Auto-Block Malicious IPs</p>
                <p className="text-xs text-slate-500">Automatically block IPs with Threat Score {'>'} 90.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cyan"></div>
              </label>
            </div>
            <Button variant="primary" className="mt-4">
              <Save className="w-4 h-4 mr-2" /> Update Policies
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
