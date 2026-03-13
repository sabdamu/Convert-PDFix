
import React from 'react';
import { 
  FileText, 
  FileJson, 
  FileCode, 
  FileSpreadsheet, 
  Presentation, 
  FileImage, 
  Lock, 
  Unlock, 
  Zap, 
  Scissors, 
  PlusSquare,
  FileMinus,
  BrainCircuit
} from 'lucide-react';
import { Tool } from './types';

export const TOOLS: Tool[] = [
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert your PDF documents to Word files with high accuracy.',
    icon: <FileText className="w-8 h-8" />,
    category: 'convert',
    from: '.pdf',
    to: '.doc',
    color: 'bg-blue-500'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    category: 'convert',
    from: '.docx',
    to: '.pdf',
    color: 'bg-blue-600'
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Make Excel spreadsheets easy to read by converting them to PDF.',
    icon: <FileSpreadsheet className="w-8 h-8 text-green-600" />,
    category: 'convert',
    from: '.xlsx',
    to: '.pdf',
    color: 'bg-green-600'
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Extract data from PDF to Excel spreadsheets in seconds.',
    icon: <FileSpreadsheet className="w-8 h-8 text-green-500" />,
    category: 'convert',
    from: '.pdf',
    to: '.xls',
    color: 'bg-green-500'
  },
  {
    id: 'ppt-to-pdf',
    name: 'PPT to PDF',
    description: 'Convert PowerPoint presentations to PDF documents.',
    icon: <Presentation className="w-8 h-8 text-orange-600" />,
    category: 'convert',
    from: '.pptx',
    to: '.pdf',
    color: 'bg-orange-600'
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one unified document.',
    icon: <PlusSquare className="w-8 h-8 text-red-600" />,
    category: 'edit',
    from: '.pdf',
    to: '.pdf',
    color: 'bg-red-600'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract pages from your PDF or save each page as a separate PDF.',
    icon: <Scissors className="w-8 h-8 text-red-500" />,
    category: 'edit',
    from: '.pdf',
    to: '.pdf',
    color: 'bg-red-500'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality.',
    icon: <FileMinus className="w-8 h-8 text-purple-600" />,
    category: 'optimize',
    from: '.pdf',
    to: '.pdf',
    color: 'bg-purple-600'
  },
  {
    id: 'ai-analyze',
    name: 'Smart AI Summary',
    description: 'Use Gemini AI to summarize and analyze any document instantly.',
    icon: <BrainCircuit className="w-8 h-8 text-indigo-600" />,
    category: 'edit',
    from: 'any',
    to: 'summary',
    color: 'bg-indigo-600'
  }
];
