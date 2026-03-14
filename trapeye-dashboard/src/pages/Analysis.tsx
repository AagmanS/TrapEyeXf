import { useState } from 'react';
import Chart from '../components/Chart';
import Globe from '../components/Globe';
import { scamsData } from '../data/scamsData';

interface RegionData {
  region: string;
  totalScams: number;
  topScamType: string;
  lossAmount: string;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

interface ScamTypeData {
  type: string;
  count: number;
  percentage: number;
  color: string;
  icon: string;
}

export default function Analysis() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  const [scamFilter, setScamFilter] = useState<'all' | 'phishing' | 'financial' | 'social' | 'job'>('all');
  const [expandedScam, setExpandedScam] = useState<number | null>(null);

  // Geographic distribution data
  const regionData: RegionData[] = [
    { region: 'Asia Pacific', totalScams: 2847000, topScamType: 'Phishing', lossAmount: '$412B', trend: 'up', percentage: 34.2 },
    { region: 'North America', totalScams: 1923000, topScamType: 'IRS/Tax Scams', lossAmount: '$523B', trend: 'up', percentage: 28.5 },
    { region: 'Europe', totalScams: 1456000, topScamType: 'Romance Scams', lossAmount: '$287B', trend: 'stable', percentage: 18.7 },
    { region: 'Latin America', totalScams: 892000, topScamType: 'WhatsApp Scams', lossAmount: '$98B', trend: 'up', percentage: 12.3 },
    { region: 'Africa', totalScams: 654000, topScamType: 'Business Email Compromise', lossAmount: '$67B', trend: 'up', percentage: 8.9 },
    { region: 'Middle East', totalScams: 423000, topScamType: 'Investment Scams', lossAmount: '$45B', trend: 'down', percentage: 5.4 },
  ];

  // Scam type breakdown
  const scamTypeData: ScamTypeData[] = [
    { type: 'Phishing', count: 1847293, percentage: 28.5, color: '#ff306e', icon: '' },
    { type: 'Investment Fraud', count: 1234567, percentage: 19.1, color: '#ff7038', icon: '' },
    { type: 'Online Shopping', count: 987654, percentage: 15.2, color: '#ffffff', icon: '' },
    { type: 'Romance Scams', count: 765432, percentage: 11.8, color: '#00c2ff', icon: '' },
    { type: 'Tech Support', count: 543210, percentage: 8.4, color: '#9370db', icon: '' },
    { type: 'Lottery/Sweepstakes', count: 432109, percentage: 6.7, color: 'var(--accent-gold)', icon: '' },
    { type: 'Identity Theft', count: 321098, percentage: 5.0, color: '#00c8ff', icon: '' },
    { type: 'Other', count: 345678, percentage: 5.3, color: '#708090', icon: '' },
  ];

  // Monthly trend data
  const trendDataMap: Record<string, { label: string; value: number }[]> = {
    '1M': [
      { label: 'Week 1', value: 450 },
      { label: 'Week 2', value: 520 },
      { label: 'Week 3', value: 480 },
      { label: 'Week 4', value: 610 }
    ],
    '3M': [
      { label: 'January', value: 1840 },
      { label: 'February', value: 2100 },
      { label: 'March', value: 1950 }
    ],
    '6M': [
      { label: 'Oct', value: 1500 },
      { label: 'Nov', value: 1750 },
      { label: 'Dec', value: 2200 },
      { label: 'Jan', value: 1840 },
      { label: 'Feb', value: 2100 },
      { label: 'Mar', value: 1950 }
    ],
    '1Y': [
      { label: 'Apr', value: 1200 },
      { label: 'May', value: 1350 },
      { label: 'Jun', value: 1500 },
      { label: 'Jul', value: 1420 },
      { label: 'Aug', value: 1600 },
      { label: 'Sep', value: 1550 },
      { label: 'Oct', value: 1700 },
      { label: 'Nov', value: 1900 },
      { label: 'Dec', value: 2400 },
      { label: 'Jan', value: 2100 },
      { label: 'Feb', value: 2300 },
      { label: 'Mar', value: 2540 }
    ]
  };

