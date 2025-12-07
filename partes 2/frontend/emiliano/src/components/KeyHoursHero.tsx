import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * KeyHours – Hero (React + TypeScript) - Smooth Version
 */

const bgStyle: React.CSSProperties = {
  background:
    "radial-gradient(1200px 700px at 75% -10%, rgba(76,76,255,0.35), transparent 60%), linear-gradient(110deg, #07070a 0%, #0f1020 25%, #18194a 55%, #2c2eff 100%)",
};

const LogoMark: React.FC = () => (
  <img
    src="/logo-key-hours.jpg"
    alt="KEY HOURS"
    className="w-32 h-10 object-contain transition-transform duration-300 hover:scale-105"
  />
);

const ZigZag: React.FC<{ className?: string; style?: React.CSSProperties }>= ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M30 40 l20 -12 v20 l20 -12 v20 l-20 12 v-20 l-20 12 z" fill="#000" opacity="0.65"/>
  </svg>
);

const KeyHoursHero: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen text-white relative" style={bgStyle}>
      {/* Floating Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-4 sm:px-8 relative z-10">
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center no-underline text-white cursor-pointer bg-transparent border-none transform transition-all duration-300 hover:scale-105"
        >
          <LogoMark />
        </button>
        <button
          onClick={() => navigate("/login")}
          className="rounded-full bg-gradient-to-r from-[#9fbce4] to-[#7fa3d1] px-6 py-3 font-semibold text-[#0e1b2e] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-[#b0cdf0] hover:to-[#9fbce4] border-none cursor-pointer"
        >
          Login
        </button>
      </header>

      {/* Hero */}
      <main className="relative mx-auto max-w-[1200px] px-4 pb-20 pt-12 sm:px-8 z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-white/20 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <span className="text-2xl animate-pulse">✨</span>
            <span className="text-white/90 text-sm font-medium">Gratitud en acción</span>
          </div>

          <h1 className="max-w-[900px] text-balance text-[34px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[48px] md:text-[72px] mb-8">
            <span className="block animate-slide-in-left" style={{animationDelay: '0.5s'}}>
              Gratitud en acción:
            </span>
            <span className="block animate-slide-in-left" style={{animationDelay: '0.7s'}}>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift">
                KeyHours — Give
              </span>
            </span>
            <span className="block animate-slide-in-left" style={{animationDelay: '0.9s'}}>
              back to your
            </span>
            <span className="block animate-slide-in-left" style={{animationDelay: '1.1s'}}>
              community
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-[700px] text-lg sm:text-xl text-white/80 leading-relaxed mb-10 animate-fade-in" style={{animationDelay: '1.3s'}}>
            Conecta tu tiempo, conocimiento y energía con necesidades reales de tu entorno. 
            Cada hora invertida se traduce en impacto tangible y crecimiento personal.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate("/login")}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-fade-in"
            style={{animationDelay: '1.5s'}}
          >
            <span className="text-xl">👥</span>
            Únete ahora
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>

        {/* Decorative shapes with smooth animations */}
        <ZigZag className="pointer-events-none absolute right-[260px] top-[110px] h-[110px] w-[110px] rotate-[3deg] scale-[1.05] opacity-70 drop-shadow-[0_4px_10px_rgba(0,0,0,.45)] max-[900px]:right-5 max-[900px]:top-[120px] transition-all duration-700 hover:opacity-90 hover:scale-110" style={{animation: 'float-gentle 8s ease-in-out infinite'}} />
        <ZigZag className="pointer-events-none absolute bottom-[120px] right-20 h-[130px] w-[130px] rotate-[2deg] scale-90 opacity-70 drop-shadow-[0_4px_10px_rgba(0,0,0,.45)] max-[900px]:right-2 max-[900px]:bottom-[130px] transition-all duration-700 hover:opacity-90 hover:scale-110" style={{animation: 'float-gentle 10s ease-in-out infinite', animationDelay: '2s'}} />
        <ZigZag className="pointer-events-none absolute bottom-[90px] left-[220px] h-[170px] w-[170px] -rotate-[12deg] scale-[1.4] opacity-70 drop-shadow-[0_4px_10px_rgba(0,0,0,.45)] max-[900px]:left-3.5 max-[900px]:bottom-[70px] transition-all duration-700 hover:opacity-90 hover:scale-[1.45]" style={{animation: 'float-gentle 12s ease-in-out infinite', animationDelay: '4s'}} />
      </main>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default KeyHoursHero;
