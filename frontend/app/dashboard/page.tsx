'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  LayoutDashboard, Shield, Newspaper, Eye, Activity,
  RefreshCw, AlertTriangle, TrendingUp, Globe, Brain,
  CheckCircle, Radio, Wifi
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SectionHeader from '@/components/SectionHeader';
import { getDashboardStats, getNewsFeed } from '@/lib/api';

// ── Custom Tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111111] border border-[#2D2D2D] p-[16px]">
      <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[1.5px] block mb-[8px]">{label}</span>
      {payload.map((p: any, i: number) => (
        <span key={i} className="font-ibm-mono text-[12px] font-bold tracking-[1px] block" style={{ color: p.color }}>
          {p.name.toUpperCase()}: {p.value}
        </span>
      ))}
    </div>
  );
};

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: any; sub?: string; color: string;
}) {
  return (
    <div className="flex flex-col p-[24px] bg-[#0A0A0A] border border-[#2D2D2D] transition-colors hover:border-[#8bfb25]">
      <div className="flex items-start justify-between mb-[16px]">
        <div className="w-[32px] h-[32px] border flex items-center justify-center shrink-0" style={{ borderColor: color, backgroundColor: `${color}15` }}>
          <Icon className="w-[14px] h-[14px]" style={{ color }} />
        </div>
        <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px] uppercase">{sub}</span>
      </div>
      <span className="font-grotesk text-[32px] font-bold tracking-[-1px] leading-none mb-[8px] text-[#F5F5F0]">
        {value}
      </span>
      <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[1px] uppercase">
        {label}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeCategory, setActiveCategory] = useState('general');
  const [newsLoading, setNewsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, newsData] = await Promise.allSettled([
        getDashboardStats(),
        getNewsFeed(activeCategory, 12),
      ]);
      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (newsData.status === 'fulfilled') setNews(newsData.value.articles || []);
      setLastUpdate(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const timer = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [fetchData]);

  const fetchNews = async (cat: string) => {
    setActiveCategory(cat);
    setNewsLoading(true);
    try {
      const data = await getNewsFeed(cat, 12);
      setNews(data.articles || []);
    } catch (e) { console.error(e); }
    finally { setNewsLoading(false); }
  };

  const PIE_DATA = stats ? [
    { name: 'PHISHING', value: stats.stats.phishing_detected, color: '#FF3366' },
    { name: 'FAKE NEWS', value: stats.stats.fake_news_detected, color: '#FFD600' },
    { name: 'DEEPFAKES', value: stats.stats.deepfakes_detected, color: '#8bfb25' },
  ] : [];

  const CATEGORIES = ['general', 'technology', 'business', 'health'];

  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[120px] min-h-screen pb-20">
      <Navbar />
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-[60px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-[48px] gap-[24px]">
          <SectionHeader
            label="[04] // LIVE METRICS"
            title="THREAT INTELLIGENCE DASHBOARD"
            subtitle={lastUpdate ? `LAST UPDATED: ${lastUpdate.toLocaleTimeString().toUpperCase()} // AUTO-REFRESH: 5 MIN` : 'CONNECTING TO SYSTEM...'}
            titleWidth="w-full max-w-[800px]"
          />
          <button onClick={fetchData}
            className="flex items-center justify-center h-[40px] px-[24px] bg-[#2D2D2D] hover:bg-[#8bfb25] hover:text-[#0A0A0A] transition-colors border max-w-[200px] border-[#2D2D2D] group text-[#888888]">
            <RefreshCw className={`w-[14px] h-[14px] mr-[8px] group-hover:text-[#0A0A0A] ${loading ? 'animate-spin' : ''}`} />
            <span className="font-ibm-mono text-[11px] font-bold tracking-[2px] group-hover:text-[#0A0A0A]">REFRESH</span>
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-[2px] mb-[24px]">
            <StatCard icon={Activity} label="TOTAL SCANS" value={stats.stats.total_scans.toLocaleString()} color="#8bfb25" sub="ALL TIME" />
            <StatCard icon={Shield} label="PHISHING FOUND" value={stats.stats.phishing_detected} color="#FF3366" sub="URL VECTORS" />
            <StatCard icon={Newspaper} label="FAKE NEWS" value={stats.stats.fake_news_detected} color="#FFD600" sub="ARTICLES" />
            <StatCard icon={Eye} label="DEEPFAKES" value={stats.stats.deepfakes_detected} color="#3399FF" sub="MEDIA SCANS" />
            <StatCard icon={Globe} label="NEWS MONITORED" value={stats.stats.news_monitored.toLocaleString()} color="#F5F5F0" sub="SOURCES" />
            <StatCard icon={TrendingUp} label="THREAT RATE" value={`${stats.stats.threat_score_avg}%`} color="#FF3366" sub="DETECTION AVG" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[2px] mb-[2px]">
          {/* Threat Timeline Chart */}
          {stats?.threat_timeline && (
            <div className="flex flex-col p-[40px] bg-[#111111] border border-[#2D2D2D] lg:col-span-2">
              <span className="font-ibm-mono text-[11px] font-bold text-[#8bfb25] tracking-[2px] mb-[32px] flex items-center gap-[12px]">
                <Activity className="w-[14px] h-[14px]" /> 7-DAY THREAT ACTIVITY
              </span>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.threat_timeline}>
                    <defs>
                      <linearGradient id="phishingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF3366" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FF3366" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="fakenewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFD600" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FFD600" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" vertical={false} />
                    <XAxis dataKey="date" stroke="#555555" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }} tickMargin={12} />
                    <YAxis stroke="#555555" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }} tickMargin={12} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8bfb25', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: '#888888', paddingTop: '20px' }} iconType="square" />
                    <Area type="monotone" dataKey="phishing" name="PHISHING" stroke="#FF3366" fill="url(#phishingGrad)" strokeWidth={2} activeDot={{ r: 6, fill: '#FF3366' }} />
                    <Area type="monotone" dataKey="fakenews" name="FAKE NEWS" stroke="#FFD600" fill="url(#fakenewsGrad)" strokeWidth={2} activeDot={{ r: 6, fill: '#FFD600' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Threat Distribution Pie */}
          {PIE_DATA.length > 0 && (
            <div className="flex flex-col p-[40px] bg-[#0A0A0A] border border-[#2D2D2D]">
              <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px] mb-[32px] flex items-center gap-[12px]">
                <Brain className="w-[14px] h-[14px]" /> THREAT DISTRIBUTION
              </span>
              <div className="h-[220px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={70} outerRadius={90} dataKey="value" stroke="none" paddingAngle={2}>
                      {PIE_DATA.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: '#888888' }} iconType="square" verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2px] mb-[24px]">
          {/* Recent Phishing */}
          {stats?.recent_phishing?.length > 0 && (
            <div className="flex flex-col p-[40px] bg-[#0A0A0A] border border-[#2D2D2D]">
              <span className="font-ibm-mono text-[11px] font-bold text-[#FF3366] tracking-[2px] mb-[24px] flex items-center gap-[12px]">
                <Shield className="w-[14px] h-[14px]" /> RECENT PHISHING VECTORS
              </span>
              <div className="flex flex-col gap-[8px]">
                {stats.recent_phishing.map((r: any, i: number) => (
                  <div key={i} className="flex items-center gap-[16px] p-[16px] bg-[#111111] border border-[#2D2D2D]">
                    <span className="font-ibm-mono text-[9px] px-[8px] py-[4px] font-bold" style={{ backgroundColor: '#FF336615', color: '#FF3366' }}>{r.risk_level}</span>
                    <span className="font-ibm-mono text-[11px] text-[#F5F5F0] flex-1 truncate">{r.url}</span>
                    <span className="font-ibm-mono text-[10px] text-[#FF3366] font-bold shrink-0">{r.probability?.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Fake News */}
          {stats?.recent_fakenews?.length > 0 && (
            <div className="flex flex-col p-[40px] bg-[#0A0A0A] border border-[#2D2D2D]">
              <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px] mb-[24px] flex items-center gap-[12px]">
                <Newspaper className="w-[14px] h-[14px]" /> RECENT FAKE NEWS ALERTS
              </span>
              <div className="flex flex-col gap-[8px]">
                {stats.recent_fakenews.map((r: any, i: number) => (
                  <div key={i} className="flex flex-col p-[16px] bg-[#111111] border border-[#2D2D2D] gap-[8px]">
                    <div className="flex items-center justify-between">
                      <span className="font-ibm-mono text-[9px] px-[8px] py-[4px] font-bold" style={{ backgroundColor: '#FFD60015', color: '#FFD600' }}>{r.verdict}</span>
                      <span className="font-ibm-mono text-[9px] text-[#888888] tracking-[1px]">{r.credibility?.toFixed(0)}% CREDIBLE</span>
                    </div>
                    <span className="font-ibm-mono text-[11px] text-[#F5F5F0] truncate leading-[1.6]">{r.headline}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Real-Time News Monitor */}
        <div className="flex flex-col p-[40px] bg-[#111111] border border-[#2D2D2D]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[24px] mb-[32px]">
            <span className="font-ibm-mono text-[11px] font-bold text-[#8bfb25] tracking-[2px] flex items-center gap-[12px]">
              <Radio className="w-[14px] h-[14px] animate-pulse" /> LIVE NEWS MONITOR
              <span className="px-[8px] py-[2px] border border-[#8bfb25] text-[#8bfb25] text-[9px]">LIVE</span>
            </span>
            {/* Category tabs */}
            <div className="flex flex-wrap gap-[8px]">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => fetchNews(cat)}
                  className={`px-[16px] py-[8px] font-ibm-mono text-[10px] font-bold tracking-[1.5px] uppercase transition-colors
                    ${activeCategory === cat
                      ? 'bg-[#8bfb25] text-[#0A0A0A]'
                      : 'bg-[#0A0A0A] border border-[#2D2D2D] text-[#888888] hover:border-[#8bfb25] hover:text-[#8bfb25]'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {newsLoading ? (
            <div className="flex justify-center py-[64px]">
              <RefreshCw className="w-[32px] h-[32px] text-[#8bfb25] animate-spin" />
            </div>
          ) : (
            <div className="overflow-auto border border-[#2D2D2D] bg-[#0A0A0A]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#2D2D2D] bg-[#111111]">
                    <th className="py-[16px] px-[24px] font-ibm-mono text-[10px] text-[#666666] tracking-[2px]">HEADLINE</th>
                    <th className="py-[16px] px-[24px] font-ibm-mono text-[10px] text-[#666666] tracking-[2px] hidden md:table-cell">SOURCE</th>
                    <th className="py-[16px] px-[24px] font-ibm-mono text-[10px] text-[#666666] tracking-[2px] text-right">CREDIBILITY</th>
                    <th className="py-[16px] px-[24px] font-ibm-mono text-[10px] text-[#666666] tracking-[2px] text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((article, i) => {
                    const score = article.credibility_score ?? 50;
                    const color = score >= 70 ? '#8bfb25' : score >= 40 ? '#FFD600' : '#FF3366';
                    return (
                      <motion.tr key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-[#2D2D2D] hover:bg-[#111111] transition-colors">
                        <td className="py-[20px] px-[24px] max-w-sm">
                          <span className="font-ibm-mono text-[12px] text-[#F5F5F0] leading-[1.6] line-clamp-2">{article.title}</span>
                        </td>
                        <td className="py-[20px] px-[24px] hidden md:table-cell">
                          <span className="font-ibm-mono text-[10px] text-[#888888] uppercase tracking-[1px]">{article.source_name}</span>
                        </td>
                        <td className="py-[20px] px-[24px] text-right">
                          <span className="font-ibm-mono text-[12px] font-bold" style={{ color }}>{score.toFixed(0)}%</span>
                        </td>
                        <td className="py-[20px] px-[24px]">
                          <div className="flex items-center justify-center">
                            {article.is_suspicious
                              ? <AlertTriangle className="w-[16px] h-[16px] text-[#FF3366]" />
                              : <CheckCircle className="w-[16px] h-[16px] text-[#8bfb25]" />
                            }
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              {news.length === 0 && (
                <div className="flex flex-col items-center justify-center py-[64px] text-[#555555]">
                  <Wifi className="w-[32px] h-[32px] mb-[16px] opacity-40" />
                  <span className="font-ibm-mono text-[11px] tracking-[2px] uppercase">CONNECT BACKEND TO LOAD LIVE NEWS</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
