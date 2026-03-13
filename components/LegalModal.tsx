
import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'cookie' | 'about' | 'help' | null;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const content = {
    privacy: {
      title: 'Kebijakan Privasi',
      body: (
        <div className="space-y-4 text-gray-600">
          <p>Terakhir diperbarui: 13 Maret 2026</p>
          <p>Di Convert PDFix, kami sangat menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami menangani informasi Anda saat Anda menggunakan layanan kami.</p>
          
          <h3 className="text-lg font-bold text-gray-900">1. Keamanan Dokumen</h3>
          <p>Kami tidak menyimpan dokumen yang Anda unggah. Semua file diproses secara real-time di server kami dan segera dihapus setelah proses konversi atau analisis selesai. Kami menggunakan enkripsi SSL untuk memastikan transfer data yang aman.</p>
          
          <h3 className="text-lg font-bold text-gray-900">2. Data yang Kami Kumpulkan</h3>
          <p>Kami tidak mengumpulkan informasi pribadi kecuali Anda memberikannya secara sukarela (seperti melalui email dukungan). Kami menggunakan data penggunaan anonim untuk meningkatkan performa situs kami.</p>
          
          <h3 className="text-lg font-bold text-gray-900">3. Pemrosesan AI</h3>
          <p>Layanan kami menggunakan teknologi Google Gemini untuk analisis dokumen. Data yang dikirim ke API AI bersifat sementara dan tunduk pada standar keamanan tinggi Google.</p>
        </div>
      )
    },
    terms: {
      title: 'Syarat Layanan',
      body: (
        <div className="space-y-4 text-gray-600">
          <p>Terakhir diperbarui: 13 Maret 2026</p>
          <p>Dengan mengakses Convert PDFix, Anda setuju untuk terikat oleh syarat dan ketentuan berikut.</p>
          
          <h3 className="text-lg font-bold text-gray-900">1. Penggunaan Layanan</h3>
          <p>Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah. Anda dilarang mengunggah konten yang melanggar hukum, berbahaya, atau melanggar hak kekayaan intelektual orang lain.</p>
          
          <h3 className="text-lg font-bold text-gray-900">2. Batasan Tanggung Jawab</h3>
          <p>Convert PDFix disediakan "sebagaimana adanya". Kami tidak memberikan jaminan bahwa layanan akan bebas dari gangguan atau kesalahan. Kami tidak bertanggung jawab atas kehilangan data atau kerusakan yang timbul dari penggunaan layanan kami.</p>
        </div>
      )
    },
    cookie: {
      title: 'Kebijakan Cookie',
      body: (
        <div className="space-y-4 text-gray-600">
          <p>Terakhir diperbarui: 13 Maret 2026</p>
          <p>Situs web kami menggunakan cookie untuk meningkatkan pengalaman pengguna Anda.</p>
          
          <h3 className="text-lg font-bold text-gray-900">1. Apa itu Cookie?</h3>
          <p>Cookie adalah file teks kecil yang disimpan di perangkat Anda saat Anda mengunjungi situs web. Mereka membantu kami mengenali preferensi Anda dan memantau lalu lintas situs.</p>
          
          <h3 className="text-lg font-bold text-gray-900">2. Jenis Cookie yang Kami Gunakan</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Cookie Esensial:</strong> Diperlukan agar situs berfungsi dengan benar.</li>
            <li><strong>Cookie Analitik:</strong> Membantu kami memahami interaksi pengunjung.</li>
          </ul>
        </div>
      )
    },
    about: {
      title: 'Tentang ScriptGenius',
      body: (
        <div className="space-y-4 text-gray-600">
          <p>ScriptGenius adalah inisiatif pengembangan perangkat lunak yang berfokus pada penyediaan alat produktivitas berbasis AI yang mudah diakses dan aman.</p>
          <p>Misi kami adalah mendemokratisasi akses ke teknologi AI canggih seperti Google Gemini untuk membantu individu dan bisnis mengelola dokumen mereka dengan lebih efisien.</p>
          <p>Convert PDFix adalah produk unggulan kami yang dirancang dengan prinsip kecepatan, kesederhanaan, dan privasi mutlak.</p>
        </div>
      )
    },
    help: {
      title: 'Pusat Bantuan',
      body: (
        <div className="space-y-4 text-gray-600">
          <h3 className="text-lg font-bold text-gray-900">Pertanyaan Umum (FAQ)</h3>
          <div className="space-y-2">
            <p className="font-bold">Apakah layanan ini gratis?</p>
            <p>Ya, Convert PDFix saat ini sepenuhnya gratis untuk digunakan dengan batasan penggunaan harian tertentu.</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold">Apakah file saya aman?</p>
            <p>Sangat aman. Kami tidak menyimpan file Anda. Semua pemrosesan terjadi di memori server dan segera dihapus.</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold">Format apa saja yang didukung?</p>
            <p>Kami mendukung PDF, Word, Excel, Gambar (JPG, PNG), dan banyak lagi.</p>
          </div>
          <p className="mt-4">Jika Anda butuh bantuan lebih lanjut, silakan hubungi kami melalui email di <a href="mailto:scriptgenius7@gmail.com" className="text-[#005696] hover:underline">scriptgenius7@gmail.com</a>.</p>
        </div>
      )
    }
  };

  const current = content[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{current.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {current.body}
        </div>
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-[#005696] text-white rounded-xl font-bold hover:bg-[#00447a] transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
