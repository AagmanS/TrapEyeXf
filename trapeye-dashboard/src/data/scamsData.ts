import { Scam } from '../types';

export const scamsData: Scam[] = [
  {
    id: 1,
    title: 'University Phishing Email',
    description: 'Fake emails impersonating university admin demanding you "verify your account" or lose access.',
    category: 'phishing',
    severity: 'critical',
    tags: ['phishing', 'email', 'impersonation'],
    redFlags: [
      'Sender email doesn\'t match official domain',
      'Creates extreme urgency ("24 hours")',
      'Link URL doesn\'t match university site',
      'Asks for password directly'
    ],
    howToAvoid: [
      'Never click links — go directly to the site',
      'Verify with IT department directly',
      'Enable 2FA on your student account'
    ]
  },
  {
    id: 2,
    title: 'Fake Internship Offer',
    description: 'Too-good-to-be-true remote internships asking you to pay for "training kits" or share bank details for "salary setup".',
    category: 'job',
    severity: 'critical',
    tags: ['job', 'financial', 'social-eng'],
    redFlags: [
      'Hired without proper interview',
      'Company can\'t be found on LinkedIn',
      'Asks you to buy equipment first',
      'Payment via UPI to personal numbers'
    ],
    howToAvoid: [
      'Verify company on official websites',
      'Never pay to get a job',
      'Use official campus placement portals'
    ]
  },
  {
    id: 3,
    title: 'QR Code Payment Fraud',
    description: 'Malicious QR codes placed on canteen tables, hostel noticeboards that redirect to phishing payment pages.',
    category: 'financial',
    severity: 'high',
    tags: ['qr-code', 'upi', 'payment'],
    redFlags: [
      'QR code sticker pasted over original',
      'URL after scan looks odd',
      'Asks you to enter UPI PIN to "receive" money'
    ],
    howToAvoid: [
      'Always preview URL before opening',
      'Use QR scanner with link preview',
      'PIN is only needed to send, not receive'
    ]
  },
  {
    id: 4,
    title: 'Scholarship / Loan Scam',
    description: 'Fraudulent WhatsApp/Telegram messages offering government scholarships requiring registration fees or Aadhaar upload.',
    category: 'financial',
    severity: 'high',
    tags: ['scholarship', 'govt-impersonation', 'identity'],
    redFlags: [
      'Unofficial WhatsApp/Telegram source',
      'Requires upfront "processing fee"',
      'Asks for Aadhaar or bank OTP'
    ],
    howToAvoid: [
      'Check only NSP (scholarships.gov.in)',
      'Never share Aadhaar on unofficial platforms',
      'Real scholarships never ask for fees'
    ]
  },
  {
    id: 5,
    title: 'OTP / SIM Swap Fraud',
    description: 'Scammer calls pretending to be bank/telecom support, tricks you into sharing OTP to "prevent account deactivation".',
    category: 'social',
    severity: 'critical',
    tags: ['otp', 'sim-swap', 'vishing'],
    redFlags: [
      'Unexpected call about account issue',
      'Pressure to share OTP "within 2 minutes"',
      'Caller knows partial account details (social engineering)'
    ],
    howToAvoid: [
      'Banks NEVER ask for OTP via phone',
      'Hang up and call bank\'s official number',
      'Block SIM if you get deactivation SMSes'
    ]
  },
  {
    id: 6,
    title: 'Romance / Sextortion Scam',
    description: 'Fake profiles on dating apps / Instagram build emotional connection, then request money or threaten to leak intimate content.',
    category: 'social',
    severity: 'medium',
    tags: ['social-media', 'sextortion', 'blackmail'],
    redFlags: [
      'Profile photos look too perfect (AI-generated)',
      'Refuses video calls or makes excuses',
      'Sudden financial emergency after trust is built'
    ],
    howToAvoid: [
      'Reverse image search profile photos',
      'Never send money to online strangers',
      'Report sextortion to cybercrime.gov.in immediately'
    ]
  },
  {
    id: 7,
    title: 'Fake Banking / UPI App',
    description: 'APK files shared via WhatsApp mimicking BHIM, Google Pay, or popular banking apps that steal credentials.',
    category: 'phishing',
    severity: 'high',
    tags: ['malware', 'apk', 'credential-theft'],
    redFlags: [
      'Shared as APK, not via Play Store',
      'Asks for excessive permissions',
      'UI looks slightly different from original'
    ],
    howToAvoid: [
      'Only install apps from official stores',
      'Disable "install from unknown sources"',
      'Check app permissions before installing'
    ]
  },
  {
    id: 8,
    title: 'Lottery / Prize Scam',
    description: '"You\'ve won ₹50,000!" SMS/emails requiring you to pay taxes or fees first to claim non-existent prize money.',
    category: 'financial',
    severity: 'medium',
    tags: ['lottery', 'advance-fee', 'sms'],
    howToAvoid: [
      'You can\'t win a contest you didn\'t enter',
      'Real prizes never require upfront fees',
      'Ignore and delete such messages'
    ]
  },
  {
    id: 9,
    title: 'Cyber Stalking & Doxxing',
    description: 'Harassers collect publicly available personal information to intimidate, threaten, or expose victims online.',
    category: 'social',
    severity: 'medium',
    tags: ['privacy', 'harassment', 'social-media'],
    howToAvoid: [
      'Audit your social media privacy settings',
      'Never post real-time location',
      'Use a pseudonym on public forums',
      'Report to cybercrime.gov.in & NCRB'
    ]
  }
];
