import { QuizQuestion } from '../types';

export const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: 'What does "phishing" mean in cybersecurity?',
    options: [
      'Catching fish in a network',
      'Fraudulently obtaining sensitive info by impersonation',
      'A type of firewall',
      'A protocol for secure browsing'
    ],
    answer: 1,
    category: 'Attack Types',
    explanation: 'Phishing uses fake emails or sites to trick users into revealing passwords or financial info. Always verify the sender!'
  },
  {
    id: 2,
    question: 'You get an SMS: "Your account will be blocked, verify now: bit.ly/xyz". What should you do?',
    options: [
      'Click the link immediately',
      'Call your bank\'s official number to verify',
      'Reply with your account details',
      'Share it with friends to warn them'
    ],
    answer: 1,
    category: 'Practical Safety',
    explanation: 'Never click unexpected short links. Always call the official number from the back of your card or the bank\'s website.'
  },
  {
    id: 3,
    question: 'What is 2FA (Two-Factor Authentication)?',
    options: [
      'Two passwords for one account',
      'Login requiring both password and a second verification step',
      'Two different email accounts',
      'A type of encryption'
    ],
    answer: 1,
    category: 'Defenses',
    explanation: '2FA adds a second layer — usually a code sent to your phone — so hackers can\'t access your account with just a password.'
  },
  {
    id: 4,
    question: 'A recruiter offers a high-paying remote internship but asks you to buy a ₹3000 "training kit" first. This is:',
    options: [
      'A legitimate opportunity',
      'An advance-fee / job scam',
      'A government scheme',
      'A standard HR process'
    ],
    answer: 1,
    category: 'Job Scams',
    explanation: 'Legitimate companies NEVER ask candidates to pay to get a job. This is a classic advance-fee fraud targeting students.'
  },
  {
    id: 5,
    question: 'What does HTTPS in a URL indicate?',
    options: [
      'The website is from India (HT = Hindustan)',
      'The connection is encrypted between browser and server',
      'The website is government-verified',
      'The site has no ads'
    ],
    answer: 1,
    category: 'Web Safety',
    explanation: 'HTTPS uses SSL/TLS encryption. While it means the connection is secure, it doesn\'t guarantee the site itself is legitimate!'
  },
  {
    id: 6,
    question: 'Which of these is the official Indian cybercrime reporting portal?',
    options: [
      'safeinternet.in',
      'cybercrime.gov.in',
      'reportcrime.org',
      'indianpolice.com'
    ],
    answer: 1,
    category: 'Reporting',
    explanation: 'cybercrime.gov.in is the official Ministry of Home Affairs portal. You can also call 1930 for immediate help.'
  },
  {
    id: 7,
    question: 'A QR code at a cafe counter asks you to enter your UPI PIN to "receive" a discount. What\'s happening?',
    options: [
      'A genuine discount offer',
      'A UPI scam — PIN is only for sending, not receiving',
      'A restaurant loyalty program',
      'A government cashback scheme'
    ],
    answer: 1,
    category: 'UPI/Payment Fraud',
    explanation: 'You NEVER need to enter a PIN to receive money on UPI. Scammers use this trick to initiate unauthorized payments from your account.'
  },
  {
    id: 8,
    question: 'What is a "zero-day vulnerability"?',
    options: [
      'A bug fixed in zero days',
      'An unknown flaw exploited before a patch exists',
      'A virus that activates at midnight',
      'A server that takes zero time to respond'
    ],
    answer: 1,
    category: 'Concepts',
    explanation: 'Zero-day means developers have had zero days to fix it. These are extremely dangerous as no patch exists when discovered.'
  },
  {
    id: 9,
    question: 'You receive an email from "admin@g00gle.com" asking to verify your account. This is an example of:',
    options: [
      'A legitimate Google email',
      'Domain spoofing / homograph attack',
      'A bug bounty notification',
      'An automatic security alert'
    ],
    answer: 1,
    category: 'Attack Types',
    explanation: '"g00gle" uses zeroes instead of "o"s — a classic domain spoofing trick. Always check the exact spelling of email domains!'
  },
  {
    id: 10,
    question: 'What should you do FIRST if you suspect your bank account has been compromised?',
    options: [
      'Post about it on social media',
      'Change your Facebook password',
      'Call your bank immediately and dial 1930',
      'Wait to see if money is missing'
    ],
    answer: 2,
    category: 'Incident Response',
    explanation: 'Time is critical! Call your bank to freeze the account and dial 1930 (National Cybercrime Helpline) — every minute matters in financial fraud.'
  }
];
