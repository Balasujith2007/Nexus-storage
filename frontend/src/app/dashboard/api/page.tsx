"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Copy, RefreshCw, Eye, EyeOff, Plus, Trash2, Check, X, AlertTriangle, ShieldCheck, Clock, Activity, Loader2, ChevronDown } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: "active" | "revoked";
  permissions: string;
  created: string;
  lastUsed: string;
  requests: number;
}

interface Toast { id: string; message: string; type: "success" | "error" | "info"; }

// ─── Helpers ─────────────────────────────────────────────────────────────────
const generateKey = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `nxs_live_sk_${seg(8)}${seg(8)}${seg(4)}`;
};

const now = () => new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

// ─── Initial data ─────────────────────────────────────────────────────────────
const INITIAL_KEYS: ApiKey[] = [
  { id: "1", name: "Primary Production Key", key: generateKey(), status: "active", permissions: "Full Access", created: "Jan 12, 2024", lastUsed: "2 mins ago", requests: 14382 },
  { id: "2", name: "Read-Only Analytics", key: generateKey(), status: "active", permissions: "Read Only", created: "Feb 5, 2024", lastUsed: "1 hour ago", requests: 8201 },
];

// ─── Toast component ──────────────────────────────────────────────────────────
function Toasts({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  const color = { success: "rgba(34,197,94,0.15)", error: "rgba(239,68,68,0.15)", info: "rgba(59,130,246,0.15)" };
  const border = { success: "rgba(34,197,94,0.3)", error: "rgba(239,68,68,0.3)", info: "rgba(59,130,246,0.3)" };
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 99999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
            style={{ background: color[t.type], border: `1px solid ${border[t.type]}`, borderRadius: 12, padding: "12px 16px", backdropFilter: "blur(16px)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)", minWidth: 260, display: "flex", alignItems: "center", gap: 10, pointerEvents: "auto" }}>
            {t.type === "success" && <Check style={{ color: "#4ade80", width: 16, height: 16, flexShrink: 0 }} />}
            {t.type === "error" && <AlertTriangle style={{ color: "#f87171", width: 16, height: 16, flexShrink: 0 }} />}
            {t.type === "info" && <ShieldCheck style={{ color: "#60a5fa", width: 16, height: 16, flexShrink: 0 }} />}
            <span style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 500, flex: 1 }}>{t.message}</span>
            <button onClick={() => onDismiss(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}><X style={{ width: 14, height: 14 }} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ open, title, message, confirmLabel, dangerous, loading, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; confirmLabel: string;
  dangerous?: boolean; loading?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
          onClick={onCancel}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            style={{ background: "linear-gradient(180deg,rgba(10,20,40,0.98),rgba(5,12,25,0.97))", border: `1px solid ${dangerous ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.25)"}`, borderRadius: 18, padding: "28px 28px 24px", width: 400, boxShadow: `0 0 40px ${dangerous ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.2)"}, 0 20px 50px rgba(0,0,0,0.5)`, backdropFilter: "blur(20px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              {dangerous ? <AlertTriangle style={{ color: "#f87171", width: 20, height: 20 }} /> : <RefreshCw style={{ color: "#60a5fa", width: 20, height: 20 }} />}
              <h3 style={{ color: "#f8fafc", fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 13.5, lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onCancel} style={{ flex: 1, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
                Cancel
              </button>
              <button onClick={onConfirm} disabled={loading}
                style={{ flex: 1, height: 40, borderRadius: 10, background: dangerous ? "rgba(239,68,68,0.85)" : "rgba(59,130,246,0.85)", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s", opacity: loading ? 0.7 : 1 }}>
                {loading && <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />}
                {loading ? "Processing…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── New Key Modal ─────────────────────────────────────────────────────────────
function NewKeyModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (name: string, perms: string, exp: string) => void }) {
  const [name, setName] = useState("");
  const [perms, setPerms] = useState("Full Access");
  const [exp, setExp] = useState("Never");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    onCreate(name.trim(), perms, exp);
    setName(""); setPerms("Full Access"); setExp("Never"); setLoading(false);
    onClose();
  };

  const inputStyle = { width: "100%", background: "rgba(3,7,18,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" };
  const labelStyle = { color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", display: "block", marginBottom: 6 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
          onClick={onClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={e => e.stopPropagation()}
            style={{ background: "linear-gradient(180deg,rgba(8,15,30,0.99),rgba(5,10,22,0.98))", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 20, padding: "28px", width: 420, boxShadow: "0 0 50px rgba(59,130,246,0.15), 0 24px 60px rgba(0,0,0,0.6)", backdropFilter: "blur(24px)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Key style={{ color: "#facc15", width: 20, height: 20 }} />
                <h3 style={{ color: "#f8fafc", fontSize: 16, fontWeight: 700, margin: 0 }}>Generate New API Key</h3>
              </div>
              <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 6, cursor: "pointer", color: "#94a3b8" }}><X style={{ width: 14, height: 14 }} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Key Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Production Backend" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Permissions</label>
                <div style={{ position: "relative" }}>
                  <select value={perms} onChange={e => setPerms(e.target.value)} style={{ ...inputStyle, paddingRight: 36, appearance: "none" }}>
                    <option>Full Access</option><option>Read Only</option><option>Write Only</option><option>Admin</option>
                  </select>
                  <ChevronDown style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#64748b", pointerEvents: "none" }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Expiration</label>
                <div style={{ position: "relative" }}>
                  <select value={exp} onChange={e => setExp(e.target.value)} style={{ ...inputStyle, paddingRight: 36, appearance: "none" }}>
                    <option>Never</option><option>30 Days</option><option>90 Days</option><option>1 Year</option>
                  </select>
                  <ChevronDown style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#64748b", pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={onClose} style={{ flex: 1, height: 42, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleCreate} disabled={!name.trim() || loading}
                style={{ flex: 1, height: 42, borderRadius: 10, background: name.trim() ? "rgba(59,130,246,0.9)" : "rgba(59,130,246,0.3)", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: name.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
                {loading ? <><Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> Generating…</> : <><Key style={{ width: 14, height: 14 }} /> Generate Key</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Key Card ─────────────────────────────────────────────────────────────────
function KeyCard({ apiKey, onCopy, onRegenerate, onRevoke }: { apiKey: ApiKey; onCopy: (key: string) => void; onRegenerate: (id: string) => void; onRevoke: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const isRevoked = apiKey.status === "revoked";

  const handleCopy = () => {
    onCopy(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const masked = `nxs_live_sk_${"•".repeat(24)}`;

  const btnBase: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 500, cursor: isRevoked ? "not-allowed" : "pointer", transition: "all 0.2s", opacity: isRevoked ? 0.45 : 1 };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: "linear-gradient(135deg,rgba(10,20,45,0.85),rgba(5,12,30,0.9))", border: `1px solid ${isRevoked ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.15)"}`, borderRadius: 16, padding: 20, backdropFilter: "blur(16px)", transition: "all 0.3s" }}>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <h4 style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{apiKey.name}</h4>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ background: isRevoked ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)", color: isRevoked ? "#f87171" : "#4ade80", border: `1px solid ${isRevoked ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
              {isRevoked ? "Revoked" : "Active"}
            </span>
            <span style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>{apiKey.permissions}</span>
          </div>
        </div>
      </div>

      {/* Key display */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(3,7,18,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
        <span style={{ flex: 1, fontFamily: "monospace", fontSize: 12.5, color: isRevoked ? "#64748b" : "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {visible && !isRevoked ? apiKey.key : masked}
        </span>
        <button onClick={() => setVisible(v => !v)} disabled={isRevoked}
          style={{ background: "none", border: "none", cursor: isRevoked ? "not-allowed" : "pointer", color: "#64748b", padding: 4, transition: "color 0.2s" }}>
          {visible ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
        </button>
        <button onClick={handleCopy} disabled={isRevoked}
          style={{ background: "none", border: "none", cursor: isRevoked ? "not-allowed" : "pointer", color: copied ? "#4ade80" : "#64748b", padding: 4, transition: "color 0.2s" }}>
          {copied ? <Check style={{ width: 15, height: 15 }} /> : <Copy style={{ width: 15, height: 15 }} />}
        </button>
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        {[{ icon: Clock, label: "Created", value: apiKey.created }, { icon: Activity, label: "Last Used", value: apiKey.lastUsed }, { icon: ShieldCheck, label: "Requests", value: apiKey.requests.toLocaleString() }].map(m => (
          <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <m.icon style={{ width: 12, height: 12, color: "#475569" }} />
            <span style={{ color: "#475569", fontSize: 11 }}>{m.label}:</span>
            <span style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600 }}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => !isRevoked && onRegenerate(apiKey.id)} disabled={isRevoked}
          style={{ ...btnBase, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }}>
          <RefreshCw style={{ width: 13, height: 13 }} /> Regenerate
        </button>
        <button onClick={() => !isRevoked && handleCopy()} disabled={isRevoked}
          style={{ ...btnBase, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa" }}>
          {copied ? <Check style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
          {copied ? "Copied!" : "Copy Key"}
        </button>
        <button onClick={() => !isRevoked && onRevoke(apiKey.id)} disabled={isRevoked}
          style={{ ...btnBase, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", marginLeft: "auto" }}>
          <Trash2 style={{ width: 13, height: 13 }} /> Revoke
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ApiAccessPage() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [confirmRegenId, setConfirmRegenId] = useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const dismissToast = (id: string) => setToasts(t => t.filter(x => x.id !== id));

  const handleCreate = (name: string, perms: string, _exp: string) => {
    const newKey: ApiKey = { id: Date.now().toString(), name, key: generateKey(), status: "active", permissions: perms, created: now(), lastUsed: "Just now", requests: 0 };
    setKeys(k => [newKey, ...k]);
    addToast(`API key "${name}" generated successfully`, "success");
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    addToast("API key copied to clipboard", "success");
  };

  const handleRegenerate = async () => {
    if (!confirmRegenId) return;
    setActionLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setKeys(k => k.map(key => key.id === confirmRegenId ? { ...key, key: generateKey(), lastUsed: "Just now" } : key));
    addToast("API key regenerated — old key is now invalidated", "info");
    setActionLoading(false);
    setConfirmRegenId(null);
  };

  const handleRevoke = async () => {
    if (!confirmRevokeId) return;
    setActionLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setKeys(k => k.map(key => key.id === confirmRevokeId ? { ...key, status: "revoked" } : key));
    addToast("API key has been revoked", "error");
    setActionLoading(false);
    setConfirmRevokeId(null);
  };

  const activeCount = keys.filter(k => k.status === "active").length;
  const totalRequests = keys.reduce((s, k) => s + k.requests, 0);

  return (
    <>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <Toasts toasts={toasts} onDismiss={dismissToast} />
      <NewKeyModal open={showNew} onClose={() => setShowNew(false)} onCreate={handleCreate} />
      <ConfirmModal open={!!confirmRegenId} title="Regenerate API Key" message="This will invalidate the current key immediately. Any services using it will stop working until updated." confirmLabel="Regenerate Key" loading={actionLoading} onConfirm={handleRegenerate} onCancel={() => setConfirmRegenId(null)} />
      <ConfirmModal open={!!confirmRevokeId} title="Revoke API Key" message="This action is permanent. The key will be immediately disabled and cannot be restored." confirmLabel="Revoke Key" dangerous loading={actionLoading} onConfirm={handleRevoke} onCancel={() => setConfirmRevokeId(null)} />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="flex flex-col gap-6 max-w-3xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Key className="h-6 w-6 text-yellow-400" /> API Access
            </h1>
            <p className="text-sm text-slate-400 mt-1">Manage programmatic access keys for your Nexus cluster.</p>
          </div>
          <button onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl transition-all shrink-0"
            style={{ background: "rgba(59,130,246,0.85)", border: "1px solid rgba(59,130,246,0.4)", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(59,130,246,1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(59,130,246,0.85)")}>
            <Plus className="h-4 w-4" /> New Key
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[{ label: "Active Keys", value: activeCount }, { label: "Total Requests", value: totalRequests.toLocaleString() }, { label: "Rate Limit", value: "10k / min" }].map(s => (
            <div key={s.label} style={{ background: "rgba(10,20,45,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px", textAlign: "center", backdropFilter: "blur(12px)" }}>
              <p className="text-xl font-black text-white">{s.value}</p>
              <p style={{ color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Key Cards */}
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {keys.map(k => (
              <KeyCard key={k.id} apiKey={k}
                onCopy={handleCopy}
                onRegenerate={id => setConfirmRegenId(id)}
                onRevoke={id => setConfirmRevokeId(id)} />
            ))}
          </AnimatePresence>
          {keys.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 24px", color: "#475569" }}>
              <Key style={{ width: 32, height: 32, margin: "0 auto 12px", opacity: 0.4 }} />
              <p style={{ fontSize: 14 }}>No API keys yet. Generate your first key above.</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
