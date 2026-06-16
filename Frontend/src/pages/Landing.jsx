import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Activity, Bot, Zap, Globe, ChevronRight, Phone, MessageCircle, User } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-brand-cyan" />,
      title: 'AI Security Copilot',
      description: 'Powered by Google Gemini to analyze threats, answer security queries, and provide mitigation strategies instantly.'
    },
    {
      icon: <Activity className="w-8 h-8 text-blue-500" />,
      title: 'Malware Sandbox',
      description: 'Upload suspicious binaries and scripts to a secure heuristics engine that detects dangerous code patterns.'
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-500" />,
      title: 'Phishing Detection',
      description: 'Scan emails and URLs using AI NLP to determine scam likelihood and protect your employees from social engineering.'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: 'Vulnerability Scanner',
      description: 'Track and patch active CVEs across your infrastructure with real-time SOC2 compliance tracking.'
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden selection:bg-brand-cyan/30">
      
      {/* Background Animated Elements */}
      <div className="fixed inset-0 z-0 flex justify-center items-center pointer-events-none opacity-40 mix-blend-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-cyan/30 rounded-full blur-[120px] blob-animate"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] blob-animate animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] blob-animate animation-delay-4000"></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="fixed inset-0 z-0 bg-grid-white bg-[length:40px_40px] bg-grid-white-fade opacity-10 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">CyberSentinel<span className="text-brand-cyan">.AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/login')}
            className="text-slate-300 hover:text-white transition-colors font-medium"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 rounded-lg bg-brand-cyan text-brand-darker font-semibold hover:bg-[#00d0dd] transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transform hover:-translate-y-0.5"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8 backdrop-blur-md"
        >
          <Zap className="w-4 h-4 text-brand-cyan" />
          <span className="text-sm font-medium text-slate-300">Next-Gen Enterprise Security Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight max-w-5xl"
        >
          Secure your infrastructure with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-blue-500">
            Intelligent Automation
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed"
        >
          CyberSentinel AI combines Gemini-powered heuristics with real-time threat monitoring to proactively hunt and mitigate cyber threats before they breach your perimeter.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 rounded-xl bg-brand-cyan text-brand-darker font-bold text-lg hover:bg-[#00d0dd] transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] flex items-center gap-2 group"
          >
            Enter Dashboard
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
            className="px-8 py-4 rounded-xl bg-slate-800/80 text-white font-semibold text-lg hover:bg-slate-700 transition-all border border-slate-700 backdrop-blur-md"
          >
            Explore Features
          </button>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 bg-slate-900/50 border-t border-slate-800/50 backdrop-blur-xl py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Complete Security Lifecycle</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">From proactive hunting to automated mitigation, our platform equips your SOC team with enterprise-grade capabilities.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={fadeIn}
                className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/80 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-900/80 flex items-center justify-center mb-6 border border-slate-700 group-hover:border-slate-600 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-slate-800 bg-slate-900/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-cyan" />
            <span className="text-slate-400 text-sm font-medium">CyberSentinel AI © {new Date().getFullYear()} - Created by Balaji Patil</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Fixed Floating Contact Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showContact && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 mb-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col origin-bottom-right"
            >
              <a 
                href="tel:+917498586267" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors border-b border-slate-700/50 text-white"
                title="Call Balaji Patil"
              >
                <Phone className="w-4 h-4 text-brand-cyan" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Call Now</span>
                  <span className="text-xs text-slate-400">+91 7498586267</span>
                </div>
              </a>
              <a 
                href="https://wa.me/917498586267" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors text-white"
                title="WhatsApp Balaji Patil"
              >
                <MessageCircle className="w-4 h-4 text-green-400" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">WhatsApp</span>
                  <span className="text-xs text-slate-400">Message me</span>
                </div>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowContact(!showContact)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all transform hover:scale-105 active:scale-95"
        >
          {showContact ? <ChevronRight className="w-6 h-6 rotate-90" /> : <MessageCircle className="w-7 h-7" />}
        </button>
      </div>

    </div>
  );
}
