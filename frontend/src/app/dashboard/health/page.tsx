"use client";

import { motion } from "framer-motion";
import { ActivitySquare, Database, Server, ServerCrash, Cpu, CheckCircle } from "lucide-react";

export default function SystemHealthPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
         <div>
           <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
             System Health
           </h1>
           <p className="text-sm text-slate-400 mt-1">Detailed service status and microservice diagnostics.</p>
         </div>
         <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
           <CheckCircle className="h-4 w-4" /> All Systems Operational
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Services */}
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }} className="bg-[#0A0F1C]/80 border border-white/5 rounded-2xl p-5 backdrop-blur-md shadow-lg">
          <h3 className="font-medium text-slate-200 text-sm mb-5 flex items-center gap-2"><Server className="h-4 w-4 text-blue-400" /> Microservices Status</h3>
          <div className="space-y-3">
             <ServiceRow name="API Gateway" status="operational" uptime="99.99%" ms="12ms" />
             <ServiceRow name="Auth Service" status="operational" uptime="100%" ms="8ms" />
             <ServiceRow name="Metadata DB (PostgreSQL)" status="operational" uptime="99.95%" ms="4ms" />
             <ServiceRow name="Cache (Redis)" status="operational" uptime="100%" ms="1ms" />
             <ServiceRow name="Sync/WebSocket Server" status="degraded" uptime="98.2%" ms="45ms" />
             <ServiceRow name="Storage Node Coordinator" status="operational" uptime="99.9%" ms="15ms" />
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          {/* Cluster CPU Load */}
          <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }} className="bg-[#0A0F1C]/80 border border-white/5 rounded-2xl p-5 backdrop-blur-md flex-1">
            <h3 className="font-medium text-slate-200 text-sm mb-5 flex items-center gap-2"><Cpu className="h-4 w-4 text-purple-400" /> Average CPU Load</h3>
            <div className="flex items-end gap-1 h-32 border-b border-white/5 pb-2">
               {Array.from({ length: 24 }).map((_, i) => (
                 <div key={i} className="flex-1 bg-purple-500/20 hover:bg-purple-500/50 transition-colors rounded-t-sm" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
               ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
               <span>24h ago</span><span>Now</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-[#0A0F1C]/80 border border-white/5 rounded-2xl p-5 flex flex-col justify-center items-center text-center">
               <span className="text-3xl font-bold text-white mb-1">99.99%</span>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cluster Uptime</span>
             </div>
             <div className="bg-[#0A0F1C]/80 border border-white/5 rounded-2xl p-5 flex flex-col justify-center items-center text-center">
               <span className="text-3xl font-bold text-emerald-400 mb-1">0</span>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dropped Chunks</span>
             </div>
          </div>
        </div>
      </div>
      
    </motion.div>
  );
}

function ServiceRow({ name, status, uptime, ms }: any) {
  const isOp = status === 'operational';
  return (
    <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
       <div className="flex items-center gap-3">
         <div className={`h-2 w-2 rounded-full ${isOp ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] animate-pulse'}`}></div>
         <span className="text-sm font-medium text-slate-300">{name}</span>
       </div>
       <div className="flex items-center gap-6">
         <div className="flex flex-col items-end">
           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Latency</span>
           <span className={`text-xs font-mono ${isOp ? 'text-slate-300' : 'text-yellow-400'}`}>{ms}</span>
         </div>
         <div className="flex flex-col items-end w-16">
           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Uptime</span>
           <span className="text-xs font-mono text-slate-300">{uptime}</span>
         </div>
       </div>
    </div>
  );
}
