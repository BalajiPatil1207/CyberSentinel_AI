import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Bot, User, Send, Sparkles } from 'lucide-react';

export function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content: 'Hello! I am your ABC Cyber Shield AI Assistant. I can help you analyze threats, explain vulnerabilities, or suggest security policies. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What are the top active threats right now?",
    "Explain CVE-2024-1024",
    "How to mitigate a phishing attack?",
    "Summarize yesterday's security events"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const query = text || input;
    if (!query.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let responseContent = "I've analyzed your request. Based on the current security context, everything looks stable, but I recommend checking the latest vulnerability scan results.";
      
      if (query.toLowerCase().includes('cve')) {
        responseContent = "CVE-2024-1024 is a critical buffer overflow vulnerability found in OpenSSL. It allows remote attackers to execute arbitrary code. Recommended action: Patch the system immediately to the latest version.";
      } else if (query.toLowerCase().includes('phishing')) {
        responseContent = "To mitigate a phishing attack: 1) Isolate the affected user's machine. 2) Reset their credentials. 3) Block the malicious sender domain at the email gateway. 4) Run a full system malware scan.";
      }

      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content: responseContent }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Security Assistant</h1>
        <p className="text-slate-400 text-sm mt-1">Get intelligent insights and actionable recommendations.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden h-[calc(100vh-180px)]">
        <CardHeader className="border-b border-slate-800 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-brand-cyan" />
            Cyber Shield Copilot
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'ai' ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-slate-800 text-slate-300'
                }`}>
                  {msg.role === 'ai' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>
                <div className={`max-w-[75%] rounded-2xl p-4 ${
                  msg.role === 'ai' 
                    ? 'bg-slate-900/80 border border-slate-800 text-slate-300 rounded-tl-none' 
                    : 'bg-brand-blue text-white rounded-tr-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-cyan/20 text-brand-cyan flex items-center justify-center shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md">
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-brand-cyan border border-slate-700 hover:border-brand-cyan transition-colors rounded-full px-3 py-1 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> {q}
                </button>
              ))}
            </div>
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-3"
            >
              <Input 
                placeholder="Ask about threats, vulnerabilities, or request a summary..." 
                className="flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit" variant="cyan" disabled={!input.trim() || isTyping}>
                <Send className="w-4 h-4 mr-2" /> Send
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
