"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, FolderPlus, Search, File as FileIcon, MoreVertical, Grid, List, Download, Share2, Trash2, Loader2, AlertTriangle, CheckCircle, X, FileText, Image as ImageIcon, Archive, FileCode, Copy, Shield, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function FilesPage() {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [activeAction, setActiveAction] = useState<number | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Actions State
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<{title: string, desc?: string, type: 'success' | 'error' | 'info'} | null>(null);

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const showToast = (title: string, desc?: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return { icon: FileText, color: 'text-red-400', bg: 'bg-red-500/10' };
      case 'jpg': case 'jpeg': case 'png': case 'gif': return { icon: ImageIcon, color: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'zip': case 'rar': case 'tar': case 'gz': return { icon: Archive, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      case 'js': case 'ts': case 'html': case 'css': return { icon: FileCode, color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
      default: return { icon: FileIcon, color: 'text-slate-400', bg: 'bg-slate-500/10' };
    }
  };

  const handleDownload = (file: any) => {
    setDownloadingId(file.id);
    setActiveAction(null);
    setTimeout(() => {
      setDownloadingId(null);
      showToast("Download started", `${file.name} is being downloaded securely.`, 'success');
    }, 1500);
  };

  const handleShare = (file: any) => {
    setSelectedFile(file);
    setIsShareModalOpen(true);
    setActiveAction(null);
  };

  const handleDeleteClick = (file: any) => {
    setSelectedFile(file);
    setIsDeleteModalOpen(true);
    setActiveAction(null);
  };

  const confirmDelete = () => {
    if (!selectedFile) return;
    setFiles(files.filter(f => f.id !== selectedFile.id));
    setIsDeleteModalOpen(false);
    showToast("File deleted", `${selectedFile.name} removed from cluster.`, 'success');
    setSelectedFile(null);
  };

  const fetchFiles = async () => {
    try {
      const res = await axios.get("/api/v1/upload");
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch files", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (selectedFile: File) => {
    setUploadError("");
    setUploadSuccess(false);
    
    // File validation
    const dangerousExts = ["exe", "bat", "sh", "cmd", "msi"];
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (dangerousExts.includes(extension || "")) {
      setUploadError("Security Alert: Executable files are not allowed.");
      return;
    }
    
    if (selectedFile.size > 100 * 1024 * 1024) {
      setUploadError("File exceeds 100MB limit.");
      return;
    }

    if (files.some(f => f.name === selectedFile.name)) {
      setUploadError("A file with this name already exists.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        }
      });
      
      setFiles(prev => [res.data, ...prev]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setUploadError(err.response?.data?.error || "Upload failed due to network error.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col w-full max-w-[1600px] mx-auto px-6 pb-20" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      
      {/* Global Drag Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/90 backdrop-blur-sm border-2 border-dashed border-blue-500 m-4 rounded-3xl pointer-events-none">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-blue-500/20 rounded-full flex items-center justify-center animate-bounce mb-6">
                <Upload className="h-10 w-10 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Drop files to upload</h2>
              <p className="text-blue-400 mt-2">Files will be instantly chunked and encrypted.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a0f19]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
        <div className="flex flex-col w-full md:w-auto">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            Files & Objects
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] font-bold text-emerald-400 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Replication Active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">{files.length} Secure Files • 2.4 TB Used</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-1 shadow-inner hidden sm:flex">
            <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}><List className="h-4 w-4" /></button>
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}><Grid className="h-4 w-4" /></button>
          </div>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium px-4 py-2 rounded-xl transition-all text-white hidden sm:flex">
            <FolderPlus className="h-4 w-4 text-cyan-400" /> New Folder
          </button>
          <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.zip,.txt,.csv" />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} 
            {isUploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>

      {/* Upload Progress/Alerts */}
      <AnimatePresence>
        {isUploading && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-[#0a0f19] border border-cyan-500/30 rounded-2xl p-5 overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-cyan-400 font-medium flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading and encrypting chunk payload...</span>
              <span className="text-white font-bold">{uploadProgress}%</span>
            </div>
            <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/5">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </motion.div>
        )}
        
        {uploadError && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium"><AlertTriangle className="h-4 w-4" /> {uploadError}</div>
            <button onClick={() => setUploadError("")} className="text-red-400 hover:text-red-300"><X className="h-4 w-4" /></button>
          </motion.div>
        )}

        {uploadSuccess && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-2 text-emerald-400 text-sm font-medium">
            <CheckCircle className="h-4 w-4" /> File successfully encrypted and distributed to the cluster.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Files List/Grid */}
      <div className="flex-1 bg-[#0a0f19]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl relative shadow-lg min-h-[400px]">
        
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-cyan-500" />
            <p className="text-sm font-medium">Fetching objects from metadata database...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 enterprise-card m-6">
            <div className="h-20 w-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Upload className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Drop files to begin replication</h3>
            <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">Upload files to automatically shard, encrypt, and distribute them across the global storage network.</p>
            <button onClick={() => fileInputRef.current?.click()} className="enterprise-button">
              <Upload className="h-4 w-4" /> Select Files
            </button>
          </div>
        ) : view === 'list' ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-black/20 border-b border-white/5 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-5 text-slate-300">File Name</th>
                  <th className="px-6 py-5 text-slate-300">Size</th>
                  <th className="px-6 py-5 text-slate-300">Cluster Status</th>
                  <th className="px-6 py-5 text-slate-300">Date Added</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {files.map((file, i) => (
                    <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.05 }} key={file.id} className="hover:bg-white/[0.03] transition-colors duration-300 group relative">
                      <td className="px-6 py-[18px] font-medium text-slate-200 flex items-center gap-4">
                        {(() => {
                           const { icon: Icon, color, bg } = getFileIcon(file.name);
                           return (
                             <div className={`p-2.5 rounded-xl border border-white/5 shadow-[0_0_15px_currentColor] ${bg} ${color} transition-colors opacity-80 group-hover:opacity-100`}>
                               <Icon className="h-5 w-5" />
                             </div>
                           );
                        })()}
                        <span className="truncate max-w-[200px] md:max-w-xs xl:max-w-md">{file.name}</span>
                      </td>
                      <td className="px-6 py-[18px]">{file.size}</td>
                      <td className="px-6 py-[18px]">
                        <div className="flex items-center gap-3">
                           {file.sync ? (
                             <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">SYNCED</span>
                           ) : file.error ? (
                             <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-widest bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">ERROR</span>
                           ) : (
                             <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-widest bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div> REPLICATING</span>
                           )}
                        </div>
                      </td>
                      <td className="px-6 py-[18px] text-xs text-slate-500">{file.date}</td>
                      <td className="px-6 py-[18px] text-right relative">
                        <button onClick={() => setActiveAction(activeAction === file.id ? null : file.id)} className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <AnimatePresence>
                          {activeAction === file.id && (
                            <motion.div initial={{ opacity: 0, scale: 0.95, right: 0 }} animate={{ opacity: 1, scale: 1, right: 56 }} exit={{ opacity: 0, scale: 0.95, right: 0 }} className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center p-2 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden gap-1">
                               <button onClick={() => handleDownload(file)} className="p-[10px] rounded-[10px] bg-white/[0.06] border border-white/[0.08] backdrop-blur-[12px] text-slate-300 hover:text-white transition-all duration-300 hover:-translate-y-[2px] hover:bg-blue-500/[0.22] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                 {downloadingId === file.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                               </button>
                               <button onClick={() => handleShare(file)} className="p-[10px] rounded-[10px] bg-white/[0.06] border border-white/[0.08] backdrop-blur-[12px] text-slate-300 hover:text-white transition-all duration-300 hover:-translate-y-[2px] hover:bg-blue-500/[0.22] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                 <Share2 className="h-4 w-4" />
                               </button>
                               <button onClick={() => handleDeleteClick(file)} className="p-[10px] rounded-[10px] bg-red-500/[0.06] border border-red-500/[0.1] backdrop-blur-[12px] text-red-400 hover:text-red-300 transition-all duration-300 hover:-translate-y-[2px] hover:bg-red-500/[0.22] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                 <Trash2 className="h-4 w-4" />
                               </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
             {files.map((file, i) => (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} key={file.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all cursor-pointer group flex flex-col shadow-inner backdrop-blur-xl relative overflow-hidden h-40">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-[30px] group-hover:bg-cyan-500/20 group-hover:scale-150 transition-all duration-500"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                     <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                        <FileIcon className="h-5 w-5" />
                     </div>
                     <button className="text-slate-500 hover:text-white transition-colors"><MoreVertical className="h-4 w-4" /></button>
                  </div>
                  <div className="relative z-10 flex-1">
                    <h4 className="font-semibold text-white truncate text-sm mb-2">{file.name}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      {file.sync ? (
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
                      )}
                      <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">{file.chunks} CHUNKS • {file.sync ? 'SYNCED' : 'REPLICATING'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-3 text-[10px] text-slate-500 font-medium uppercase border-t border-white/5 relative z-10">
                     <span>{file.size}</span>
                     <span>{file.date}</span>
                  </div>
                </motion.div>
             ))}
          </div>
        )}
      </div>
      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && selectedFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsShareModalOpen(false)} className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-md bg-[#0f172a] border border-blue-500/20 rounded-2xl shadow-2xl p-6 z-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] pointer-events-none rounded-full"></div>
              
              <div className="flex justify-between items-center mb-5 relative z-10">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-wide">
                  <Share2 className="h-5 w-5 text-blue-400" />
                  Secure Share
                </h2>
                <button onClick={() => setIsShareModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
                   <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                     <FileIcon className="h-6 w-6" />
                   </div>
                   <div className="overflow-hidden">
                     <h3 className="font-semibold text-white truncate">{selectedFile.name}</h3>
                     <p className="text-xs text-slate-400">{selectedFile.size} • Encrypted</p>
                   </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Secure Link</label>
                  <div className="flex items-center gap-2">
                    <input type="text" readOnly value={`https://nexus.cloud/share/${selectedFile.id || 'x9f2k1'}`} className="w-full bg-[#030712]/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-300 font-mono focus:outline-none shadow-inner" />
                    <button onClick={() => {
                        navigator.clipboard.writeText(`https://nexus.cloud/share/${selectedFile.id || 'x9f2k1'}`);
                        showToast("Link Copied", "Secure share link copied to clipboard.", 'success');
                    }} className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Expiration</label>
                    <select className="w-full bg-[#030712]/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors appearance-none shadow-inner">
                      <option value="24h">24 Hours</option>
                      <option value="7d">7 Days</option>
                      <option value="30d">30 Days</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Access Level</label>
                    <select className="w-full bg-[#030712]/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors appearance-none shadow-inner">
                      <option value="view">View Only</option>
                      <option value="download">Can Download</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button onClick={() => setIsShareModalOpen(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">Done</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-sm bg-[#0f172a] border border-red-500/20 rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.15)] p-6 z-10 overflow-hidden text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 blur-[60px] pointer-events-none rounded-full"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.2)] border border-red-500/20">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Delete File?</h2>
                <p className="text-sm text-slate-400 mb-6">Are you sure you want to delete <span className="text-slate-200 font-semibold">{selectedFile.name}</span>? This action cannot be undone.</p>
                
                <div className="flex w-full gap-3">
                  <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/10">Cancel</button>
                  <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]">Delete</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 50, x: "-50%" }} className="fixed bottom-6 left-1/2 z-50">
            <div className={`bg-[#0f172a]/95 backdrop-blur-xl border rounded-2xl px-5 py-4 flex items-start gap-3 shadow-2xl min-w-[300px] ${
              toastMessage.type === 'success' ? 'border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 
              toastMessage.type === 'error' ? 'border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 
              'border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
            }`}>
              <div className={`shrink-0 mt-0.5 ${
                toastMessage.type === 'success' ? 'text-emerald-400' : 
                toastMessage.type === 'error' ? 'text-red-400' : 'text-blue-400'
              }`}>
                {toastMessage.type === 'success' ? <CheckCircle className="h-5 w-5" /> : 
                 toastMessage.type === 'error' ? <AlertTriangle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white mb-0.5">{toastMessage.title}</h4>
                {toastMessage.desc && <p className="text-[13px] text-slate-400 leading-snug">{toastMessage.desc}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
