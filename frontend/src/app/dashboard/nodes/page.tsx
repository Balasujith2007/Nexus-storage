"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Activity, Database, CheckCircle, Wifi, Hexagon, AlertTriangle, ShieldCheck, RefreshCw, X, Terminal, Clock } from "lucide-react";

export default function NodesMonitor() {
  const [selectedNodeLogs, setSelectedNodeLogs] = useState<string | null>(null);

  const getMockLogs = (nodeId: string) => {
    return [
      { time: "09:42:15", type: "success", msg: "Replication synced successfully across 4 shards." },
      { time: "09:43:02", type: "info", msg: "Health check passed. CPU 14%, RAM 32%." },
      { time: "09:45:18", type: "warning", msg: "Latency spike detected (185ms). Re-routing traffic." },
      { time: "09:46:05", type: "info", msg: "Connection re-established. Optimizing routes." },
      { time: "09:47:33", type: "success", msg: "Node synchronization completed. 100% active." },
    ];
  };

  const nodes = [
    { id: "node-alpha-01", status: "online", location: "US-East-1", storage: "64%", health: "99.9%", latency: "24ms", chunks: "124,532" },
    { id: "node-beta-02", status: "online", location: "EU-West-2", storage: "42%", health: "100%", latency: "45ms", chunks: "89,102" },
    { id: "node-gamma-03", status: "syncing", location: "AP-South-1", storage: "81%", health: "98.5%", latency: "112ms", chunks: "145,002" },
    { id: "node-delta-04", status: "offline", location: "US-West-1", storage: "--", health: "--", latency: "--", chunks: "--" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 px-4 md:px-0">
      {/* Topology Header */}
      <div className="bg-[#071426]/90 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] rounded-[24px] p-8 md:p-10 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-extrabold mb-3 flex items-center gap-4 text-white tracking-tight">
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/30 text-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <Hexagon className="h-7 w-7" />
              </div>
              Network Topology
            </h2>
            <p className="text-slate-400 text-[15px] max-w-xl leading-relaxed font-medium">
              Real-time monitoring of globally distributed storage nodes. Files are sharded, encrypted, and replicated across this decentralized enterprise infrastructure.
            </p>
          </div>
          
          <div className="flex gap-5 w-full md:w-auto">
             <div className="flex-1 md:flex-none flex flex-col items-center justify-center px-8 py-5 bg-[#040b17] rounded-2xl border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">3</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-widest font-extrabold mt-2">Online Nodes</span>
             </div>
             <div className="flex-1 md:flex-none flex flex-col items-center justify-center px-8 py-5 bg-[#040b17] rounded-2xl border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-200 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">1.2 TB</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-widest font-extrabold mt-2">Network Cap</span>
             </div>
          </div>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {nodes.map((node, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
            key={node.id} 
            className={`rounded-[24px] p-[20px] relative overflow-hidden group transition-all duration-300 ease backdrop-blur-md shadow-2xl hover:-translate-y-[3px] hover:shadow-[0_0_25px_rgba(59,130,246,0.18)] mb-[24px] ${
              node.status === 'offline' 
                ? 'bg-gradient-to-br from-[#1a0b0b] to-[#040b17] border border-red-900/40' 
                : 'bg-gradient-to-br from-[#071426] to-[#040b17] border border-blue-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
            }`}
          >
            {/* Status Background Glow */}
            {node.status === 'online' && <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500"></div>}
            {node.status === 'syncing' && <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-amber-500/20 transition-colors duration-500"></div>}
            {node.status === 'offline' && <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-[60px] pointer-events-none transition-colors duration-500"></div>}

            {/* Header: Name and Status */}
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl border shadow-inner ${
                  node.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 
                  node.status === 'syncing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 
                  'bg-red-500/10 text-red-400 border-red-500/30'
                }`}>
                  <Server className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-white tracking-widest uppercase drop-shadow-md">{node.id}</h3>
                  <div className="flex items-center gap-2.5 text-[13px] font-bold mt-2">
                    <span className="text-slate-400 uppercase tracking-wide">{node.location}</span>
                  </div>
                </div>
              </div>
              
              {/* Status Pill */}
              <div className={`pr-4 pt-2 pb-1.5 pl-4 rounded-full border flex items-center gap-2.5 font-bold text-[0.72rem] uppercase tracking-[0.15em] shadow-sm transition-colors duration-300 ${
                node.status === 'online' ? 'bg-emerald-500/10 text-[#34D399] border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)] drop-shadow-[0_0_12px_rgba(52,211,153,0.45)]' : 
                node.status === 'syncing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)] drop-shadow-[0_0_5px_rgba(245,158,11,0.8)] animate-pulse' : 
                'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)] drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]'
              }`}>
                <div className="flex items-center gap-2">
                  {node.status === 'online' && <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>}
                  <span>{node.status}</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10 mb-10">
              {[
                { label: "Storage", value: node.storage, icon: Database },
                { label: "Health", value: node.health, icon: Activity },
                { label: "Latency", value: node.latency, icon: Wifi },
                { label: "Chunks", value: node.chunks, icon: Hexagon }
              ].map((metric, idx) => (
                <div key={idx} className={`bg-[#040b17] p-[20px] rounded-2xl border transition-colors duration-300 ${node.status === 'offline' ? 'border-red-900/20' : 'border-white/5 group-hover:border-white/10'} shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] flex flex-col justify-center`}>
                  <div className="flex items-center gap-2.5 text-slate-400 text-[10px] uppercase font-extrabold tracking-widest mb-3">
                    <div className={`p-1.5 rounded-full border ${node.status === 'offline' ? 'bg-red-950/30 border-red-900/30 text-red-500/50' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                      <metric.icon className="h-3.5 w-3.5" />
                    </div>
                    {metric.label}
                  </div>
                  <div className={`text-xl font-extrabold tracking-tight ${node.status === 'offline' ? 'text-slate-600' : 'text-white'}`}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={`pt-8 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 text-sm relative z-10 ${node.status === 'offline' ? 'border-red-900/20' : 'border-white/10'}`}>
              {node.status === 'online' ? (
                <span className="text-slate-300 flex items-center gap-2.5 font-bold tracking-wide text-[13px]">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" /> Optimal Operation
                </span>
              ) : node.status === 'syncing' ? (
                 <span className="text-slate-300 flex items-center gap-2.5 font-bold tracking-wide text-[13px]">
                  <RefreshCw className="h-5 w-5 text-amber-400 animate-spin" /> Replicating Chunks...
                </span>
              ) : (
                <span className="text-slate-300 flex items-center gap-2.5 font-bold tracking-wide text-[13px]">
                  <AlertTriangle className="h-5 w-5 text-red-500" /> Connection Lost
                </span>
              )}
              
              <button onClick={() => setSelectedNodeLogs(node.id)} className="px-[16px] py-[10px] rounded-[10px] bg-white/[0.08] text-[0.85rem] text-[#E5F0FF] border border-white/[0.12] backdrop-blur-[10px] transition-all duration-300 ease hover:bg-blue-500/[0.22] hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] font-medium flex items-center gap-2 cursor-pointer">
                <Terminal className="h-3.5 w-3.5" />
                View Logs
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Logs Modal Panel */}
      <AnimatePresence>
        {selectedNodeLogs && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNodeLogs(null)} className="absolute inset-0 bg-[#030712]/60 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-full max-w-md h-full bg-[#0a0f19] border-l border-blue-500/20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-10 flex flex-col overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] pointer-events-none rounded-full"></div>
              
              <div className="flex items-center justify-between p-6 border-b border-white/10 relative z-10 bg-[#071426]/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                    <Terminal className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-[1.1rem] font-extrabold text-[#E5F0FF] uppercase tracking-widest">{selectedNodeLogs} Logs</h2>
                    <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Live Stream Active</p>
                  </div>
                </div>
                <button onClick={() => setSelectedNodeLogs(null)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 relative z-10 space-y-4">
                {getMockLogs(selectedNodeLogs).map((log, idx) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="flex gap-3 text-sm font-mono p-3 rounded-lg bg-[#030712] border border-white/5 hover:border-white/10 transition-colors">
                    <span className="text-slate-500 shrink-0 flex items-center gap-1"><Clock className="h-3 w-3" /> {log.time}</span>
                    <span className={`w-1.5 rounded-full shrink-0 ${
                      log.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                      log.type === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                      'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                    }`}></span>
                    <p className="text-slate-300 break-words leading-relaxed">{log.msg}</p>
                  </motion.div>
                ))}
                
                {/* Fake loading cursor */}
                <div className="flex gap-3 text-sm font-mono p-3">
                  <span className="text-slate-600 flex items-center gap-1"><Clock className="h-3 w-3" /> --:--:--</span>
                  <div className="w-2 h-4 bg-blue-400 animate-pulse mt-0.5"></div>
                </div>
              </div>
              
              <div className="p-4 border-t border-white/10 bg-[#071426]/80 backdrop-blur-md relative z-10">
                <button className="w-full py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5" /> Pause Feed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
