import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import { Search, Filter, ShieldAlert, X } from 'lucide-react';
import { Button } from '../components/Button';

export function ThreatMonitoring() {
  const { threats } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThreat, setSelectedThreat] = useState(null);

  const filteredThreats = threats.filter(t => 
    (t._id || t.id).toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Threat Monitoring</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time threat feed and analysis.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Active Threat Feed</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search threats..." 
                className="pl-9 h-9 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-9 px-3">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredThreats.map((threat) => (
              <div 
                key={threat._id || threat.id} 
                className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
                onClick={() => setSelectedThreat(threat)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    threat.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                    threat.severity === 'High' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      {threat.type} 
                      <Badge variant={
                        threat.severity === 'Critical' ? 'destructive' :
                        threat.severity === 'High' ? 'warning' : 'info'
                      }>
                        {threat.severity}
                      </Badge>
                    </h4>
                    <div className="text-sm text-slate-400 mt-1 flex gap-4">
                      <span>ID: {(threat._id || threat.id).substring(0, 8)}</span>
                      <span>Source: {threat.source}</span>
                      <span>Target: {threat.target}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-400">{new Date(threat.timestamp || threat.createdAt).toLocaleString()}</span>
                  <div className="mt-2">
                    <Badge variant={threat.status === 'Active' ? 'destructive' : 'success'}>
                      {threat.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredThreats.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                No threats found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Threat Details Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-brand-darker border-slate-700 shadow-2xl relative">
            <button 
              onClick={() => setSelectedThreat(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <ShieldAlert className="text-red-500 w-6 h-6" />
                Threat Details: {(selectedThreat._id || selectedThreat.id)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                  <p className="text-sm text-slate-400">Threat Type</p>
                  <p className="font-semibold text-white mt-1">{selectedThreat.type}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                  <p className="text-sm text-slate-400">Severity</p>
                  <p className="font-semibold text-red-400 mt-1">{selectedThreat.severity}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                  <p className="text-sm text-slate-400">Source IP/Node</p>
                  <p className="font-mono text-white mt-1">{selectedThreat.source}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                  <p className="text-sm text-slate-400">Target Asset</p>
                  <p className="font-mono text-white mt-1">{selectedThreat.target}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-3">Investigation Timeline</h4>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-700">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-brand-cyan shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-800 bg-slate-900/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-200">Threat Detected</div>
                        <time className="text-xs text-slate-500">{new Date(selectedThreat.timestamp || selectedThreat.createdAt).toLocaleTimeString()}</time>
                      </div>
                      <div className="text-slate-400 text-sm">System flagged anomalous activity from threat feed.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <Button variant="outline" onClick={() => setSelectedThreat(null)}>Close</Button>
                <Button variant="primary">Create Incident</Button>
                <Button variant="cyan">Block IP</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
