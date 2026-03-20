// src/services/websiteService.ts
import axiosInstance from '../api/axiosInstance';

export interface Website {
  id: string;
  name: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  templateId: string;
  createdAt: string;
  updatedAt: string;
  template?: { id: string; name: string; layout: any };
  course?: Course;
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
  tags?: string[];
  websiteId: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  videoUrl?: string;
  order: number;
  courseId: string;
}

// ─── Websites ─────────────────────────────────────────────────────────────────
export const getWebsites = async (): Promise<Website[]> => {
  const { data } = await axiosInstance.get('/websites');
  return data;
};

export const getWebsite = async (id: string): Promise<Website> => {
  const { data } = await axiosInstance.get(`/websites/${id}`);
  return data;
};

export const createWebsite = async (payload: { name: string; slug: string; templateId: string }): Promise<Website> => {
  const { data } = await axiosInstance.post('/websites', payload);
  return data;
};

export const updateWebsite = async (id: string, payload: Partial<{ name: string; slug: string }>): Promise<Website> => {
  const { data } = await axiosInstance.put(`/websites/${id}`, payload);
  return data;
};

export const publishWebsite = async (id: string): Promise<Website> => {
  const { data } = await axiosInstance.put(`/websites/${id}/publish`);
  return data;
};

export const deleteWebsite = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/websites/${id}`);
};

// ─── Courses ──────────────────────────────────────────────────────────────────
export const createCourse = async (payload: Partial<Course>): Promise<Course> => {
  const { data } = await axiosInstance.post('/courses', payload);
  return data;
};

export const updateCourse = async (id: string, payload: Partial<Course>): Promise<Course> => {
  const { data } = await axiosInstance.put(`/courses/${id}`, payload);
  return data;
};

// ─── Lessons ──────────────────────────────────────────────────────────────────
export const addLesson = async (courseId: string, payload: Partial<Lesson>): Promise<Lesson> => {
  const { data } = await axiosInstance.post(`/courses/${courseId}/lessons`, payload);
  return data;
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
  await axiosInstance.delete(`/courses/lessons/${lessonId}`);
};