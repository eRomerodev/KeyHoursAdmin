import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ChevronRight, Users, Heart, Target, ArrowRight, Star, Sparkles, Globe, Clock } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [currentProject, setCurrentProject] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const projects = [
    {
      id: 1,
      title: "Limpieza de Playas",
      description: "Contribuye al cuidado del medio ambiente limpiando nuestras costas",
      image: "🏖️",
      hours: "40 horas",
      participants: "25 estudiantes",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Tutoring Estudiantil",
      description: "Ayuda a estudiantes de primaria con sus estudios",
      image: "📚",
      hours: "60 horas",
      participants: "15 estudiantes",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Construcción Comunitaria",
      description: "Participa en la construcción de espacios para la comunidad",
      image: "🏗️",
      hours: "80 horas",
      participants: "30 estudiantes",
      color: "from-green-500 to-emerald-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      <Navbar variant="landing" />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-800/10 animate-pulse"></div>
          
          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/15 to-blue-500/15 rounded-full blur-3xl animate-float-slow"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>
        
        <div className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" style={{animationDuration: '3s'}} />
                <Heart className="w-5 h-5 text-red-400 animate-pulse" />
              </div>
              <span className="text-white/90 text-sm font-medium">Gratitud en acción</span>
            </div>
            
            {/* Main Title */}
            <div className="space-y-4 mb-8">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-tight">
                <span className="block animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  KeyHours
                </span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                    Give back to your
                  </span>
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                  community
                </span>
              </h1>
            </div>
            
            {/* Description */}
            <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              Conecta tu tiempo, conocimiento y energía con necesidades reales de tu entorno. 
              Cada hora invertida se traduce en impacto tangible y crecimiento personal.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{animationDelay: '1s'}}>
            <Link
              to="/login-new"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-full font-semibold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-500 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105"
            >
              <Users className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              Únete ahora
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <button className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 hover:border-white/50 transform hover:-translate-y-1">
              <Globe className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              Ver proyectos
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/20">
              <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Nuestra filosofía</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Misión y <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Visión</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Los principios que guían cada acción y cada hora de servicio en nuestra comunidad
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission */}
            <div className="group perspective-1000">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 lg:p-12 border border-white/10 hover:bg-white/10 transition-all duration-700 h-full transform group-hover:rotate-y-2 group-hover:scale-105 shadow-2xl hover:shadow-blue-500/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                    <Target className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
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

            {/* Vision */}
            <div className="group perspective-1000">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 lg:p-12 border border-white/10 hover:bg-white/10 transition-all duration-700 h-full transform group-hover:-rotate-y-2 group-hover:scale-105 shadow-2xl hover:shadow-purple-500/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                    <Star className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
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
      </section>

      {/* Projects Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/20">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Proyectos activos</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Proyectos que <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">inspiran</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Descubre oportunidades para hacer la diferencia en tu comunidad y crear un impacto real
            </p>
          </div>

          <div className="relative">
            {/* Project Showcase */}
            <div className={`bg-gradient-to-r ${projects[currentProject].color}/20 backdrop-blur-md rounded-3xl p-10 lg:p-16 border border-white/10 shadow-2xl transition-all duration-1000`}>
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Project Info */}
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                    <span className="text-3xl animate-bounce" style={{animationDuration: '2s'}}>
                      {projects[currentProject].image}
                    </span>
                    <span className="text-white font-medium">Proyecto Inspirador</span>
                  </div>
                  
                  <h3 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {projects[currentProject].title}
                  </h3>
                  
                  <p className="text-white/80 text-xl leading-relaxed">
                    {projects[currentProject].description}
                  </p>
                  
                  <div className="flex gap-8">
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-white/80 font-medium">{projects[currentProject].hours}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80 font-medium">{projects[currentProject].participants}</span>
                    </div>
                  </div>
                  
                  <button className="group inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                    Ver proyecto
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                {/* Project Visual */}
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className={`w-80 h-80 bg-gradient-to-br ${projects[currentProject].color}/20 rounded-3xl flex items-center justify-center text-9xl backdrop-blur-sm border border-white/10 shadow-2xl transition-all duration-1000 group-hover:scale-105 group-hover:rotate-3`}>
                      <span className="transition-all duration-500 group-hover:scale-110">
                        {projects[currentProject].image}
                      </span>
                    </div>
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-4 mt-12">
              {projects.map((project, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProject(index)}
                  className={`group flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500 ${
                    index === currentProject 
                      ? 'bg-white/20 backdrop-blur-md border border-white/30' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentProject 
                      ? 'bg-white w-8' 
                      : 'bg-white/40 group-hover:bg-white/60'
                  }`}></div>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    index === currentProject ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                  }`}>
                    {project.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-3xl p-16 lg:p-20 border border-white/10 shadow-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Heart className="w-5 h-5 text-red-400 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Únete a nosotros</span>
            </div>
            
            <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Comunidad que crece
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                sirviendo
              </span>
            </h2>
            
            <p className="text-xl sm:text-2xl text-white/70 mb-12 leading-relaxed max-w-3xl mx-auto">
              Únete a una comunidad que transforma vidas a través del servicio. 
              Cada acción cuenta, cada hora importa, cada persona marca la diferencia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/login-new"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-12 py-6 rounded-full font-semibold text-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-500 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105"
              >
                <Heart className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
                Forma parte del cambio
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              
              <button className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-12 py-6 rounded-full font-semibold text-xl hover:bg-white/20 transition-all duration-300 border border-white/30 hover:border-white/50 transform hover:-translate-y-1">
                <Users className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                Ver testimonios
              </button>
            </div>
          </div>
        </div>

        {/* Footer Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </section>
    </div>
  );
};

export default LandingPage;
