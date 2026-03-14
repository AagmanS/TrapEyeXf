export interface Scam {
  id: number;
  title: string;
  description: string;
  category: 'phishing' | 'financial' | 'social' | 'job';
  severity: 'critical' | 'high' | 'medium';
  tags: string[];
  redFlags?: string[];
  howToAvoid?: string[];
}

export interface GlossaryTerm {
  name: string;
  definition: string;
  category: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  category: string;
  explanation: string;
}

export interface ReportAuthority {
  id: number;
  icon: string;
  title: string;
  url: string;
  description: string;
  actionType?: 'website' | 'call' | 'email';
  email?: string;
  phone?: string;
}

export interface FeedItem {
  id: number;
  type: 'threat' | 'warn' | 'safe';
  message: string;
  timestamp: string;
}

export interface StatCard {
  id: number;
  icon: string;
  value: string;
  label: string;
  color: 'cyan' | 'green' | 'red' | 'orange';
}

export type PageType = 'dashboard' | 'analysis' | 'glossary' | 'checklist' | 'quiz' | 'report' | 'simulator';
