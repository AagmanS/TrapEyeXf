'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Upload, Image as ImageIcon, Video, Loader2, AlertTriangle, Brain, Shield, Zap, Info, FileImage } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SectionHeader from '@/components/SectionHeader';
import { analyzeDeepfake } from '@/lib/api';

interface DeepfakeResult {
  filename: string;
  media_type: string;
  deepfake_probability: number;
  confidence_level: string;
  gemini_analysis: string;
  authenticity_score: number;
  frames_analyzed: number;
  scan_time: string;
}

export default function DeepfakePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeepfakeResult | null>(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length === 0) return;
    const f = accepted[0];
    setFile(f);
    setResult(null);
    setError('');
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [], 'image/png': [], 'image/webp': [],
      'video/mp4': [], 'video/webm': [], 'video/quicktime': [],
    },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeDeepfake(file);
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
            label="[03] // FORENSIC PLATFORM"
            title="DEEPFAKE DETECTOR"
            subtitle="UPLOAD MEDIA FOR HEURISTIC ARTIFACT SCANNING COMBINED WITH COMPUTER VISION TO VERIFY AUTHENTICITY."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-[24px]">
          {/* Upload area */}
          <div className="md:col-span-3 flex flex-col gap-[24px]">
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center p-[40px] border-2 cursor-pointer transition-all duration-300 min-h-[300px] 
              ${isDragActive ? 'border-[#FF3366] bg-[#110505]' : 'border-[#2D2D2D] bg-[#111111] hover:border-[#FF3366]'}`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="relative w-full h-[200px]">
                  <img src={preview} alt="PREVIEW" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-[#0A0A0A]/80 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="font-ibm-mono text-[11px] font-bold text-[#F5F5F0] tracking-[2px]">CLICK OR DRAG TO CHANGE FILE</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-[64px] h-[64px] mb-[24px] border border-[#FF3366] bg-[#FF3366]/10 flex items-center justify-center">
                    <Upload className="w-[24px] h-[24px] text-[#FF3366]" />
                  </div>
                  <span className="font-grotesk text-[16px] font-bold text-[#F5F5F0] tracking-[1.5px] mb-[8px] uppercase">
                    {isDragActive ? 'DROP PAYLOAD HERE' : 'DROP INTEGRITY CHECK PAYLOAD'}
                  </span>
                  <span className="font-ibm-mono text-[10px] text-[#666666] tracking-[2px] uppercase">
                    JPEG, PNG, WEBP, MP4, WEBM // MAX 50MB
                  </span>
                </div>
              )}
            </div>

            {file && !loading && !result && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-[16px] bg-[#1A1A1A] border border-[#2D2D2D] gap-[16px]">
                <div className="flex items-center gap-[12px] w-full min-w-0">
                  <div className="p-[8px] border border-[#FF3366] bg-[#110505] shrink-0">
                    {file.type.startsWith('video/') ? <Video className="w-[16px] h-[16px] text-[#FF3366]" /> : <ImageIcon className="w-[16px] h-[16px] text-[#FF3366]" />}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-ibm-mono text-[12px] text-[#F5F5F0] truncate w-full block">{file.name}</span>
                    <span className="font-ibm-mono text-[9px] text-[#888888] tracking-[1.5px]">{(file.size / 1024).toFixed(0)} KB // {file.type.toUpperCase()}</span>
                  </div>
                </div>
                <button
                  onClick={handleAnalyze}
                  className="flex items-center justify-center h-[40px] px-[24px] bg-[#FF3366] hover:bg-[#ff4d79] transition-colors shrink-0 w-full sm:w-auto"
                >
                  <span className="font-grotesk text-[11px] font-bold text-[#0A0A0A] tracking-[2px]">
                    ANALYZE MEDIA
                  </span>
                </button>
              </div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-[20px] bg-[#0A0A0A] border border-[#FF3366] text-[#FF3366] mt-[16px]">
                  <AlertTriangle className="w-[18px] h-[18px]" />
                  <span className="font-ibm-mono text-[11px] font-bold tracking-[1.5px]">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading */}
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-[40px] bg-[#111111] border border-[#2D2D2D] relative overflow-hidden h-[240px]">
                  <rect className="absolute top-0 left-0 w-full h-[2px] bg-[rgba(255,51,102,0.5)] animate-scan" style={{ animation: "hero-scan 2s linear infinite" }} />
                  <Loader2 className="w-[32px] h-[32px] text-[#FF3366] animate-spin mb-4" />
                  <span className="font-grotesk text-[16px] font-bold text-[#F5F5F0] tracking-[2px] mb-4">FORENSIC PROCESSING...</span>
                  <div className="flex flex-col gap-1 items-center">
                    {['EXTRACTING FRAMES', 'RUNNING DEEPFAKE MODEL', 'GEMINI VISION ANALYSIS', 'COMPUTING AUTHENTICITY SCORE'].map((step, i) => (
                      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4 }} className="flex items-center gap-2 text-[#888888]">
                        <span className="font-ibm-mono text-[10px] tracking-[1.5px] uppercase">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info sidebar */}
          <div className="md:col-span-2 flex flex-col gap-[24px]">
            <div className="flex flex-col p-[32px] border border-[#2D2D2D] bg-[#111111]">
              <span className="font-ibm-mono text-[11px] font-bold text-[#FF3366] tracking-[2px] flex items-center gap-2 mb-[24px]">
                <Zap className="w-[14px] h-[14px]" /> DETECTION METHODS
              </span>
              <div className="flex flex-col gap-[16px]">
                {[
                  { icon: Shield, label: 'HEURISTIC ANALYSIS', desc: 'JPEG QUALITY & COMPRESSION ARTIFACTS' },
                  { icon: Brain, label: 'GEMINI VISION', desc: 'FACIAL FEATURE & TEXTURE ANALYSIS' },
                  { icon: Eye, label: 'FORENSIC CHECKS', desc: 'LIGHTING INCONSISTENCY DETECTION' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-[16px] items-start">
                    <div className="w-[32px] h-[32px] border border-[#FF3366] bg-[#110505] flex items-center justify-center shrink-0">
                      <item.icon className="w-[14px] h-[14px] text-[#FF3366]" />
                    </div>
                    <div>
                      <span className="block font-grotesk text-[12px] font-bold text-[#F5F5F0] tracking-[1px] mb-[4px]">{item.label}</span>
                      <span className="block font-ibm-mono text-[9px] text-[#666666] tracking-[1px] leading-[1.4]">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex p-[24px] border border-[#FFD600] bg-[#FFD600]/5 items-start gap-[12px]">
              <Info className="w-[14px] h-[14px] text-[#FFD600] shrink-0 mt-[2px]" />
              <span className="font-ibm-mono text-[9px] text-[#FFD600] tracking-[1.5px] leading-[1.6]">
                DEEPFAKE DETECTION IS A RAPIDLY EVOLVING FIELD. RESULTS SHOULD BE TREATED AS PROBABILISTIC INDICATORS, NOT DEFINITIVE PROOF.
              </span>
            </div>
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-[24px] flex flex-col gap-[24px]">
              
              <div className="flex flex-col md:flex-row gap-[24px]">
                {/* Score Panel */}
                <div className={`flex flex-col p-[40px] border-2 flex-1 ${result.deepfake_probability > 0.7 ? 'border-[#FF3366] bg-[#110505]' : 'border-[#8bfb25] bg-[#0A110A]'}`}>
                  <span className="font-ibm-mono text-[11px] font-bold tracking-[2px] mb-[24px]" style={{ color: result.deepfake_probability > 0.7 ? '#FF3366' : '#8bfb25' }}>
                    [ ANALYSIS RESULT ]
                  </span>
                  
                  <div className="flex flex-col items-center justify-center flex-1 py-[24px]">
                    <span className="font-ibm-mono text-[10px] text-[#666666] tracking-[2px] mb-[8px]">AUTHENTICITY SCORE</span>
                    <span className="font-grotesk text-[80px] font-bold tracking-[-3px] leading-none mb-[16px]" style={{ color: result.deepfake_probability > 0.7 ? '#FF3366' : '#8bfb25' }}>
                      {result.authenticity_score}<span className="text-[32px]">%</span>
                    </span>
                    <div className="px-[12px] py-[4px] border border-[#2D2D2D] bg-[#0A0A0A]">
                      <span className="font-ibm-mono text-[10px] font-bold tracking-[2px]" style={{ color: result.deepfake_probability > 0.7 ? '#FF3366' : '#8bfb25' }}>
                        {result.confidence_level.toUpperCase()} CONFIDENCE
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-[16px] pt-[24px] border-t border-[#2D2D2D] mt-[24px]">
                    <div className="w-[32px] h-[32px] border border-[#2D2D2D] bg-[#111111] flex items-center justify-center shrink-0">
                      {result.media_type === 'video' ? <Video className="w-[14px] h-[14px] text-[#888888]" /> : <FileImage className="w-[14px] h-[14px] text-[#888888]" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-ibm-mono text-[11px] text-[#F5F5F0] truncate block w-[200px]">{result.filename}</span>
                      <span className="font-ibm-mono text-[9px] text-[#666666] tracking-[2px]">TYPE: {result.media_type.toUpperCase()} // FRAMES: {result.frames_analyzed}</span>
                    </div>
                  </div>
                </div>

                {/* Gemini Analysis */}
                <div className="flex flex-col p-[40px] border border-[#2D2D2D] bg-[#111111] flex-[2]">
                  <span className="font-ibm-mono text-[11px] font-bold text-[#FF3366] tracking-[2px] flex items-center gap-2 mb-[24px]">
                    <Brain className="w-[14px] h-[14px]" /> GEMINI VISION FORENSICS
                  </span>
                  <div className="border-l-2 border-[#FF3366] pl-[24px]">
                     <p className="font-ibm-mono text-[12px] text-[#F5F5F0] leading-[1.8] tracking-[0.5px] uppercase whitespace-pre-line">
                       {result.gemini_analysis}
                     </p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
