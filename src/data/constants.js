import { Zap, Network, Monitor, Settings, Shield, AlertTriangle, HelpCircle, Wifi, Camera, Cpu, CheckCircle, Cloud, Search } from 'lucide-react';

export const IconMap = {
  power: Zap,
  network: Network,
  terminal: Monitor,
  settings: Settings,
  shield: Shield,
  alert: AlertTriangle,
  monitor: Monitor,
  search: Search,
  wifi: Wifi,
  camera: Camera,
  cpu: Cpu,
  success: CheckCircle,
  info: HelpCircle,
  cloud: Cloud
};

export const severityColors = {
  critical: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-red-500/20' },
  warning: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  info: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  success: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' }
};
