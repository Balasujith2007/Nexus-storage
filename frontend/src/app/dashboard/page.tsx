"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, Activity, HardDrive, Wifi, ShieldCheck, 
  Hexagon, Database, AlertTriangle, Zap, CheckCircle, Plus, X, Loader2, FileText, Globe
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from "recharts";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

// Mock Data
const trafficData = [
  { time: '00:00', upload: 240, download: 340 },
  { time: '04:00', upload: 139, download: 280 },
  { time: '08:00', upload: 480, download: 560 },
  { time: '12:00', upload: 390, download: 490 },
  { time: '16:00', upload: 520, download: 610 },
  { time: '20:00', upload: 290, download: 410 },
  { time: '24:00', upload: 210, download: 320 },
];

const storageDistribution = [
  { name: 'US-East', value: 400, color: '#06b6d4', usage: '4.2 TB' },
  { name: 'EU-West', value: 300, color: '#3b82f6', usage: '3.1 TB' },
  { name: 'AP-South', value: 300, color: '#8b5cf6', usage: '3.1 TB' },
  { name: 'US-West', value: 200, color: '#10b981', usage: '2.0 TB' },
];

const activityLogs = [
  { id: 1, type: "success", message: "Node beta-02 successfully synced 4,200 chunks.", time: "2 mins ago" },
  { id: 2, type: "warning", message: "Latency spike detected in AP-South-1 region.", time: "15 mins ago" },
  { id: 3, type: "info", message: "New dataset uploaded. Distributing shards across cluster.", time: "1 hour ago" },
  { id: 4, type: "error", message: "Node delta-04 missed heartbeat. Marking as offline.", time: "3 hours ago" },
  { id: 5, type: "success", message: "Global cluster health check passed.", time: "5 hours ago" },
];

