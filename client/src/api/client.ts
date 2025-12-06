import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { components } from './openapi-types';

const getBaseUrl = () => {
  // Vite exposes env vars at import.meta.env
  // Fallback to http://localhost:3000
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:3000';
};

const api: AxiosInstance = axios.create({ baseURL: getBaseUrl(), headers: { 'Content-Type': 'application/json' } });

// Interceptor to attach token from localStorage (if present)
api.interceptors.request.use((cfg) => {
  try {
    const userData = sessionStorage.getItem('persist:user');
    if (!userData) { return cfg; }
    const rawToken = JSON.parse(userData).token;
    let token = rawToken;
    if (typeof rawToken == "string" && rawToken.startsWith("\"")) {
      token = JSON.parse(rawToken);
    }
    console.log(token);
    if (token) {
      // cfg.headers can be AxiosHeaders (class) or plain object depending on runtime.
      // Use a safe any-cast to set Authorization header.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cfg.headers as any) = { ...(cfg.headers as any), Authorization: `Bearer ${token}` };
    }
  } catch (e) {
    // ignore (e.g., SSR environment without localStorage)
  }
  return cfg;
});

// Types

// Request DTOs
export type TrialCreateDTO = { title: string; passphrase: string; userId: string };
export type AnswerPostDTO = { trialId: string; questionId: string; answer: string; score?: number; memo?: string };

// Response shapes based on OpenAPI components
export type TrialResponse = { success: true; data: components['schemas']['Trial'] };
export type AnswerCreateResponse = { success: true; data: { id: string } };
export type AnswerResponse = { success: true; data: components['schemas']['Answer'] };

// Response shapes based on Backend API return value (将来的にはOpenAPIで管理したい)
export type SignInResponse = { 
  success: true; 
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
    };
  }
};

export const createTrial = async (dto: TrialCreateDTO): Promise<TrialResponse> => {
  const res = await api.post<TrialResponse>('/api/trial', dto);
  return res.data;
};

export const postAnswer = async (dto: AnswerPostDTO): Promise<AnswerCreateResponse> => {
  const res = await api.post<AnswerCreateResponse>('/api/answer', dto);
  return res.data;
};

export const updateAnswer = async (id: string, data: Partial<Pick<components['schemas']['Answer'], 'score' | 'scoringStatus' | 'memo'>>): Promise<AnswerResponse> => {
  const res = await api.put<AnswerResponse>(`/api/answer/${id}`, data);
  return res.data;
};

export default api;
