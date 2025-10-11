import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Clock, Users, Sparkles } from "lucide-react";

/**
 * KeyHours – Slide: Proyectos que inspiran (React + TypeScript) - Smooth Version
 */

const bgStyle: React.CSSProperties = {
  background:
    "radial-gradient(1200px 700px at 75% -10%, rgba(76,76,255,0.35), transparent 60%), linear-gradient(110deg, #07070a 0%, #0f1020 25%, #18194a 55%, #2c2eff 100%)",
  position: 'relative',
  overflow: 'hidden',
};

const ZigZag: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M30 40 l20 -12 v20 l20 -12 v20 l-20 12 v-20 l-20 12 z"
      fill="#000"
      opacity="0.65"
    />
  </svg>
);

const ProjectsInspire: React.FC = () => {
  const [currentProject, setCurrentProject] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      id: 1,
      title: "Limpieza de Playas",
      description: "Contribuye al cuidado del medio ambiente",
      emoji: "🏖️",
      hours: "40 horas",
      participants: "25 estudiantes",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Tutoring Estudiantil",
      description: "Ayuda a estudiantes de primaria",
      emoji: "📚",
      hours: "60 horas",
      participants: "15 estudiantes",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Construcción Comunitaria",
      description: "Espacios para la comunidad",
      emoji: "🏗️",
      hours: "80 horas",
      participants: "30 estudiantes",
      color: "from-green-500 to-emerald-500"
    }
  ];

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentProj = projects[currentProject];

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[1200px] px-4 py-24 text-white sm:px-8"
      style={bgStyle}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '9s'}}></div>

      {/* Section Header */}
      <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/20">
          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          <span className="text-white/90 text-sm font-medium">Proyectos activos</span>
        </div>
        <h2 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-4">
          Proyectos que <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift">inspiran</span>
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Descubre oportunidades para hacer la diferencia en tu comunidad
        </p>
      </div>

      {/* Project Showcase */}
      <div className={`bg-gradient-to-r ${currentProj.color}/20 backdrop-blur-md rounded-3xl p-10 lg:p-16 border border-white/10 shadow-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Título Section */}
          <div className="relative max-w-[420px] flex-shrink-0">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
              <span className="text-3xl animate-bounce" style={{animationDuration: '2s'}}>
                {currentProj.emoji}
              </span>
              <span className="text-white font-medium">Proyecto Inspirador</span>
            </div>

            <h3 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              {currentProj.title}
            </h3>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              {currentProj.description}
            </p>

            {/* Stats */}
            <div className="flex gap-6 mb-8">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/10">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white/80 font-medium text-sm">{currentProj.hours}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/10">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-white/80 font-medium text-sm">{currentProj.participants}</span>
              </div>
            </div>

            {/* Zigzag decorativo con animaciones */}
            <ZigZag className="absolute -left-10 top-[-60px] h-[80px] w-[80px] rotate-[20deg] opacity-60 drop-shadow-[0_4px_10px_rgba(0,0,0,.4)] transition-all duration-700 hover:opacity-90" style={{animation: 'float-gentle 8s ease-in-out infinite'}} />
            <ZigZag className="absolute left-10 top-[-30px] h-[60px] w-[60px] -rotate-[10deg] opacity-50 drop-shadow-[0_4px_10px_rgba(0,0,0,.4)] transition-all duration-700 hover:opacity-80" style={{animation: 'float-gentle 10s ease-in-out infinite', animationDelay: '2s'}} />
            <ZigZag className="absolute left-[-40px] bottom-[-60px] h-[90px] w-[90px] -rotate-[30deg] opacity-60 drop-shadow-[0_4px_10px_rgba(0,0,0,.4)] transition-all duration-700 hover:opacity-90" style={{animation: 'float-gentle 12s ease-in-out infinite', animationDelay: '4s'}} />
          </div>

          {/* Card del proyecto */}
          <div className="relative flex flex-col items-center group">
            <div className={`relative overflow-hidden rounded-[40px] bg-gradient-to-br ${currentProj.color}/30 backdrop-blur-sm border border-white/20 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-2`}>
              <div className="h-[320px] w-[420px] max-w-full flex items-center justify-center">
                <span className="text-[160px] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                  {currentProj.emoji}
                </span>
              </div>
              <div className="absolute left-0 top-0 p-5 text-[20px] font-semibold bg-black/20 backdrop-blur-sm rounded-br-3xl">
                Proyecto {currentProject + 1}
              </div>
              {/* Decorative Badge */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-2xl">⭐</span>
              </div>
            </div>

            {/* Indicadores con mejor diseño */}
            <div className="mt-10 flex items-center gap-4">
              {projects.map((proj, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentProject(i)}
                  className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-500 ${
                    i === currentProject 
                      ? "bg-white/20 backdrop-blur-md border border-white/30" 
                      : "bg-white/5 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <div className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    i === currentProject ? "bg-white w-8" : "bg-white/40"
                  }`}></div>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    i === currentProject ? "text-white" : "text-white/60"
                  }`}>
                    {proj.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Botón flecha mejorado */}
            <button 
              onClick={() => setCurrentProject((prev) => (prev + 1) % projects.length)}
              className="absolute right-[-70px] top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm p-4 text-black transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-xl shadow-lg group/arrow"
            >
              <ArrowRight size={28} strokeWidth={2.5} className="group-hover/arrow:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Smooth Transition to Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#d9d9d9] pointer-events-none z-20"></div>
    </section>
  );
};

export default ProjectsInspire;
