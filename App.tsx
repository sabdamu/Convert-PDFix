// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD07koeB_vSEN9-4KK0VdQqdh97fV4yRsY",
  authDomain: "convert-pdfix.firebaseapp.com",
  projectId: "convert-pdfix",
  storageBucket: "convert-pdfix.firebasestorage.app",
  messagingSenderId: "864443968398",
  appId: "1:864443968398:web:5cadd357059e530b3992df",
  measurementId: "G-Q8VXEGWT2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import React from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ToolGrid from './components/ToolGrid';
import Converter from './components/Converter';
import { TOOLS } from './constants';
import { Sparkles, Zap, Shield, Heart } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-white to-gray-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 text-[#005696] rounded-full text-sm font-bold mb-6 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>KONVERSI BERBASIS AI</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Semua alat yang Anda butuhkan <br />
            <span className="text-[#005696]">untuk PDF & Dokumen</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Convert PDFix menghadirkan kekuatan Google Gemini ke dokumen Anda. Konversi, kompres, dan analisis dengan wawasan cerdas dalam hitungan detik.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#005696] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-[#00447a] hover:shadow-2xl transition-all">
              Coba Gratis Sekarang
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-[#005696] border-2 border-blue-100 rounded-2xl font-bold text-lg hover:border-[#005696] transition-all">
              Lihat Dokumentasi
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-gray-400 grayscale opacity-70">
            <span className="font-bold text-2xl tracking-tighter">GOOGLE</span>
            <span className="font-bold text-2xl tracking-tighter">ADOBE</span>
            <span className="font-bold text-2xl tracking-tighter">MICROSOFT</span>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Toolkit Cerdas Kami</h2>
          <p className="text-gray-500">Pilih alat untuk memulai transformasi dokumen Anda</p>
        </div>
        <ToolGrid onSelectTool={(id) => navigate(`/tool/${id}`)} />
      </section>

      {/* Features Section */}
      <section className="bg-white py-24 border-y">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Sangat Cepat</h3>
              <p className="text-gray-500 leading-relaxed">
                Algoritma yang dioptimalkan memastikan konversi Anda selesai dalam hitungan detik.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-50 text-[#005696] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Didukung AI</h3>
              <p className="text-gray-500 leading-relaxed">
                Didukung oleh Gemini 3 Flash untuk menyediakan ringkasan cerdas dan analisis konten secara otomatis.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 text-[#be123c] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Aman & Privat</h3>
              <p className="text-gray-500 leading-relaxed">
                File Anda dienkripsi dan dihapus secara otomatis setelah diproses. Kami tidak pernah menyimpan data Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#005696] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <h2 className="text-4xl font-bold mb-8">Siap meningkatkan produktivitas Anda?</h2>
          <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto">
            Bergabunglah dengan jutaan pengguna yang mempercayai Convert PDFix.
          </p>
          <button className="px-12 py-5 bg-white text-[#005696] rounded-2xl font-bold text-xl shadow-2xl hover:bg-gray-50 transition-all flex items-center space-x-3 mx-auto">
            <Heart className="w-6 h-6 fill-[#005696]" />
            <span>Mulai Gratis</span>
          </button>
        </div>
      </section>
    </main>
  );
};

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const tool = TOOLS.find(t => t.id === toolId);

  if (!tool) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Alat tidak ditemukan</h2>
        <button onClick={() => navigate('/')} className="text-[#005696] hover:underline">Kembali ke beranda</button>
      </div>
    );
  }

  return (
    <main className="flex-grow py-12 bg-gray-50 min-h-[80vh]">
      <Converter tool={tool} onBack={() => navigate('/')} />
    </main>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tool/:toolId" element={<ToolPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
