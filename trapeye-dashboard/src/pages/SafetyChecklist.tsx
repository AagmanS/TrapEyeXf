import { useApp } from '../context/AppContext';

const checklistData = {
  account: [
    'Enable 2FA on all email and social media accounts',
    'Use a password manager — never reuse passwords',
    'Check for breached accounts on haveibeenpwned.com',
    'Review app permissions on your Google/Apple account',
    'Enable login alerts for suspicious sign-ins',
  ],
  device: [
    'Keep OS and apps updated — don\'t delay security patches',
    'Install apps only from Play Store / App Store',
    'Set a screen lock (PIN, fingerprint, or pattern)',
    'Enable remote wipe on your phone',
    'Don\'t charge phone at public USB ports (juice jacking risk)',
  ],
  online: [
    'Verify email sender\'s full address before clicking links',
    'Don\'t share personal info in WhatsApp/Telegram groups',
    'Review privacy settings on Instagram, Facebook, Snapchat',
    'Use a VPN on public Wi-Fi (college canteen, library)',
    'Think before you post — location data in photos',
  ],
  finance: [
    'Never share OTP, CVV, or PIN with anyone',
    'Verify UPI payment receivers before sending money',
    'Set daily transaction limits on mobile banking apps',
    'Register mobile number for bank transaction alerts',
    'Check bank statements weekly for unauthorized transactions',
  ]
};

export default function SafetyChecklist() {
  const { checklistState, toggleChecklist } = useApp();

  const totalItems = Object.values(checklistData).reduce((acc, items) => acc + items.length, 0);
  const completedItems = Object.values(checklistState).filter(Boolean).length;

  return (
    <div className="page">
      <div className="topbar">
        <div className="page-title">Safety <span>Checklist</span></div>
      </div>

      <div className="two-col">
        <div>
          <div className="section-header">Account Security</div>
          <div id="checklist-account">
            {checklistData.account.map((item, idx) => {
              const key = `account-${idx}`;
              return (
                <div 
                  key={key} 
                  className={`checklist-item ${checklistState[key] ? 'checked' : ''}`}
                  onClick={() => toggleChecklist(key)}
                >
                  <div className="check-box">{checklistState[key] ? '■' : '□'}</div>
                  <div className="check-text">{item}</div>
                </div>
              );
            })}
          </div>
          
          <div className="section-header" style={{ marginTop: '20px' }}>Device Safety</div>
          <div id="checklist-device">
            {checklistData.device.map((item, idx) => {
              const key = `device-${idx}`;
              return (
                <div 
                  key={key} 
                  className={`checklist-item ${checklistState[key] ? 'checked' : ''}`}
                  onClick={() => toggleChecklist(key)}
                >
                  <div className="check-box">{checklistState[key] ? '■' : '□'}</div>
                  <div className="check-text">{item}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div>
          <div className="section-header">Online Behaviour</div>
          <div id="checklist-online">
            {checklistData.online.map((item, idx) => {
              const key = `online-${idx}`;
              return (
                <div 
                  key={key} 
                  className={`checklist-item ${checklistState[key] ? 'checked' : ''}`}
                  onClick={() => toggleChecklist(key)}
                >
                  <div className="check-box">{checklistState[key] ? '■' : '□'}</div>
                  <div className="check-text">{item}</div>
                </div>
              );
            })}
          </div>
          
          <div className="section-header" style={{ marginTop: '20px' }}>Financial Safety</div>
          <div id="checklist-finance">
            {checklistData.finance.map((item, idx) => {
              const key = `finance-${idx}`;
              return (
                <div 
                  key={key} 
                  className={`checklist-item ${checklistState[key] ? 'checked' : ''}`}
                  onClick={() => toggleChecklist(key)}
                >
                  <div className="check-box">{checklistState[key] ? '■' : '□'}</div>
                  <div className="check-text">{item}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
