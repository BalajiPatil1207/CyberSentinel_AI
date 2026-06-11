import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Plus, MessageSquare, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function IncidentResponse() {
  const { incidents, updateIncident } = useData();
  const { user } = useAuth();
  const [selectedIncident, setSelectedIncident] = useState(null);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return <Badge variant="destructive">Critical</Badge>;
      case 'High': return <Badge variant="warning">High</Badge>;
      case 'Medium': return <Badge variant="info">Medium</Badge>;
      default: return <Badge>Low</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open': return <Badge variant="destructive">Open</Badge>;
      case 'Investigating': return <Badge variant="warning">Investigating</Badge>;
      case 'Mitigated': return <Badge variant="info">Mitigated</Badge>;
      case 'Resolved': return <Badge variant="success">Resolved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Incident Response Center</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track security incidents.</p>
        </div>
        <Button variant="cyan">
          <Plus className="w-4 h-4 mr-2" />
          Create Incident
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="h-[calc(100vh-180px)] flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle>Active Tickets</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-3 space-y-3">
              {incidents.map((incident) => (
                <div 
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedIncident?.id === incident.id 
                      ? 'bg-slate-800 border-brand-cyan shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-slate-400">{incident.id}</span>
                    {getStatusBadge(incident.status)}
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2">{incident.title}</h4>
                  <div className="flex justify-between items-center text-xs">
                    {getPriorityBadge(incident.priority)}
                    <span className="text-slate-500">{new Date(incident.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedIncident ? (
            <Card className="h-[calc(100vh-180px)] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <AlertTriangle className="w-64 h-64 text-white" />
              </div>
              <CardHeader className="border-b border-slate-800 pb-4 z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      {selectedIncident.title}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                      <span className="font-mono text-brand-cyan">{selectedIncident.id}</span> • 
                      Created {new Date(selectedIncident.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(selectedIncident.status)}
                    {getPriorityBadge(selectedIncident.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6 z-10 space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Assigned To</p>
                    <p className="font-medium text-white">{selectedIncident.assignee}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Current Status</p>
                    <select 
                      className="bg-transparent border-none outline-none text-white font-medium p-0 w-full cursor-pointer"
                      value={selectedIncident.status}
                      onChange={(e) => {
                        updateIncident(selectedIncident.id, { status: e.target.value });
                        setSelectedIncident({ ...selectedIncident, status: e.target.value });
                      }}
                    >
                      <option value="Open" className="bg-slate-900">Open</option>
                      <option value="Investigating" className="bg-slate-900">Investigating</option>
                      <option value="Mitigated" className="bg-slate-900">Mitigated</option>
                      <option value="Resolved" className="bg-slate-900">Resolved</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-4 border-b border-slate-800 pb-2">Investigation Notes</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center text-xs text-white font-bold">
                          SA
                        </div>
                        <span className="text-sm font-medium text-slate-300">System Admin</span>
                        <span className="text-xs text-slate-500 ml-auto">Just now</span>
                      </div>
                      <p className="text-sm text-slate-400">Initial review of logs indicates a potential lateral movement attempt from the compromised endpoint. Proceeding to isolate the machine.</p>
                    </div>
                  </div>
                </div>

              </CardContent>
              <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex gap-3 z-10">
                <input 
                  type="text" 
                  placeholder="Add investigation notes..." 
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan"
                />
                <Button variant="primary">Add Note</Button>
              </div>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-180px)] flex flex-col items-center justify-center text-slate-500 border-dashed border-2 border-slate-800 bg-transparent">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p>Select an incident from the list to view details.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
