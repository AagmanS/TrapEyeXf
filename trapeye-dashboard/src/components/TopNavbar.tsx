import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { translations } from '../data/translations';

type Language = 'en' | 'hi' | 'kn';

export default function TopNavbar() {
  const { currentPage, setCurrentPage, currentLanguage, setLanguage } = useApp();
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const t = translations[currentLanguage];

  const navItems = [
    { page: 'dashboard', label: t.dashboard },
    { page: 'analysis', label: t.analysis },
    { page: 'simulator', label: t.simulator },
    { page: 'glossary', label: t.glossary },
    { page: 'checklist', label: t.checklist },
    { page: 'quiz', label: t.quiz },
    { page: 'report', label: t.report },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLangDropdown(false);
  };

  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <div className="brand-logo-icon-mini">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div className="brand-info-horizontal">
          <div className="logo-brand">TRAP<span className="highlight">EYE</span></div>
          <div className="logo-separator">|</div>
          <div className="logo-sub">CYBERSHIELD ACADEMY</div>
        </div>
      </div>

      <div className="navbar-center">
        {navItems.map(item => (
          <button
            key={item.page}
            className={`nav-item ${currentPage === item.page ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.page as any)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="navbar-right">
        {/* Threat Meter */}
        <div className="threat-meter-mini">
          <div className="threat-label-mini">THREAT LEVEL</div>
          <div className="threat-bar-wrap-mini">
            <div className="threat-bar-mini"></div>
          </div>
          <div className="threat-val-mini">62%</div>
        </div>


        {/* User Avatar */}
        <div className="avatar">S</div>

        {/* Language Switcher */}
        <div className="lang-switcher">
          <button 
            className="lang-btn"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
          >
            {currentLanguage.toUpperCase()}
          </button>
          {showLangDropdown && (
            <div className="lang-dropdown">
              <button 
                className={`lang-option ${currentLanguage === 'en' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                English
              </button>
              <button 
                className={`lang-option ${currentLanguage === 'hi' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('hi')}
              >
                हिंदी
              </button>
              <button 
                className={`lang-option ${currentLanguage === 'kn' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('kn')}
              >
                ಕನ್ನಡ
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
