"use client";

import { motion } from "framer-motion";
import { ActivityIcon, UploadCloud, Database, ShieldAlert, Key, Zap, RefreshCw } from "lucide-react";

export default function ActivityFeedPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const activities = [
    { id: 1, type: "upload", title: "File Upload Completed", desc: "System_Architecture_v2.pdf (2.4 MB) was uploaded to node-alpha.", time: "Just now", icon: UploadCloud, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { id: 2, type: "sync", title: "Chunk Replication", desc: "Chunk 8f4a2b successfully replicated to node-beta.", time: "2 mins ago", icon: RefreshCw, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { id: 3, type: "security", title: "Admin Login", desc: "Successful login from 192.168.1.42.", time: "15 mins ago", icon: Key, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { id: 4, type: "system", title: "Storage Optimization", desc: "Background task compressed 4.2 GB of unused blocks.", time: "1 hour ago", icon: Database, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { id: 5, type: "warning", title: "High Latency Detected", desc: "AP-South-1 link reporting >200ms latency.", time: "3 hours ago", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { id: 6, type: "alert", title: "Failed Authentication", desc: "Invalid JWT token rejected from unknown origin.", time: "5 hours ago", icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
         <div>
           <h1 className="text-2xl enterprise-heading flex items-center gap-2">
             Activity Feed
           </h1>
           <p className="enterprise-description mt-1">Real-time timeline of all system and cluster events.</p>
         </div>
         <button className="enterprise-button">
           <ActivityIcon className="h-4 w-4" /> Live Stream
         </button>
      </div>

      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-8 top-4 bottom-0 w-px feed-timeline-line"></div>

        <div className="space-y-6">
          {activities.map((activity, i) => (
            <motion.div 
              key={activity.id}
              variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
              className="relative flex gap-6"
            >
              <div className={`h-16 w-16 shrink-0 rounded-2xl flex items-center justify-center border ${activity.bg} ${activity.border} ${activity.color} shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_currentColor]`}>
                <activity.icon className="h-6 w-6" />
              </div>
              
              <div className="flex-1 enterprise-card p-5 group transition-all duration-300 hover:translate-x-2">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="enterprise-heading text-[1.1rem]">{activity.title}</h3>
                  <span className="text-[10px] font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-md">{activity.time}</span>
                </div>
                <p className="enterprise-description">{activity.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
    </motion.div>
  );
}
