'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Loader2, AlertTriangle, Brain, Flag, Info, BarChart2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SectionHeader from '@/components/SectionHeader';
import { analyzeFakeNews } from '@/lib/api';

interface NewsResult {
  headline: string;
  credibility_score: number;
  fake_probability: number;
  ml_classification: string;
  gemini_reasoning: string;
  language_flags: string[];
  overall_verdict: string;
  scan_time: string;
}

const EXAMPLES = [
  {
    headline: 'Scientists confirm drinking lemon water cures cancer completely',
    text: 'SHOCKING new study reveals that doctors and pharmaceutical companies have been hiding a simple cure for all types of cancer for decades...',
    url: 'http://alternativehealth-blog.tk/cancer-cure-exposed',
  },
  {
    headline: 'Federal Reserve raises interest rates by 0.25% amid inflation concerns',
    text: 'The Federal Reserve announced a quarter-point interest rate increase on Wednesday, citing continued inflationary pressures in the economy.',
    url: 'https://reuters.com/markets/federal-reserve-rate-decision',
  },
];

export default function FakeNewsPage() {
  const [headline, setHeadline] = useState('');
  const [articleText, setArticleText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NewsResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!headline.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeFakeNews({ headline, article_text: articleText, source_url: sourceUrl });
      setResult(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'ANALYSIS FAILED. CHECK SYSTEM CONNECTION.');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setHeadline(ex.headline);
    setArticleText(ex.text);
    setSourceUrl(ex.url);
  };

  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[120px] min-h-screen pb-20">
      <Navbar />
      <div className="max-w-[1200px] w-full mx-auto px-6 md:px-[60px]">
        {/* Header */}
        <div className="mb-[48px]">
          <SectionHeader
            label="[02] // NLP ANALYSIS"
            title="FAKE NEWS DETECTOR"
            subtitle="HYBRID ML + GEMINI AI ANALYSIS OF NEWS ARTICLES FOR MISINFORMATION AND CREDIBILITY."
          />
        </div>

        {/* Input Card */}
        <div className="flex flex-col p-[32px] bg-[#111111] border border-[#2D2D2D] w-full mb-[32px]">
          <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px] mb-6">[ ARTICLE SUBMISSION ]</span>
          
          <div className="space-y-[16px]">
            <div>
              <label className="font-ibm-mono text-[10px] text-[#888888] tracking-[1.5px] block mb-[8px]">ARTICLE HEADLINE *</label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                placeholder="ENTER THE NEWS HEADLINE..."
                className="w-full bg-[#050505] border border-[#2D2D2D] text-[#F5F5F0] font-ibm-mono text-[13px] tracking-[1px] px-[16px] py-[16px] focus:outline-none focus:border-[#FFD600] transition-colors"
                spellCheck={false}
              />
            </div>
            <div>
              <label className="font-ibm-mono text-[10px] text-[#888888] tracking-[1.5px] block mb-[8px]">ARTICLE TEXT (OPTIONAL)</label>
              <textarea
                value={articleText}
                onChange={e => setArticleText(e.target.value)}
                placeholder="PASTE FULL CONTENT FOR DEEPER ANALYSIS..."
                rows={4}
                className="w-full bg-[#050505] border border-[#2D2D2D] text-[#F5F5F0] font-ibm-mono text-[13px] tracking-[1px] px-[16px] py-[16px] focus:outline-none focus:border-[#FFD600] transition-colors resize-none"
                spellCheck={false}
              />
            </div>
            <div>
              <label className="font-ibm-mono text-[10px] text-[#888888] tracking-[1.5px] block mb-[8px]">SOURCE URL (OPTIONAL)</label>
              <input
                type="text"
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                placeholder="HTTPS://SOURCE-WEBSITE.COM/ARTICLE"
                className="w-full bg-[#050505] border border-[#2D2D2D] text-[#F5F5F0] font-ibm-mono text-[13px] tracking-[1px] px-[16px] py-[16px] focus:outline-none focus:border-[#FFD600] transition-colors"
                spellCheck={false}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-[16px] pt-[24px]">
            <button
              onClick={handleAnalyze}
              disabled={loading || !headline.trim()}
              className="flex items-center justify-center h-[54px] px-[32px] bg-[#FFD600] hover:bg-[#ffe140] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group w-full sm:w-auto"
            >
              {loading ? <Loader2 className="w-[18px] h-[18px] animate-spin text-[#0A0A0A] mr-2" /> : <Brain className="w-[18px] h-[18px] text-[#0A0A0A] mr-2" />}
              <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
                {loading ? 'ANALYZING...' : 'RUN NLP MODEL'}
              </span>
            </button>
            <div className="flex flex-wrap gap-[8px] items-center">
              <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px] uppercase mr-2 flex items-center gap-2">
                <Info className="w-3 h-3" /> EXAMPLES:
              </span>
              {EXAMPLES.map((ex, i) => (
                <button key={i} onClick={() => loadExample(ex)}
                  className="font-ibm-mono text-[10px] tracking-[1px] text-[#888888] bg-[#0A0A0A] border border-[#2D2D2D] px-[12px] py-[8px] hover:border-[#FFD600] hover:text-[#FFD600] transition-colors uppercase">
                  EXAMPLE {i + 1}
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
              <AlertTriangle className="w-[18px] h-[18px]" />
              <span className="font-ibm-mono text-[11px] font-bold tracking-[1.5px]">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-[64px] bg-[#111111] border border-[#2D2D2D] mb-[32px] relative overflow-hidden">
              <rect className="absolute top-0 left-0 w-full h-[2px] bg-[rgba(255,214,0,0.5)] animate-scan" style={{ animation: "hero-scan 2s linear infinite" }} />
              <Brain className="w-[32px] h-[32px] text-[#FFD600] animate-pulse mb-6" />
              <span className="font-grotesk text-[18px] font-bold text-[#F5F5F0] tracking-[2px] mb-6">COMPUTING CREDIBILITY...</span>
              <div className="flex flex-col gap-2">
                {['RUNNING ML CLASSIFIER', 'DETECTING LANGUAGE PATTERNS', 'GEMINI AI REASONING', 'SCORING CREDIBILITY'].map((step, i) => (
                  <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4 }} className="flex items-center gap-2 text-[#888888]">
                    <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px]">[0{i+1}]</span>
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-[16px]">
              
              <div className={`flex flex-col md:flex-row gap-[16px] w-full items-stretch`}>
                {/* Score overview */}
                <div className={`flex flex-col flex-1 p-[40px] border-2 bg-[#0A0A0A] ${
                  result.credibility_score > 70 ? 'border-[#8bfb25]' : 
                  result.credibility_score > 40 ? 'border-[#FFD600]' : 'border-[#FF3366]'
                }`}>
                  <span className="font-ibm-mono text-[11px] font-bold tracking-[2px] mb-[24px]" style={{ color: result.credibility_score > 70 ? '#8bfb25' : result.credibility_score > 40 ? '#FFD600' : '#FF3366' }}>
                    [ OVERALL CREDIBILITY ]
                  </span>
                  
                  <div className="flex flex-col items-center justify-center flex-1">
                    <span className="font-grotesk text-[80px] font-bold tracking-[-3px] leading-none" style={{ color: result.credibility_score > 70 ? '#8bfb25' : result.credibility_score > 40 ? '#FFD600' : '#FF3366' }}>
                      {result.credibility_score}<span className="text-[32px]">%</span>
                    </span>
                    <span className="font-ibm-mono text-[12px] font-bold tracking-[2px] mt-[16px] text-[#F5F5F0]">
                      {result.overall_verdict.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="mt-[24px] pt-[24px] border-t border-[#2D2D2D] w-full text-center">
                    <span className="font-ibm-mono text-[11px] p-[8px] border border-[#2D2D2D] bg-[#111111] text-[#888888] uppercase">
                       ML CLASSIFICATION: {result.ml_classification}
                    </span>
                  </div>
                </div>

                {/* Info Block */}
                <div className="flex flex-col flex-[2] p-[40px] border border-[#2D2D2D] bg-[#111111] justify-center">
                  <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[2px] mb-[12px]">ANALYZED HEADLINE:</span>
                  <p className="font-grotesk text-[24px] text-[#F5F5F0] leading-[1.3] font-bold mb-[24px]">"{result.headline}"</p>
                  
                  {result.language_flags.length > 0 && (
                    <div className="mt-auto">
                      <span className="font-ibm-mono text-[11px] text-[#FFD600] font-bold tracking-[2px] mb-[12px] flex items-center gap-[8px]">
                        <Flag className="w-[14px] h-[14px]" /> RED FLAGS DETECTED
                      </span>
                      <div className="flex flex-col gap-[8px]">
                        {result.language_flags.map((flag, i) => (
                           <div key={i} className="flex items-start gap-[12px]">
                             <span className="font-ibm-mono text-[10px] mt-[3px] font-bold text-[#FFD600]">&gt;</span>
                             <span className="font-ibm-mono text-[11px] text-[#AAAAAA] tracking-[1px] uppercase">{flag}</span>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gemini Reasoning */}
              <div className="flex flex-col p-[40px] border border-[#2D2D2D] bg-[#0A0A0A]">
                <span className="font-ibm-mono text-[11px] font-bold text-[#4ADE80] tracking-[2px] mb-[24px] flex items-center gap-2">
                  <Brain className="w-[14px] h-[14px]" /> [ GEMINI AI INSIGHTS ]
                </span>
                <p className="font-ibm-mono text-[13px] text-[#F5F5F0] leading-[1.8] tracking-[0.5px] uppercase whitespace-pre-line border-l-2 border-[#4ADE80] pl-[24px]">
                  {result.gemini_reasoning}
                </p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Pipeline info when idle */}
        {!result && !loading && (
          <div className="flex flex-col p-[40px] border border-[#2D2D2D] bg-[#0A0A0A] mt-[16px]">
            <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px] mb-[32px] flex items-center gap-2">
              <BarChart2 className="w-[14px] h-[14px]" /> [ ANALYSIS PIPELINE ]
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
              {[
                { step: '01', title: 'ML MODEL', desc: 'TF-IDF + LOGISTIC REGRESSION' },
                { step: '02', title: 'NLP SCAN', desc: 'SENSATIONALISM DETECTION' },
                { step: '03', title: 'SOURCE', desc: 'REPUTATION API SCORING' },
                { step: '04', title: 'GEMINI AI', desc: 'MULTIMODAL REASONING' },
              ].map(item => (
                <div key={item.step} className="flex flex-col p-[24px] bg-[#111111] border border-[#2D2D2D]">
                  <span className="font-ibm-mono text-[11px] text-[#FFD600] font-bold tracking-[2px] mb-[12px]">{item.step}</span>
                  <span className="font-grotesk text-[14px] font-bold text-[#F5F5F0] tracking-[1px] mb-[8px] uppercase">{item.title}</span>
                  <span className="font-ibm-mono text-[10px] text-[#666666] tracking-[1px] leading-[1.6] uppercase">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
