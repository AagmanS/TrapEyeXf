import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface Choice {
  text: string;
  nextNode: string;
}

interface ScenarioNode {
  id: string;
  narrative: string;
  illustration: string;
  choices: Choice[];
  hint?: string;
  technicalExplanation?: string;
  isEnd?: boolean;
  endType?: 'SAFE' | 'COMPROMISED' | 'RECOVERED';
  xpReward?: number;
  lesson?: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  nodes: Record<string, ScenarioNode>;
}

const scenarios: Record<string, Scenario> = {
  internship: {
    id: 'internship',
    title: 'The Dream Internship',
    description: 'A lucrative internship offer arrives on LinkedIn. Is it legitimate or a scam?',
    nodes: {
      '1': {
        id: '1',
        narrative: "You're a 2nd year CSE student scrolling through LinkedIn. A message pops up from 'TechGiant HR' offering a ₹25,000/month remote internship. They found your profile and want to hire you immediately—no interview needed!",
        illustration: '',
        choices: [
          { text: 'Reply enthusiastically and share your resume', nextNode: '2A' },
          { text: 'Check the company profile first', nextNode: '2B' },
          { text: 'Ignore it', nextNode: 'safe_end_1' }
        ],
        hint: 'Legitimate companies always have a proper hiring process',
        technicalExplanation: 'Scammers often create fake profiles on professional networks targeting students with too-good-to-be-true offers.'
      },
      '2A': {
        id: '2A',
        narrative: "You reply enthusiastically. They respond: 'Great! We need to process a background check first. Please pay a ₹1500 registration fee via UPI.'",
        illustration: '',
        choices: [
          { text: 'Pay via UPI to secure the internship', nextNode: '3A' },
          { text: 'Ask why a company charges candidates', nextNode: '3B' }
        ],
        hint: 'Real employers never ask candidates to pay for anything',
        technicalExplanation: 'Advance fee fraud is one of the most common scams. Once you pay, they will invent more fees.'
      },
      '2B': {
        id: '2B',
        narrative: "You investigate the company. Red flags everywhere: Company created 2 days ago, only 3 followers, employees use stock photos, no website, generic email (techgiant.hr@gmail.com instead of company domain).",
        illustration: '',
        choices: [
          { text: 'Proceed anyway—the offer is too good to pass up', nextNode: '3A' },
          { text: 'Report the profile and block', nextNode: 'safe_end_2' }
        ],
        hint: 'Trust your research. Legitimate companies have verifiable online presence.',
        technicalExplanation: 'Always verify company details on official registries like MCA (Ministry of Corporate Affairs) before engaging.'
      },
      '3A': {
        id: '3A',
        narrative: "You paid the ₹1500. They thank you and say: 'Perfect! Now we need ₹5000 more for equipment deposit. This will be refunded after 3 months.' Your bank balance is getting low.",
        illustration: '',
        choices: [
          { text: 'Pay again—you don\'t want to lose the opportunity', nextNode: 'compromised_end_1' },
          { text: 'Stop and report to cybercrime.gov.in', nextNode: 'recovered_end_1' }
        ],
        hint: 'Cut your losses. Report immediately.',
        technicalExplanation: 'This is escalation technique—they keep asking for more until you realize it\'s a scam or run out of money.'
      },
      '3B': {
        id: '3B',
        narrative: "You question the fee. Their tone changes dramatically: 'This is confidential. Don\'t tell anyone about this fee or the offer will be cancelled. Just pay quietly.'",
        illustration: '',
        choices: [
          { text: 'Realize it\'s a scam—report and block', nextNode: 'safe_end_3' },
          { text: 'Pay secretly as instructed', nextNode: 'compromised_end_2' }
        ],
        hint: 'Secrecy is a huge red flag. Legitimate businesses are transparent.',
        technicalExplanation: 'Scammers use isolation tactics to prevent victims from getting advice from others who might recognize the scam.'
      },
      'safe_end_1': {
        id: 'safe_end_1',
        narrative: "You ignored the message. Good instinct! Later that week, your college placement cell warns students about fake internship scams circulating on LinkedIn.",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'SAFE',
        xpReward: 150,
        lesson: 'Trust your instincts. If something seems too good to be true, it probably is. Always verify opportunities through official channels.'
      },
      'safe_end_2': {
        id: 'safe_end_2',
        narrative: "You reported the fake profile to LinkedIn and blocked them. Two weeks later, LinkedIn thanks you for helping protect the community. Your college placement cell later shares a legitimate internship opportunity worth ₹30,000/month!",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'SAFE',
        xpReward: 150,
        lesson: 'Verification protects you and others. Reporting scams helps platforms remove bad actors faster.'
      },
      'safe_end_3': {
        id: 'safe_end_3',
        narrative: "You recognized the secrecy demand as a major red flag. You reported the profile, blocked them, and warned your friends in the college WhatsApp group. Your quick thinking prevented others from falling victim!",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'SAFE',
        xpReward: 150,
        lesson: 'Secrecy requests are always suspicious. Legitimate opportunities don\'t require confidentiality about fees.'
      },
      'compromised_end_1': {
        id: 'compromised_end_1',
        narrative: "You paid ₹6500 total. They ghosted you. The LinkedIn profile disappeared. You check your bank account—₹6500 is gone. You feel sick. But there's still time to act.",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'COMPROMISED',
        xpReward: 30,
        lesson: 'IMMEDIATE ACTIONS:\n1. Call 1930 (Cyber Crime Helpline) NOW\n2. File complaint at cybercrime.gov.in\n3. Contact your bank to freeze transactions\n4. Save all screenshots as evidence\n5. Don\'t blame yourself—scammers are professionals'
      },
      'compromised_end_2': {
        id: 'compromised_end_2',
        narrative: "You paid secretly. They asked for even more. Finally you stopped. Total loss: ₹1500. The profile vanished. You learned an expensive lesson, but at least you stopped before losing more.",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'COMPROMISED',
        xpReward: 30,
        lesson: 'IMMEDIATE ACTIONS:\n1. Call 1930 immediately\n2. File FIR at cybercrime.gov.in\n3. Share your experience to warn others\n4. Never pay for job opportunities'
      },
      'recovered_end_1': {
        id: 'recovered_end_1',
        narrative: "You refused to pay more and immediately reported to cybercrime.gov.in. You also called your bank. Because you acted fast, they flagged the UPI ID and prevented further damage. You lost ₹1500 but protected yourself from更大的损失.",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'RECOVERED',
        xpReward: 80,
        lesson: 'Quick action minimized damage. Always report scams immediately—even if you can\'t recover money, you help prevent others from being scammed.'
      }
    }
  },
  otp: {
    id: 'otp',
    title: 'The OTP Call',
    description: 'A bank representative calls about a suspicious transaction. They need your OTP.',
    nodes: {
      '1': {
        id: '1',
        narrative: "You just paid ₹800 online for hostel food subscription. Minutes later, your phone rings: 'Hello, I'm calling from HDFC Bank Fraud Detection. We detected a suspicious transaction of ₹47,000 on your account. To protect your funds, please share the OTP we just sent you.'",
        illustration: '',
        choices: [
          { text: 'Share the OTP to verify and protect your account', nextNode: 'compromised_otp_1' },
          { text: 'Say you\'ll call back on the official bank number', nextNode: '2B' },
          { text: 'Hang up immediately', nextNode: 'safe_otp_1' }
        ],
        hint: 'Banks NEVER ask for OTP over the phone. Ever.',
        technicalExplanation: 'This is vishing (voice phishing). Scammers use spoofed caller IDs to appear legitimate and create urgency to bypass your critical thinking.'
      },
      '2B': {
        id: '2B',
        narrative: "You say you'll call the bank officially. Their voice becomes urgent and threatening: 'Sir/Ma'am, if you hang up, the fraud will complete within 2 minutes! Your entire savings will be gone! Just read me the OTP quickly!'",
        illustration: '',
        choices: [
          { text: 'Panic and share the OTP', nextNode: 'compromised_otp_2' },
          { text: 'Stay calm, hang up, call 1800 number on your card', nextNode: 'safe_otp_2' }
        ],
        hint: 'Pressure tactics mean it\'s a scam. Real banks stay professional.',
        technicalExplanation: 'Creating false urgency is a classic manipulation technique. Take control by ending the call and initiating contact yourself.'
      },
      'safe_otp_1': {
        id: 'safe_otp_1',
        narrative: "You hung up. Smart move! You immediately checked your bank app—no suspicious transactions. You called the official 1800 number on your debit card to report the attempt. The bank confirms: they never called you.",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'SAFE',
        xpReward: 150,
        lesson: 'Perfect response! Banks NEVER ask for OTP, PIN, or passwords over phone/email. Always initiate callbacks yourself using official numbers.'
      },
      'safe_otp_2': {
        id: 'safe_otp_2',
        narrative: "You stayed calm and hung up despite their threats. Called the 1800 number on your card. Bank confirms: NO suspicious transaction exists. This was a vishing attempt. They applaud your awareness!",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'SAFE',
        xpReward: 150,
        lesson: 'Excellent! Pressure + urgency = scam. Real bank employees remain professional and never threaten customers. You aced this test!'
      },
      'compromised_otp_1': {
        id: 'compromised_otp_1',
        narrative: "You shared the OTP. They thanked you and hung up. Within minutes, you receive multiple transaction alerts: ₹47,000 debited... ₹23,000 debited... Your entire account is drained. You feel numb.",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'COMPROMISED',
        xpReward: 30,
        lesson: 'CRITICAL ACTIONS NOW:\n1. Call 1930 IMMEDIATELY (fastest response)\n2. Email cybercrime.gov.in with transaction details\n3. Visit your bank branch with complaint\n4. Freeze all linked accounts\n5. Change all passwords from a clean device\nTime is critical—act within the hour!'
      },
      'compromised_otp_2': {
        id: 'compromised_otp_2',
        narrative: "You panicked and shared the OTP under pressure. Same result: account drained. The threat was fake—there was no real fraud attempt. You were manipulated into authorizing the fraud yourself.",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'COMPROMISED',
        xpReward: 30,
        lesson: 'EMERGENCY STEPS:\n1. Dial 1930 NOW\n2. File complaint at cybercrime.gov.in\n3. Contact bank fraud department\n4. Preserve call logs and SMS\n5. Learn: Banks NEVER ask for OTP'
      }
    }
  },
  whatsapp_qr: {
    id: 'whatsapp_qr',
    title: 'The WhatsApp QR',
    description: 'Free Swiggy vouchers in the college group! Scan now before midnight!',
    nodes: {
      '1': {
        id: '1',
        narrative: "Your college WhatsApp group explodes with messages: 'FREE ₹200 Swiggy voucher! Scan this QR code and claim before midnight! Already got mine!' 40 people have already forwarded it. The QR code image looks professional.",
        illustration: '',
        choices: [
          { text: 'Scan immediately—everyone else is doing it', nextNode: '2A' },
          { text: 'Google the offer first', nextNode: '2B' },
          { text: 'Ask who originally posted it', nextNode: '2C' }
        ],
        hint: 'Urgency + forwards = high scam probability',
        technicalExplanation: 'QR codes can hide malicious URLs. Scammers exploit FOMO (fear of missing out) and social proof ("everyone is doing it") to bypass skepticism.',
      },
      '2A': {
        id: '2A',
        narrative: "You scan the QR code. It opens a website that looks exactly like Swiggy: 'Congratulations! Enter your UPI ID and PIN to receive ₹200 instantly.' The design is perfect, URL is almost correct (swigy[.]in instead of swiggy.in).",
        illustration: '',
        choices: [
          { text: 'Enter UPI details to claim voucher', nextNode: 'compromised_qr_1' },
          { text: 'Close immediately—something feels wrong', nextNode: 'recovered_qr_1' }
        ],
        hint: 'Never enter credentials on pages opened via QR codes',
        technicalExplanation: 'This is credential harvesting. The fake site captures your UPI ID and PIN, then immediately drains your account. Always manually type official URLs.'
      },
      '2B': {
        id: '2B',
        narrative: "You Google 'Swiggy free voucher QR code'. Zero results from Swiggy's official Twitter, Instagram, or website. You search the exact message text—it's a known scam circulating since 2023!",
        illustration: '',
        choices: [
          { text: 'Proceed anyway—others already did it so it must work', nextNode: '2A' },
          { text: 'Warn the group and report to cybercrime.gov.in', nextNode: 'safe_qr_2' }
        ],
        hint: 'Absence of official confirmation = scam',
        technicalExplanation: 'Legitimate promotions are always announced on official channels. If brands have not posted about it, it is fake.',
      },
      '2C': {
        id: '2C',
        narrative: "You ask who posted it originally. Nobody knows—it's been forwarded 6 times. The chain is: Unknown → Person A → Person B → ... → Your group. Digital telephone game with a dangerous message.",
        illustration: '',
        choices: [
          { text: 'If nobody got scammed yet, it must be fine', nextNode: '2A' },
          { text: 'Suspicious—report the message', nextNode: 'safe_qr_3' }
        ],
        hint: 'Unverifiable origin = don\'t trust',
        technicalExplanation: 'Forwarded messages without clear origin are high-risk. Scammers rely on trust chains: you trust your friend, who trusts their friend, etc.'
      },
      'safe_qr_1': {
        id: 'safe_qr_1',
        narrative: "You closed the page without entering anything. Wise choice! You screenshot the QR and report it to Swiggy's official Twitter. They confirm: FAKE. They're investigating the impersonation.",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'RECOVERED',
        xpReward: 80,
        lesson: 'Good instincts! You avoided disaster. Always access rewards programs directly through official apps/websites, never via QR codes or links.'
      },
      'safe_qr_2': {
        id: 'safe_qr_2',
        narrative: "You posted in the group: 'GUYS THIS IS FAKE! Swiggy has no such offer. Don\'t scan!' You also reported to cybercrime.gov.in. Several students thank you—you prevented potential losses!",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'SAFE',
        xpReward: 150,
        lesson: 'Outstanding! You protected yourself AND your community. Always verify before forwarding, and speak up when you spot scams.'
      },
      'safe_qr_3': {
        id: 'safe_qr_3',
        narrative: "You reported the message as suspicious. Later, news breaks that this exact QR code was stealing UPI credentials across 15 colleges. Your caution potentially saved dozens of students!",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'SAFE',
        xpReward: 150,
        lesson: 'Perfect judgment! Unverifiable forwarded messages should always be treated as suspicious until proven otherwise.'
      },
      'compromised_qr_1': {
        id: 'compromised_qr_1',
        narrative: "You entered your UPI ID and PIN. Instantly: 'Transaction Failed. Try again.' Then again. On third try, you get alerts: ₹9,500 debited, ₹14,200 debited... The page was harvesting credentials, not giving vouchers.",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'COMPROMISED',
        xpReward: 30,
        lesson: 'EMERGENCY PROTOCOL:\n1. Call 1930 IMMEDIATELY\n2. Freeze UPI via your bank app\n3. File cybercrime.gov.in complaint\n4. Change UPI PIN immediately\n5. Screenshot everything as evidence\nAct within minutes, not hours!'
      },
      'recovered_qr_1': {
        id: 'recovered_qr_1',
        narrative: "Something felt off so you closed the page without entering details. No money lost! You reported the QR to your college IT cell. They issue an alert to all groups, preventing campus-wide scam.",
        illustration: '',
        choices: [],
        isEnd: true,
        endType: 'RECOVERED',
        xpReward: 80,
        lesson: 'Well done! Trusting your gut prevented loss. QR codes are safe for payments but NEVER for entering credentials.'
      }
    }
  }
};

