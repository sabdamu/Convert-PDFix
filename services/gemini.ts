import { GoogleGenAI, Type } from "@google/genai";
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";
import { marked } from "marked";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processDocumentWithAI = async (
  fileName: string, 
  fileType: string, 
  base64Data: string, 
  mode: 'analyze' | 'ocr' | 'convert-to-text'
) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  let systemPrompt = '';
  
  if (mode === 'ocr' || mode === 'convert-to-text') {
    systemPrompt = `Anda adalah AI Converter Pro yang sangat presisi dalam menangani konversi dokumen dari format PDF ke Word atau Excel. Tugas utama Anda adalah menjaga integritas struktur dokumen asli.

Instruksi Operasional:
1. Analisis Struktur: Identifikasi layout halaman secara utuh. Jaga agar posisi teks, gambar, dan tabel tetap pada koordinat yang logis sesuai dengan dokumen asli.
2. Penanganan Tabel: Saat mengonversi ke format tabular, prioritaskan menjaga batasan baris dan kolom. Jangan melakukan penggabungan sel yang tidak perlu dan pastikan data numerik tetap akurat (tidak ada perubahan digit).
3. Integritas Visual: Untuk setiap gambar atau ikon, berikan referensi posisi yang tepat agar saat pengguna mengunduh hasilnya, elemen visual tidak "berantakan" atau bertumpuk.
4. Output Terstruktur: 
   - Untuk konversi ke Word: Hasilkan format Markdown yang sangat rapi dan terstruktur yang mencerminkan dokumen asli.
   - Untuk konversi ke Excel: Berikan output dalam bentuk tabel Markdown yang bersih atau format CSV.
5. Larangan: Dilarang mengubah data, dilarang menambahkan teks narasi di luar hasil konversi, dan dilarang menyederhanakan tabel yang rumit menjadi teks biasa.

Ekstrak SEMUA konten dari dokumen yang diberikan dengan akurasi 100%.`;
  } else {
    systemPrompt = `You are a smart document assistant for Convert PDFix. 
       Analyze this file and provide a 3-sentence summary and 3 improvement suggestions in Indonesian.`;
  }

  try {
    const part = {
      inlineData: {
        mimeType: fileType || 'application/pdf',
        data: base64Data
      }
    };

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [part, { text: systemPrompt }] },
    });

    return response.text || "Tidak ada teks yang terdeteksi.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Gagal memproses dokumen dengan AI. Pastikan format file didukung (PDF, Gambar, atau Dokumen Teks).");
  }
};

export const simulateConversion = async (toolId: string, extractedText: string, targetExt: string): Promise<string> => {
  let finalContent: any = '';
  let mimeType: string = 'text/plain';

  // Convert Markdown to HTML for Office formats
  const htmlContent = marked.parse(extractedText);

  if (targetExt === '.docx' || targetExt === '.doc') {
    mimeType = 'application/msword';
    finalContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Converted Document</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; line-height: 1.6; color: #333; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
        h1, h2, h3 { color: #005696; }
      </style>
      </head>
      <body>${htmlContent}</body>
      </html>`;
    const blob = new Blob(['\ufeff', finalContent], { type: mimeType });
    return URL.createObjectURL(blob);
  } else if (targetExt === '.xlsx' || targetExt === '.xls') {
    mimeType = 'application/vnd.ms-excel';
    finalContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'>
      <style>
        table { border-collapse: collapse; }
        td { border: 0.5pt solid #000; padding: 5px; }
        th { border: 0.5pt solid #000; background-color: #f2f2f2; font-weight: bold; }
      </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>`;
    const blob = new Blob(['\ufeff', finalContent], { type: mimeType });
    return URL.createObjectURL(blob);
  } else if (targetExt === '.pdf') {
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const splitText = doc.splitTextToSize(extractedText, pageWidth - margin * 2);
    doc.text(splitText, margin, 20);
    const pdfOutput = doc.output('blob');
    return URL.createObjectURL(pdfOutput);
  } else {
    mimeType = 'text/plain';
    finalContent = extractedText;
    const blob = new Blob(['\ufeff', finalContent], { type: mimeType });
    return URL.createObjectURL(blob);
  }
};

export const mergePDFs = async (files: { name: string, base64: string }[]): Promise<string> => {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const pdfBytes = Uint8Array.from(atob(file.base64), c => c.charCodeAt(0));
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  const mergedPdfBytes = await mergedPdf.save();
  const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

export const splitPDF = async (base64: string): Promise<string> => {
  const pdfBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const pdf = await PDFDocument.load(pdfBytes);
  const newPdf = await PDFDocument.create();
  
  // Just take the first page as a "split" example for now, or we could return multiple.
  // To keep it simple for the UI, we'll just return the first page.
  const [firstPage] = await newPdf.copyPages(pdf, [0]);
  newPdf.addPage(firstPage);
  
  const splitPdfBytes = await newPdf.save();
  const blob = new Blob([splitPdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};
