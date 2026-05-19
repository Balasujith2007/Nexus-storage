"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cloud, Search, Bell, Menu, X, Activity, LayoutDashboard, FolderOpen, HardDrive, ShieldCheck, ActivityIcon, Settings, LogOut, Upload, ChevronLeft, ChevronRight, ChevronDown, CheckCircle, RefreshCw, AlertTriangle, Clock, User, Key, Shield } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = useStore((state) => state.logout);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "File upload completed", time: "2m ago", read: false, type: "upload" },
    { id: 2, text: "Replication synced to node-beta", time: "5m ago", read: false, type: "sync" },
    { id: 3, text: "High latency detected", time: "10m ago", read: false, type: "warning" },
    { id: 4, text: "Security scan completed", time: "15m ago", read: true, type: "security" }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Storage Nodes", href: "/dashboard/nodes", icon: HardDrive },
    { name: "Analytics", href: "/dashboard/analytics", icon: Activity },
    { name: "File Replication", href: "/dashboard/files", icon: FolderOpen },
    { name: "Activity Logs", href: "/dashboard/activity", icon: ActivityIcon },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  if (!mounted) return null;

  return (
    <div className="main-layout dashboard-container bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500/30">
      
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-50 bg-[#0a0f19]/80 backdrop-blur-2xl border-r border-white/5 justify-between">
        <div className="flex flex-col h-full">
          
          {/* Logo Section */}
          <div className="h-20 flex items-center px-6 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all">
                <Cloud className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">Nexus Storage</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                    isActive 
                      ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/5 text-white border border-cyan-500/20 shadow-inner" 
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:translate-x-1"
                  }`}
                >
                  <item.icon className={`h-5 w-5 transition-colors ${isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "group-hover:text-cyan-300"}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div layoutId="active-indicator" className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></motion.div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions/Profile */}
          <div className="p-4 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all group text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent"
            >
              <LogOut className="h-5 w-5 group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area — natural flow, no scroll cage */}
      <div className="dashboard-content flex-1 flex flex-col lg:ml-64 relative min-w-0">
        
        {/* Top Header for Search & Right Actions */}
        <header 
          className={`sticky top-0 z-40 w-full transition-all duration-300 h-20 flex items-center ${
            scrolled 
              ? "bg-[#030712]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
              : "bg-transparent"
          }`}
        >
          <div className="w-full px-6 lg:px-8 flex items-center justify-between">
              
              {/* Mobile Branding & Menu Toggle */}
              <div className="flex items-center gap-4 lg:hidden">
                <button 
                  onClick={() => setMobileMenuOpen(true)} 
                  className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="flex items-center gap-2">
                  <Cloud className="h-6 w-6 text-cyan-400" />
                  <span className="font-bold text-lg text-white tracking-tight">Nexus</span>
                </div>
              </div>

              {/* Desktop Spacer */}
              <div className="hidden lg:block flex-1"></div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-4 sm:gap-6">
                
                {/* Search */}
                <div className="hidden md:flex relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search resources..." 
                    className="w-56 bg-[#0a0f19] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-white transition-all placeholder-slate-500 hover:bg-white/5"
                  />
                </div>

                {/* Uptime Chip */}
                <div className="hidden lg:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                  <span className="text-xs font-semibold text-emerald-400">99.99% Uptime</span>
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors rounded-full group">
                    <Bell className="h-5 w-5 group-hover:animate-[ring_1s_ease-in-out_infinite]" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-[#030712]">
                         <span className="text-[9px] font-bold text-white leading-none mt-[1px]">{unreadCount}</span>
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotificationsOpen && (
                       <>
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNotificationsOpen(false)} className="fixed inset-0 z-40" />
                         <motion.div 
                           initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                           animate={{ opacity: 1, y: 0, scale: 1 }} 
                           exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                           transition={{ duration: 0.2 }}
                           className="notifications-panel flex flex-col"
                         >
                           <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                             <h3 className="font-bold text-[#E5F0FF] flex items-center gap-2">
                               Notifications 
                               {unreadCount > 0 && <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>}
                             </h3>
                             <button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))} className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors font-bold tracking-wide uppercase">Mark all read</button>
                           </div>
                           <div className="flex-1 overflow-y-auto">
                             {notifications.map((notif, idx) => (
                               <div key={notif.id} onClick={() => markAsRead(notif.id)} className={`p-[16px] border-b border-white/5 cursor-pointer transition-all duration-[250ms] ease hover:bg-[rgba(59,130,246,0.08)] group relative ${!notif.read ? 'bg-blue-500/[0.04]' : 'opacity-70 hover:opacity-100'}`}>
                                 <div className="flex items-start gap-[12px]">
                                   <div className={`mt-0.5 shrink-0 p-1.5 rounded-lg border ${!notif.read ? 'bg-white/5 border-white/10 shadow-inner' : 'border-transparent'}`}>
                                      {notif.type === 'upload' ? <Upload className={`h-4 w-4 ${!notif.read ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-slate-400'}`} /> :
                                       notif.type === 'sync' ? <RefreshCw className={`h-4 w-4 ${!notif.read ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'text-slate-400'}`} /> :
                                       notif.type === 'warning' ? <AlertTriangle className={`h-4 w-4 ${!notif.read ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]' : 'text-slate-400'}`} /> :
                                       <ShieldCheck className={`h-4 w-4 ${!notif.read ? 'text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]' : 'text-slate-400'}`} />}
                                   </div>
                                   <div className="flex-1 min-w-0">
                                     <div className="flex justify-between items-start mb-1 gap-2">
                                       <p className={`text-[13px] whitespace-normal break-words leading-[1.5] ${!notif.read ? 'font-bold text-white drop-shadow-md' : 'font-medium text-slate-300'}`}>{notif.text}</p>
                                       {!notif.read ? (
                                         <div className="h-2 w-2 mt-1.5 bg-blue-500 rounded-full shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                       ) : (
                                         <span className="text-[10px] text-blue-400 font-bold flex items-center gap-1 shrink-0"><CheckCircle className="h-3 w-3" /> Seen</span>
                                       )}
                                     </div>
                                     <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-2"><Clock className="h-3 w-3" /> {notif.time}</p>
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </motion.div>
                       </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Upload Button */}
                <button 
                  onClick={() => router.push('/dashboard/files')}
                  className="hidden sm:flex enterprise-button"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </button>

                {/* User Avatar Trigger — only the clickable trigger stays in the header */}
                <div className="profile-wrapper">
                  <div
                    id="profile-trigger"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-white/10"
                  >
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px] shadow-[0_0_10px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all">
                      <div className="h-full w-full rounded-full bg-[#030712] flex items-center justify-center overflow-hidden">
                        <span className="text-xs font-bold text-white">JD</span>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-semibold text-[#E5F0FF] leading-tight">Admin User</p>
                      <p className="text-xs text-slate-400">Owner</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-white' : 'group-hover:text-white'}`} />
                  </div>
                </div>

              </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 w-full px-6 lg:px-8 py-6 relative z-0 overflow-x-hidden">
          {/* Ambient Background Lights — clipped by overflow:hidden on parent */}
          <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none -z-10 mix-blend-screen"></div>
          <div className="absolute bottom-1/4 left-0 w-[400px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen"></div>
          
          <div className="pb-16 w-full max-w-full">
            {children}
          </div>
        </main>
      </div>

      {/* ====================================================
          PROFILE DROPDOWN — rendered at ROOT level to escape
          the header's stacking context (sticky+z-40 creates
          a stacking context that traps absolute children).
          Using position:fixed + viewport coords at z-[9999]
          guarantees it sits above ALL page content.
      ==================================================== */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            {/* Invisible full-screen backdrop — closes dropdown on outside click */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 9998, cursor: "default" }}
            />

            {/* The actual dropdown — fixed to viewport top-right, above everything */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: "84px",
                right: "20px",
                width: "260px",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                pointerEvents: "auto",
                background: "linear-gradient(180deg, rgba(8,15,30,0.98), rgba(5,10,20,0.96))",
                border: "1px solid rgba(59,130,246,0.18)",
                borderRadius: "16px",
                backdropFilter: "blur(18px)",
                boxShadow: "0 0 30px rgba(59,130,246,0.18), 0 10px 40px rgba(0,0,0,0.45)",
              }}
            >
              {/* Profile Header */}
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ height: "48px", width: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", padding: "2px", marginBottom: "4px" }}>
                  <div style={{ height: "100%", width: "100%", borderRadius: "50%", background: "#030712", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "white" }}>JD</span>
                  </div>
                </div>
                <span style={{ color: "#F8FAFC", fontWeight: 700, fontSize: "15px" }}>Admin User</span>
                <span style={{ color: "#94A3B8", fontSize: "12.5px" }}>Administrator</span>
                <span style={{ color: "#94A3B8", fontSize: "12.5px" }}>Cluster Owner</span>
              </div>

              <div style={{ width: "100%", height: "1px", borderTop: "1px solid rgba(255,255,255,0.08)" }} />

              {/* Nav Section 1 */}
              <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "2px" }}>
                {([
                  { label: "Profile",   icon: User,            route: "/dashboard/profile" },
                  { label: "Settings",  icon: Settings,        route: "/dashboard/settings" },
                  { label: "Workspace", icon: LayoutDashboard, route: "/dashboard/workspace" },
                ] as { label: string; icon: React.ElementType; route: string }[]).map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { setIsProfileOpen(false); router.push(item.route); }}
                    style={{
                      height: "44px", padding: "0 14px", width: "100%",
                      display: "flex", alignItems: "center", gap: "12px",
                      borderRadius: "10px", fontSize: "14px", fontWeight: 500,
                      color: "#CBD5E1", background: "transparent", border: "none",
                      transition: "all 0.2s ease", cursor: "pointer", textAlign: "left",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.12)"; (e.currentTarget as HTMLElement).style.color = "#F8FAFC"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#CBD5E1"; }}
                  >
                    <item.icon style={{ height: "18px", width: "18px", color: "#64748b", flexShrink: 0 }} />
                    {item.label}
                  </button>
                ))}
              </div>

              <div style={{ width: "100%", height: "1px", borderTop: "1px solid rgba(255,255,255,0.08)" }} />

              {/* Nav Section 2 */}
              <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "2px" }}>
                {([
                  { label: "API Access",      icon: Key,    route: "/dashboard/api" },
                  { label: "Security Center",  icon: Shield, route: "/dashboard/security" },
                ] as { label: string; icon: React.ElementType; route: string }[]).map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { setIsProfileOpen(false); router.push(item.route); }}
                    style={{
                      height: "44px", padding: "0 14px", width: "100%",
                      display: "flex", alignItems: "center", gap: "12px",
                      borderRadius: "10px", fontSize: "14px", fontWeight: 500,
                      color: "#CBD5E1", background: "transparent", border: "none",
                      transition: "all 0.2s ease", cursor: "pointer", textAlign: "left",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.12)"; (e.currentTarget as HTMLElement).style.color = "#F8FAFC"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#CBD5E1"; }}
                  >
                    <item.icon style={{ height: "18px", width: "18px", color: "#64748b", flexShrink: 0 }} />
                    {item.label}
                  </button>
                ))}
              </div>

              <div style={{ width: "100%", height: "1px", borderTop: "1px solid rgba(255,255,255,0.08)" }} />

              {/* Logout */}
              <div style={{ padding: "8px" }}>
                <button
                  onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                  style={{
                    height: "44px", width: "100%", padding: "0 14px",
                    display: "flex", alignItems: "center", gap: "12px",
                    borderRadius: "10px", fontSize: "14px", fontWeight: 500,
                    color: "#FCA5A5", background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    transition: "all 0.2s ease", cursor: "pointer",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.22)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.12)"; }}
                >
                  <LogOut style={{ height: "18px", width: "18px", color: "#FCA5A5", flexShrink: 0 }} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-[#0a0f19] border-r border-white/10 z-50 flex flex-col shadow-2xl"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Cloud className="h-6 w-6 text-cyan-400" />
                  <span className="font-bold text-lg text-white">Nexus</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/5 text-white border border-cyan-500/20" 
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${isActive ? "text-cyan-400" : ""}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/5">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
