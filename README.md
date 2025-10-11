# 🎓 KeyHours - Sistema de Gestión de Horas de Servicio Comunitario

## 📋 Descripción del Proyecto

**KeyHours** es una plataforma web integral diseñada para gestionar las horas de servicio comunitario de los estudiantes del Instituto Kriete de Ingeniería y Ciencias. El sistema permite a los administradores crear proyectos, gestionar aplicaciones de estudiantes, y hacer seguimiento del progreso de las horas de servicio, mientras que los estudiantes pueden explorar oportunidades, aplicar a proyectos y registrar sus horas.

## 🎯 Características Principales

### 👨‍💼 **Para Administradores:**
- Dashboard completo con estadísticas en tiempo real
- Gestión de proyectos y convocatorias
- Sistema de revisión de aplicaciones
- Gestión de estudiantes y credenciales
- Reportes y estadísticas detalladas

### 🎓 **Para Estudiantes:**
- Exploración de proyectos disponibles
- Sistema de aplicación a proyectos
- Seguimiento de progreso personal
- Registro de horas de servicio
- Perfil personalizado

### 🎨 **Diseño y UX:**
- Interfaz moderna y responsiva
- Animaciones suaves y transiciones
- Paleta de colores institucional
- Diseño accesible y intuitivo

## 🛠️ Tecnologías Utilizadas

### **Frontend:**
- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **React Router** - Navegación
- **Axios** - Cliente HTTP

### **Backend:**
- **Django 5.2** - Framework web
- **Django REST Framework** - API REST
- **SQLite3** - Base de datos
- **JWT** - Autenticación
- **Python 3.11+** - Lenguaje backend

### **Herramientas:**
- **PostCSS** - Procesamiento CSS
- **ESLint** - Linting JavaScript/TypeScript
- **Git** - Control de versiones

## 🚀 Instalación y Configuración

### **Prerrequisitos:**
- Node.js 18+ y npm
- Python 3.11+
- Git

### **1. Clonar el Repositorio:**
```bash
git clone [URL_DEL_REPOSITORIO]
cd "Key hours"
```

### **2. Configurar Backend (Django):**
```bash
# Instalar dependencias de Python
pip install -r requirements.txt

# Ejecutar migraciones de base de datos
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser

# Iniciar servidor backend
python manage.py runserver
```

### **3. Configurar Frontend (React):**
```bash
# Instalar dependencias de Node.js
npm install

# Iniciar servidor de desarrollo
npm start
```

### **4. Acceder a la Aplicación:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Admin Django:** http://localhost:8000/admin

## 📁 Estructura del Proyecto

```
Key hours/
├── 📂 backend/                 # Aplicación Django
│   ├── applications/           # Módulo de aplicaciones
│   ├── hours/                 # Módulo de horas de servicio
│   ├── projects/              # Módulo de proyectos
│   ├── users/                 # Módulo de usuarios
│   └── keyhours_backend/      # Configuración principal
├── 📂 frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/            # Páginas principales
│   │   ├── services/         # Servicios API
│   │   └── styles/           # Estilos personalizados
│   └── public/               # Archivos públicos
├── 📂 partes/                 # Distribución por equipos
├── 📄 requirements.txt        # Dependencias Python
├── 📄 package.json           # Dependencias Node.js
└── 📄 README.md              # Este archivo
```

## 👥 Estructura del Equipo

### **Frontend (50% - 50%):**
- **Joshua**: Componentes principales y páginas de administrador
- **Emiliano**: Componentes de estudiante y servicios

### **Backend (50% - 50%):**
- **David**: Módulos Users y Projects
- **Marco**: Módulos Applications y Hours

### **Diseño y PM (100%):**
- **Adriana**: CSS, assets, documentación y configuración

## 🔐 Credenciales de Prueba

### **Administrador:**
- **Usuario:** admin
- **Contraseña:** admin123

### **Estudiante:**
- **Usuario:** estudiante
- **Contraseña:** estudiante123

## 📊 Funcionalidades Implementadas

### ✅ **Completadas:**
- [x] Sistema de autenticación JWT
- [x] Dashboard de administrador
- [x] Gestión de proyectos y convocatorias
- [x] Sistema de aplicaciones
- [x] Gestión de estudiantes
- [x] Registro de horas de servicio
- [x] Interfaz responsiva
- [x] Animaciones y transiciones
- [x] Sistema de notificaciones
- [x] Reportes y estadísticas

### 🔄 **En Desarrollo:**
- [ ] Sistema de notificaciones en tiempo real
- [ ] Exportación de reportes
- [ ] Integración con sistema de becas
- [ ] Optimizaciones de rendimiento

## 🎨 Paleta de Colores

```css
--primary-dark: #07070a
--secondary-dark: #0f1020
--accent-blue: #2c2eff
--gradient-start: #07070a
--gradient-end: #2c2eff
```

## 📱 Responsive Design

El proyecto está optimizado para:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🧪 Testing

```bash
# Ejecutar tests del backend
python manage.py test

# Ejecutar tests del frontend
npm test
```

## 📈 Métricas del Proyecto

- **116 archivos** de código fuente
- **27 directorios** organizados
- **5 módulos** principales
- **15+ componentes** React
- **20+ páginas** implementadas
- **4 servicios** API completos

## 🔧 Comandos Útiles

### **Backend:**
```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Ejecutar servidor
python manage.py runserver

# Shell de Django
python manage.py shell
```

### **Frontend:**
```bash
# Desarrollo
npm start

# Build de producción
npm run build

# Linting
npm run lint

# Tests
npm test
```

## 📚 Documentación Adicional

- **API Documentation:** http://localhost:8000/api/docs/
- **Component Storybook:** [En desarrollo]
- **Guía de Contribución:** [Ver carpeta `partes/`]

## 🐛 Problemas Conocidos

- [ ] Optimización de imágenes en producción
- [ ] Manejo de errores 500 en frontend
- [ ] Validación de formularios en tiempo real

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍🏫 Información para el Profesor

### **Para Evaluar el Proyecto:**

1. **Ejecutar el proyecto** siguiendo los pasos de instalación
2. **Revisar la carpeta `partes/`** para ver la distribución del trabajo por equipos
3. **Explorar las funcionalidades** usando las credenciales de prueba
4. **Revisar el código** en las carpetas `src/` (frontend) y módulos Django (backend)

### **Puntos Clave del Proyecto:**
- ✅ Arquitectura full-stack moderna
- ✅ Separación clara de responsabilidades
- ✅ Diseño responsive y accesible
- ✅ Sistema de autenticación robusto
- ✅ API REST bien estructurada
- ✅ Código limpio y documentado
- ✅ Distribución equitativa del trabajo en equipo

---

**Desarrollado por:** Equipo KeyHours (Joshua, Emiliano, David, Marco, Adriana)  
**Institución:** Instituto Kriete de Ingeniería y Ciencias  
**Año:** 2025  
**Materia:** [Nombre de la materia]