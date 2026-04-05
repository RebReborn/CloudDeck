import React from 'react';
import { useCloudDeckStore } from '../../store/useCloudDeckStore';
import { 
  HardDrive, 
  Activity, 
  Database,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatBytes, cn } from '../../lib/utils';

export default function UsageStats() {
  const { usage } = useCloudDeckStore();

  if (!usage) return null;

  const stats = [
    { 
      label: 'Storage', 
      value: formatBytes(usage.storage.usage), 
      limit: formatBytes(usage.storage.limit),
      percent: (usage.storage.usage / usage.storage.limit) * 100,
      icon: HardDrive,
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/20'
    },
    { 
      label: 'Bandwidth', 
      value: formatBytes(usage.bandwidth.usage), 
      limit: formatBytes(usage.bandwidth.limit),
      percent: (usage.bandwidth.usage / usage.bandwidth.limit) * 100,
      icon: Activity,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20'
    },
    { 
      label: 'Assets', 
      value: (usage.objects?.usage || 0).toString(), 
      limit: (usage.objects?.limit || 0).toString(),
      percent: ((usage.objects?.usage || 0) / (usage.objects?.limit || 1)) * 100,
      icon: Database,
      color: 'from-purple-500 to-pink-600',
      shadow: 'shadow-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-8">
      {stats.map((stat, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={stat.label}
          className="group relative p-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] hover:bg-slate-900/60 transition-all duration-500 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg shrink-0 transition-transform group-hover:scale-110",
              stat.color,
              stat.shadow
            )}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-[10px] font-black text-white/40 uppercase tracking-widest">
               <TrendingUp className="w-3 h-3" />
               <span>Normal</span>
            </div>
          </div>

          <div className="space-y-1">
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label} Usage</p>
             <div className="flex items-end gap-2">
                <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
                <span className="text-xs font-bold text-white/20 mb-1.5">/ {stat.limit}</span>
             </div>
          </div>

          <div className="mt-6 space-y-2">
             <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={cn("h-full rounded-full transition-all duration-1000", stat.color.replace('from-', 'bg-'))}
                />
             </div>
             <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
                <span>{stat.percent.toFixed(1)}% Consumed</span>
                <span className="group-hover:text-white/60 transition-colors cursor-pointer flex items-center gap-1">Details <ArrowUpRight className="w-3 h-3" /></span>
             </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
