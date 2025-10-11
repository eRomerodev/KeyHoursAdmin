import React, { useState } from 'react';
import { X, User, Lock, CreditCard, Eye, EyeOff } from 'lucide-react';
import { studentService, CreateStudentData } from '../services/studentService';

interface CreateStudentFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editStudent?: any;
}

const CreateStudentForm: React.FC<CreateStudentFormProps> = ({
  onClose,
  onSuccess,
  editStudent,
}) => {
  const [formData, setFormData] = useState<CreateStudentData>({
    username: editStudent?.username || '',
    password: '',
    password_confirm: '',
    carnet: editStudent?.carnet || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.carnet.trim()) {
      newErrors.carnet = 'El carnet es requerido';
    } else if (!studentService.validateCarnet(formData.carnet)) {
      newErrors.carnet = 'El carnet debe contener solo letras mayúsculas y números';
    }

    if (!editStudent) {
      // Para nuevos estudiantes, la contraseña es obligatoria
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }

      if (!formData.password_confirm) {
        newErrors.password_confirm = 'Confirma la contraseña';
      } else if (formData.password !== formData.password_confirm) {
        newErrors.password_confirm = 'Las contraseñas no coinciden';
      }
    } else {
      // Para edición, la contraseña es opcional pero si se proporciona debe ser válida
      if (formData.password) {
        if (formData.password.length < 8) {
          newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }
        
        if (!formData.password_confirm) {
          newErrors.password_confirm = 'Confirma la nueva contraseña';
        } else if (formData.password !== formData.password_confirm) {
          newErrors.password_confirm = 'Las contraseñas no coinciden';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (editStudent) {
        // Actualizar estudiante existente
        const updateData: Partial<CreateStudentData> = {
          username: formData.username,
          carnet: formData.carnet
        };

        // Solo incluir password si se proporcionó una nueva
        if (formData.password) {
          updateData.password = formData.password;
          updateData.password_confirm = formData.password_confirm;
        }

        const response = await studentService.updateStudent(editStudent.id, updateData);
        
        alert(`✅ Estudiante actualizado exitosamente!\n\n` +
              `📋 INFORMACIÓN ACTUALIZADA:\n` +
              `Usuario: ${formData.username}\n` +
              `Carnet: ${formData.carnet}\n` +
              `${formData.password ? 'Contraseña: Actualizada' : 'Contraseña: Sin cambios'}\n\n` +
              `Los cambios han sido guardados correctamente.`);
        
        onSuccess();
      } else {
        // Crear nuevo estudiante
        const response = await studentService.createStudent(formData);
        
        // Mostrar la contraseña al admin
        if (response.temp_password) {
          alert(
            `✅ Estudiante creado exitosamente!\n\n` +
            `📋 CREDENCIALES:\n` +
            `Usuario: ${formData.username}\n` +
            `Carnet: ${formData.carnet}\n` +
            `Contraseña: ${response.temp_password}\n\n` +
            `⚠️ IMPORTANTE: Guarda esta contraseña, es la única vez que se mostrará.`
          );
        }
        
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving student:', error);
      setErrors({ submit: error.message || 'Error al guardar el estudiante' });
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const password = studentService.generateTempPassword();
    setFormData(prev => ({
      ...prev,
      password,
      password_confirm: password
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editStudent ? 'Editar Estudiante' : 'Crear Nuevo Estudiante'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                Nombre de Usuario *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="usuario123"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Carnet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="inline w-4 h-4 mr-2" />
                Carnet *
              </label>
              <input
                type="text"
                name="carnet"
                value={formData.carnet}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                  errors.carnet ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="20230001"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.carnet && (
                <p className="text-red-500 text-sm mt-1">{errors.carnet}</p>
              )}
            </div>

            {/* Password Fields */}
            {!editStudent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="inline w-4 h-4 mr-2" />
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="inline w-4 h-4 mr-2" />
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirm"
                      value={formData.password_confirm}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password_confirm ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Repite la contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password_confirm && (
                    <p className="text-red-500 text-sm mt-1">{errors.password_confirm}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="inline w-4 h-4 mr-2" />
                    Nueva Contraseña (opcional)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Dejar vacío para mantener actual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="inline w-4 h-4 mr-2" />
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirm"
                      value={formData.password_confirm}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password_confirm ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Repite la nueva contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password_confirm && (
                    <p className="text-red-500 text-sm mt-1">{errors.password_confirm}</p>
                  )}
                </div>
              </div>
            )}

            {/* Generate Password Button */}
            {!editStudent && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={generatePassword}
                  className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  🔄 Generar contraseña aleatoria
                </button>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errors.submit}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : (editStudent ? 'Actualizar' : 'Crear Estudiante')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStudentForm;
