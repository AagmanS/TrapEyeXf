'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, AlertTriangle, Monitor, Activity, Terminal, ChevronRight,
  Zap, RefreshCw, Layers, ShieldAlert, Cpu
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SectionHeader from '@/components/SectionHeader';

const THREATS = [
  { id: 'TRX-9901', name: 'MALICIOUS_PAYLOAD.EXE', type: 'MALWARE', severity: 'CRITICAL', time: '10:42 AM', status: 'CONTAINED', ip: '192.168.1.1' },
  { id: 'TRX-9904', name: 'PHISHING_INJECT.JS', type: 'SCRIPT', severity: 'HIGH', time: '11:15 AM', status: 'ANALYZING', ip: '45.72.11.230' },
  { id: 'TRX-9912', name: 'CREDENTIAL_STEALER.DLL', type: 'TROJAN', severity: 'CRITICAL', time: '12:05 PM', status: 'CONTAINED', ip: 'Unknown' },
  { id: 'TRX-9988', name: 'FAKE_UPDATE.ZIP', type: 'DROPPER', severity: 'MEDIUM', time: '01:30 PM', status: 'QUARANTINED', ip: '10.0.0.54' },
];

export default function SandboxPage() {
  const [activeThreat, setActiveThreat] = useState(THREATS[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulate progress
  useEffect(() => {
    let interval: any;
    if (analyzing) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setAnalyzing(false);
            return 100;
          }
          return p + Math.floor(Math.random() * 15);
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [analyzing, activeThreat]);

  const handleSelect = (threat: typeof THREATS[0]) => {
    if (activeThreat.id === threat.id) return;
    setActiveThreat(threat);
    setAnalyzing(true);
  };

  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[120px] min-h-screen pb-20">
      <Navbar />
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-[60px]">
        
        {/* Header */}
        <div className="mb-[48px]">
          <SectionHeader
            label="[05] // CONTAINMENT PROTOCOL"
            title="THREAT SANDBOX"
            subtitle="SECURE VIRTUALIZED ENVIRONMENT FOR ISOLATED THREAT EXECUTION AND ANALYSIS."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
          
          {/* Threats List Sidebar */}
          <div className="lg:col-span-4 flex flex-col border border-[#2D2D2D] bg-[#111111]">
            <div className="p-[24px] border-b border-[#2D2D2D] flex items-center justify-between">
              <span className="font-ibm-mono text-[11px] font-bold text-[#8bfb25] tracking-[2px] flex items-center gap-[12px]">
                <Layers className="w-[14px] h-[14px]" /> ISOLATED PAYLOADS
              </span>
              <Activity className="w-[14px] h-[14px] text-[#555555] animate-pulse" />
            </div>
            <div className="flex flex-col flex-1 max-h-[600px] overflow-y-auto">
              {THREATS.map((threat) => {
                const isActive = activeThreat.id === threat.id;
                const isCrit = threat.severity === 'CRITICAL';
                return (
                  <button
                    key={threat.id}
                    onClick={() => handleSelect(threat)}
                    className={`flex flex-col p-[24px] border-b border-[#2D2D2D] text-left transition-colors relative group
                      ${isActive ? 'bg-[#1A1A1A]' : 'hover:bg-[#161616]'}`}
                  >
                    {isActive && (
                      <motion.div layoutId="sandbox-sidebar-active" className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ background: isCrit ? '#FF3366' : '#8bfb25' }} />
                    )}
                    <div className="flex items-center justify-between mb-[12px]">
                      <span className="font-ibm-mono text-[9px] px-[6px] py-[2px] font-bold tracking-[1.5px]" style={{ 
                        color: isCrit ? '#FF3366' : '#FFD600', 
                        backgroundColor: isCrit ? 'rgba(255,51,102,0.1)' : 'rgba(255,214,0,0.1)' 
                      }}>
                        {threat.severity}
                      </span>
                      <span className="font-ibm-mono text-[9px] text-[#555555]">{threat.time}</span>
                    </div>
                    <span className="font-ibm-mono text-[12px] font-bold text-[#F5F5F0] truncate w-full mb-[6px]">{threat.name}</span>
                    <div className="flex items-center gap-[12px]">
                       <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[1px]">{threat.type}</span>
                       <span className="font-ibm-mono text-[10px] text-[#555555]">•</span>
                       <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[1px]">{threat.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sandbox Viewer Area */}
          <div className="lg:col-span-8 flex flex-col gap-[24px]">
            {/* Top Stats */}
            <div className="grid grid-cols-3 border border-[#2D2D2D] bg-[#111111]">
               {[
                 { label: 'ENVIRONMENT', val: 'Ubuntu 22.04 LTS (Isolated)', icon: Monitor },
                 { label: 'CPU KERNEL', val: 'TRX-Hyp V3.1.2', icon: Cpu },
                 { label: 'INTEGRITY', val: 'CONTAINMENT STABLE', icon: Shield, color: '#8bfb25' },
               ].map((st, i) => (
                 <div key={i} className={`flex flex-col p-[20px] ${i < 2 ? 'border-r border-[#2D2D2D]' : ''}`}>
                   <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px] mb-[12px] flex items-center gap-[8px]">
                     <st.icon className="w-[12px] h-[12px]" /> {st.label}
                   </span>
                   <span className="font-ibm-mono text-[11px] font-bold tracking-[1px]" style={{ color: st.color || '#F5F5F0' }}>
                     {st.val}
                   </span>
                 </div>
               ))}
            </div>

            {/* Sandbox Simulation Window */}
            <div className="flex flex-col border border-[#2D2D2D] bg-[#050505] min-h-[400px] relative overflow-hidden flex-1">
              {/* Window Header */}
              <div className="h-[40px] bg-[#111111] border-b border-[#2D2D2D] flex items-center px-[20px] justify-between z-10">
                 <div className="flex items-center gap-[8px]">
                   <div className="w-[10px] h-[10px] rounded-full bg-[#FF3366]" />
                   <div className="w-[10px] h-[10px] rounded-full bg-[#FFD600]" />
                   <div className="w-[10px] h-[10px] rounded-full bg-[#8bfb25]" />
                 </div>
                 <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[2px]">SANDBOX DISPLAY - {activeThreat.id}</span>
                 <div className="w-[30px]" /> {/* Spacer */}
              </div>

              {/* Console / Simulated VM state */}
              <div className="flex-1 p-[32px] relative z-0 flex flex-col justify-center items-center text-center">
                <AnimatePresence mode="wait">
                  {analyzing ? (
                    <motion.div 
                      key="analyzing"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center w-full max-w-[400px]"
                    >
                      <RefreshCw className="w-[32px] h-[32px] text-[#8bfb25] animate-spin mb-[32px]" />
                      <div className="w-full h-[2px] bg-[#1A1A1A] mb-[16px] relative overflow-hidden">
                        <motion.div className="absolute top-0 left-0 bottom-0 bg-[#8bfb25]" 
                                    initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: 'linear', duration: 0.3 }} />
                      </div>
                      <div className="flex items-center justify-between w-full font-ibm-mono text-[10px] tracking-[2px] text-[#888888]">
                         <span>REVERSE ENGINEERING PAYLOAD...</span>
                         <span className="text-[#8bfb25]">{progress}%</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center w-full"
                    >
                      <div className="w-[80px] h-[80px] border border-[#FF3366] bg-[#FF3366]/10 flex items-center justify-center mb-[32px] relative">
                         <ShieldAlert className="w-[32px] h-[32px] text-[#FF3366]" />
                         <span className="absolute -bottom-[20px] left-1/2 -translate-x-1/2 font-ibm-mono text-[10px] text-[#FF3366] tracking-[2px] font-bold whitespace-nowrap">
                           PAYLOAD ISOLATED
                         </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-[16px] w-full max-w-[500px] text-left">
                        <div className="flex flex-col p-[16px] border border-[#2D2D2D] bg-[#111111]">
                          <span className="font-ibm-mono text-[9px] text-[#555555] mb-[8px]">TARGET SIGNATURE</span>
                          <span className="font-ibm-mono text-[11px] text-[#F5F5F0] truncate" title={activeThreat.name}>{activeThreat.name}</span>
                        </div>
                        <div className="flex flex-col p-[16px] border border-[#2D2D2D] bg-[#111111]">
                          <span className="font-ibm-mono text-[9px] text-[#555555] mb-[8px]">CONNECTION ATTEMPT</span>
                          <span className="font-ibm-mono text-[11px] text-[#F5F5F0]">{activeThreat.ip}</span>
                        </div>
                        <div className="flex flex-col p-[16px] border border-[#2D2D2D] bg-[#111111] col-span-2">
                          <span className="font-ibm-mono text-[9px] text-[#555555] mb-[8px]">BEHAVIORAL HEURISTICS LOG</span>
                          <div className="flex flex-col gap-[8px] mt-[4px]">
                            <span className="font-ibm-mono text-[10px] text-[#888888]">&gt; Hooks established in Kernel space (BLOCKED)</span>
                            <span className="font-ibm-mono text-[10px] text-[#888888]">&gt; Attempting to spawn remote shell to C2 (BLOCKED)</span>
                            <span className="font-ibm-mono text-[10px] text-[#8bfb25]">&gt; Payload successfully terminated and logged.</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Cyber grid bg element */}
                <div className="absolute inset-0 z-[-1] opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#8bfb25 1px, transparent 1px), linear-gradient(90deg, #8bfb25 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
