"use client";

import { motion } from "framer-motion";
import { LineChart, BarChart2, PieChart, Activity, DownloadCloud, UploadCloud } from "lucide-react";

export default function AnalyticsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 350, damping: 25 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
         <div>
           <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
             Advanced Analytics
           </h1>
           <p className="text-sm text-slate-400 mt-1">Deep insights into cluster performance and network traffic.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Network Traffic Line Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#0A0F1C]/80 border border-white/5 rounded-2xl p-5 backdrop-blur-md flex flex-col h-[380px] shadow-lg">
          <div className="flex justify-between items-center mb-6">
             <div>
               <h3 className="font-medium text-slate-200 text-sm">Network Traffic (7 Days)</h3>
               <p className="text-xs text-slate-500 mt-0.5">Ingress and egress throughput across all edge nodes.</p>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span><span className="text-xs text-slate-400">Ingress</span></div>
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span><span className="text-xs text-slate-400">Egress</span></div>
             </div>
          </div>
          
          <div className="flex-1 relative w-full h-full flex items-end pt-4 z-10">
            <div className="absolute inset-0 flex flex-col justify-between border-b border-white/5 pb-6">
               {[100, 75, 50, 25, 0].map(val => (
                 <div key={val} className="flex w-full items-center">
                   <span className="text-[10px] text-slate-600 w-8">{val}Gbps</span>
                   <div className="flex-1 border-t border-white/[0.02] border-dashed"></div>
                 </div>
               ))}
            </div>
            
            <svg className="absolute inset-0 h-full w-full pl-8 pb-6 overflow-visible preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
               <defs>
                 <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="rgba(34,211,238,0.2)" />
                   <stop offset="100%" stopColor="rgba(34,211,238,0)" />
                 </linearGradient>
               </defs>
               
               {/* Ingress Line */}
               <path d="M 0,90 L 15,80 L 30,85 L 45,60 L 60,65 L 75,40 L 90,45 L 100,20 L 100,100 L 0,100 Z" fill="url(#cyanGrad)" />
               <motion.path 
                 initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
                 d="M 0,90 L 15,80 L 30,85 L 45,60 L 60,65 L 75,40 L 90,45 L 100,20" 
                 fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinejoin="round" 
               />
               
               {/* Egress Line */}
               <motion.path 
                 initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                 d="M 0,95 L 20,90 L 40,75 L 60,80 L 80,50 L 100,35" 
                 fill="none" stroke="#a855f7" strokeWidth="2" strokeLinejoin="round" 
               />
            </svg>
            
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
               <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </motion.div>

        {/* Node Performance Distribution */}
        <motion.div variants={itemVariants} className="bg-[#0A0F1C]/80 border border-white/5 rounded-2xl p-5 backdrop-blur-md flex flex-col h-[380px] shadow-lg">
          <div className="mb-6">
            <h3 className="font-medium text-slate-200 text-sm">Upload Trends</h3>
            <p className="text-xs text-slate-500 mt-0.5">File chunks processed per hour</p>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-1.5 mt-auto border-b border-white/5 pb-2">
             {Array.from({ length: 12 }).map((_, i) => {
               const h = Math.floor(Math.random() * 80) + 20;
               return (
                 <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                   <motion.div 
                     initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: i * 0.05 }}
                     className="w-full rounded-t-sm bg-blue-500 opacity-60 group-hover:opacity-100 group-hover:bg-cyan-400 transition-colors"
                   ></motion.div>
                   {/* Hover Tooltip Mock */}
                   <div className="absolute -top-8 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                     {h * 10} MB
                   </div>
                 </div>
               );
             })}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <MetricBox title="Avg Read Latency" value="24ms" change="-2ms" icon={<DownloadCloud />} color="text-emerald-400" />
         <MetricBox title="Avg Write Latency" value="112ms" change="+4ms" icon={<UploadCloud />} color="text-yellow-400" />
         <MetricBox title="Replication Factor" value="3x" change="Optimal" icon={<Activity />} color="text-blue-400" />
      </div>
      
    </motion.div>
  );
}

function MetricBox({ title, value, change, icon, color }: any) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }} className="bg-[#0A0F1C]/80 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:bg-[#0f172a] transition-colors shadow-sm">
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{title}</h4>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
          <span className={`text-[10px] font-semibold ${color}`}>{change}</span>
        </div>
      </div>
      <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-slate-400 group-hover:text-white transition-colors">
        {icon}
      </div>
    </motion.div>
  );
}
