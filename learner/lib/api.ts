// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  videoUrl?: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  instructor?: string;
  price?: number;
  duration?: string;
  level?: string;
  tags: string[];
  lessons: Lesson[];
}

export interface Website {
  id: string;
  slug: string;
  name: string;
  status: string;
  mergedLayout: LayoutNode;
  course?: Course;
}

export interface LayoutNode {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: LayoutNode[];
}

export const getWebsiteBySlug = async (slug: string): Promise<Website> => {
  const { data } = await api.get(`/websites/slug/${slug}`);
  return data;
};

export const getAllWebsites = async (): Promise<Website[]> => {
  const { data } = await api.get('/websites');
  return data;
};

export default api;