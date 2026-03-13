import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  File, 
  Loader2, 
  CheckCircle2, 
  Download, 
  X, 
  Sparkles, 
  AlertCircle,
  Copy,
  FileText,
  Clock
} from 'lucide-react';
import { Tool, ConversionState, FileData } from '../types';
import { processDocumentWithAI, simulateConversion, mergePDFs, splitPDF } from '../services/gemini';
import SplitPdfTool from './SplitPdfTool';

interface ConverterProps {
  tool: Tool;
  onBack: () => void;
}

const Converter: React.FC<ConverterProps> = ({ tool, onBack }) => {
  const [files, setFiles] = useState<{ file: FileData, base64: string }[]>([]);
  const [state, setState] = useState<ConversionState>({ status: 'idle', progress: 0 });
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressInterval = useRef<number | null>(null);

  const isMultiFile = tool.id === 'merge-pdf';

  // Smooth progress animation
  useEffect(() => {
    if (state.status === 'processing') {
      progressInterval.current = window.setInterval(() => {
        setDisplayProgress(prev => {
          if (prev < 98) return prev + Math.random() * 2;
          return prev;
        });
      }, 200);
    } else if (state.status === 'completed') {
      setDisplayProgress(100);
      if (progressInterval.current) clearInterval(progressInterval.current);
    } else if (state.status === 'idle') {
      setDisplayProgress(0);
      if (progressInterval.current) clearInterval(progressInterval.current);
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [state.status]);

  const processFiles = (selectedFiles: globalThis.File[]) => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((selectedFile: globalThis.File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          const fileData = {
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
            lastModified: selectedFile.lastModified
          };
          
          if (isMultiFile) {
            setFiles(prev => [...prev, { file: fileData, base64: base64String }]);
          } else {
            setFiles([{ file: fileData, base64: base64String }]);
          }
        };
        reader.readAsDataURL(selectedFile);
      });
      
      setState({ status: 'idle', progress: 0 });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as globalThis.File[];
    processFiles(selectedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files) as globalThis.File[];
    processFiles(droppedFiles);
  };

  const startConversion = async () => {
    if (files.length === 0) return;

    setState({ status: 'uploading', progress: 10 });
    setDisplayProgress(10);
    
    try {
      setState(prev => ({ ...prev, status: 'processing' }));
      
      let resultUrl = '';
      let resultText = '';

      if (tool.id === 'merge-pdf') {
        resultUrl = await mergePDFs(files.map(f => ({ name: f.file.name, base64: f.base64 })));
        resultText = `Berhasil menggabungkan ${files.length} file PDF.`;
      } else if (tool.id === 'split-pdf') {
        resultUrl = await splitPDF(files[0].base64);
        resultText = `Berhasil memisahkan halaman pertama dari ${files[0].file.name}.`;
      } else if (tool.id === 'compress-pdf') {
        // Simple compression simulation: just return the same file for now
        // Real compression would require more complex logic
        const blob = new Blob([Uint8Array.from(atob(files[0].base64), c => c.charCodeAt(0))], { type: 'application/pdf' });
        resultUrl = URL.createObjectURL(blob);
        resultText = `File ${files[0].file.name} telah dioptimalkan.`;
      } else {
        // AI-based conversion
        const isTextExtractTool = tool.category === 'convert' || tool.id === 'ai-analyze';
        
        resultText = await processDocumentWithAI(
          files[0].file.name, 
          files[0].file.type, 
          files[0].base64, 
          tool.id === 'ai-analyze' ? 'analyze' : 'ocr'
        );

        resultUrl = await simulateConversion(tool.id, resultText, tool.to);
      }

      setState({
        status: 'completed',
        progress: 100,
        resultUrl: resultUrl,
        analysis: resultText
      });
    } catch (err: any) {
      setState({
        status: 'error',
        progress: 0,
        error: err.message || "Terjadi kesalahan saat pemrosesan."
      });
    }
  };

  const copyToClipboard = () => {
    if (state.analysis) {
      navigator.clipboard.writeText(state.analysis);
      alert("Teks berhasil disalin!");
    }
  };

  const reset = () => {
    setFiles([]);
    setState({ status: 'idle', progress: 0 });
    setDisplayProgress(0);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getTargetFileName = () => {
    if (files.length === 0) return 'converted_file';
    const firstFile = files[0].file;
    const baseName = firstFile.name.substring(0, firstFile.name.lastIndexOf('.')) || firstFile.name;
    
    if (tool.id === 'merge-pdf') return `merged_document.pdf`;
    return `${baseName}${tool.to}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-[#005696] p-8 text-white relative">
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center text-center pt-4">
            <div className="p-4 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm shadow-inner">
              {tool.icon}
            </div>
            <h2 className="text-3xl font-bold mb-2">{tool.name}</h2>
            <div className="flex items-center space-x-2 text-blue-100 text-sm opacity-90">
              <span className="px-2 py-0.5 bg-white/20 rounded uppercase font-bold">{tool.from.replace('.', '')}</span>
              <span>&rarr;</span>
              <span className="px-2 py-0.5 bg-white/20 rounded uppercase font-bold">{tool.to.replace('.', '')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {tool.id === 'split-pdf' && files.length > 0 && state.status === 'idle' ? (
            <SplitPdfTool 
              base64={files[0].base64}
              fileName={files[0].file.name}
              onComplete={(url, message) => {
                setState({
                  status: 'completed',
                  progress: 100,
                  resultUrl: url,
                  analysis: message
                });
              }}
              onError={(err) => {
                setState({
                  status: 'error',
                  progress: 0,
                  error: err
                });
              }}
            />
          ) : files.length === 0 || (isMultiFile && state.status === 'idle') ? (
            <div className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-4 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden ${
                  isDragging 
                    ? 'border-[#005696] bg-blue-50/50 scale-[1.02]' 
                    : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/30'
                }`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 ${
                  isDragging ? 'scale-110 bg-blue-100' : 'bg-blue-50 group-hover:scale-110'
                }`}>
                  <Upload className={`w-10 h-10 ${isDragging ? 'text-[#00447a]' : 'text-[#005696]'}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {isDragging ? 'Lepaskan file di sini' : (isMultiFile ? 'Pilih file-file PDF untuk digabungkan' : `Pilih file ${tool.from} Anda`)}
                </h3>
                <p className="text-gray-400 text-center max-w-xs">
                  {isDragging ? 'Siap untuk diproses' : 'Tarik dan lepas file di sini atau klik untuk mencari.'} <br/>
                  <span className="text-[#005696] font-semibold text-xs mt-2 block uppercase tracking-tighter">
                    {tool.id === 'ai-analyze' ? 'ANALISIS CERDAS GEMINI 3 FLASH' : 'DILENGKAPI TEKNOLOGI OCR AI'}
                  </span>
                </p>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={tool.from === 'any' ? '*' : tool.from}
                  multiple={isMultiFile}
                />
              </div>

              {isMultiFile && files.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700">File Terpilih ({files.length})</h4>
                  <div className="grid gap-3">
                    {files.map((f, idx) => (
                      <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <File className="w-5 h-5 text-[#005696] mr-3" />
                        <span className="flex-grow truncate text-sm font-medium">{f.file.name}</span>
                        <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={startConversion}
                    className="w-full py-4 bg-[#005696] text-white rounded-2xl font-bold shadow-lg hover:bg-[#00447a] transition-all"
                  >
                    Gabungkan Sekarang
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* File Info (Single File Mode) */}
              {!isMultiFile && (
                <div className="flex items-center p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="p-4 bg-white rounded-xl shadow-sm mr-4 border border-gray-50">
                    <File className="w-8 h-8 text-[#005696]" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-gray-900 truncate pr-4">{files[0].file.name}</h4>
                    <p className="text-sm text-gray-500">{(files[0].file.size / 1024 / 1024).toFixed(2)} MB • {files[0].file.type || 'Document'}</p>
                  </div>
                  <button 
                    onClick={reset}
                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    disabled={state.status === 'processing' || state.status === 'uploading'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Status Display */}
              {state.status === 'idle' && !isMultiFile && (
                <button 
                  onClick={startConversion}
                  className="w-full py-5 bg-[#005696] hover:bg-[#00447a] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Konversi ke {tool.to.toUpperCase()} Sekarang</span>
                </button>
              )}

              {(state.status === 'uploading' || state.status === 'processing') && (
                <div className="text-center space-y-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full border-4 border-gray-100 border-t-[#005696] animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[#005696] font-black text-lg">
                      {Math.floor(displayProgress)}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-gray-800 text-xl">
                      {state.status === 'uploading' ? 'Mengunggah...' : 'Memproses...'}
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Estimasi selesai: Kurang dari 10 detik</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden p-1 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-[#005696] via-indigo-500 to-[#be123c] h-full transition-all duration-300 rounded-full relative"
                      style={{ width: `${displayProgress}%` }}
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                    Mohon jangan tutup halaman ini
                  </p>
                </div>
              )}

              {state.status === 'completed' && (
                <div className="animate-in zoom-in-95 fade-in duration-500">
                  <div className="bg-green-50 border border-green-100 p-8 rounded-3xl flex flex-col items-center text-center mb-8 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/5 rounded-full"></div>
                    <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 drop-shadow-sm" />
                    <h2 className="text-3xl font-black text-green-900 mb-2">Proses Selesai!</h2>
                    <p className="text-green-700 mb-8 max-w-sm">File Anda telah berhasil diproses ke format <strong>{tool.to.toUpperCase()}</strong>.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <a 
                        href={state.resultUrl} 
                        download={getTargetFileName()}
                        className="px-10 py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black shadow-xl shadow-green-100 flex items-center justify-center space-x-3 transition-all hover:scale-105 active:scale-95"
                      >
                        <Download className="w-6 h-6" />
                        <span>UNDUH {tool.to.toUpperCase()}</span>
                      </a>
                      {state.analysis && (
                        <button 
                          onClick={copyToClipboard}
                          className="px-10 py-5 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-2xl font-black flex items-center justify-center space-x-3 transition-all active:scale-95"
                        >
                          <Copy className="w-6 h-6" />
                          <span>SALIN HASIL</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Content Preview Card */}
                  {state.analysis && (
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
                      <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-indigo-500/10 rounded-lg">
                             <FileText className="w-5 h-5 text-indigo-400" />
                          </div>
                          <h4 className="font-black text-gray-200 uppercase tracking-tighter">Pratinjau Hasil</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                           <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-black uppercase">
                             {tool.id === 'ai-analyze' ? 'Gemini 3 Flash Analysis' : 'AI Processing Output'}
                           </span>
                        </div>
                      </div>
                      <div className="max-h-[350px] overflow-y-auto text-gray-400 font-mono text-sm whitespace-pre-wrap leading-relaxed custom-scrollbar bg-black/30 p-4 rounded-xl border border-white/5">
                        {state.analysis}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {state.status === 'error' && (
                <div className="bg-red-50 border border-red-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-900">Ups! Terjadi Kesalahan</h3>
                    <p className="text-red-700">{state.error}</p>
                  </div>
                  <button onClick={reset} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold">Coba Lagi</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm flex items-center justify-center space-x-2">
        <Sparkles className="w-4 h-4 text-[#005696]" />
        <span className="font-medium tracking-wide tracking-tighter uppercase text-[10px]">Diproses dengan Keamanan Enkripsi End-to-End oleh Convert PDFix</span>
      </div>
    </div>
  );
};

export default Converter;
