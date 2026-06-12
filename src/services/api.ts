import axios from 'axios';
import type { UploadResponse, ChatResponse } from '../types';

const API = axios.create({
  baseURL: 'http://localhost:8000',
});

// Upload PDF
export const uploadPDF = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Send Chat Question
export const sendChatMessage = async (question: string): Promise<ChatResponse> => {
  const response = await API.post('/api/chat', { question });
  return response.data;
};

// Health Check
export const checkHealth = async () => {
  const response = await API.get('/');
  return response.data;
};
