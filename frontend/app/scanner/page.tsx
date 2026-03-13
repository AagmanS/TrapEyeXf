'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, ChevronDown, ChevronUp, Globe, Hash, ExternalLink, Info, ShieldAlert } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SectionHeader from '@/components/SectionHeader';
import { analyzeURL } from '@/lib/api';

interface AnalysisResult {
  url: string;
  risk_level: string;
  phishing_probability: number;
  reasons: string[];
  features: Record<string, any>;
  phishtank_listed: boolean;
  scan_time: string;
}

function FeatureRow({ label, value, good }: { label: string; value: any; good?: boolean }) {
  const isGood = good !== undefined ? good : typeof value === 'boolean' ? value : null;
  return (
    <div className="flex justify-between items-center py-[12px] border-b border-[#2D2D2D] last:border-0">
      <span className="font-ibm-mono text-[11px] text-[#888888] tracking-[1px]">{label}</span>
      <span className={`font-ibm-mono text-[11px] font-bold tracking-[1px] ${
        isGood === true ? 'text-[#8bfb25]' : isGood === false ? 'text-[#FF3366]' : 'text-[#F5F5F0]'
      }`}>
        {typeof value === 'boolean' ? (value ? 'YES' : 'NO') :
         Array.isArray(value) ? (value.length ? value.join(', ').toUpperCase() : 'NONE') :
         String(value).toUpperCase()}
      </span>
    </div>
  );
}

