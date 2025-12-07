import React, { useState } from 'react';
import { X, User, Lock, CreditCard, Eye, EyeOff, Award, Percent } from 'lucide-react';
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
    first_name: editStudent?.first_name || '',
    last_name: editStudent?.last_name || '',
    password: '',
    password_confirm: '',
    carnet: editStudent?.carnet || '',
    scholarship_type: editStudent?.scholarship_type || 'KEY EXCELLENCE',
    scholarship_percentage: editStudent?.scholarship_percentage || 100,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convertir carnet a mayúsculas automáticamente
    let processedValue = value;
    if (name === 'carnet') {
      processedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'scholarship_percentage' 
        ? (processedValue === '' ? undefined : parseFloat(processedValue)) 
        : processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Función para generar username automáticamente
  const generateUsername = (firstName: string, lastName: string, carnet: string): string => {
    // Si hay nombre y apellido, crear username basado en ellos
    if (firstName && lastName) {
      const first = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const last = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (first && last) {
        return `${first}.${last}`.substring(0, 30); // Limitar a 30 caracteres
      }
    }
    // Si no, usar el carnet
    return carnet.toLowerCase();
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validar nombre completo (first_name y last_name) o username
    if (!editStudent) {
      // Para nuevos estudiantes, requerir nombre y apellido
      if (!formData.first_name?.trim()) {
        newErrors.first_name = 'El nombre es requerido';
      }
      if (!formData.last_name?.trim()) {
        newErrors.last_name = 'El apellido es requerido';
      }
    } else {
      // Para edición, username es opcional si hay nombre/apellido
      if (!formData.username?.trim() && !formData.first_name?.trim() && !formData.last_name?.trim()) {
        newErrors.username = 'El nombre de usuario o nombre completo es requerido';
      }
    }

    if (!formData.carnet.trim()) {
      newErrors.carnet = 'El carnet es requerido';
    } else if (!studentService.validateCarnet(formData.carnet)) {
      newErrors.carnet = 'El carnet debe contener solo letras mayúsculas y números';
    }

    if (!formData.scholarship_type || !formData.scholarship_type.trim()) {
      newErrors.scholarship_type = 'El tipo de beca es requerido';
    }

    if (formData.scholarship_percentage === undefined || formData.scholarship_percentage === null) {
      newErrors.scholarship_percentage = 'El porcentaje de beca es requerido';
    } else if (formData.scholarship_percentage < 0 || formData.scholarship_percentage > 100) {
      newErrors.scholarship_percentage = 'El porcentaje debe estar entre 0 y 100';
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
          carnet: formData.carnet,
          scholarship_type: formData.scholarship_type,
          scholarship_percentage: formData.scholarship_percentage,
        };

        // Incluir first_name y last_name si están disponibles
        if (formData.first_name) {
          updateData.first_name = formData.first_name;
        }
        if (formData.last_name) {
          updateData.last_name = formData.last_name;
        }

        // Solo incluir password si se proporcionó una nueva
        if (formData.password) {
          updateData.password = formData.password;
          updateData.password_confirm = formData.password_confirm;
        }

        await studentService.updateStudent(editStudent.id, updateData);
        
        alert(`✅ Estudiante actualizado exitosamente!\n\n` +
              `📋 INFORMACIÓN ACTUALIZADA:\n` +
              `Usuario: ${formData.username}\n` +
              `Carnet: ${formData.carnet}\n` +
              `${formData.password ? 'Contraseña: Actualizada' : 'Contraseña: Sin cambios'}\n\n` +
              `Los cambios han sido guardados correctamente.`);
        
        onSuccess();
      } else {
        // Crear nuevo estudiante
        // Generar username automáticamente si no se proporcionó
        let username = formData.username?.trim();
        if (!username && formData.first_name && formData.last_name) {
          username = generateUsername(formData.first_name, formData.last_name, formData.carnet);
        } else if (!username) {
          // Si no hay username ni nombre completo, usar carnet
          username = formData.carnet.toLowerCase();
        }
        
        // Asegurar que el carnet esté en mayúsculas antes de enviar
        const dataToSend = {
          ...formData,
          carnet: formData.carnet.toUpperCase().trim(),
          username: username,
          first_name: formData.first_name?.trim() || '',
          last_name: formData.last_name?.trim() || '',
        };
        
        const response = await studentService.createStudent(dataToSend);
        
        // Mostrar la contraseña al admin
        if (response.temp_password) {
          const createdUsername = response.user?.username || dataToSend.username;
          alert(
            `✅ Estudiante creado exitosamente!\n\n` +
            `📋 CREDENCIALES:\n` +
            `Nombre: ${dataToSend.first_name} ${dataToSend.last_name}\n` +
            `Usuario: ${createdUsername}\n` +
            `Carnet: ${dataToSend.carnet}\n` +
            `Contraseña: ${response.temp_password}\n\n` +
            `⚠️ IMPORTANTE: Guarda esta contraseña, es la única vez que se mostrará.`
          );
        }
        
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving student:', error);
      
      // Extraer mensaje de error más específico
      let errorMessage = 'Error al guardar el estudiante';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.toString) {
        errorMessage = error.toString();
      }
      
      // Si hay detalles de validación, mostrarlos también
      if (error?.details && typeof error.details === 'object') {
        const detailsMessages = Object.entries(error.details)
          .map(([field, message]: [string, any]) => {
            const msg = Array.isArray(message) ? message[0] : message;
            return `${field}: ${msg}`;
          })
          .join(', ');
        
        if (detailsMessages) {
          errorMessage = `${errorMessage}\n\nDetalles: ${detailsMessages}`;
        }
      }
      
      setErrors({ submit: errorMessage });
      
      // También mostrar en consola para debugging
      console.error('Detalles del error:', {
        message: errorMessage,
        error: error,
        details: error?.details,
        formData: formData
      });
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
            {/* Nombre y Apellido para nuevos estudiantes */}
            {!editStudent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-2" />
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Jose Luis"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-2" />
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Montalvo"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>
            ) : (
              /* Username para edición */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  Nombre de Usuario
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
                <p className="text-xs text-gray-500 mt-1">Solo letras, números y caracteres @/./+/-/_</p>
              </div>
            )}

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

            {/* Scholarship Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="inline w-4 h-4 mr-2" />
                Tipo de Beca *
              </label>
              <input
                type="text"
                name="scholarship_type"
                value={formData.scholarship_type || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.scholarship_type ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="KEY EXCELLENCE"
              />
              {errors.scholarship_type && (
                <p className="text-red-500 text-sm mt-1">{errors.scholarship_type}</p>
              )}
            </div>

            {/* Scholarship Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Percent className="inline w-4 h-4 mr-2" />
                Porcentaje de Beca *
              </label>
              <input
                type="number"
                name="scholarship_percentage"
                value={formData.scholarship_percentage || ''}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.scholarship_percentage ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="100"
              />
              {errors.scholarship_percentage && (
                <p className="text-red-500 text-sm mt-1">{errors.scholarship_percentage}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Valor entre 0 y 100</p>
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
                <div className="font-semibold mb-1">Error de validación</div>
                <div className="text-sm whitespace-pre-line">{errors.submit}</div>
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
