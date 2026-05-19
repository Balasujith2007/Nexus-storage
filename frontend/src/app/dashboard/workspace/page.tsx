"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Globe, Server, Users, GitBranch } from "lucide-react";

export default function WorkspacePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-6 max-w-4xl"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-blue-400" />
          Workspace
        </h1>
        <p className="text-sm text-slate-400">Overview of your Nexus workspace, cluster membership, and team access.</p>
      </div>

      {/* Workspace Card */}
      <div className="bg-[#0A0F1C]/80 border border-white/8 rounded-2xl p-6 backdrop-blur-md shadow-lg">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Nexus Production</h2>
            <p className="text-sm text-slate-400 mt-0.5">US-East-1 · Production Environment</p>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Server,    label: "Nodes",       value: "8" },
            { icon: Globe,     label: "Regions",     value: "4" },
            { icon: Users,     label: "Team Members",value: "3" },
            { icon: GitBranch, label: "Environments", value: "2" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#030712]/60 border border-white/5 rounded-xl p-4 text-center">
              <stat.icon className="h-5 w-5 text-slate-400 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-[#0A0F1C]/80 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" /> Team Members
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { name: "Admin User", role: "Owner", initials: "JD", color: "from-cyan-500 to-blue-600" },
            { name: "Node Manager", role: "Editor", initials: "NM", color: "from-purple-500 to-blue-500" },
            { name: "Read-only Viewer", role: "Viewer", initials: "RV", color: "from-slate-500 to-slate-600" },
          ].map((member) => (
            <div key={member.name} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <div className={`h-9 w-9 rounded-full bg-gradient-to-tr ${member.color} p-[2px] shrink-0`}>
                <div className="h-full w-full rounded-full bg-[#030712] flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{member.initials}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200">{member.name}</p>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">{member.role}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
