import { ReportAuthority } from '../types';

const reportAuthorities: ReportAuthority[] = [
  {
    id: 1,
    icon: '⬢',
    title: 'National Cybercrime Portal',
    url: 'https://cybercrime.gov.in',
    description: 'Official Government of India portal. File complaints for financial fraud, child abuse, social media crimes, and all cybercrimes. Available 24/7.',
    actionType: 'website'
  },
  {
    id: 2,
    icon: '◈',
    title: 'Cyber Crime Helpline',
    url: 'tel:1930',
    description: 'Call 1930 for immediate assistance with online financial frauds. Quick response team that can alert banks to freeze transactions.',
    actionType: 'call'
  },
  {
    id: 3,
    icon: '⬢',
    title: 'Reserve Bank of India',
    url: 'https://bankingombudsman.rbi.org.in',
    description: 'Report banking fraud, unauthorized transactions, UPI scams, and online payment frauds. RBI Ombudsman handles bank-related cybercrimes.',
    actionType: 'website'
  },
  {
    id: 4,
    icon: '◈',
    title: 'CERT-In',
    url: 'https://cert-in.org.in',
    email: 'incident@cert-in.org.in',
    description: 'Indian Computer Emergency Response Team. Report malware, phishing websites, data breaches, and critical infrastructure attacks.',
    actionType: 'website'
  },
  {
    id: 5,
    icon: '⬢',
    title: 'Local Cyber Police Cell',
    url: 'https://cybercrime.gov.in/Locateofficer.aspx',
    description: 'File FIR at your nearest cyber police station. Use the portal to locate your jurisdiction\'s cybercrime unit for in-person reporting.',
    actionType: 'website'
  },
  {
    id: 6,
    icon: '◈',
    title: 'Sanchar Saathi (DoT)',
    url: 'https://sancharsaathi.gov.in',
    phone: '1800-11-0420',
    description: 'Report mobile fraud, fake SIM cards, and telecom-related scams. Block stolen phones and report misuse of your phone number.',
    actionType: 'website'
  }
];

