
import React from 'react';
import { Menu, X } from 'lucide-react';
import logoUrl from '../assets/logo.svg';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#/" className="flex items-center space-x-2 group">
          <img src={logoUrl} alt="Logo" className="w-12 h-12" />
          <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-black tracking-tight text-[#005696]">
              Convert
            </span>
            <span className="text-xs font-bold text-[#be123c] tracking-[0.2em]">
              PDFix
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <a href="#/" className="hover:text-[#005696] transition-colors">Semua Alat</a>
          <a href="#/tool/merge-pdf" className="hover:text-[#005696] transition-colors">Gabung PDF</a>
          <a href="#/tool/split-pdf" className="hover:text-[#005696] transition-colors">Pisah PDF</a>
          <a href="#/tool/compress-pdf" className="hover:text-[#005696] transition-colors">Kompres PDF</a>
          <div className="h-6 w-px bg-gray-200"></div>
          <button className="px-4 py-2 text-[#005696] hover:bg-blue-50 rounded-full transition-colors border border-[#005696]">
            Masuk
          </button>
          <button className="px-4 py-2 bg-[#005696] text-white hover:bg-[#00447a] rounded-full transition-all shadow-md hover:shadow-lg">
            Daftar Gratis
          </button>
        </nav>

        <button 
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-xl p-4 flex flex-col space-y-4 animate-in slide-in-from-top duration-200">
          <a href="#/" className="p-2 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>Semua Alat</a>
          <a href="#/tool/merge-pdf" className="p-2 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>Gabung PDF</a>
          <a href="#/tool/split-pdf" className="p-2 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>Pisah PDF</a>
          <button className="w-full py-3 bg-[#005696] text-white rounded-lg font-bold">Daftar Sekarang</button>
        </div>
      )}
    </header>
  );
};

export default Header;
