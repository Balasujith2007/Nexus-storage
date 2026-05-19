"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Shield, Calendar, Edit3, X, Check, AlertTriangle, Loader2, Camera } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface UserProfile {
  fullName: string;
  email: string;
  username: string;
  role: string;
  memberSince: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

// ─── Initial Data ────────────────────────────────────────────────────────────
const INITIAL_PROFILE: UserProfile = {
  fullName: "Admin User",
  email: "admin@nexus.cloud",
  username: "jd_admin",
  role: "Cluster Owner",
  memberSince: "January 2024",
};

// ─── Toast Component ──────────────────────────────────────────────────────────
function Toasts({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  const color = { success: "rgba(34,197,94,0.15)", error: "rgba(239,68,68,0.15)" };
  const border = { success: "rgba(34,197,94,0.3)", error: "rgba(239,68,68,0.3)" };
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 99999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            style={{
              background: color[t.type],
              border: `1px solid ${border[t.type]}`,
              borderRadius: 12,
              padding: "12px 16px",
              backdropFilter: "blur(16px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              minWidth: 260,
              display: "flex",
              alignItems: "center",
              gap: 10,
              pointerEvents: "auto"
            }}
          >
            {t.type === "success" && <Check style={{ color: "#4ade80", width: 16, height: 16, flexShrink: 0 }} />}
            {t.type === "error" && <AlertTriangle style={{ color: "#f87171", width: 16, height: 16, flexShrink: 0 }} />}
            <span style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 500, flex: 1 }}>{t.message}</span>
            <button
              onClick={() => onDismiss(t.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
function EditProfileModal({
  open,
  profile,
  onClose,
  onSave,
}: {
  open: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => Promise<void>;
}) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; username?: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (open) {
      setFormData(profile);
      setErrors({});
    }
  }, [open, profile]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return "US";
  };

  const inputBaseStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(3,7,18,0.6)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "all 0.2s ease"
  };

  const labelStyle: React.CSSProperties = {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    display: "block",
    marginBottom: 6
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: "linear-gradient(180deg,rgba(8,15,30,0.99),rgba(5,10,22,0.98))",
              border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: 20,
              padding: "28px",
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 0 50px rgba(59,130,246,0.15), 0 24px 60px rgba(0,0,0,0.6)",
              backdropFilter: "blur(24px)",
              margin: "0 16px",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Edit3 style={{ color: "#3b82f6", width: 20, height: 20 }} />
                <h3 style={{ color: "#f8fafc", fontSize: 16, fontWeight: 700, margin: 0 }}>Edit Profile</h3>
              </div>
              <button
                onClick={onClose}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 6, cursor: "pointer", color: "#94a3b8", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8"; }}
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            </div>

            {/* Avatar Upload Section */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ position: "relative" }}>
                <div style={{ height: 80, width: 80, borderRadius: "50%", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", padding: 3, boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}>
                  <div style={{ height: "100%", width: "100%", borderRadius: "50%", background: "#030712", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>{getInitials(formData.fullName)}</span>
                  </div>
                </div>
                <button
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "#3b82f6",
                    border: "2px solid #0a0f1c",
                    borderRadius: "50%",
                    padding: 6,
                    cursor: "pointer",
                    color: "white",
                    boxShadow: "0 0 10px rgba(59,130,246,0.5)",
                    transition: "transform 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  title="Change Avatar"
                >
                  <Camera style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  value={formData.fullName}
                  onChange={e => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  placeholder="e.g. John Doe"
                  style={{ ...inputBaseStyle, border: errors.fullName ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(59,130,246,0.3)" }}
                  onFocus={e => !errors.fullName && (e.target.style.border = "1px solid rgba(59,130,246,0.8)")}
                  onBlur={e => !errors.fullName && (e.target.style.border = "1px solid rgba(59,130,246,0.3)")}
                />
                {errors.fullName && <p style={{ color: "#f87171", fontSize: 11, marginTop: 4 }}>{errors.fullName}</p>}
              </div>

              <div>
                <label style={labelStyle}>Username</label>
                <input
                  value={formData.username}
                  onChange={e => {
                    setFormData({ ...formData, username: e.target.value });
                    if (errors.username) setErrors({ ...errors, username: undefined });
                  }}
                  placeholder="e.g. jd_admin"
                  style={{ ...inputBaseStyle, border: errors.username ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(59,130,246,0.3)" }}
                  onFocus={e => !errors.username && (e.target.style.border = "1px solid rgba(59,130,246,0.8)")}
                  onBlur={e => !errors.username && (e.target.style.border = "1px solid rgba(59,130,246,0.3)")}
                />
                {errors.username && <p style={{ color: "#f87171", fontSize: 11, marginTop: 4 }}>{errors.username}</p>}
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  value={formData.email}
                  onChange={e => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="e.g. admin@nexus.cloud"
                  style={{ ...inputBaseStyle, border: errors.email ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(59,130,246,0.3)" }}
                  onFocus={e => !errors.email && (e.target.style.border = "1px solid rgba(59,130,246,0.8)")}
                  onBlur={e => !errors.email && (e.target.style.border = "1px solid rgba(59,130,246,0.3)")}
                />
                {errors.email && <p style={{ color: "#f87171", fontSize: 11, marginTop: 4 }}>{errors.email}</p>}
              </div>

              <div>
                <label style={labelStyle}>Role</label>
                <input
                  value={formData.role}
                  readOnly
                  style={{ ...inputBaseStyle, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)", color: "#64748b", cursor: "not-allowed" }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button
                onClick={onClose}
                style={{ flex: 1, height: 42, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
                onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
                onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                style={{
                  flex: 1, height: 42, borderRadius: 10, background: "rgba(59,130,246,0.85)", border: "1px solid rgba(59,130,246,0.5)", color: "white", fontSize: 13, fontWeight: 600, cursor: isSaving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s",
                  boxShadow: "0 0 20px rgba(59,130,246,0.3)"
                }}
                onMouseEnter={e => { if (!isSaving) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 25px rgba(59,130,246,0.5)"; } }}
                onMouseLeave={e => { if (!isSaving) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,0.85)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(59,130,246,0.3)"; } }}
                onMouseDown={e => { if (!isSaving) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
                onMouseUp={e => { if (!isSaving) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                {isSaving ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Saving...</> : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const dismissToast = (id: string) => setToasts(t => t.filter(x => x.id !== id));

  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setProfile(updatedProfile);
    addToast("Profile Updated Successfully", "success");
    setIsModalOpen(false);
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return "US";
  };

  return (
    <>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <Toasts toasts={toasts} onDismiss={dismissToast} />
      
      <EditProfileModal
        open={isModalOpen}
        profile={profile}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col gap-6 max-w-3xl"
      >
        {/* Header */}
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <User className="h-6 w-6 text-cyan-400" />
            User Profile
          </h1>
          <p className="text-sm text-slate-400">Manage your account identity and personal settings.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#0A0F1C]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden group">
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 to-blue-600/0 opacity-0 group-hover:from-cyan-500/5 group-hover:to-blue-600/5 transition-opacity duration-500 pointer-events-none" />
          
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[3px] shadow-[0_0_20px_rgba(34,211,238,0.3)] shrink-0 z-10">
            <div className="h-full w-full rounded-full bg-[#030712] flex items-center justify-center">
              <span className="text-2xl font-black text-white">{getInitials(profile.fullName)}</span>
            </div>
          </div>
          
          <div className="flex-1 z-10">
            <h2 className="text-xl font-bold text-white">{profile.fullName}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{profile.role} · Nexus Storage</p>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full">Owner</span>
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-full">Administrator</span>
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl shrink-0 z-10 transition-all duration-200 cursor-pointer"
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,0.15)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(59,130,246,0.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.96)"; }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          >
            <Edit3 className="h-4 w-4 text-cyan-400" /> Edit Profile
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Mail, label: "Email", value: profile.email },
            { icon: Shield, label: "Role", value: profile.role },
            { icon: Calendar, label: "Member Since", value: profile.memberSince },
            { icon: User, label: "Username", value: profile.username },
          ].map((item) => (
            <div key={item.label} className="bg-[#0A0F1C]/80 border border-white/5 rounded-xl p-4 flex items-center gap-4 backdrop-blur-md group transition-all duration-300 hover:bg-[#0f172a]/90 hover:border-white/10">
              <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg group-hover:border-cyan-500/30 transition-colors duration-300">
                <item.icon className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{item.label}</p>
                <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors duration-300">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
