import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Users, Target, Award, BookOpen, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const InfoPage: React.FC = () => {
  const navigate = useNavigate();

  const bgStyle: React.CSSProperties = {
    background: "radial-gradient(1200px 700px at 75% -10%, rgba(76,76,255,0.35), transparent 60%), linear-gradient(110deg, #07070a 0%, #0f1020 25%, #18194a 55%, #2c2eff 100%)",
    minHeight: '100vh',
    position: 'relative',
  };

  return (
    <div style={bgStyle} className="min-h-screen text-white">
      <Navbar variant="landing" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/20">
            <Info className="w-5 h-5 text-blue-400" />
            <span className="text-white/90 text-sm font-medium">Información</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Acerca de <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">KeyHours</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Conoce más sobre nuestra plataforma y cómo funciona el sistema de horas de servicio comunitario.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Qué es KeyHours */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">¿Qué es KeyHours?</h3>
            <p className="text-white/70 leading-relaxed">
              KeyHours es una plataforma integral diseñada para gestionar las horas de servicio comunitario 
              de los estudiantes del Instituto Kriete de Ingeniería y Ciencias. Conectamos a estudiantes con 
              proyectos que generan impacto real en la comunidad.
            </p>
          </div>

          {/* Cómo Funciona */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">¿Cómo Funciona?</h3>
            <p className="text-white/70 leading-relaxed">
              Los estudiantes pueden explorar proyectos disponibles, aplicar a aquellos que les interesen, 
              y registrar sus horas de servicio. Los administradores gestionan proyectos, revisan aplicaciones 
              y validan las horas completadas.
            </p>
          </div>

          {/* Beneficios */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Beneficios</h3>
            <ul className="text-white/70 space-y-2 list-disc list-inside">
              <li>Impacto real en la comunidad</li>
              <li>Crecimiento personal y profesional</li>
              <li>Seguimiento detallado de horas</li>
              <li>Diversidad de proyectos disponibles</li>
            </ul>
          </div>

          {/* Para Quién */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">¿Para Quién?</h3>
            <p className="text-white/70 leading-relaxed">
              KeyHours está diseñado para estudiantes del Instituto Kriete que necesitan completar sus horas 
              de servicio comunitario, así como para administradores que gestionan proyectos y validan el 
              trabajo de los estudiantes.
            </p>
          </div>
        </div>

        {/* Mission & Vision Summary */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10 mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Nuestra Misión y Visión
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Misión</h3>
              <p className="text-white/70 leading-relaxed">
                Conectar el tiempo, conocimiento y energía de la comunidad Key con necesidades reales del 
                entorno mediante proyectos de aprendizaje-servicio medibles y formativos.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Visión</h3>
              <p className="text-white/70 leading-relaxed">
                Ser la cultura viva de la comunidad Key donde la gratitud se convierte en acción: cada 
                estudiante y colaborador aporta su talento para co-crear soluciones sostenibles.
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/30 hover:border-white/50"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;

