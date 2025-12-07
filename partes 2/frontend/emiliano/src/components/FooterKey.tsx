import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Info, HelpCircle } from "lucide-react";

/**
 * KeyHours – Footer Section (React + TypeScript + Tailwind) - Smooth Version
 */

const FooterKey: React.FC = () => {
  const navigate = useNavigate();
  
  const footerLinks = [
    { label: 'Soporte', icon: Heart, color: 'from-blue-500 to-cyan-500', path: '/soporte' },
    { label: 'Información', icon: Info, color: 'from-purple-500 to-pink-500', path: '/informacion' },
    { label: 'Q&A', icon: HelpCircle, color: 'from-green-500 to-emerald-500', path: '/qa' }
  ];

  return (
    <footer className="relative w-full bg-gradient-to-br from-[#d9d9d9] to-[#c9c9c9] px-8 py-12 md:px-16 shadow-2xl">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo y texto */}
          <div className="flex items-center gap-5 group">
            <div className="w-[64px] h-[64px] transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
              <img
                src="/logo-key-hours.jpg"
                alt="KEY HOURS"
                className="w-full h-full object-contain filter drop-shadow-lg transition-all duration-300 group-hover:brightness-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[32px] font-extrabold tracking-tight text-black leading-none transition-colors duration-300 group-hover:text-blue-600">
                key
              </span>
              <span className="text-[13px] font-medium tracking-wide text-black/80 uppercase leading-tight">
                Instituto Kriete de<br />Ingeniería y Ciencias
              </span>
            </div>
          </div>

          {/* Botones a la derecha */}
          <div className="flex flex-col gap-3 text-center">
            {footerLinks.map(({ label, icon: Icon, color, path }, i) => (
              <button
                key={i}
                onClick={() => navigate(path)}
                className={`group/btn w-[180px] bg-gradient-to-r ${color} bg-[length:200%_100%] bg-left px-6 py-3 text-[16px] font-semibold text-white rounded-lg shadow-md transition-all duration-500 hover:bg-right hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover/btn:rotate-12" />
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 pt-6 border-t border-black/10 text-center">
          <p className="text-sm text-black/60">
            © 2025 KeyHours - Instituto Kriete de Ingeniería y Ciencias
          </p>
          <p className="text-xs text-black/40 mt-2">
            Give back to your community ✨
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterKey;
