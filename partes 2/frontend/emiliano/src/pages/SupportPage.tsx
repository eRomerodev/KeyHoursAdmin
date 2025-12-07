import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Mail, Phone, MessageCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const SupportPage: React.FC = () => {
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
            <Heart className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Soporte</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Centro de <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Soporte</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos si tienes alguna pregunta o necesitas asistencia.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Email */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Correo Electrónico</h3>
            <p className="text-white/70 mb-4">
              Envíanos un correo y te responderemos lo antes posible.
            </p>
            <a 
              href="mailto:soporte@keyhours.edu.sv" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              soporte@keyhours.edu.sv
            </a>
          </div>

          {/* Phone */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Teléfono</h3>
            <p className="text-white/70 mb-4">
              Llámanos de lunes a viernes de 8:00 AM a 5:00 PM.
            </p>
            <a 
              href="tel:+50322345678" 
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              +503 2234-5678
            </a>
          </div>

          {/* Chat */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Chat en Vivo</h3>
            <p className="text-white/70 mb-4">
              Chatea con nuestro equipo de soporte en tiempo real.
            </p>
            <button className="text-green-400 hover:text-green-300 transition-colors">
              Iniciar chat
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                ¿Cómo puedo registrarme en KeyHours?
              </h3>
              <p className="text-white/70">
                Puedes registrarte usando tu carnet de estudiante y la contraseña temporal proporcionada por tu administrador.
              </p>
            </div>
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                ¿Cómo aplico a un proyecto?
              </h3>
              <p className="text-white/70">
                Navega a la sección de "Convocatorias" en tu dashboard, selecciona un proyecto y haz clic en "Aplicar".
              </p>
            </div>
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                ¿Cómo registro mis horas de servicio?
              </h3>
              <p className="text-white/70">
                Ve a "Mi Progreso" en tu dashboard y haz clic en "Registrar Horas". Completa el formulario con la información requerida.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                ¿Qué hago si tengo problemas técnicos?
              </h3>
              <p className="text-white/70">
                Contacta a nuestro equipo de soporte a través de correo electrónico o teléfono. Estaremos encantados de ayudarte.
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
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

export default SupportPage;

