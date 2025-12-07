import React, { useState, useEffect, useRef } from "react";

/**
 * KeyHours – Slide: Misión / Visión (React + TypeScript) - Smooth Version
 */

const bgStyle: React.CSSProperties = {
  background: 'transparent',
  position: 'relative',
};

const MissionVision: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 sm:px-8 relative" style={bgStyle}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/20">
            <span className="text-xl animate-pulse">⭐</span>
            <span className="text-white/90 text-sm font-medium">Nuestra filosofía</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Misión y <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift">Visión</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Los principios que guían cada acción y cada hora de servicio en nuestra comunidad
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Misión Card */}
          <div className={`group perspective-1000 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{transitionDelay: '0.2s'}}>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 lg:p-12 border border-white/10 hover:bg-white/10 transition-all duration-700 h-full shadow-2xl hover:shadow-blue-500/10 transform hover:scale-105">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:rotate-12">
                  <span className="text-3xl">🎯</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white">Misión</h2>
              </div>
              <p className="text-white/80 leading-relaxed text-lg group-hover:text-white/90 transition-colors duration-300">
                Conectar el tiempo, conocimiento y energía de la comunidad Key con necesidades reales del entorno
                mediante proyectos de aprendizaje–servicio medibles y formativos; articulamos aliados, capacitación y
                seguimiento para que cada hora invertida se traduzca en impacto tangible y crecimiento personal.
              </p>
            </div>
          </div>

          {/* Visión Card */}
          <div className={`group perspective-1000 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{transitionDelay: '0.4s'}}>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 lg:p-12 border border-white/10 hover:bg-white/10 transition-all duration-700 h-full shadow-2xl hover:shadow-purple-500/10 transform hover:scale-105">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:rotate-12">
                  <span className="text-3xl">⭐</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white">Visión</h2>
              </div>
              <p className="text-white/80 leading-relaxed text-lg group-hover:text-white/90 transition-colors duration-300">
                Ser la cultura viva de la comunidad Key donde la gratitud se convierte en acción: cada estudiante y
                colaborador aporta su talento para co-crear soluciones sostenibles con nuestros aliados, dejando capacidades
                locales que perduran. Give back to your community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Transition to Next Section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#07070a]/50 pointer-events-none z-20"></div>
    </section>
  );
};

export default MissionVision;
