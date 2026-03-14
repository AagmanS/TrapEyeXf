import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import './LandingPage.css';

interface LoginFormData {
  username: string;
  password: string;
}

export default function LandingPage() {
  const { setCurrentPage, currentLanguage, setLanguage, setIsAuthenticated } = useApp();
  const t = translations[currentLanguage];
  const [formData, setFormData] = useState<LoginFormData>({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // We don't check localStorage here anymore to satisfy "refresh = landing page"
    setIsLoading(false);

    // Intro animation timer for 3-4s fade-in sequence
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    localStorage.setItem('trapeye_user', JSON.stringify({
      username: formData.username,
      loginTime: new Date().toISOString()
    }));

    setIsLoggedIn(true);
  };

  const handleEnterDashboard = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  if (isLoading) {
    return (
      <div className="landing-page loading-screen">
        <div className="loader-ring"></div>
      </div>
    );
  }

  if (isLoggedIn) {
    const user = JSON.parse(localStorage.getItem('trapeye_user') || '{}');
    return (
      <div className="landing-page modern-dark">
        {showIntro && (
          <div className="intro-sequence modern-intro">
            <div className="intro-logo">TRAP<span className="accent-gold">EYE</span></div>
            <div className="intro-tagline loading-bar-container">
              <div className="loading-bar"></div>
            </div>
          </div>
        )}

        <section className="hero-section modern-hero center-hero">
          <div className="ornex-circle-glow"></div>
          
          <div className="sidebar-label">
            <div className="vertical-text">ADAPTIVE SECURITY .</div>
          </div>

          <div className="hero-container">
            <div className="hero-content centered fade-in-up">
              <div className="badge-pill">{t.welcomeBack}</div>
              <h1 className="hero-title oversize-text">
                {currentLanguage === 'en' ? 'READY TO EVOLVE,' : ''} <br/>
                <span className="accent-gold">{user.username?.toUpperCase()}</span>{currentLanguage !== 'en' ? '?' : '?'}
              </h1>
              
              <div className="panoramic-action">
                <div className="arrow-line"></div>
                <button 
                  className="ornex-btn hover-scale"
                  onClick={handleEnterDashboard}
                >
                  {t.enterDashboard}
                </button>
              </div>
            </div>
          </div>

        </section>
      </div>
    );
  }

  return (
    <div className="landing-page modern-dark">
      {/* Intro Animation Sequence (3-4s) */}
      {showIntro && (
        <div className="intro-sequence modern-intro">
          <div className="intro-logo-container">
            <div className="intro-logo reveal-text">TRAP<span className="accent-gold">EYE</span></div>
          </div>
          <div className="intro-tagline loading-bar-container">
            <div className="loading-bar"></div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="landing-nav glass-nav slide-down">
        <div className="nav-brand">
          <div className="brand-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <div className="brand-info-horizontal">
            <div className="logo-brand">TRAP<span className="accent-gold">EYE</span></div>
            <div className="logo-separator">|</div>
            <div className="logo-sub">CYBERSHIELD ACADEMY</div>
          </div>
        </div>
        <div className="nav-links">
        </div>
        <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="lang-switcher-landing">
            {['EN', 'HI', 'KN'].map((l) => (
              <button
                key={l}
                className={`lang-link-small ${currentLanguage === l.toLowerCase() ? 'active' : ''}`}
                onClick={() => setLanguage(l.toLowerCase() as any)}
              >
                {l}
              </button>
            ))}
          </div>
          <button className="btn-outline sleek-btn" onClick={() => setShowLoginModal(true)}>{t.studentLogin}</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section modern-hero">
        <div className="ornex-circle-glow"></div>
        <div className="grid-overlay"></div>
        
        <div className="sidebar-label">
          <div className="vertical-text">ADAPTIVE SECURITY .</div>
        </div>

        <div className="hero-container">
          <div className="hero-content centered fade-in-up">
            <div className="badge-pill fade-in-up delay-1">{t.cyberEdu}</div>
            <h1 className="hero-title oversize-text fade-in-up delay-2">
              CYBER DEFENSE<br />
              {t.evolvesDaily.split(' ')[0]} <span className="text-gradient">{t.evolvesDaily.split(' ')[1]}</span><br />
              {t.evolvesDaily.split(' ')[2] || ''}
            </h1>
            
            <div className="panoramic-action fade-in-up delay-4 mx-auto">
              <div className="arrow-line"></div>
              <button className="ornex-btn" onClick={() => setShowLoginModal(true)}>
                {t.getStarted}
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="login-modal-container slide-in-top" onClick={(e) => e.stopPropagation()}>
            <div className="login-card modern-glass-card hover-glow interaction-card">
              <button className="modal-close-btn" onClick={() => setShowLoginModal(false)}>×</button>
              <div className="card-header">
                <div className="icon-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <h2 className="login-title">{t.studentLogin}</h2>
              </div>
              <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-group sleek-input-group">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder={t.username}
                    autoComplete="username"
                    className="sleek-input"
                  />
                  <div className="input-focus-border"></div>
                </div>
                <div className="form-group sleek-input-group">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t.password}
                    autoComplete="current-password"
                    className="sleek-input"
                  />
                  <div className="input-focus-border"></div>
                </div>
                {error && <div className="error-message neon-error">{error}</div>}
                <button type="submit" className="login-button btn-primary w-full mt-4">
                  {t.accessDashboard}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

