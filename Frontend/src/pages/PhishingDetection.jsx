import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Mail, Link as LinkIcon, ShieldCheck, ShieldAlert, ChevronRight } from 'lucide-react';

export function PhishingDetection() {
  const [content, setContent] = useState('');
  const [type, setType] = useState('email'); // email or url
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = () => {
    if (!content) return;
    setScanning(true);
    // Simulate AI scan
    setTimeout(() => {
      setScanning(false);
      setResult({
        score: Math.floor(Math.random() * 40) + 60, // 60-100 score for dummy
        isMalicious: Math.random() > 0.5,
        details: [
          "Suspicious sender domain mismatch",
          "Urgent language detected ('Immediate action required')",
          "Hidden URL redirects to unknown server"
        ]
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Phishing & URL Detection</h1>
        <p className="text-slate-400 text-sm mt-1">AI-powered email content and link analyzer.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Content Analyzer</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            <div className="flex gap-2 p-1 bg-slate-900/50 rounded-lg w-fit">
              <button 
                onClick={() => setType('email')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${type === 'email' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <div className="flex items-center gap-2"><Mail className="w-4 h-4"/> Email Text</div>
              </button>
              <button 
                onClick={() => setType('url')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${type === 'url' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <div className="flex items-center gap-2"><LinkIcon className="w-4 h-4"/> URL / Link</div>
              </button>
            </div>

            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === 'email' ? "Paste email headers and content here..." : "https://suspicious-link.com"}
              className="w-full flex-1 min-h-[200px] glass-input resize-none p-4 font-mono text-sm"
            />
            
            <Button variant="cyan" onClick={handleScan} disabled={scanning || !content}>
              {scanning ? 'Analyzing Content...' : 'Run Security Scan'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detection Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!result && !scanning && (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-slate-500">
                <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
                <p>Submit content to run the analysis.</p>
              </div>
            )}
            
            {scanning && (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin"></div>
                <p className="text-brand-cyan animate-pulse">AI is analyzing patterns...</p>
              </div>
            )}

            {result && !scanning && (
              <div className="space-y-6">
                <div className={`p-6 rounded-xl border ${result.isMalicious ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'} flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    {result.isMalicious ? <ShieldAlert className="w-12 h-12 text-red-400" /> : <ShieldCheck className="w-12 h-12 text-green-400" />}
                    <div>
                      <h3 className={`text-xl font-bold ${result.isMalicious ? 'text-red-400' : 'text-green-400'}`}>
                        {result.isMalicious ? 'High Risk Detected' : 'Safe Content'}
                      </h3>
                      <p className="text-slate-300 mt-1">AI Threat Score: {result.score}/100</p>
                    </div>
                  </div>
                </div>

                {result.isMalicious && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Analysis Breakdown</h4>
                    <ul className="space-y-3">
                      {result.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                          <ChevronRight className="w-5 h-5 text-brand-cyan shrink-0" />
                          <span className="text-slate-300 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-slate-800">
                      <h4 className="text-sm font-medium text-slate-400 mb-3">Recommended Actions</h4>
                      <div className="flex gap-3">
                        <Button variant="outline" className="text-red-400 border-red-900 hover:bg-red-900/20">Block Sender</Button>
                        <Button variant="primary">Create Incident Ticket</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
