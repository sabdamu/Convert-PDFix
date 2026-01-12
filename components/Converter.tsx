
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  File, 
  Loader2, 
  CheckCircle2, 
  Download, 
  X, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { Tool, ConversionState, FileData } from '../types';
import { analyzeDocument, simulateConversion } from '../services/gemini';

interface ConverterProps {
  tool: Tool;
  onBack: () => void;
}

const Converter: React.FC<ConverterProps> = ({ tool, onBack }) => {
  const [file, setFile] = useState<FileData | null>(null);
  const [state, setState] = useState<ConversionState>({ status: 'idle', progress: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: selectedFile.lastModified
      });
      setState({ status: 'idle', progress: 0 });
    }
  };

  const startConversion = async () => {
    if (!file) return;

    setState({ status: 'uploading', progress: 20 });
    
    setTimeout(() => setState(prev => ({ ...prev, status: 'processing', progress: 50 })), 1000);

    try {
      const [analysisResult, convertedUrl] = await Promise.all([
        analyzeDocument(file.name, file.type),
        simulateConversion(tool.id)
      ]);

      setState({
        status: 'completed',
        progress: 100,
        resultUrl: convertedUrl,
        analysis: analysisResult
      });
    } catch (err) {
      setState({
        status: 'error',
        progress: 0,
        error: "Terjadi kesalahan saat konversi. Silakan coba lagi."
      });
    }
  };

  const reset = () => {
    setFile(null);
    setState({ status: 'idle', progress: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
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
            <div className="p-4 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
              {tool.icon}
            </div>
            <h2 className="text-3xl font-bold mb-2">{tool.name}</h2>
            <p className="text-blue-100 opacity-90">{tool.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-10 h-10 text-[#005696]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Pilih file Anda</h3>
              <p className="text-gray-400 text-center max-w-xs">
                Tarik dan lepas file di sini atau klik untuk mencari. Maksimal 50MB.
              </p>
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-8">
              {/* File Info */}
              <div className="flex items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-4 bg-white rounded-xl shadow-sm mr-4">
                  <File className="w-8 h-8 text-[#005696]" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-900 truncate max-w-xs md:max-w-md">{file.name}</h4>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  onClick={reset}
                  className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  disabled={state.status === 'processing' || state.status === 'uploading'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Display */}
              {state.status === 'idle' && (
                <button 
                  onClick={startConversion}
                  className="w-full py-5 bg-[#005696] hover:bg-[#00447a] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Konversi & Analisis dengan AI</span>
                </button>
              )}

              {(state.status === 'uploading' || state.status === 'processing') && (
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-[#005696] animate-spin mx-auto" />
                  <p className="font-medium text-gray-600">
                    {state.status === 'uploading' ? 'Mengunggah dokumen...' : 'Gemini AI sedang memproses file Anda...'}
                  </p>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-[#005696] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${state.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {state.status === 'completed' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-green-50 border border-green-100 p-8 rounded-2xl flex flex-col items-center text-center mb-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold text-green-900 mb-2">Konversi Berhasil!</h3>
                    <p className="text-green-700 mb-6">File Anda siap diunduh.</p>
                    <a 
                      href={state.resultUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full md:w-auto px-10 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center space-x-2 transition-all"
                    >
                      <Download className="w-5 h-5" />
                      <span>Unduh {tool.to.toUpperCase()}</span>
                    </a>
                  </div>

                  {/* AI Analysis Card */}
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles className="w-20 h-20 text-[#005696]" />
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Sparkles className="w-5 h-5 text-[#005696]" />
                      <h4 className="font-bold text-[#005696] uppercase tracking-wider text-sm">Wawasan Cerdas AI</h4>
                    </div>
                    <div className="prose prose-blue text-[#005696] whitespace-pre-wrap leading-relaxed">
                      {state.analysis}
                    </div>
                  </div>
                </div>
              )}

              {state.status === 'error' && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center space-x-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                  <p className="text-red-700 font-medium">{state.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm flex items-center justify-center space-x-2">
        <Sparkles className="w-4 h-4" />
        <span>Didukung oleh Gemini 3 Flash & Convert PDFix Core</span>
      </div>
    </div>
  );
};

export default Converter;
