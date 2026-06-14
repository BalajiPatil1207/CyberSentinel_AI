import React from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Shield, AlertTriangle, ShieldAlert, Activity, Bug, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Mon', attacks: 400 },
  { name: 'Tue', attacks: 300 },
  { name: 'Wed', attacks: 550 },
  { name: 'Thu', attacks: 450 },
  { name: 'Fri', attacks: 700 },
  { name: 'Sat', attacks: 200 },
  { name: 'Sun', attacks: 350 },
];

const pieData = [
  { name: 'Phishing', value: 400 },
  { name: 'Malware', value: 300 },
  { name: 'DDoS', value: 300 },
  { name: 'Insider', value: 200 },
];

const COLORS = ['#00f0ff', '#0052ff', '#b500ff', '#f43f5e'];

function StatCard({ title, value, icon: Icon, trend, colorClass }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <h4 className="text-2xl font-bold text-white mt-2">{value}</h4>
          {trend && (
            <p className={`text-xs mt-2 ${trend.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
              {trend} from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}

export function Dashboard() {
  const { threats, incidents, vulnerabilities } = useData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time overview of your security posture.</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm text-slate-300 font-medium">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Threats Detected" value={threats.length} icon={ShieldAlert} trend="+12%" colorClass="bg-red-500/10 text-red-400" />
        <StatCard title="Active Incidents" value={incidents.filter(i => i.status !== 'Resolved').length} icon={AlertTriangle} trend="-5%" colorClass="bg-yellow-500/10 text-yellow-400" />
        <StatCard title="Vulnerabilities" value={vulnerabilities.length} icon={Bug} colorClass="bg-purple-500/10 text-purple-400" />
        <StatCard title="Security Score" value="85/100" icon={Shield} trend="+2" colorClass="bg-brand-cyan/10 text-brand-cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Threat Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                    itemStyle={{ color: '#00f0ff' }}
                  />
                  <Area type="monotone" dataKey="attacks" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorAttacks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attack Types</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2 mt-4">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-medium text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Active Threats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Threat ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3 rounded-tr-lg">Time</th>
                </tr>
              </thead>
              <tbody>
                {threats.slice(0, 5).map((threat) => (
                  <tr key={threat._id || threat.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{(threat._id || threat.id).substring(0, 8)}</td>
                    <td className="px-4 py-3 text-slate-300">{threat.type}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{threat.source}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        threat.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        threat.severity === 'High' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {threat.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{new Date(threat.timestamp || threat.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
