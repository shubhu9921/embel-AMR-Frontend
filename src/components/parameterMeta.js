import { Cpu, Droplet, Flame, Zap, Sun } from "lucide-react";

export const parameterMeta = {
  Voltage: { icon: Cpu, color: "green" },
  Current: { icon: Cpu, color: "green" },
  "Power Factor": { icon: Zap, color: "green" },
  Frequency: { icon: Cpu, color: "green" },
  "System Uptime": { icon: Cpu, color: "green" },
  "Peak Demand": { icon: Zap, color: "green" },
  "Grid Stability": { icon: Zap, color: "green" },
  "Last Power Event": { icon: Cpu, color: "green" },
  "Total Energy": { icon: Zap, color: "green" },
  "Harmonics": { icon: Cpu, color: "green" },

  "Gas Pressure": { icon: Flame, color: "green" },
  "System Temperature": { icon: Flame, color: "green" },
  "Flow Velocity": { icon: Flame, color: "green" },
  "Calorific Value": { icon: Flame, color: "green" },
  "Gas Purity": { icon: Flame, color: "green" },
  "Supply Reliability": { icon: Flame, color: "green" },
  "Valve Position": { icon: Flame, color: "green" },
  "Last Inspection": { icon: Flame, color: "green" },

  Irradiance: { icon: Sun, color: "green" },
  "Panel Temp": { icon: Sun, color: "amber" },
  "System Efficiency": { icon: Sun, color: "green" },
  "Grid Feed": { icon: Sun, color: "green" },

  "System Pressure": { icon: Droplet, color: "green" },
  "Water Temperature": { icon: Droplet, color: "green" },
  "Flow Rate": { icon: Droplet, color: "green" },
  "pH Level": { icon: Droplet, color: "green" },
  Turbidity: { icon: Droplet, color: "green" },
  "Chlorine Level": { icon: Droplet, color: "green" },
  "Valve Status": { icon: Droplet, color: "green" },
  "Last Maintenance": { icon: Droplet, color: "green" },
  "Total Volume": { icon: Droplet, color: "green" },
};
