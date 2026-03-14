import { useApp } from '../context/AppContext';
import { PageType } from '../types';

export default function Sidebar() {
  const { currentPage, setCurrentPage } = useApp();

  const navItems: { page: PageType; icon: string; label: string; badge?: number; section: 'learn' | 'practice' }[] = [
    { page: 'dashboard', icon: '', label: 'Dashboard', section: 'learn' },
    { page: 'analysis', icon: '', label: 'Analytics', section: 'learn' },
    { page: 'glossary', icon: '', label: 'Glossary', section: 'learn' },
    { page: 'checklist', icon: '', label: 'Safety Checklist', section: 'learn' },
    { page: 'quiz', icon: '', label: 'Quiz Arena', section: 'practice' },
    { page: 'report', icon: '', label: 'Report Center', section: 'practice' },
    { page: 'simulator', icon: '', label: 'Simulator', section: 'practice' },
  ];

  return (
    <nav className="sidebar">
      <div className="logo">
        <div className="logo-brand">Trap<span>Eye</span></div>
        <div className="logo-sub">CyberShield Academy</div>
      </div>

      <div className="nav-section">Learn</div>
      {navItems.filter(item => item.section === 'learn').map(item => (
        <div
          key={item.page}
          className={`nav-item ${currentPage === item.page ? 'active' : ''}`}
          onClick={() => setCurrentPage(item.page)}
        >
          {item.label}
          {item.badge && <span className="nav-badge">{item.badge}</span>}
        </div>
      ))}

      <div className="nav-section">Practice</div>
      {navItems.filter(item => item.section === 'practice').map(item => (
        <div
          key={item.page}
          className={`nav-item ${currentPage === item.page ? 'active' : ''}`}
          onClick={() => setCurrentPage(item.page)}
        >
          {item.label}
        </div>
      ))}

      <div className="sidebar-bottom">
        <div className="threat-meter">
          <div className="threat-label blink">GLOBAL THREAT LEVEL</div>
          <div className="threat-bar-wrap">
            <div className="threat-bar"></div>
          </div>
          <div className="threat-val">ELEVATED · 62%</div>
        </div>
      </div>
    </nav>
  );
}