export default function ScannerPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showFeatures, setShowFeatures] = useState(false);

  const exampleURLs = [
    'https://secure-paypal-login.verify-account.tk/signin',
    'https://google.com',
    'https://amazon-security-alert.ml/update-payment',
    'https://github.com/openai/gpt-4',
  ];

  const handleScan = async (scanUrl?: string) => {
    const target = scanUrl || url;
    if (!target.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setShowFeatures(false);
    try {
      const data = await analyzeURL(target);
      setResult(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'ANALYSIS FAILED. CHECK SYSTEM CONNECTION.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[120px] min-h-screen pb-20">
      <Navbar />
      <div className="max-w-[1200px] w-full mx-auto px-6 md:px-[60px]">
        {/* Header */}
        <div className="mb-[48px]">
          <SectionHeader
            label="[01] // VECTOR ANALYSIS"
            title="URL PHISHING SCANNER"
            subtitle="SUBMIT SUSPICIOUS LINKS FOR HEURISTIC AND ML-BASED THREAT CLASSIFICATION."
          />
        </div>

        {/* Scanner Input */}
        <div className="flex flex-col p-[32px] bg-[#111111] border border-[#2D2D2D] w-full mb-[32px]">
          <span className="font-ibm-mono text-[11px] font-bold text-[#8bfb25] tracking-[2px] mb-6">[ TARGET URL ]</span>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Globe className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#555555]" />
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScan()}
                placeholder="https://example.com/login"
                className="w-full bg-[#050505] border border-[#2D2D2D] text-[#F5F5F0] font-ibm-mono text-[13px] tracking-[1px] pl-[48px] pr-[16px] py-[16px] focus:outline-none focus:border-[#8bfb25] transition-colors"
                spellCheck={false}
              />
            </div>
            <button
              onClick={() => handleScan()}
              disabled={loading || !url.trim()}
              className="flex items-center justify-center h-[54px] px-[32px] bg-[#8bfb25] hover:bg-[#aefc60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group w-full sm:w-auto"
            >
              {loading ? <Loader2 className="w-[18px] h-[18px] animate-spin text-[#0A0A0A] mr-2" /> : <Search className="w-[18px] h-[18px] text-[#0A0A0A] mr-2" />}
              <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
                {loading ? 'SCANNING...' : 'EXECUTE SCAN'}
              </span>
            </button>
          </div>

          {/* Examples */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3">
            <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px] uppercase flex items-center gap-2">
              <Info className="w-3 h-3" /> TEST VECTORS:
            </span>
            <div className="flex flex-wrap gap-2">
              {exampleURLs.map(u => (
                <button
                  key={u}
                  onClick={() => { setUrl(u); handleScan(u); }}
                  className="font-ibm-mono text-[10px] tracking-[1px] text-[#888888] bg-[#0A0A0A] border border-[#2D2D2D] px-[12px] py-[6px] hover:border-[#8bfb25] hover:text-[#8bfb25] transition-colors truncate max-w-[200px]"
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-[20px] bg-[#0A0A0A] border border-[#FF3366] text-[#FF3366] mb-[32px]">
              <ShieldAlert className="w-[18px] h-[18px]" />
              <span className="font-ibm-mono text-[11px] font-bold tracking-[1.5px]">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-[64px] bg-[#111111] border border-[#2D2D2D] mb-[32px] relative overflow-hidden">
              <rect className="absolute top-0 left-0 w-full h-[2px] bg-[rgba(139,251,37,0.5)] animate-scan" style={{ animation: "hero-scan 2s linear infinite" }} />
              <Loader2 className="w-[32px] h-[32px] text-[#8bfb25] animate-spin mb-6" />
              <span className="font-grotesk text-[18px] font-bold text-[#F5F5F0] tracking-[2px] mb-6">ANALYZING SIGNATURES...</span>
              <div className="flex flex-col gap-2">
                {['EXTRACTING FEATURES', 'RUNNING ML MODEL', 'CHECKING PHISHTANK', 'COMPUTING RISK SCORE'].map((step, i) => (
                  <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4 }} className="flex items-center gap-2 text-[#888888]">
                    <span className="font-ibm-mono text-[10px] font-bold text-[#8bfb25] tracking-[2px]">[0{i+1}]</span>
                    <span className="font-ibm-mono text-[10px] tracking-[1.5px]">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className={`flex flex-col p-[40px] mb-[16px] border-2 ${
                result.risk_level === 'CRITICAL' ? 'bg-[#110505] border-[#FF3366]' :
                result.risk_level === 'HIGH' ? 'bg-[#110A00] border-[#FFD600]' :
                result.risk_level === 'MEDIUM' ? 'bg-[#110A00] border-[#FFD600]' :
                'bg-[#051105] border-[#8bfb25]'
              }`}>
                <div className="flex items-center justify-between border-b border-[#2D2D2D] pb-[24px] mb-[24px]">
                   <span className="font-ibm-mono text-[11px] font-bold tracking-[2px]" style={{ color: result.risk_level === 'CRITICAL' ? '#FF3366' : result.risk_level === 'HIGH' ? '#FFD600' : '#8bfb25' }}>
                     [ SCAN COMPLETE ]
                   </span>
                   <span className="font-ibm-mono text-[10px] text-[#666666] tracking-[1.5px]">
                     {new Date(result.scan_time).toUTCString()}
                   </span>
                </div>

                <div className="flex flex-col lg:flex-row gap-[48px]">
                  {/* Score */}
                  <div className="flex flex-col shrink-0 items-center justify-center p-[32px] bg-[#0A0A0A] border border-[#2D2D2D] w-[200px] h-[200px] relative">
                    <span className="font-ibm-mono text-[10px] text-[#666] tracking-[2px] absolute top-[16px]">CONFIDENCE</span>
                    <span className="font-grotesk text-[64px] font-bold tracking-[-2px] leading-none" style={{ color: result.risk_level === 'CRITICAL' ? '#FF3366' : result.risk_level === 'HIGH' ? '#FFD600' : '#8bfb25' }}>
                      {Math.round(result.phishing_probability * 100)}<span className="text-[24px]">%</span>
                    </span>
                    <span className="font-ibm-mono text-[12px] font-bold tracking-[2px] mt-[16px]" style={{ color: result.risk_level === 'CRITICAL' ? '#FF3366' : result.risk_level === 'HIGH' ? '#FFD600' : '#8bfb25' }}>
                      {result.risk_level}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col gap-[20px] justify-center">
                    <div className="flex items-center gap-[12px]">
                      <span className="font-ibm-mono text-[10px] font-bold text-[#888888] tracking-[2px] px-[8px] py-[4px] bg-[#1A1A1A]">URL</span>
                      <a href={result.url} target="_blank" rel="noopener noreferrer" className="font-ibm-mono text-[13px] text-[#F5F5F0] break-all hover:text-[#8bfb25] hover:underline flex items-center gap-[8px]">
                        {result.url} <ExternalLink className="w-[12px] h-[12px] outline-none" />
                      </a>
                    </div>
                    
                    {result.phishtank_listed && (
                      <div className="flex items-center w-fit h-[24px] px-[12px] bg-[#0A0A0A] border border-[#FF3366]">
                        <span className="font-ibm-mono text-[9px] font-bold text-[#FF3366] tracking-[2px]">[ WARNING: PHISHTANK LISTED ]</span>
                      </div>
                    )}

                    <div className="mt-[8px]">
                      <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[2px] block mb-[12px]">DETECTION LOGS:</span>
                      {result.reasons.map((r, i) => (
                        <div key={i} className="flex items-start gap-[12px] mb-[8px]">
                           <span className="font-ibm-mono text-[10px] mt-[2px] font-bold tracking-[2px]" style={{ color: result.risk_level === 'CRITICAL' ? '#FF3366' : result.risk_level === 'HIGH' ? '#FFD600' : '#8bfb25' }}>
                             &gt;
                           </span>
                           <span className="font-ibm-mono text-[11px] text-[#AAAAAA] tracking-[1px] leading-[1.6] uppercase">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature breakdown */}
              <div className="flex flex-col border border-[#2D2D2D] bg-[#0F0F0F]">
                <button
                  onClick={() => setShowFeatures(!showFeatures)}
                  className="flex items-center justify-between w-full p-[24px] hover:bg-[#161616] transition-colors"
                >
                  <span className="font-grotesk text-[14px] font-bold text-[#F5F5F0] tracking-[2px] flex items-center gap-[12px]">
                    <Hash className="w-[16px] h-[16px] text-[#8bfb25]" /> RAW FEATURE EXTRACTS
                  </span>
                  {showFeatures ? <ChevronUp className="w-[16px] h-[16px] text-[#888888]" /> : <ChevronDown className="w-[16px] h-[16px] text-[#888888]" />}
                </button>

                <AnimatePresence>
                  {showFeatures && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="p-[32px] border-t border-[#2D2D2D] grid grid-cols-1 md:grid-cols-2 gap-x-[48px] bg-[#0A0A0A]">
                        <div>
                          <FeatureRow label="URL LENGTH" value={result.features.url_length} />
                          <FeatureRow label="DOT COUNT" value={result.features.num_dots} />
                          <FeatureRow label="SUBDOMAIN LEVELS" value={result.features.num_subdomains} />
                          <FeatureRow label="USES IP ADDRESS" value={result.features.has_ip} good={!result.features.has_ip} />
                          <FeatureRow label="HTTPS SECURED" value={result.features.has_https} good={result.features.has_https} />
                        </div>
                        <div>
                          <FeatureRow label="DOMAIN ENTROPY" value={result.features.domain_entropy} />
                          <FeatureRow label="SUSPICIOUS TLD" value={result.features.suspicious_tld} good={!result.features.suspicious_tld} />
                          <FeatureRow label="BRAND IMPERSONATION" value={result.features.impersonates_brand} good={!result.features.impersonates_brand} />
                          <FeatureRow label="PHISHING KEYWORDS" value={result.features.suspicious_keywords} good={!result.features.suspicious_keywords?.length} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