  const timeframeMultiplier = {
    '1M': 1,
    '3M': 2.8,
    '6M': 5.2,
    '1Y': 10.5
  };

  const m = timeframeMultiplier[selectedTimeframe];

  const filteredScams = scamFilter === 'all' 
    ? scamsData 
    : scamsData.filter(scam => scam.category === scamFilter);

  const toggleScam = (id: number) => {
    setExpandedScam(expandedScam === id ? null : id);
  };

  const getSeverityClass = (severity: string) => {
    switch(severity) {
      case 'critical': return 'sev-critical';
      case 'high': return 'sev-high';
      case 'medium': return 'sev-medium';
      default: return 'sev-medium';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return '▲';
      case 'down': return '▼';
      case 'stable': return '—';
      default: return '—';
    }
  };

  const getTrendColor = (trend: string) => {
    switch(trend) {
      case 'up': return '#ff3366';
      case 'down': return '#00ff9d';
      case 'stable': return 'var(--accent-gold)';
      default: return '#6b8aaa';
    }
  };

  return (
    <div className="page">
      <div className="topbar">
        <div className="page-title">Intelligence <span>Analysis</span></div>
        <div className="topbar-right">
          <div className="status-indicator">
            <span className="dot pulse" style={{ backgroundColor: 'var(--accent-gold)' }}></span>
            LIVE INTELLIGENCE FEED
          </div>
          <select 
            className="modern-select"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
          >
            <option value="1M">Last Month</option>
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
            <option value="1Y">Last Year</option>
          </select>
        </div>
      </div>

      {/* Hero Analytics Section */}
      <div className="panel globe-hero-panel" style={{ marginBottom: '32px', padding: '0', overflow: 'hidden', background: 'radial-gradient(circle at center, var(--accent-gold-dim) 0%, transparent 70%)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', minHeight: '500px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border)' }}>
             <Globe 
                data={[
                  { region: 'Asia', value: 34, color: '#ff306e' },
                  { region: 'NAmerica', value: 28, color: '#ff7038' },
                  { region: 'Europe', value: 19, color: '#ffffff' },
                  { region: 'SAmerica', value: 12, color: '#00c2ff' },
                  { region: 'Africa', value: 9, color: '#9370db' }
                ]}
                size={450}
                animated={true}
             />
             <div className="globe-overlay-top">GLOBAL THREAT MAP v4.2</div>
             <div className="globe-overlay-bottom">REAL-TIME TELEMETRY ACTIVE</div>
          </div>
          
          <div style={{ padding: '40px' }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-gold)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '8px' }}>CORE ANALYSIS</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Global Threat Landscape</h2>
            
            <div className="analytics-stats-list">
              <div className="stat-row">
                <div className="stat-row-label">Critical Vulnerabilities</div>
                <div className="stat-row-value red">{Math.floor(1248 * m).toLocaleString()}</div>
              </div>
              <div className="stat-row">
                <div className="stat-row-label">Active Phishing Clusters</div>
                <div className="stat-row-value orange">{Math.floor(3892 * m).toLocaleString()}</div>
              </div>
              <div className="stat-row">
                <div className="stat-row-label">Detected AI Vishing (Voice)</div>
                <div className="stat-row-value" style={{ color: 'var(--accent-gold)' }}>{(157 * (m > 1 ? 1.2 : 1)).toFixed(0)}% <span style={{ fontSize: '10px' }}>UP</span></div>
              </div>
              <div className="stat-row">
                <div className="stat-row-label">Mean Time to Detection</div>
                <div className="stat-row-value" style={{ color: 'var(--accent-gold)' }}>{ (4.2 / (m > 1 ? 1.1 : 1)).toFixed(1) } min</div>
              </div>
            </div>

            <div style={{ marginTop: '32px', padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '11px', color: 'var(--accent-gold)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '8px' }}>INTELLIGENCE SUMMARY</div>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6' }}>
                The {selectedTimeframe.replace('1M', 'last month').replace('3M', 'last quarter').replace('6M', 'last 6 months').replace('1Y', 'full year')} shows a 
                <span style={{ color: 'var(--red)' }}> {Math.floor(12 + m)}% increase</span> in automated credential harvesting. Threat actors are pivoting towards 
                <span style={{ color: 'var(--accent-gold)' }}> AI-driven voice manipulation</span> targeting student housing departments.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="two-col" style={{ marginBottom: '32px' }}>
        <div className="panel">
          <div className="section-header" style={{ border: 'none', marginBottom: '16px' }}>Threat Volume Trend ({selectedTimeframe})</div>
          <Chart
            type="bar"
            data={trendDataMap[selectedTimeframe]}
            colors={['var(--accent-gold)']}
            height={200}
          />
        </div>
        <div className="panel">
          <div className="section-header" style={{ border: 'none', marginBottom: '16px' }}>Threat Distribution by Class</div>
          <Chart
            type="doughnut"
            data={scamTypeData.slice(0, 4).map(scam => ({
              label: scam.type,
              value: scam.percentage,
              percentage: scam.percentage,
              color: scam.color
            }))}
            colors={['#ff306e', '#ff7038', '#ffffff', '#00c2ff']}
            height={200}
          />
        </div>
      </div>

      <div className="section-header">Live Scam Registry</div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-start' }}>
        <select 
          className="modern-select"
          value={scamFilter}
          onChange={(e) => setScamFilter(e.target.value as any)}
          style={{ width: '200px' }}
        >
          <option value="all">All Categories</option>
          <option value="phishing">Phishing</option>
          <option value="financial">Financial</option>
          <option value="social">Social Engineering</option>
          <option value="job">Job Scams</option>
        </select>
      </div>

      <div className="scam-grid" style={{ marginBottom: '40px' }}>
        {filteredScams.map(scam => (
          <div 
            key={scam.id} 
            className={`scam-card ${expandedScam === scam.id ? 'open' : ''}`}
            onClick={() => toggleScam(scam.id)}
            style={expandedScam === scam.id ? { borderColor: 'var(--accent-gold)' } : {}}
          >
            <div className={`scam-severity ${getSeverityClass(scam.severity)}`}>
              {scam.severity.toUpperCase()}
            </div>
            <div className="scam-title">{scam.title}</div>
            <div className="scam-desc">{scam.description}</div>
            <div className="scam-tags">
              {scam.tags.map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
            </div>
            {(scam.redFlags || scam.howToAvoid) && (
              <div className="scam-expand">
                {scam.redFlags && (
                  <div className="expand-section">
                    <div className="expand-title" style={{ color: 'var(--accent-gold)' }}>Red Flags</div>
                    <ul className="expand-list">
                      {scam.redFlags.map((flag, idx) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {scam.howToAvoid && (
                  <div className="expand-section">
                    <div className="expand-title" style={{ color: 'var(--accent-gold)' }}>How to Avoid</div>
                    <ul className="expand-list">
                      {scam.howToAvoid.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="section-header">Regional Intelligence Reports</div>
      <div className="panel" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {regionData.map((region, idx) => (
            <div key={idx} className="intel-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{region.region.toUpperCase()}</span>
                <span style={{ color: getTrendColor(region.trend), fontSize: '12px' }}>{getTrendIcon(region.trend)} {region.trend.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-gold)', marginBottom: '4px' }}>{region.lossAmount}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '12px' }}>ESTIMATED LOSSES</div>
              <div style={{ fontSize: '13px', color: 'var(--text)' }}>Primary Vector: <span style={{ color: '#ff6b35' }}>{region.topScamType}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
