import React, { useState } from 'react';
import { X } from 'lucide-react';
import { applicationService, CreateApplicationData } from '../services/applicationService';

interface ApplicationFormProps {
  projectId: number;
  projectName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  projectId,
  projectName,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    motivation: '',
    hours_per_week: 5,
    start_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.motivation.trim()) {
      setError('La motivación es requerida');
      return;
    }
    
    if (!formData.start_date) {
      setError('La fecha de inicio es requerida');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const applicationData: CreateApplicationData = {
        project: projectId,
        motivation: formData.motivation,
        available_hours_per_week: Number(formData.hours_per_week),
        start_date_preference: formData.start_date
      };

      const application = await applicationService.createApplication(applicationData);
      console.log('✅ Aplicación creada:', application);
      
      alert(`✅ ¡Solicitud enviada exitosamente!\n\nProyecto: ${projectName}\nEstado: Pendiente de revisión`);
      onSuccess();
    } catch (error: any) {
      console.error('❌ Error al crear aplicación:', error);
      const errorMessage = error.message || 'Error al enviar la solicitud';
      setError(errorMessage);
      
      // Mostrar alerta adicional si el error es específico
      if (errorMessage.includes('Ya has aplicado')) {
        alert('⚠️ Ya has aplicado a este proyecto anteriormente.');
        onSuccess(); // Cerrar el formulario de todas formas
      } else if (errorMessage.includes('no está aceptando')) {
        alert('⚠️ Este proyecto no está aceptando nuevas solicitudes en este momento.');
      } else if (errorMessage.includes('máximo de participantes')) {
        alert('⚠️ Este proyecto ya ha alcanzado el máximo de participantes.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Solicitar Unirse al Proyecto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">{projectName}</h3>
            <p className="text-sm text-gray-600">Completa los siguientes campos para solicitar participación</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Motivación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivación para participar *
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Explica por qué quieres participar en este proyecto..."
                required
              />
            </div>

            {/* Horas por semana */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horas Disponibles por Semana *
              </label>
              <select
                name="hours_per_week"
                value={formData.hours_per_week}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value={1}>1 hora por semana</option>
                <option value={2}>2 horas por semana</option>
                <option value={3}>3 horas por semana</option>
                <option value={4}>4 horas por semana</option>
                <option value={5}>5 horas por semana</option>
                <option value={10}>10 horas por semana</option>
                <option value={15}>15 horas por semana</option>
                <option value={20}>20 horas por semana</option>
              </select>
            </div>

            {/* Fecha de inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio Preferida *
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
