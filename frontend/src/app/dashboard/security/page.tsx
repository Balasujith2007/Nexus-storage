"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Lock, Key, AlertTriangle, Fingerprint, Eye } from "lucide-react";

export default function SecurityPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
         <div>
           <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
             Security & Access
           </h1>
           <p className="text-sm text-slate-400 mt-1">Monitor cluster security, encryption status, and authentication logs.</p>
         </div>
         <button className="text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
           <ShieldAlert className="h-4 w-4" /> Run Security Scan
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard title="AES-256 Encryption" status="Enabled" subtext="All chunks encrypted at rest" icon={<Lock className="text-emerald-400 h-5 w-5" />} glow="bg-emerald-500" />
        <StatusCard title="Cluster Firewall" status="Active" subtext="Inbound traffic restricted" icon={<ShieldCheck className="text-emerald-400 h-5 w-5" />} glow="bg-emerald-500" />
        <StatusCard title="Auth Protocols" status="Strict" subtext="JWT + Refresh Tokens active" icon={<Key className="text-blue-400 h-5 w-5" />} glow="bg-blue-500" />
        <StatusCard title="Threat Detection" status="Monitoring" subtext="0 threats detected today" icon={<Eye className="text-purple-400 h-5 w-5" />} glow="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Security Logs */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#0A0F1C]/80 border border-white/5 rounded-2xl p-0 backdrop-blur-md overflow-hidden shadow-lg">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="font-medium text-slate-200 text-sm flex items-center gap-2"><Fingerprint className="h-4 w-4 text-slate-400" /> Authentication Logs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-[#030712]/50 border-b border-white/5 uppercase text-[10px] font-bold tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">User / IP</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { event: "Login Success", user: "192.168.1.42", status: "Granted", time: "2 mins ago", ok: true },
                  { event: "Token Refresh", user: "system_service", status: "Granted", time: "15 mins ago", ok: true },
                  { event: "Failed Login Attempt", user: "45.22.19.11", status: "Blocked", time: "1 hour ago", ok: false },
                  { event: "API Key Generated", user: "admin_user", status: "Granted", time: "3 hours ago", ok: true },
                  { event: "Node Connection", user: "node-beta-02", status: "Verified", time: "5 hours ago", ok: true },
                ].map((log, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-300">{log.event}</td>
                    <td className="px-5 py-3 font-mono text-xs">{log.user}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${log.ok ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Threat Map / Alerts */}
        <motion.div variants={itemVariants} className="bg-[#0A0F1C]/80 border border-white/5 rounded-2xl p-5 backdrop-blur-md flex flex-col shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px]"></div>
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <h3 className="font-medium text-slate-200 text-sm">Security Alerts</h3>
          </div>
          
          <div className="space-y-4 flex-1">
             <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-yellow-500/5 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <h4 className="text-xs font-bold text-yellow-500 mb-1">Unusual Traffic Spike</h4>
               <p className="text-[11px] text-slate-400">Node-gamma-03 reported a 400% increase in egress traffic over the last 10 minutes.</p>
             </div>
             
             <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
               <h4 className="text-xs font-bold text-slate-300 mb-1">Outdated Certificate</h4>
               <p className="text-[11px] text-slate-400">Internal gRPC communication cert on Node-alpha expires in 12 days.</p>
             </div>
          </div>
        </motion.div>
      </div>
      
    </motion.div>
  );
}

function StatusCard({ title, status, subtext, icon, glow }: any) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }} className="bg-[#0A0F1C]/80 border border-white/5 rounded-2xl p-5 relative overflow-hidden group shadow-sm">
      <div className={`absolute -right-8 -top-8 w-24 h-24 ${glow} opacity-[0.08] rounded-full blur-[20px] group-hover:opacity-[0.15] transition-opacity`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 shadow-inner backdrop-blur-md">{icon}</div>
        <span className="text-sm font-bold text-white tracking-tight">{status}</span>
      </div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 relative z-10">{title}</h3>
      <p className="text-[10px] text-slate-500 font-medium relative z-10">{subtext}</p>
    </motion.div>
  );
}
