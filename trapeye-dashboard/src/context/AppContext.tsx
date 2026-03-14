import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PageType } from '../types';
import { FeedItem } from '../types';

interface AppContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  feedItems: FeedItem[];
  checklistState: Record<string, boolean>;
  toggleChecklist: (id: string) => void;
  quizScore: number;
  setQuizScore: (score: number) => void;
  xp: number;
  addXp: (amount: number) => void;
  currentLanguage: 'en' | 'hi' | 'kn';
  setLanguage: (lang: 'en' | 'hi' | 'kn') => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const feedMessages = [
  { type: 'threat' as const, msg: 'Phishing link reported — fake UPI portal' },
  { type: 'warn' as const, msg: 'Suspicious QR detected on campus' },
  { type: 'safe' as const, msg: 'URL verified — NPTEL course portal' },
  { type: 'threat' as const, msg: 'OTP scam call reported — Bengaluru' },
  { type: 'warn' as const, msg: 'Fake internship email circulating in groups' },
  { type: 'safe' as const, msg: 'Aadhaar verification site confirmed legitimate' },
  { type: 'threat' as const, msg: 'Malicious APK shared on Telegram channel' },
  { type: 'warn' as const, msg: 'Lottery scam SMS surge detected' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [quizScore, setQuizScore] = useState(0);
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('trapeye_xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi' | 'kn'>(() => {
    const saved = localStorage.getItem('trapeye_lang');
    return (saved as 'en' | 'hi' | 'kn') || 'en';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Persist XP
  useEffect(() => {
    localStorage.setItem('trapeye_xp', xp.toString());
  }, [xp]);

  // Persist language and apply to body
  useEffect(() => {
    localStorage.setItem('trapeye_lang', currentLanguage);
    document.body.setAttribute('data-lang', currentLanguage);
  }, [currentLanguage]);

  const addXp = (amount: number) => {
    setXp(prev => prev + amount);
  };

  const setLanguage = (lang: 'en' | 'hi' | 'kn') => {
    setCurrentLanguage(lang);
  };

  // Live feed updates
  useEffect(() => {
    let feedIdx = 0;
    const interval = setInterval(() => {
      const item = feedMessages[feedIdx % feedMessages.length];
      const now = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const newFeedItem: FeedItem = {
        id: Date.now(),
        type: item.type,
        message: item.msg,
        timestamp: time
      };

      setFeedItems(prev => [newFeedItem, ...prev.slice(0, 9)]);
      feedIdx++;
    }, 4000);

    // Initialize with some items
    const initialItems: FeedItem[] = [
      { id: 1, type: 'threat', message: 'Phishing URL detected — fake bank portal', timestamp: 'just now' },
      { id: 2, type: 'warn', message: 'QR code with malicious redirect — campus area', timestamp: '2m ago' },
      { id: 3, type: 'safe', message: 'URL verified safe — scholarship portal', timestamp: '4m ago' },
      { id: 4, type: 'threat', message: 'Internship scam reported — fake HR email', timestamp: '7m ago' },
      { id: 5, type: 'warn', message: 'Suspicious UPI payment request flagged', timestamp: '9m ago' },
      { id: 6, type: 'safe', message: 'Image verified — legitimate payment proof', timestamp: '12m ago' },
    ];
    setFeedItems(initialItems);

    return () => clearInterval(interval);
  }, []);

  const toggleChecklist = (id: string) => {
    setChecklistState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AppContext.Provider value={{ 
      currentPage, 
      setCurrentPage, 
      feedItems,
      checklistState,
      toggleChecklist,
      quizScore,
      setQuizScore,
      xp,
      addXp,
      currentLanguage,
      setLanguage,
      isAuthenticated,
      setIsAuthenticated
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
