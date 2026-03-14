import { useApp } from '../context/AppContext';
import { StatCard } from '../types';
import { translations } from '../data/translations';

const statsData: StatCard[] = [
  { id: 1, icon: '', value: '$1.03T', label: 'Global scam losses 2024', color: 'cyan' },
  { id: 2, icon: '', value: '57%', label: 'Students targeted by internship scams', color: 'red' },
  { id: 3, icon: '', value: '<24h', label: 'Average scam completion time', color: 'orange' },
  { id: 4, icon: '', value: '4%', label: 'Victims who fully recover money', color: 'green' },
];

export default function Dashboard() {
  const { setCurrentPage, feedItems, currentLanguage } = useApp();
  const t = translations[currentLanguage];

  return (
    <div className="page active">
      <div className="topbar">
        <div>
          <div className="page-title">{t.heroTitle.split(' ')[0]} <span>{t.heroTitle.split(' ')[1]}</span></div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", marginTop: '4px' }}>
            {t.heroSub}
          </div>
        </div>
        <div className="topbar-right">
          <div className="avatar">S</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {statsData.map(stat => (
          <div key={stat.id} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-num">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        {/* Live Feed */}
        <div className="panel">
          <div className="section-header">{t.liveFeed}</div>
          <div className="live-feed">
            {feedItems.map(item => (
              <div key={item.id} className={`feed-item ${item.type}`}>
                <div className="feed-dot"></div>
                {item.message}
                <div className="feed-time">{item.timestamp}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Learn */}
        <div className="panel">
          <div className="section-header">{t.securityTip}</div>
          <div className="tip-box">
            <div className="tip-badge">TIP OF THE DAY</div>
            <div className="tip-content">
              Always verify the sender's full email address, not just the display name. Scammers often spoof display names like <strong className="text-orange"> "HR Dept"</strong> while the actual email is <span className="text-red-mono">hr.apply2024@gmail.ru</span>
            </div>
            <div className="tip-meta">Category: Email Phishing · Difficulty: Beginner</div>
          </div>
          <div className="section-header" style={{ fontSize: '14px', marginTop: '16px' }}>{t.progress}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{t.modulesCompleted}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--cyan)' }}>4/8</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '6px' }}>
              <div style={{ width: '50%', height: '6px', borderRadius: '4px', background: 'linear-gradient(90deg, var(--cyan), var(--green))' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{t.quizScoreAvg}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--green)' }}>78%</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '6px' }}>
              <div style={{ width: '78%', height: '6px', borderRadius: '4px', background: 'linear-gradient(90deg, var(--green), var(--cyan))' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="section-header">{t.quickActions}</div>
      <div className="three-col">
        <div className="panel interactive-panel" onClick={() => setCurrentPage('quiz')}>
          <div className="action-title">{t.takeQuiz}</div>
          <div className="action-desc">{t.takeQuizDesc}</div>
        </div>
        <div className="panel interactive-panel orange-hover" onClick={() => setCurrentPage('analysis')}>
          <div className="action-title">{t.analysis}</div>
          <div className="action-desc">{t.scamWatchDesc}</div>
        </div>
        <div className="panel interactive-panel green-hover" onClick={() => setCurrentPage('report')}>
          <div className="action-title">{t.report}</div>
          <div className="action-desc">{t.reportScamDesc}</div>
        </div>
      </div>
    </div>
  );
}