export default function CyberpunkDashboard() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    ip: "",
    region: "US-East-1",
    capacity: 10,
    status: "ONLINE"
  });

  const totalCapacity = nodes.reduce((acc, curr) => acc + (curr.capacity || 10), 0) || 120; 
  const activeNodes = nodes.filter(n => n.status !== "OFFLINE").length;
  
  useEffect(() => {
    axios.get("/api/v1/nodes")
      .then(res => {
        const mappedNodes = res.data.map((n: any) => ({
          id: n.id,
          name: n.name,
          region: n.region,
          status: n.status === "online" ? "ONLINE" : n.status === "syncing" ? "SYNCING" : "OFFLINE",
          storage: n.storage || Math.floor(Math.random() * 80),
          health: 100,
          latency: Math.floor(Math.random() * 50) + 10,
          chunks: `${Math.floor(Math.random() * 200)}k`,
          operation: n.status === "online" ? "Optimal Operation" : "Replicating Chunks..."
        }));
        setNodes(mappedNodes);
      })
      .catch(err => console.error(err));
  }, []);

  const validateIP = (ip: string) => {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  };

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name || !formData.ip) {
      setErrorMsg("Name and IP Address are required.");
      return;
    }

    if (!validateIP(formData.ip)) {
      setErrorMsg("Invalid IPv4 address format.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/v1/nodes", {
        name: formData.name, ip: formData.ip, region: formData.region,
        capacity: formData.capacity, status: formData.status.toLowerCase(), replicationEnabled: true
      });

      const newNode = {
        id: res.data.id, name: res.data.name, region: res.data.region,
        status: res.data.status === "online" ? "ONLINE" : "SYNCING",
        storage: 0, health: 100, latency: 12, chunks: "0", operation: "Initializing..."
      };

      setNodes(prev => [...prev, newNode]);
      setIsAddNodeOpen(false);
      setFormData({ name: "", ip: "", region: "US-East-1", capacity: 10, status: "ONLINE" });
      setSuccessToast(`Node ${newNode.name} added successfully!`);
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Failed to add node.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 297, 'F');
      
      doc.setTextColor(6, 182, 212);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text("NEXUS STORAGE", 14, 25);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text("Decentralized Network Analytics Report", 14, 32);
      
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);

      doc.setDrawColor(30, 41, 59);
      doc.line(14, 42, 196, 42);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Executive Summary", 14, 52);
      
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Storage Capacity: ${totalCapacity} TB   |   Active Nodes: ${activeNodes}   |   System Health: Secure`, 14, 60);
      doc.text(`Total Files Managed: 1.2M+`, 14, 66);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Node-wise Infrastructure Breakdown", 14, 80);

      const tableData = nodes.map(n => [
        n.name, n.region, `${n.capacity || 10} TB`, n.status, `${n.health}%`, n.operation
      ]);

      autoTable(doc, {
        startY: 85,
        head: [['Node Name', 'Region', 'Capacity', 'Status', 'Health', 'Current Operation']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [6, 182, 212], textColor: [255, 255, 255], fontStyle: 'bold' },
        bodyStyles: { fillColor: [30, 41, 59], textColor: [203, 213, 225] },
        alternateRowStyles: { fillColor: [15, 23, 42] },
        styles: { lineColor: [51, 65, 85] }
      });

      const chartElement = document.getElementById('report-chart');
      let finalY = (doc as any).lastAutoTable.finalY + 15;
      
      if (chartElement) {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Storage Growth & Traffic Chart", 14, finalY);
        
        const canvas = await html2canvas(chartElement, { scale: 2, backgroundColor: '#0f172a' });
        const imgData = canvas.toDataURL('image/png');
        
        doc.addImage(imgData, 'PNG', 14, finalY + 5, 180, 70);
        finalY = finalY + 85;
      }

      if (finalY > 260) { doc.addPage(); finalY = 20; doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 297, 'F'); }
      
      doc.setDrawColor(6, 182, 212);
      doc.line(140, finalY + 30, 196, finalY + 30);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("Admin Authorization Signature", 145, finalY + 35);
      
      doc.save(`Nexus_Storage_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      setSuccessToast("Report Generated & Downloaded!");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err) {
      setErrorMsg("Failed to generate PDF Report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-full">
      
      {/* 1. Animated Hero Section & Actions */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative bg-[#0b132b]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Soft neon glow backgrounds inside hero safely clipped by overflow-hidden */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/5 pointer-events-none"></div>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-500/10 blur-[80px] pointer-events-none rounded-full"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3 mb-2">
            Storage Intelligence
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] font-bold text-emerald-400 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              System Optimal
            </span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">Real-time enterprise monitoring of decentralized storage nodes and network telemetry.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
          <button onClick={handleGenerateReport} disabled={isGenerating} className="enterprise-button disabled:opacity-50">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {isGenerating ? "Generating..." : "Download Report"}
          </button>
          <button onClick={() => setIsAddNodeOpen(true)} className="enterprise-button">
            <Plus className="h-4 w-4" /> Add Node
          </button>
        </div>
      </motion.div>

      {/* 2. Compact Glassmorphism Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Storage" value={`${totalCapacity} TB`} subtext="64% Utilized" trend="+12 TB" icon={<HardDrive className="h-5 w-5 text-cyan-400" />} color="bg-cyan-500/10 border-cyan-500/20 text-cyan-400" />
        <StatCard title="Active Nodes" value={nodes.length.toString()} subtext="Globally Distributed" trend="+1 New" icon={<Server className="h-5 w-5 text-blue-400" />} color="bg-blue-500/10 border-blue-500/20 text-blue-400" />
        <StatCard title="Total Files" value="1.2M" subtext="Replicated Chunks" trend="High Activity" icon={<Database className="h-5 w-5 text-purple-400" />} color="bg-purple-500/10 border-purple-500/20 text-purple-400" />
        <StatCard title="System Health" value="Secure" subtext="AES-256 Active" trend="0 Alerts" icon={<ShieldCheck className="h-5 w-5 text-emerald-400" />} color="bg-emerald-500/10 border-emerald-500/20 text-emerald-400" />
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Traffic Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 enterprise-card relative overflow-hidden group p-5">
           <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-700"></div>
           <h3 className="text-sm font-bold text-white mb-4 tracking-wide flex items-center gap-2 relative z-10"><Activity className="h-4 w-4 text-cyan-400" /> Storage Growth & Traffic</h3>
           <div id="report-chart" className="w-full h-[300px] relative z-10">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={trafficData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                 <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                 <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                 <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} itemStyle={{ fontSize: '12px' }} />
                 <Area type="monotone" dataKey="upload" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorUpload)" />
                 <Area type="monotone" dataKey="download" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorDownload)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </motion.div>

        {/* Enhanced Donut Chart for Regions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="enterprise-card flex flex-col relative overflow-hidden group p-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700"></div>
          <h3 className="text-sm font-bold text-white mb-2 tracking-wide flex items-center gap-2 relative z-10"><Globe className="h-4 w-4 text-blue-400" /> Region Analytics</h3>
          
          <div className="flex-1 w-full relative z-10">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={storageDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                  {storageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', border: 'none' }} itemStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
               <span className="text-2xl font-black text-white drop-shadow-md">4</span>
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Regions</span>
            </div>
          </div>
          
          <div className="space-y-2 mt-4 relative z-10">
            {storageDistribution.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs text-slate-300 bg-[#0f172a]/50 border border-white/5 px-3 py-2 rounded-lg hover:border-white/10 transition-colors group/row">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full shadow-sm group-hover/row:scale-125 transition-transform" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }}></div>
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  <span className="font-mono text-slate-400">{item.usage}</span>
                </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 4. Professional Network Topology & Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Topology */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2"><Hexagon className="h-4 w-4 text-cyan-400" /> Network Topology Matrix</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nodes.map((node, i) => <NodeCard key={node.id} node={node} index={i} />)}
          </div>
        </div>

        {/* Activity Logs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2"><Zap className="h-4 w-4 text-yellow-400" /> Security & Activity Log</h2>
          </div>
          <div className="enterprise-card p-4 space-y-2">
             {activityLogs.map((log, i) => (
               <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={log.id} className="flex items-start gap-3 p-3 bg-[#0f172a]/50 hover:bg-[#1e293b]/50 rounded-xl transition-colors border border-white/5 hover:border-white/10 group cursor-default">
                 <div className={`mt-1 h-2 w-2 rounded-full shrink-0 group-hover:scale-125 transition-transform ${
                   log.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 
                   log.type === 'warning' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' : 
                   log.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 
                   'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                 }`}></div>
                 <div>
                   <p className="text-sm text-slate-300 font-medium leading-snug">{log.message}</p>
                   <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{log.time}</span>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>

      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 50, x: "-50%" }} className="fixed bottom-6 left-1/2 z-50">
            <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <div className="h-8 w-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-white font-medium">{successToast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Node Modal */}
      <AnimatePresence>
        {isAddNodeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddNodeOpen(false)} className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-[#0f172a] border border-cyan-500/20 rounded-2xl shadow-2xl p-6 max-w-md w-full z-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] pointer-events-none rounded-full"></div>
              
              <div className="flex justify-between items-center mb-5 relative z-10">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-wide">
                  <Server className="h-5 w-5 text-cyan-400" />
                  Deploy New Node
                </h2>
                <button onClick={() => setIsAddNodeOpen(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 relative z-10">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-400">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleAddNode} className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Node Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Gamma Edge" style={{ color: "white" }} className="w-full bg-[#030712]/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm !text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-colors shadow-inner" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">IP Address</label>
                    <input type="text" value={formData.ip} onChange={e => setFormData({...formData, ip: e.target.value})} placeholder="192.168.1.10" style={{ color: "white" }} className="w-full bg-[#030712]/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm !text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-colors shadow-inner" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Capacity (TB)</label>
                    <input type="number" min="1" max="1000" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} style={{ color: "white" }} className="w-full bg-[#030712]/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm !text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-colors shadow-inner" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Region</label>
                    <select value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} style={{ color: "white" }} className="w-full bg-[#030712]/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm !text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-colors appearance-none shadow-inner">
                      <option value="US-East-1" className="bg-[#0f172a] text-white">US-East-1</option>
                      <option value="US-West-1" className="bg-[#0f172a] text-white">US-West-1</option>
                      <option value="EU-Central-1" className="bg-[#0f172a] text-white">EU-Central-1</option>
                      <option value="AP-South-1" className="bg-[#0f172a] text-white">AP-South-1</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ color: "white" }} className="w-full bg-[#030712]/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm !text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-colors appearance-none shadow-inner">
                      <option value="ONLINE" className="bg-[#0f172a] text-white">Online</option>
                      <option value="SYNCING" className="bg-[#0f172a] text-white">Syncing</option>
                      <option value="OFFLINE" className="bg-[#0f172a] text-white">Offline</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setIsAddNodeOpen(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20">
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Deploy Node
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components

function StatCard({ title, value, subtext, trend, icon, color, glow }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="enterprise-card flex flex-col h-full group relative overflow-hidden p-5">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-white/10 transition-colors duration-500`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{title}</h3>
        <div className={`p-1.5 rounded-lg border ${color} bg-white/5 ${glow}`}>{icon}</div>
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-black text-white mb-1.5 tracking-tight">{value}</div>
        <div className="flex items-center justify-between">
           <p className="text-[11px] font-medium text-slate-500">{subtext}</p>
           <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${color} bg-[#0f172a]`}>{trend}</span>
        </div>
      </div>
    </motion.div>
  );
}

function NodeCard({ node, index }: any) {
  const isOnline = node.status === 'ONLINE';
  const isSyncing = node.status === 'SYNCING';
  const colorText = isOnline ? 'text-emerald-400' : isSyncing ? 'text-yellow-400' : 'text-red-400';
  const bgColor = isOnline ? 'bg-emerald-500' : isSyncing ? 'bg-yellow-500' : 'bg-red-500';
  const borderColor = isOnline ? 'border-emerald-500/20' : isSyncing ? 'border-yellow-500/20' : 'border-red-500/20';

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="enterprise-card flex flex-col group relative overflow-hidden p-5">
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full blur-[40px] pointer-events-none group-hover:opacity-10 transition-opacity duration-500 ${bgColor}`}></div>
      
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-[#0f172a] border ${borderColor} ${colorText} shadow-inner`}>
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-wide">{node.name}</h3>
            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest mt-1">
              <span className={`flex items-center gap-1.5 ${colorText}`}>
                <span className="relative flex h-1.5 w-1.5">
                  {(isOnline || isSyncing) && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bgColor}`}></span>}
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${bgColor}`}></span>
                </span>
                {node.status}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{node.region}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
           <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
             <span>Storage Usage</span>
             <span className="text-white">{node.storage}%</span>
           </div>
           <div className="h-1.5 w-full bg-[#0f172a] border border-white/5 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" style={{ width: `${node.storage}%` }}></div>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#0f172a]/50 p-2.5 rounded-xl border border-white/5">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Health</div>
            <div className="font-semibold text-white text-xs">{node.health}%</div>
          </div>
          <div className="bg-[#0f172a]/50 p-2.5 rounded-xl border border-white/5">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Latency</div>
            <div className="font-semibold text-white text-xs">{node.latency}ms</div>
          </div>
          <div className="bg-[#0f172a]/50 p-2.5 rounded-xl border border-white/5">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Chunks</div>
            <div className="font-semibold text-white text-xs truncate">{node.chunks}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
