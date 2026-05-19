"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cloud, Zap, Database, ArrowRight, Menu, Search, Bell, Upload, User } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-[#030712] to-[#030712]"></div>
        <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      
      {/* Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0f19]/75 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0f19]/75 shadow-[0_1px_30px_rgba(0,0,0,0.3)]"
      >
        <div className="max-w-7xl mx-auto flex h-[72px] items-center justify-between px-6 lg:px-8 relative">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Cloud className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Nexus
            </span>
          </div>

          {/* Navigation Links - Centered */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {['Dashboard', 'Storage', 'Nodes', 'Analytics', 'Settings'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`} 
                className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors group py-2"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 group-hover:w-full rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-5">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all w-48 focus:w-64"
              />
            </div>

            <button className="text-slate-400 hover:text-white transition-colors relative group">
              <Bell className="h-5 w-5 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0a0f19]"></span>
            </button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </motion.button>

            <button className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[2px] cursor-pointer hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
              <div className="h-full w-full rounded-full bg-[#0A0F19] flex items-center justify-center overflow-hidden">
                 <User className="h-4 w-4 text-slate-300" />
              </div>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0a0f19]/95 backdrop-blur-xl border-b border-white/5 p-6 space-y-6 absolute w-full top-full left-0 shadow-2xl"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            
            <nav className="flex flex-col gap-4">
              {['Dashboard', 'Storage', 'Nodes', 'Analytics', 'Settings'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </nav>
            
            <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Upload className="h-4 w-4" />
                Upload File
              </button>
            </div>
          </motion.div>
        )}
      </motion.header>

      <main className="flex-1 flex flex-col items-center relative z-10 pt-32 pb-24 w-full">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 flex flex-col items-center text-center">
          
          {/* Notification Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400 mb-8 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Nexus Platform v2.0 is now live
          </motion.div>

          {/* Hero Typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter mb-8 max-w-5xl leading-[1.05]"
          >
            Distributed Storage for the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              Modern Cloud Era.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed"
          >
            High-performance, fault-tolerant cloud storage infrastructure built with distributed Rust microservices, real-time synchronization, and encrypted multi-node architecture.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
          >
            <Link href="/register" className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]">
              Start Storing Now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold py-3.5 px-8 rounded-xl transition-all border border-white/10 backdrop-blur-md">
              View Dashboard
            </Link>
          </motion.div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.7, delay: 0.5 }}
             className="w-full max-w-5xl mt-24 relative"
          >
             <div className="absolute inset-0 -top-10 bg-gradient-to-b from-blue-500/20 via-transparent to-transparent rounded-full blur-[80px] -z-10"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent z-10 bottom-0 top-1/2"></div>
             
             <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-[#0A0F1C] relative z-0">
                {/* Mock Browser Bar */}
                <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2 backdrop-blur-md">
                   <div className="flex gap-2 ml-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                   </div>
                   <div className="mx-auto flex-1 max-w-sm bg-white/5 rounded-md text-xs font-medium text-slate-500 px-4 py-1.5 text-center border border-white/5">
                      app.nexus.cloud
                   </div>
                   <div className="w-16"></div> {/* Spacer for balance */}
                </div>
                {/* Mock Content */}
                <div className="aspect-[16/10] md:aspect-[21/9] bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
             </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
