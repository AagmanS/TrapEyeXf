import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

// ─── Phishing ──────────────────────────────────────────────────────────────
export const analyzeURL = async (url: string) => {
  const { data } = await api.post('/api/phishing/analyze', { url });
  return data;
};

export const getPhishingHistory = async (limit = 20) => {
  const { data } = await api.get(`/api/phishing/history?limit=${limit}`);
  return data;
};

// ─── Fake News ─────────────────────────────────────────────────────────────
export const analyzeFakeNews = async (payload: {
  headline: string;
  article_text?: string;
  source_url?: string;
}) => {
  const { data } = await api.post('/api/fakenews/analyze', payload);
  return data;
};

export const getFakeNewsHistory = async (limit = 20) => {
  const { data } = await api.get(`/api/fakenews/history?limit=${limit}`);
  return data;
};

// ─── Deepfake ──────────────────────────────────────────────────────────────
export const analyzeDeepfake = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/api/deepfake/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return data;
};

// ─── News Monitor ──────────────────────────────────────────────────────────
export const getNewsFeed = async (category = 'general', limit = 20) => {
  const { data } = await api.get(`/api/news/feed?category=${category}&limit=${limit}`);
  return data;
};

export const getNewsAlerts = async () => {
  const { data } = await api.get('/api/news/alerts');
  return data;
};

// ─── Dashboard ─────────────────────────────────────────────────────────────
export const getDashboardStats = async () => {
  const { data } = await api.get('/api/dashboard/stats');
  return data;
};

// ─── Health ────────────────────────────────────────────────────────────────
export const healthCheck = async () => {
  const { data } = await api.get('/api/health');
  return data;
};
