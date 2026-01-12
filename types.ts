// Added React import to fix namespace error for React.ReactNode
import React from 'react';

export type ToolCategory = 'convert' | 'optimize' | 'edit' | 'security';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: ToolCategory;
  from: string;
  to: string;
  color: string;
}

export interface ConversionState {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  resultUrl?: string;
  analysis?: string;
  error?: string;
}

export interface FileData {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  content?: string | ArrayBuffer | null;
}