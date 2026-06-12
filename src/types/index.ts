export interface UploadResponse {
  status: string;
  message: string;
  filename: string;
  text_length: number;
  chunks: number;
  embeddings: number;
}

export interface ArchitectureScores {
  security: number;
  scalability: number;
  performance: number;
  maintainability: number;
  availability: number;
}

export interface ChatResponse {
  success: boolean;
  question: string;
  answer: string;
  architecture_type: string;
  scores: ArchitectureScores;
  recommendations: string[];
  report: string;
  sources: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  sources?: string[];
}