export default function Simulator() {
  const { setCurrentPage, addXp } = useApp();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<string>('1');
  const [decisionPath, setDecisionPath] = useState<string[]>([]);
  const [threatLevel, setThreatLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [hintUsed, setHintUsed] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (!selectedScenario) return;
    
    const scenario = scenarios[selectedScenario];
    const node = scenario.nodes[currentNode];
    if (!node) return;

    setTypedText('');
    setIsTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(node.narrative.slice(0, index));
      index++;
      if (index > node.narrative.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [selectedScenario, currentNode]);

  const handleChoice = (nextNode: string) => {
    const scenario = scenarios[selectedScenario!];
    const node = scenario.nodes[nextNode];
    
    setDecisionPath([...decisionPath, currentNode]);
    setCurrentNode(nextNode);
    
    // Update threat level based on choice quality
    if (nextNode.includes('compromised')) {
      setThreatLevel(prev => Math.min(prev + 25, 100));
    } else if (nextNode.includes('safe')) {
      setThreatLevel(0);
    }

    // Award XP if end node
    if (node.isEnd && node.xpReward) {
      const finalXP = hintUsed ? node.xpReward - 20 : node.xpReward;
      setXp(finalXP);
      addXp(finalXP);
    }
  };

  const resetScenario = () => {
    setCurrentNode('1');
    setDecisionPath([]);
    setThreatLevel(0);
    setXp(0);
    setShowHint(false);
    setShowTechnical(false);
  };

  const selectScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    resetScenario();
  };

  const exitSimulator = () => {
    setSelectedScenario(null);
    resetScenario();
  };

  // Scenario selection screen
  if (!selectedScenario) {
    return (
      <div className="page">
        <div className="topbar">
          <div className="page-title">Scenario <span>Simulator</span></div>
          <div className="topbar-right">
            <button 
              className="quiz-restart"
              onClick={() => setCurrentPage('dashboard')}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            Choose Your Scenario
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '32px' }}>
            Experience realistic scam situations and learn to make safe choices. Each scenario takes 3-5 minutes.
          </p>

          <div className="three-col" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {Object.values(scenarios).map(scenario => (
              <div 
                key={scenario.id}
                className="panel"
                onClick={() => selectScenario(scenario.id)}
                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'rgba(0, 200, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center', color: 'var(--cyan)' }}>⬢</div>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  {scenario.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6' }}>
                  {scenario.description}
                </p>
                <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--cyan)', fontFamily: "'JetBrains Mono', monospace" }}>
                  Click to start →
                </div>
              </div>
            ))}
          </div>

          <div className="panel" style={{ marginTop: '32px' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              ◈ How It Works
            </h3>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--muted)', lineHeight: '1.8' }}>
              <li>Read each scenario carefully and make choices</li>
              <li>Your decisions determine the outcome (Safe/Compromised/Recovered)</li>
              <li>Earn XP for good decisions, learn from mistakes</li>
              <li>Use hints if stuck (-20 XP penalty)</li>
              <li>Check technical explanations to understand the scam mechanics</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Active scenario screen
  const scenario = scenarios[selectedScenario];
  const node = scenario.nodes[currentNode];

  if (!node) return null;

  const shareResult = () => {
    const result = node.endType || 'IN_PROGRESS';
    const text = `I completed the '${scenario.title}' simulation on TrapEye CyberShield! Result: ${result} #TrapEye #CyberAwareness`;
    navigator.clipboard.writeText(text);
    alert('Result copied to clipboard!');
  };

  return (
    <div className="page">
      {/* Progress Breadcrumb */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        {['1', ...decisionPath].map((step, idx) => (
          <div 
            key={idx}
            style={{
              padding: '6px 12px',
              background: idx === decisionPath.length ? 'var(--cyan)' : 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontSize: '12px',
              fontFamily: "'JetBrains Mono', monospace",
              color: idx === decisionPath.length ? 'var(--bg)' : 'var(--muted)'
            }}
          >
            Node {step}
          </div>
        ))}
      </div>

      <div className="two-col" style={{ gap: '24px' }}>
        {/* Story Panel (Left ~60%) */}
        <div className="panel" style={{ position: 'relative' }}>
          <div style={{ fontSize: '64px', textAlign: 'center', marginBottom: '20px' }}>
            {node.illustration}
          </div>
          
          <div 
            style={{ 
              minHeight: '200px', 
              fontSize: '15px', 
              lineHeight: '1.7',
              marginBottom: '24px',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {typedText}
            {isTyping && <span className="blink">▋</span>}
          </div>

          {!node.isEnd && !isTyping && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {node.choices.map((choice, idx) => (
                <button
                  key={idx}
                  className="quiz-option"
                  onClick={() => handleChoice(choice.nextNode)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleChoice(choice.nextNode);
                    }
                  }}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}

          {node.isEnd && (
            <div className={`score-panel show quiz-question`} style={{ padding: '32px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>{node.illustration}</div>
              <div className="score-num" style={{ 
                color: node.endType === 'SAFE' ? 'var(--green)' : 
                       node.endType === 'RECOVERED' ? 'var(--yellow)' : 'var(--red)',
                fontSize: '42px'
              }}>
                {node.endType === 'SAFE' ? 'SAFE!' : 
                 node.endType === 'RECOVERED' ? 'RECOVERED!' : 'COMPROMISED!'}
              </div>
              <div className="score-msg" style={{ whiteSpace: 'pre-wrap', marginBottom: '24px' }}>
                {node.lesson}
              </div>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button className="quiz-restart" onClick={resetScenario}>
                  ↺ Replay Scenario
                </button>
                <button className="quiz-restart" onClick={exitSimulator}>
                  Exit to Menu
                </button>
                <button className="quiz-next-btn show" onClick={shareResult}>
                  Share Result
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Context Panel (Right ~40%) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Threat Meter */}
          <div className="panel">
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
              THREAT-O-METER
            </div>
            <div style={{ 
              width: '100%', 
              height: '12px', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${threatLevel}%`,
                height: '100%',
                background: `linear-gradient(90deg, 
                  ${threatLevel < 30 ? 'var(--green)' : 
                    threatLevel < 60 ? 'var(--yellow)' : 'var(--red)'}, 
                  ${threatLevel < 30 ? 'var(--green)' : 'var(--red)'})`,
                transition: 'width 0.5s ease',
                borderRadius: '6px'
              }}></div>
            </div>
            <div style={{ 
              fontSize: '13px', 
              fontFamily: "'JetBrains Mono', monospace", 
              fontWeight: '700',
              color: threatLevel < 30 ? 'var(--green)' : 
                     threatLevel < 60 ? 'var(--yellow)' : 'var(--red)',
              marginTop: '6px'
            }}>
              {threatLevel < 30 ? 'LOW RISK' : 
               threatLevel < 60 ? 'MODERATE' : 'HIGH DANGER'}
            </div>
          </div>

          {/* Hint Button */}
          {!node.isEnd && (
            <div className="panel">
              <button
                className="quiz-next-btn show"
                onClick={() => {
                  setShowHint(!showHint);
                  if (!showHint) setHintUsed(true);
                }}
                style={{ width: '100%' }}
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              {showHint && node.hint && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '12px', 
                  background: 'rgba(255, 215, 0, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: 'var(--yellow)',
                  lineHeight: '1.6'
                }}>
                  {node.hint}
                </div>
              )}
            </div>
          )}

          {/* Technical Explanation */}
          {!node.isEnd && (
            <div className="panel">
              <button
                className="quiz-next-btn show"
                onClick={() => setShowTechnical(!showTechnical)}
                style={{ width: '100%', background: 'transparent', border: '1px solid var(--cyan)' }}
              >
                {showTechnical ? 'Hide Technical Details' : 'What\'s Happening Technically?'}
              </button>
              {showTechnical && node.technicalExplanation && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '12px', 
                  background: 'rgba(0, 200, 255, 0.05)',
                  border: '1px solid rgba(0, 200, 255, 0.2)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: 'var(--text)',
                  lineHeight: '1.6',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {node.technicalExplanation}
                </div>
              )}
            </div>
          )}

          {/* Character Info */}
          <div className="panel">
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
              Current Scenario
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
              {scenario.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Node {currentNode} of {Object.keys(scenario.nodes).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
