"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, User, Shield, 
  Activity, Server, Globe, AlertTriangle, ShieldCheck, 
  Cpu, UploadCloud, ChevronDown, Check, Zap, Moon, Sun, XCircle,
  Clock, Lock, Key, Layers, Smartphone,
  Fingerprint, Database, Network
} from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{show: boolean, success: boolean, message: string}>({show: false, success: true, message: ""});
  
  // Accordion State
  const [expandedSection, setExpandedSection] = useState<string | null>("general");

  const defaultToggles = { 
    snapshots: true, disasterRecovery: false, beta: false,
    aiMonitoring: true, autoScaling: true
  };
  
  const [toggles, setToggles] = useState(defaultToggles);
  const [initialToggles, setInitialToggles] = useState(defaultToggles);

  const [particles, setParticles] = useState<{x: number, y: number, size: number, delay: number, duration: number}[]>([]);

  useEffect(() => {
    // Simulate Backend Fetch
    const fetchSettings = async () => {
      try {
        await new Promise(res => setTimeout(res, 800)); // Network delay
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();

    const p = Array.from({length: 15}).map(() => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 3 + 1, delay: Math.random() * 5,
      duration: 3 + Math.random() * 2
    }));
    const timeout = setTimeout(() => setParticles(p), 0);
    return () => clearTimeout(timeout);
  }, []);

  const hasChanges = JSON.stringify(toggles) !== JSON.stringify(initialToggles);

  const handleSave = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    
    try {
      await new Promise(res => setTimeout(res, 1200)); // Simulate save
      setInitialToggles(toggles);
      showToast(true, "Settings applied. Configuration synced successfully.");
    } catch {
      showToast(false, "Cluster synchronization failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (success: boolean, message: string) => {
    setSaveStatus({ show: true, success, message });
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleDiscard = () => {
    setToggles(initialToggles);
  };

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAccordion = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const isLight = theme === "light";
  const bgMain = isLight ? "bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] text-[#0f172a]" : "bg-[#03060f] text-[#F8FAFC]";
  const textMain = isLight ? "text-[#0F172A]" : "!text-[#F8FAFC]";
  const textMuted = isLight ? "text-[#64748B]" : "!text-[#CBD5E1]";
  
  const cardBg = isLight 
    ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.82))] border border-[rgba(148,163,184,0.16)] shadow-[0_10px_30px_rgba(15,23,42,0.08)]" 
    : "bg-[linear-gradient(180deg,rgba(8,15,30,0.96),rgba(5,10,20,0.92))] border border-[rgba(59,130,246,0.18)]";
    
  const cardHover = "hover:-translate-y-[1px] hover:shadow-[0_10px_30px_rgba(59,130,246,0.08)] transition-all duration-[250ms] ease";

  const inputBorder = isLight ? "border-[rgba(148,163,184,0.2)]" : "border-[rgba(148,163,184,0.15)]";
  const inputBg = isLight ? "bg-white" : "bg-[rgba(15,23,42,0.75)]";
  const inputColor = isLight ? "text-slate-800" : "!text-[#E2E8F0]";
  const labelClass = `text-[0.75rem] font-semibold tracking-[0.08em] uppercase flex items-center gap-2 ${isLight ? 'text-slate-500' : '!text-[#94A3B8]'}`;
  
  const iconWrapper = `w-[42px] h-[42px] rounded-[12px] flex items-center justify-center shrink-0 ${isLight ? 'bg-[rgba(59,130,246,0.08)]' : 'bg-[rgba(59,130,246,0.12)]'}`;

  return (
    <div className={`w-full min-h-screen relative flex flex-col font-sans transition-colors duration-500 ${bgMain} overflow-x-hidden`}>
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-500">
        {!isLight && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a1223_0%,#03060f_100%)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] mix-blend-screen opacity-60"></div>
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
          </>
        )}
        {/* Soft animated particles */}
        {particles.map((p, i) => (
          <motion.div 
            key={i}
            className={`absolute rounded-full ${isLight ? 'bg-blue-400/40' : 'bg-blue-400/30'}`}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -40, 0], opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className={`max-w-[1400px] mx-auto w-full px-[32px] py-[40px] pb-32`}>
        
        {/* Header Structure */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex flex-col gap-2">
            <h1 className={`text-[3rem] font-[800] tracking-[-0.03em] leading-tight ${textMain}`}>Platform Configurations</h1>
            <p className="text-[#94A3B8] text-[0.95rem] tracking-[0.08em] uppercase font-semibold">Infrastructure / Settings / US-East-1</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${isLight ? 'bg-white border-emerald-200 shadow-sm' : 'bg-[#071426] border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'}`}>
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
              </div>
              <span className={`text-[13px] font-bold uppercase tracking-wide ${isLight ? 'text-emerald-700' : '!text-emerald-400'}`}>Cluster Operational</span>
            </div>
            
            {/* Theme Toggle Segmented Control */}
            <div className={`h-[44px] p-1 rounded-[14px] flex items-center gap-1 ${isLight ? 'bg-[rgba(15,23,42,0.06)]' : 'bg-white/[0.04] border border-white/5'}`}>
              <button 
                onClick={() => setTheme("light")}
                className={`h-[36px] px-[18px] rounded-[10px] font-semibold text-[14px] transition-all duration-[250ms] flex items-center gap-2 ${isLight ? 'bg-white text-[#0f172a] shadow-[0_4px_12px_rgba(15,23,42,0.12)]' : 'bg-transparent text-[#64748B] hover:text-white'}`}
              >
                <Sun className="w-4 h-4" /> Light
              </button>
              <button 
                onClick={() => setTheme("dark")}
                className={`h-[36px] px-[18px] rounded-[10px] font-semibold text-[14px] transition-all duration-[250ms] flex items-center gap-2 ${!isLight ? 'bg-[rgba(59,130,246,0.18)] text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'bg-transparent text-[#64748B] hover:text-[#0f172a]'}`}
              >
                <Moon className="w-4 h-4" /> Dark
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-6 animate-pulse">
            <div className={`h-28 rounded-[18px] border ${cardBg}`}></div>
            <div className={`h-28 rounded-[18px] border ${cardBg}`}></div>
            <div className={`h-28 rounded-[18px] border ${cardBg}`}></div>
          </div>
        ) : (
          <div className="flex flex-col">
            
            {/* GENERAL MODULE */}
            <div className={`rounded-[18px] p-0 overflow-hidden mb-[18px] ${cardBg} ${cardHover}`}>
              <button onClick={() => toggleAccordion('general')} className="w-full flex items-center justify-between p-[24px] bg-transparent cursor-pointer transition-colors group">
                <div className="flex items-center gap-[18px]">
                  <div className={iconWrapper}>
                    <Settings className={`h-[22px] w-[22px] ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                  </div>
                  <div className="text-left">
                    <h3 className={`text-[1.4rem] font-bold tracking-[-0.02em] ${textMain}`}>General</h3>
                    <p className={`text-[0.98rem] leading-[1.6] ${textMuted}`}>Workspace name, environment, and appearance</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 transition-transform duration-[250ms] ease ${!isLight ? 'text-slate-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600'} ${expandedSection === 'general' ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {expandedSection === 'general' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                    <div className={`w-full h-[1px] ${isLight ? 'bg-[rgba(148,163,184,0.16)]' : 'bg-[rgba(255,255,255,0.08)]'}`}></div>
                    <div className="p-[32px] grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                      
                      <div className="space-y-8">
                        <div className="space-y-3.5 group/input">
                          <label className={labelClass}>Workspace Name</label>
                          <input type="text" defaultValue="Nexus Production" className={`w-full border rounded-[10px] min-h-[44px] px-[14px] py-2 text-[15px] font-medium focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all cursor-text ${inputBg} ${inputBorder} ${inputColor} ${!isLight && 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)]'}`} />
                        </div>
                        <div className="space-y-3.5 group/input">
                          <label className={labelClass}>Deployment Region</label>
                          <div className="relative">
                            <select className={`w-full border rounded-[10px] min-h-[44px] px-[14px] py-2 text-[15px] font-medium focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all appearance-none cursor-pointer ${inputBg} ${inputBorder} ${inputColor} ${!isLight && 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)]'}`}>
                              <option>US-East-1 (N. Virginia)</option>
                              <option>EU-West-2 (London)</option>
                              <option>AP-South-1 (Mumbai)</option>
                            </select>
                            <ChevronDown className={`absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none ${textMuted}`} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-3.5 group/input">
                          <label className={labelClass}>Environment Type</label>
                          <div className="relative">
                            <select className={`w-full border rounded-[10px] min-h-[44px] px-[14px] py-2 text-[15px] font-medium focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all appearance-none cursor-pointer ${inputBg} ${inputBorder} ${inputColor} ${!isLight && 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)]'}`}>
                              <option>Production (Live)</option>
                              <option>Staging (Pre-release)</option>
                              <option>Development</option>
                            </select>
                            <ChevronDown className={`absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none ${textMuted}`} />
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACCOUNT MODULE */}
            <div className={`rounded-[18px] p-0 overflow-hidden mb-[18px] ${cardBg} ${cardHover}`}>
              <button onClick={() => toggleAccordion('account')} className="w-full flex items-center justify-between p-[24px] bg-transparent cursor-pointer transition-colors group">
                <div className="flex items-center gap-[18px]">
                  <div className={iconWrapper}>
                    <User className={`h-[22px] w-[22px] ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                  </div>
                  <div className="text-left">
                    <h3 className={`text-[1.4rem] font-bold tracking-[-0.02em] ${textMain}`}>Account</h3>
                    <p className={`text-[0.98rem] leading-[1.6] ${textMuted}`}>Profile, authentication, and active sessions</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 transition-transform duration-[250ms] ease ${!isLight ? 'text-slate-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600'} ${expandedSection === 'account' ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {expandedSection === 'account' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                    <div className={`w-full h-[1px] ${isLight ? 'bg-[rgba(148,163,184,0.16)]' : 'bg-[rgba(255,255,255,0.08)]'}`}></div>
                    <div className="p-[32px]">
                      <div className="flex flex-col md:flex-row gap-[40px] items-start">
                        <div className="flex flex-col items-center gap-6">
                          <div className={`w-32 h-32 rounded-full border-[5px] flex items-center justify-center text-5xl font-extrabold shadow-xl ${isLight ? 'bg-slate-100 border-white text-slate-400' : 'bg-[#040b17] border-[#0a1a32] !text-slate-300 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]'}`}>
                            AD
                          </div>
                          <button className={`px-6 py-3 text-[13px] font-bold uppercase tracking-wide rounded-full border transition-all hover:scale-105 active:scale-95 ${isLight ? 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-blue-300' : 'bg-[#040b17] border-white/20 !text-white hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'}`}>Change Avatar</button>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-[32px] w-full">
                          <div className="space-y-3.5">
                            <label className={labelClass}>Full Name</label>
                            <input type="text" defaultValue="Administrator" className={`w-full border rounded-[10px] min-h-[44px] px-[14px] py-2 text-[15px] font-medium focus:outline-none focus:border-blue-400 transition-all ${inputBg} ${inputBorder} ${inputColor} ${!isLight && 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)]'}`} />
                          </div>
                          <div className="space-y-3.5">
                            <label className={labelClass}>Email Address</label>
                            <input type="email" defaultValue="admin@nexus.cloud" className={`w-full border rounded-[10px] min-h-[44px] px-[14px] py-2 text-[15px] font-medium focus:outline-none focus:border-blue-400 transition-all ${inputBg} ${inputBorder} ${inputColor} ${!isLight && 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)]'}`} />
                          </div>
                          <div className="space-y-3.5">
                            <label className={labelClass}>MFA Authentication</label>
                            <div className={`flex items-center justify-between p-5 border rounded-[10px] transition-colors hover:border-blue-400/40 cursor-pointer ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'} ${inputBg} ${inputBorder}`}>
                              <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                  <Fingerprint className="w-5 h-5 text-emerald-500" />
                                </div>
                                <span className={`text-[15px] font-bold ${inputColor}`}>App Authenticator</span>
                              </div>
                              <button className={`text-[13px] font-bold hover:underline underline-offset-4 transition-all ${isLight ? 'text-blue-600' : '!text-blue-400 hover:!text-blue-300'}`}>Configure</button>
                            </div>
                          </div>
                          <div className="space-y-3.5">
                            <label className={labelClass}>Active Devices</label>
                            <div className={`flex items-center justify-between p-5 border rounded-[10px] transition-colors hover:border-red-400/40 cursor-pointer ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'} ${inputBg} ${inputBorder}`}>
                              <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                                  <Smartphone className="w-5 h-5 text-blue-500" />
                                </div>
                                <span className={`text-[15px] font-bold ${inputColor}`}>2 Sessions</span>
                              </div>
                              <button className={`text-[13px] font-bold hover:underline underline-offset-4 transition-all ${isLight ? 'text-slate-500 hover:text-red-500' : '!text-slate-400 hover:!text-red-400'}`}>Revoke All</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SECURITY MODULE */}
            <div className={`rounded-[18px] p-0 overflow-hidden mb-[18px] ${cardBg} ${cardHover}`}>
              <button onClick={() => toggleAccordion('security')} className="w-full flex items-center justify-between p-[24px] bg-transparent cursor-pointer transition-colors group">
                <div className="flex items-center gap-[18px]">
                  <div className={iconWrapper}>
                    <Shield className={`h-[22px] w-[22px] ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                  </div>
                  <div className="text-left">
                    <h3 className={`text-[1.4rem] font-bold tracking-[-0.02em] ${textMain}`}>Security</h3>
                    <p className={`text-[0.98rem] leading-[1.6] ${textMuted}`}>Firewalls, API tokens, and access policies</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 transition-transform duration-[250ms] ease ${!isLight ? 'text-slate-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600'} ${expandedSection === 'security' ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {expandedSection === 'security' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                    <div className={`w-full h-[1px] ${isLight ? 'bg-[rgba(148,163,184,0.16)]' : 'bg-[rgba(255,255,255,0.08)]'}`}></div>
                    <div className="p-[32px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] mb-[32px]">
                        <div className={`p-8 border rounded-[16px] flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 ${inputBg} ${inputBorder} ${!isLight ? 'hover:bg-[#0a1a32] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]' : 'hover:shadow-md'}`}>
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-[12px] bg-amber-500/10 border border-amber-500/20">
                              <Key className="w-6 h-6 text-amber-500" />
                            </div>
                            <h4 className={`text-base font-bold uppercase tracking-wide ${textMain}`}>API Access Tokens</h4>
                          </div>
                          <p className={`text-[15px] leading-relaxed font-medium ${textMuted}`}>Manage keys for programmatic cluster access and CI/CD pipelines.</p>
                          <div className="mt-auto pt-5">
                            <button className={`w-full py-3.5 text-[13px] font-bold uppercase tracking-widest rounded-[12px] transition-all active:scale-95 ${isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200' : 'bg-[#071426] border border-white/20 !text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'}`}>Generate New Token</button>
                          </div>
                        </div>
                        <div className={`p-8 border rounded-[16px] flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 ${inputBg} ${inputBorder} ${!isLight ? 'hover:bg-[#0a1a32] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]' : 'hover:shadow-md'}`}>
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-[12px] bg-emerald-500/10 border border-emerald-500/20">
                              <Network className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h4 className={`text-base font-bold uppercase tracking-wide ${textMain}`}>Firewall Rules</h4>
                          </div>
                          <p className={`text-[15px] leading-relaxed font-medium ${textMuted}`}>Currently allowing all traffic on port 443. 3 Custom rules active.</p>
                          <div className="mt-auto pt-5">
                            <button className={`w-full py-3.5 text-[13px] font-bold uppercase tracking-widest rounded-[12px] transition-all active:scale-95 ${isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200' : 'bg-[#071426] border border-white/20 !text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'}`}>Edit Policies</button>
                          </div>
                        </div>
                      </div>
                      <div className={`p-6 border rounded-[16px] flex items-center justify-between transition-colors cursor-pointer ${inputBg} ${inputBorder} ${!isLight ? 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] hover:bg-[#0a1a32]' : 'hover:bg-slate-50'}`}>
                          <div className="flex items-center gap-5">
                            <div className="p-3.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                              <Lock className="w-7 h-7 text-blue-500" />
                            </div>
                            <div>
                              <p className={`text-base font-bold uppercase tracking-wide ${textMain}`}>End-to-End Encryption</p>
                              <p className={`text-[15px] mt-1.5 font-medium ${textMuted}`}>AES-256-GCM enforced on all storage buckets.</p>
                          </div>
                        </div>
                        <div className={`px-5 py-2 rounded-full border text-[11px] font-bold tracking-[0.2em] uppercase ${isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-500/20 border-emerald-400/30 !text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>Enforced</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* STORAGE MODULE */}
            <div className={`rounded-[18px] p-0 overflow-hidden mb-[18px] ${cardBg} ${cardHover}`}>
              <button onClick={() => toggleAccordion('storage')} className="w-full flex items-center justify-between p-[24px] bg-transparent cursor-pointer transition-colors group">
                <div className="flex items-center gap-[18px]">
                  <div className={iconWrapper}>
                    <Database className={`h-[22px] w-[22px] ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                  </div>
                  <div className="text-left">
                    <h3 className={`text-[1.4rem] font-bold tracking-[-0.02em] ${textMain}`}>Storage & Data</h3>
                    <p className={`text-[0.98rem] leading-[1.6] ${textMuted}`}>Capacity, regions, and retention policies</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 transition-transform duration-[250ms] ease ${!isLight ? 'text-slate-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600'} ${expandedSection === 'storage' ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {expandedSection === 'storage' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                    <div className={`w-full h-[1px] ${isLight ? 'bg-[rgba(148,163,184,0.16)]' : 'bg-[rgba(255,255,255,0.08)]'}`}></div>
                    <div className="p-[32px]">
                      <div className="mb-[40px]">
                        <div className="flex justify-between items-end mb-4">
                          <p className={`text-[13px] font-bold tracking-widest uppercase ${textMain}`}>Cluster Capacity Usage</p>
                          <p className={`text-lg font-bold ${isLight ? 'text-blue-600' : '!text-blue-400'}`}>4.2 TB <span className={`text-[15px] font-medium ${textMuted}`}>/ 10 TB</span></p>
                        </div>
                        <div className={`w-full h-5 rounded-full overflow-hidden border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#040b17] border-white/10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]'}`}>
                          <motion.div initial={{ width: 0 }} animate={{ width: "42%" }} transition={{ duration: 1.5, ease: "easeOut" }} className={`h-full relative ${isLight ? 'bg-blue-500' : 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.6)]'}`}>
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1.5rem_1.5rem] animate-[shimmer_1s_linear_infinite]"></div>
                          </motion.div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[32px]">
                        <div className={`p-6 border rounded-[16px] text-center transition-all duration-300 hover:-translate-y-1.5 ${inputBg} ${inputBorder} ${!isLight ? 'hover:bg-[#0a1a32] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]' : 'hover:shadow-md'}`}>
                          <p className={`text-[11px] font-bold tracking-widest uppercase ${textMuted}`}>Replication</p>
                          <p className={`text-2xl font-bold mt-3 ${textMain}`}>Multi-AZ</p>
                        </div>
                        <div className={`p-6 border rounded-[16px] text-center transition-all duration-300 hover:-translate-y-1.5 ${inputBg} ${inputBorder} ${!isLight ? 'hover:bg-[#0a1a32] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]' : 'hover:shadow-md'}`}>
                          <p className={`text-[11px] font-bold tracking-widest uppercase ${textMuted}`}>Retention</p>
                          <p className={`text-2xl font-bold mt-3 ${textMain}`}>30 Days</p>
                        </div>
                        <div className={`p-6 border rounded-[16px] text-center transition-all duration-300 hover:-translate-y-1.5 ${inputBg} ${inputBorder} ${!isLight ? 'hover:bg-[#0a1a32] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]' : 'hover:shadow-md'}`}>
                          <p className={`text-[11px] font-bold tracking-widest uppercase ${textMuted}`}>Auto-Scale</p>
                          <p className={`text-2xl font-bold mt-3 ${isLight ? 'text-emerald-600' : '!text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'}`}>Enabled</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* INFRASTRUCTURE AUTOMATION MODULE */}
            <div className={`rounded-[18px] p-0 overflow-hidden mb-[18px] ${cardBg} ${cardHover}`}>
              <button onClick={() => toggleAccordion('automation')} className="w-full flex items-center justify-between p-[24px] bg-transparent cursor-pointer transition-colors group">
                <div className="flex items-center gap-[18px]">
                  <div className={iconWrapper}>
                    <Cpu className={`h-[22px] w-[22px] ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                  </div>
                  <div className="text-left">
                    <h3 className={`text-[1.4rem] font-bold tracking-[-0.02em] ${textMain}`}>Infrastructure Automation</h3>
                    <p className={`text-[0.98rem] leading-[1.6] ${textMuted}`}>System protocols, scaling, and advanced features</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 transition-transform duration-[250ms] ease ${!isLight ? 'text-slate-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600'} ${expandedSection === 'automation' ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {expandedSection === 'automation' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                    <div className={`w-full h-[1px] ${isLight ? 'bg-[rgba(148,163,184,0.16)]' : 'bg-[rgba(255,255,255,0.08)]'}`}></div>
                    <div className="p-[32px] flex flex-col gap-4">
                      
                      {/* Premium Toggle Cards */}
                      {[
                        { id: 'snapshots', icon: Layers, label: 'Automated Snapshots', desc: 'Daily state backup of cluster configurations and data volumes.' },
                        { id: 'disasterRecovery', icon: Activity, label: 'Disaster Recovery', desc: 'Continuous hot-standby replication to secondary region.' },
                        { id: 'aiMonitoring', icon: Zap, label: 'AI Health Monitoring', desc: 'Predictive analytics for node failure and resource bottlenecks.' },
                        { id: 'autoScaling', icon: Server, label: 'Elastic Auto-Scaling', desc: 'Dynamically provision new nodes based on traffic thresholds.' },
                        { id: 'beta', icon: ShieldCheck, label: 'Beta Features', desc: 'Early access to experimental v2.0 routing algorithms.', isBeta: true }
                      ].map((feature) => (
                        <div key={feature.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[16px] transition-all duration-300 gap-5 cursor-pointer hover:-translate-y-[1px] border ${isLight ? 'hover:bg-slate-50 hover:shadow-sm border-slate-200 bg-white' : 'hover:bg-white/[0.04] hover:border-white/20 border-white/5 bg-[#040b17]'}`} onClick={() => handleToggle(feature.id as keyof typeof toggles)}>
                          <div className="flex items-start gap-6">
                            <div className={`p-3 rounded-[12px] mt-0.5 ${isLight ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-white/10 !text-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'}`}>
                              <feature.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-4">
                                <p className={`text-[15px] font-bold uppercase tracking-wide ${textMain}`}>{feature.label}</p>
                                {feature.isBeta && <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold border uppercase tracking-[0.2em] ${isLight ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-blue-500/20 !text-blue-300 border-blue-400/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}>Beta</span>}
                              </div>
                              <p className={`text-[15px] mt-1.5 font-medium leading-relaxed ${textMuted}`}>{feature.desc}</p>
                            </div>
                          </div>
                          {/* Modern Switch */}
                          <div className={`w-14 h-7 rounded-full shrink-0 relative transition-all duration-300 border ${toggles[feature.id as keyof typeof toggles] ? (isLight ? 'bg-blue-500 border-blue-600' : 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.6),inset_0_2px_4px_rgba(0,0,0,0.4)]') : (isLight ? 'bg-slate-200 border-slate-300' : 'bg-[#03060f] border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]')}`}>
                            <div className={`absolute top-[2px] left-[2.5px] w-[20px] h-[20px] bg-white rounded-full transition-transform duration-300 shadow-md ${toggles[feature.id as keyof typeof toggles] ? 'translate-x-[28px]' : 'translate-x-0'}`}></div>
                          </div>
                        </div>
                      ))}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}
      </div>

      {/* Sticky Save Action Bar */}
      <AnimatePresence>
        {(hasChanges && !isLoading) && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-12 z-50 flex items-center gap-5 backdrop-blur-[20px] border p-4 rounded-[24px] shadow-2xl transition-all duration-300 ${isLight ? 'bg-white/90 border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.15)]' : 'bg-[#071426]/95 border-blue-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(59,130,246,0.3)]'}`}
          >
            <div className="flex items-center gap-3 px-4 hidden sm:flex">
              <div className="p-2 rounded-full bg-amber-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                <AlertTriangle className="w-5 h-5 !text-amber-300" />
              </div>
              <span className={`text-[15px] font-extrabold tracking-wide ${isLight ? 'text-slate-700' : '!text-white'}`}>Unsaved Changes</span>
            </div>
            
            <button onClick={handleDiscard} disabled={isSaving} className={`px-6 py-3.5 text-[13px] font-extrabold tracking-widest uppercase transition-all rounded-[16px] border cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 ${isLight ? 'text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border-transparent' : '!text-slate-300 bg-[#040b17] hover:bg-red-500/20 hover:!text-red-300 border-white/10 hover:border-red-400/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'}`}>
              Discard
            </button>
            <button onClick={handleSave} disabled={isSaving} className="relative overflow-hidden px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-[16px] text-[13px] font-extrabold tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(59,130,246,0.6)] disabled:opacity-50 flex items-center gap-3 hover:scale-[1.03] active:scale-95 cursor-pointer group border border-blue-400/50">
              {isSaving ? (
                <>
                  <div className="h-5 w-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                  Deploying...
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Toast */}
      <AnimatePresence>
        {saveStatus.show && (
          <motion.div initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 50, scale: 0.9 }} className={`fixed top-28 right-10 z-50 flex items-center gap-5 backdrop-blur-[20px] border p-6 rounded-[24px] shadow-2xl ${saveStatus.success ? (isLight ? 'bg-white/95 border-emerald-200 shadow-emerald-500/10' : 'bg-[#071426]/95 border-emerald-400/50 shadow-[0_20px_50px_rgba(16,185,129,0.35)]') : (isLight ? 'bg-white/95 border-red-200 shadow-red-500/10' : 'bg-[#071426]/95 border-red-400/50 shadow-[0_20px_50px_rgba(239,68,68,0.35)]')}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] ${saveStatus.success ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {saveStatus.success ? <Check className={`h-6 w-6 ${isLight ? 'text-emerald-600' : '!text-emerald-300'}`} /> : <XCircle className={`h-6 w-6 ${isLight ? 'text-red-600' : '!text-red-300'}`} />}
            </div>
            <div>
              <p className={`text-base font-extrabold tracking-wide ${textMain}`}>{saveStatus.success ? "Settings applied" : "Save failed"}</p>
              <p className={`text-[15px] mt-1.5 font-medium ${textMuted}`}>{saveStatus.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
