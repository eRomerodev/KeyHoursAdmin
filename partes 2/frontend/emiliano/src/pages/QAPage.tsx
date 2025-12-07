import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const QAPage: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const bgStyle: React.CSSProperties = {
    background: "radial-gradient(1200px 700px at 75% -10%, rgba(76,76,255,0.35), transparent 60%), linear-gradient(110deg, #07070a 0%, #0f1020 25%, #18194a 55%, #2c2eff 100%)",
    minHeight: '100vh',
    position: 'relative',
  };

  const faqs = [
    {
      question: "¿Cómo me registro en KeyHours?",
      answer: "Para registrarte, necesitas tu carnet de estudiante y la contraseña temporal proporcionada por tu administrador. Ve a la página de login e ingresa tus credenciales. Si es tu primer acceso, se te pedirá cambiar tu contraseña."
    },
    {
      question: "¿Cómo aplico a un proyecto?",
      answer: "Navega a la sección de 'Convocatorias' en tu dashboard de estudiante. Allí verás todos los proyectos disponibles. Selecciona el proyecto que te interese y haz clic en 'Aplicar'. Completa el formulario de aplicación y espera la revisión del administrador."
    },
    {
      question: "¿Cómo registro mis horas de servicio?",
      answer: "Ve a la sección 'Mi Progreso' en tu dashboard. Haz clic en 'Registrar Horas' y completa el formulario con la fecha, cantidad de horas trabajadas, y una descripción de las actividades realizadas. Las horas serán enviadas para validación por el administrador del proyecto."
    },
    {
      question: "¿Cuántas horas debo completar?",
      answer: "El número de horas requeridas depende de tu programa académico. Puedes verificar tus requisitos en tu perfil de estudiante. La plataforma te mostrará tu progreso y las horas que te faltan por completar."
    },
    {
      question: "¿Puedo aplicar a múltiples proyectos?",
      answer: "Sí, puedes aplicar a múltiples proyectos siempre y cuando tengas tiempo para participar en ellos. Sin embargo, asegúrate de poder cumplir con los compromisos de cada proyecto antes de aplicar."
    },
    {
      question: "¿Qué pasa si mi aplicación es rechazada?",
      answer: "Si tu aplicación es rechazada, recibirás una notificación con la razón. Puedes aplicar a otros proyectos disponibles. También puedes contactar al administrador del proyecto si tienes preguntas sobre la decisión."
    },
    {
      question: "¿Cómo sé si mis horas fueron validadas?",
      answer: "Recibirás una notificación cuando tus horas sean validadas o rechazadas. También puedes ver el estado de tus horas en la sección 'Mi Progreso' de tu dashboard. Las horas validadas se sumarán automáticamente a tu total."
    },
    {
      question: "¿Qué hago si tengo problemas técnicos?",
      answer: "Si experimentas problemas técnicos, contacta a nuestro equipo de soporte a través de correo electrónico (soporte@keyhours.edu.sv) o teléfono (+503 2234-5678). Estamos disponibles de lunes a viernes de 8:00 AM a 5:00 PM."
    },
    {
      question: "¿Puedo ver el historial de mis proyectos anteriores?",
      answer: "Sí, en tu dashboard puedes ver todos los proyectos en los que has participado, tanto activos como completados. También puedes ver un resumen de todas tus horas registradas y validadas."
    },
    {
      question: "¿Cómo cambio mi contraseña?",
      answer: "Ve a tu perfil de usuario y selecciona 'Cambiar Contraseña'. Ingresa tu contraseña actual y la nueva contraseña. Asegúrate de usar una contraseña segura con al menos 8 caracteres."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={bgStyle} className="min-h-screen text-white">
      <Navbar variant="landing" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/20">
            <HelpCircle className="w-5 h-5 text-green-400" />
            <span className="text-white/90 text-sm font-medium">Preguntas y Respuestas</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Preguntas <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Frecuentes</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre KeyHours y cómo usar la plataforma.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left bg-transparent hover:bg-white/5 transition-colors duration-200"
              >
                <h3 className="text-xl font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-white/70 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-white/70 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-white/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10 text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            ¿No encontraste tu respuesta?
          </h2>
          <p className="text-white/70 mb-6">
            Si tienes más preguntas, no dudes en contactarnos. Estamos aquí para ayudarte.
          </p>
          <button
            onClick={() => navigate('/soporte')}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Contactar Soporte
          </button>
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

export default QAPage;

