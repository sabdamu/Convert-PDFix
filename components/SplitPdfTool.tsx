import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  Layers, 
  Maximize2,
  Check,
  AlertCircle
} from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

// Set worker for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface SplitRange {
  id: string;
  from: number;
  to: number;
}

interface SplitPdfToolProps {
  base64: string;
  fileName: string;
  onComplete: (resultUrl: string, message: string) => void;
  onError: (error: string) => void;
}

const SplitPdfTool: React.FC<SplitPdfToolProps> = ({ base64, fileName, onComplete, onError }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [ranges, setRanges] = useState<SplitRange[]>([{ id: '1', from: 1, to: 1 }]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mergeAll, setMergeAll] = useState(false);
  const [splitMode, setSplitMode] = useState<'custom' | 'fixed'>('custom');
  const [fixedRange, setFixedRange] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadPdf();
  }, [base64]);

  const loadPdf = async () => {
    try {
      setLoading(true);
      const loadingTask = pdfjs.getDocument({ data: atob(base64) });
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);

      // Update initial range to cover all pages if it's just one range
      setRanges([{ id: '1', from: 1, to: pdf.numPages }]);

      // Generate previews for all pages
      const previewUrls: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport, canvas }).promise;
          previewUrls.push(canvas.toDataURL());
        }
      }
      setPreviews(previewUrls);
      setLoading(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      onError('Gagal memuat pratinjau PDF.');
      setLoading(false);
    }
  };

  const addRange = () => {
    const lastRange = ranges[ranges.length - 1];
    const nextFrom = Math.min(lastRange.to + 1, numPages);
    const nextTo = Math.min(nextFrom + 1, numPages);
    
    setRanges([...ranges, { 
      id: Math.random().toString(36).substr(2, 9), 
      from: nextFrom, 
      to: nextTo 
    }]);
  };

  const removeRange = (id: string) => {
    if (ranges.length > 1) {
      setRanges(ranges.filter(r => r.id !== id));
    }
  };

  const updateRange = (id: string, field: 'from' | 'to', value: number) => {
    setRanges(ranges.map(r => {
      if (r.id === id) {
        const newValue = Math.max(1, Math.min(numPages, value));
        return { ...r, [field]: newValue };
      }
      return r;
    }));
  };

  const handleSplit = async () => {
    try {
      setIsProcessing(true);
      const pdfBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const sourcePdf = await PDFDocument.load(pdfBytes);
      
      let finalRanges = ranges;
      if (splitMode === 'fixed') {
        finalRanges = [];
        for (let i = 1; i <= numPages; i += fixedRange) {
          finalRanges.push({
            id: i.toString(),
            from: i,
            to: Math.min(i + fixedRange - 1, numPages)
          });
        }
      }

      if (mergeAll) {
        // Merge selected ranges into one PDF
        const newPdf = await PDFDocument.create();
        for (const range of finalRanges) {
          const pageIndices = [];
          for (let i = range.from - 1; i < range.to; i++) {
            pageIndices.push(i);
          }
          const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
          copiedPages.forEach(page => newPdf.addPage(page));
        }
        const pdfData = await newPdf.save();
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        onComplete(URL.createObjectURL(blob), `Berhasil memisahkan dan menggabungkan ${finalRanges.length} rentang halaman.`);
      } else {
        // For now, we'll just return the first range as a single PDF
        const range = finalRanges[0];
        const newPdf = await PDFDocument.create();
        const pageIndices = [];
        for (let i = range.from - 1; i < range.to; i++) {
          pageIndices.push(i);
        }
        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        const pdfData = await newPdf.save();
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        onComplete(URL.createObjectURL(blob), `Berhasil memisahkan rentang halaman ${range.from}-${range.to}.`);
      }
    } catch (err) {
      console.error('Error splitting PDF:', err);
      onError('Gagal memproses pemisahan PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Menyiapkan pratinjau PDF...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Side: Preview */}
      <div className="flex-grow bg-gray-100 rounded-3xl p-8 min-h-[500px] flex flex-col items-center overflow-y-auto max-h-[800px] custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
          {previews.map((url, idx) => {
            const pageNum = idx + 1;
            let isInRange = false;
            
            if (splitMode === 'custom') {
              isInRange = ranges.some(r => pageNum >= r.from && pageNum <= r.to);
            } else {
              // In fixed mode, all pages are part of some range
              isInRange = true;
            }
            
            return (
              <div 
                key={idx} 
                className={`relative group transition-all duration-300 ${
                  isInRange ? 'scale-105' : 'opacity-40 grayscale'
                }`}
              >
                <div className="text-center mb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Halaman {pageNum}</span>
                </div>
                <div className={`bg-white p-3 rounded-xl shadow-xl border-4 transition-all ${
                  isInRange ? 'border-blue-500 shadow-blue-100' : 'border-transparent'
                }`}>
                  <img src={url} alt={`Page ${pageNum}`} className="w-full h-auto rounded-sm" />
                </div>
                {isInRange && (
                  <div className="absolute top-8 right-2 bg-blue-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side: Controls */}
      <div className="w-full lg:w-96 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl space-y-8 sticky top-24">
          <div className="flex items-center justify-between border-b pb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 rounded-xl">
                <Layers className="w-6 h-6 text-[#be123c]" />
              </div>
              <h3 className="font-black text-2xl text-gray-800 tracking-tight">Pisah</h3>
            </div>
            <div className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full text-gray-500 uppercase">
              {numPages} Halaman
            </div>
          </div>

          {/* Mode Selector */}
          <div className="space-y-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
              <span>Mode Rentang</span>
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
              <button 
                onClick={() => setSplitMode('custom')}
                className={`py-3 px-4 rounded-xl text-sm font-black transition-all ${
                  splitMode === 'custom' 
                    ? 'bg-white text-[#be123c] shadow-md border border-gray-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Kustom
              </button>
              <button 
                onClick={() => setSplitMode('fixed')}
                className={`py-3 px-4 rounded-xl text-sm font-black transition-all ${
                  splitMode === 'fixed' 
                    ? 'bg-white text-[#be123c] shadow-md border border-gray-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Tetap
              </button>
            </div>
          </div>

          {/* Ranges List */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {splitMode === 'custom' ? (
              <>
                {ranges.map((range, index) => (
                  <div key={range.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 relative group hover:border-blue-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black">
                          {index + 1}
                        </div>
                        <span className="text-xs font-black text-gray-700 uppercase tracking-tight">Rentang</span>
                      </div>
                      {ranges.length > 1 && (
                        <button 
                          onClick={() => removeRange(range.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Dari Halaman</label>
                        <input 
                          type="number" 
                          min="1"
                          max={numPages}
                          value={range.from}
                          onChange={(e) => updateRange(range.id, 'from', parseInt(e.target.value))}
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Ke Halaman</label>
                        <input 
                          type="number" 
                          min="1"
                          max={numPages}
                          value={range.to}
                          onChange={(e) => updateRange(range.id, 'to', parseInt(e.target.value))}
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={addRange}
                  className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 font-black text-xs uppercase tracking-widest"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Rentang</span>
                </button>
              </>
            ) : (
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Maximize2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-black text-gray-700 uppercase tracking-tight">Pemisahan Tetap</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Pisah setiap X halaman</label>
                  <input 
                    type="number" 
                    min="1"
                    max={numPages}
                    value={fixedRange}
                    onChange={(e) => setFixedRange(Math.max(1, parseInt(e.target.value)))}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl text-lg font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                  PDF akan dipisahkan menjadi beberapa file, masing-masing berisi {fixedRange} halaman.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 hover:bg-blue-50 transition-colors cursor-pointer group" onClick={() => setMergeAll(!mergeAll)}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                mergeAll ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200 group-hover:border-blue-300'
              }`}>
                {mergeAll && <Check className="w-4 h-4 text-white" />}
              </div>
              <label className="text-xs font-black text-blue-900 cursor-pointer select-none">
                Gabungkan semua rentang dalam satu file PDF
              </label>
            </div>

            <button 
              onClick={handleSplit}
              disabled={isProcessing}
              className="w-full py-5 bg-[#be123c] hover:bg-[#9f1239] text-white rounded-2xl font-black text-xl shadow-2xl shadow-red-200 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isProcessing ? (
                <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <FileText className="w-6 h-6" />
                  <span>PISAH PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitPdfTool;
