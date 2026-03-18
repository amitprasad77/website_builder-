// // src/services/templateService.ts
// import axiosInstance from '../api/axiosInstance';
// import type{ Template } from '../types/builder';

// // ─── Templates ────────────────────────────────────────────────────────────────

// // Save new template
// export const saveTemplate = async (data: Omit<Template, 'id'>) => {
//   const response = await axiosInstance.post('/templates', data);
//   return response.data;
// };

// // Get all templates
// export const getTemplates = async (): Promise<Template[]> => {
//   const response = await axiosInstance.get('/templates');
//   return response.data;
// };

// // Get single template by ID
// export const getTemplate = async (id: string): Promise<Template> => {
//   const response = await axiosInstance.get(`/templates/${id}`);
//   return response.data;
// };

// // Update existing template
// export const updateTemplate = async (
//   id: string,
//   data: Partial<Template>
// ) => {
//   const response = await axiosInstance.put(`/templates/${id}`, data);
//   return response.data;
// };

// // Delete template
// export const deleteTemplate = async (id: string) => {
//   const response = await axiosInstance.delete(`/templates/${id}`);
//   return response.data;
// };


// src/services/templateService.ts
import axiosInstance from '../api/axiosInstance';
import type { LayoutNode } from '../types/builder';

export interface Template {
  id: string;
  name: string;
  description?: string;
  layout: LayoutNode;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export const saveTemplate = async (payload: { name: string; layout: LayoutNode }): Promise<Template> => {
  const { data } = await axiosInstance.post('/templates', payload);
  return data;
};

export const getTemplates = async (): Promise<Template[]> => {
  const { data } = await axiosInstance.get('/templates');
  return data;
};

export const getTemplate = async (id: string): Promise<Template> => {
  const { data } = await axiosInstance.get(`/templates/${id}`);
  return data;
};

export const updateTemplate = async (id: string, payload: Partial<{ name: string; layout: LayoutNode }>): Promise<Template> => {
  const { data } = await axiosInstance.put(`/templates/${id}`, payload);
  return data;
};

export const deleteTemplate = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/templates/${id}`);
};