export default function ReportCenter() {
  const handleCardClick = (authority: ReportAuthority) => {
    if (authority.url.startsWith('tel:')) {
      window.location.href = authority.url;
    } else if (authority.actionType === 'website') {
      window.open(authority.url, '_blank', 'noopener,noreferrer');
    } else if (authority.email) {
      window.location.href = `mailto:${authority.email}`;
    }
  };

  return (
    <div className="page">
      <div className="topbar">
        <div className="page-title">Report <span>Center</span></div>
      </div>

      <div style={{ 
        background: 'rgba(255,51,102,0.07)', 
        border: '1px solid rgba(255,51,102,0.2)', 
        borderRadius: '12px', 
        padding: '16px 20px', 
        marginBottom: '24px', 
        display: 'flex', 
        gap: '12px', 
        alignItems: 'center' 
      }}>
        <span style={{ fontSize: '24px' }}>⚠</span>
        <div>
          <div style={{ fontWeight: '700', marginBottom: '2px' }}>Immediate Danger?</div>
          <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
            If you've been scammed or face cyber threat, dial <strong style={{ color: 'var(--red)', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer' }} onClick={() => window.location.href = 'tel:1930'}>1930</strong> (National Cybercrime Helpline) immediately. Available 24×7.
          </div>
        </div>
      </div>

      <div className="section-header">Reporting Authorities — India</div>
      <div className="report-grid">
        {reportAuthorities.map(authority => (
          <div 
            key={authority.id} 
            className="report-card"
            onClick={() => handleCardClick(authority)}
            style={{ cursor: 'pointer' }}
            title={`Visit: ${authority.url}`}
          >
            <div className="report-icon">{authority.icon}</div>
            <div className="report-title">{authority.title}</div>
            <div className="report-url">{authority.url.replace('https://', '').replace('tel:', 'Call: ')}</div>
            <div className="report-desc">{authority.description}</div>
            {authority.actionType && (
              <div style={{ marginTop: '8px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--cyan)' }}>
                {authority.actionType === 'call' ? 'TEL Click to Call' : authority.actionType === 'email' ? 'EMAIL Send Email' : 'LINK Visit Website →'}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="section-header" style={{ marginTop: '24px' }}>Steps to Take After a Scam</div>
      <div className="two-col">
        <div className="panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: 'rgba(0,200,255,0.15)', 
                color: 'var(--cyan)', 
                borderRadius: '50%', 
                width: '28px', 
                height: '28px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontFamily: "'JetBrains Mono', monospace", 
                fontWeight: '700', 
                fontSize: '13px', 
                flexShrink: '0' 
              }}>1</div>
              <div>
                <strong>Call 1930 immediately</strong>
                <br />
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Report financial fraud within the first hour for best chance of recovery
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: 'rgba(0,200,255,0.15)', 
                color: 'var(--cyan)', 
                borderRadius: '50%', 
                width: '28px', 
                height: '28px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontFamily: "'JetBrains Mono', monospace", 
                fontWeight: '700', 
                fontSize: '13px', 
                flexShrink: '0' 
              }}>2</div>
              <div>
                <strong>Change all passwords</strong>
                <br />
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Email, banking, and social media accounts — use a fresh device if possible
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: 'rgba(0,200,255,0.15)', 
                color: 'var(--cyan)', 
                borderRadius: '50%', 
                width: '28px', 
                height: '28px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontFamily: "'JetBrains Mono', monospace", 
                fontWeight: '700', 
                fontSize: '13px', 
                flexShrink: '0' 
              }}>3</div>
              <div>
                <strong>Screenshot everything</strong>
                <br />
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Preserve evidence: messages, transaction IDs, scammer profiles
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: 'rgba(0,200,255,0.15)', 
                color: 'var(--cyan)', 
                borderRadius: '50%', 
                width: '28px', 
                height: '28px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontFamily: "'JetBrains Mono', monospace", 
                fontWeight: '700', 
                fontSize: '13px', 
                flexShrink: '0' 
              }}>4</div>
              <div>
                <strong>File on cybercrime.gov.in</strong>
                <br />
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Submit formal complaint with all collected evidence
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: 'rgba(0,255,157,0.15)', 
                color: 'var(--green)', 
                borderRadius: '50%', 
                width: '28px', 
                height: '28px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontFamily: "'JetBrains Mono', monospace", 
                fontWeight: '700', 
                fontSize: '13px', 
                flexShrink: '0' 
              }}>5</div>
              <div>
                <strong>Notify your bank</strong>
                <br />
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Request chargeback or transaction block; report card for reissuance
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: 'rgba(0,255,157,0.15)', 
                color: 'var(--green)', 
                borderRadius: '50%', 
                width: '28px', 
                height: '28px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontFamily: "'JetBrains Mono', monospace", 
                fontWeight: '700', 
                fontSize: '13px', 
                flexShrink: '0' 
              }}>6</div>
              <div>
                <strong>Run a malware scan</strong>
                <br />
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  If you installed anything suspicious, scan all devices immediately
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: 'rgba(0,255,157,0.15)', 
                color: 'var(--green)', 
                borderRadius: '50%', 
                width: '28px', 
                height: '28px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontFamily: "'JetBrains Mono', monospace", 
                fontWeight: '700', 
                fontSize: '13px', 
                flexShrink: '0' 
              }}>7</div>
              <div>
                <strong>Tell someone you trust</strong>
                <br />
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Scams cause stress — tell a friend, family, or counsellor
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: 'rgba(0,255,157,0.15)', 
                color: 'var(--green)', 
                borderRadius: '50%', 
                width: '28px', 
                height: '28px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontFamily: "'JetBrains Mono', monospace", 
                fontWeight: '700', 
                fontSize: '13px', 
                flexShrink: '0' 
              }}>8</div>
              <div>
                <strong>Warn others in your college group</strong>
                <br />
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Share scam details (without personal info) to protect peers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
