
import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin, Mail } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Logo className="w-10 h-10" />
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-black tracking-tight text-[#005696]">Convert</span>
                <span className="text-[10px] font-bold text-[#be123c] tracking-[0.2em]">PDFix</span>
              </div>
            </div>
            <p className="text-gray-500 max-w-xs mb-2">
              Solusi dokumen pintar terbaik Anda dari <span className="font-semibold text-gray-700">ScriptGenius</span>.
            </p>
            <p className="text-gray-400 text-sm mb-6 italic">
              Dibuat dan dikembangkan oleh <span className="font-medium">Johan de Fretes</span>.
            </p>
            <div className="flex space-x-4">
              <Twitter className="w-5 h-5 text-gray-400 hover:text-[#005696] cursor-pointer" />
              <Facebook className="w-5 h-5 text-gray-400 hover:text-[#005696] cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-[#005696] cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-[#005696] cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Solusi</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-[#005696]">Gabung PDF</a></li>
              <li><a href="#" className="hover:text-[#005696]">Pisah PDF</a></li>
              <li><a href="#" className="hover:text-[#005696]">Kompres PDF</a></li>
              <li><a href="#" className="hover:text-[#005696]">PDF ke Word</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-[#005696]">Tentang ScriptGenius</a></li>
              <li><a href="#" className="hover:text-[#005696]">Blog</a></li>
              <li><a href="#" className="hover:text-[#005696]">Karir</a></li>
              <li><a href="#" className="hover:text-[#005696]">Legal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Bantuan</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-[#005696]">Pusat Bantuan</a></li>
              <li><a href="mailto:scriptgenius7@gmail.com" className="hover:text-[#005696] flex items-center gap-1"><Mail className="w-3 h-3" /> Hubungi Kami</a></li>
              <li><a href="#" className="hover:text-[#005696]">Status</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-400 text-xs">
          <p>© 2026 Convert PDFix oleh ScriptGenius. Seluruh hak cipta dilindungi.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Kebijakan Privasi</a>
            <a href="#" className="hover:underline">Syarat Layanan</a>
            <a href="#" className="hover:underline">Kebijakan Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
