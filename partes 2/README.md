# 📁 Partes 2 - División del Proyecto KeyHours (Versión Actual)

Esta carpeta contiene la división del proyecto **KeyHours** según las responsabilidades de cada miembro del equipo, basada en la versión **ACTUAL** del proyecto.

## 📂 Estructura de Carpetas

```
partes 2/
├── backend/
│   ├── david/          # Módulos Hours y Applications + Users
│   └── marco/          # Módulo Projects
├── frontend/
│   ├── joshua/         # Componentes y páginas de administrador
│   └── emiliano/       # Componentes de estudiante y servicios
└── diseño-pm/
    └── adriana/        # CSS, assets, documentación y configuración
```

## 👥 Responsabilidades por Miembro

### 🔧 **Backend**

#### **David** (`backend/david/`)
- ✅ `hours/` - Módulo completo de gestión de horas sociales
- ✅ `applications/` - Módulo completo de aplicaciones
- ✅ `users/` - Módulo de usuarios (compartido con Marco)
- ✅ `keyhours_backend/` - Configuración de Django
- ✅ `manage.py` - Script principal Django
- ✅ `requirements.txt` - Dependencias Python

**Funcionalidades:**
- Registro y validación de horas sociales
- Gestión de aplicaciones de estudiantes
- Sistema de notificaciones y reportes
- Validaciones de tiempo y estados
- Gestión de metas y resúmenes de horas

#### **Marco** (`backend/marco/`)
- ✅ `projects/` - Módulo completo de gestión de proyectos
- ✅ `users/` - Módulo de usuarios (compartido con David)
- ✅ `keyhours_backend/` - Configuración de Django
- ✅ `manage.py` - Script principal Django
- ✅ `requirements.txt` - Dependencias Python

**Funcionalidades:**
- CRUD completo de proyectos
- Gestión de convocatorias y asignación de cupos
- Control de visibilidad y estados de proyectos
- Sistema de requisitos y documentos
- Estadísticas y reportes de proyectos
- Gestión de categorías de proyectos

### ⚛️ **Frontend**

#### **Joshua** (`frontend/joshua/`)
- ✅ `src/components/DashboardAdminKeyHours.tsx` - Dashboard de administrador
- ✅ `src/components/ProfileAdminKeyHours.tsx` - Perfil de administrador
- ✅ `src/components/NewProjectKeyHours.tsx` - Crear nuevo proyecto
- ✅ `src/components/ProjectDetailKeyHours.tsx` - Detalles de proyecto (admin)
- ✅ `src/components/ApplicantsKeyHours.tsx` - Gestión de aplicantes
- ✅ `src/components/StudentsListAdmin.tsx` - Lista de estudiantes
- ✅ `src/components/CreateStudentForm.tsx` - Formulario de creación de estudiantes
- ✅ `src/components/StudentDetailModal.tsx` - Modal de detalles de estudiante
- ✅ `src/pages/StudentsManagementPage.tsx` - Página de gestión de estudiantes

**Funcionalidades:**
- Interfaz completa de administración
- Gestión de proyectos desde el panel admin
- Gestión de estudiantes y sus credenciales
- Revisión y aprobación de aplicaciones
- Visualización de estadísticas y reportes

#### **Emiliano** (`frontend/emiliano/`)
- ✅ `src/components/UnifiedLogin.tsx` - Login unificado
- ✅ `src/components/ApplicationForm.tsx` - Formulario de aplicación
- ✅ `src/components/KeyHoursHero.tsx` - Hero section del landing
- ✅ `src/components/MissionVision.tsx` - Misión y visión
- ✅ `src/components/ProjectsInspire.tsx` - Proyectos destacados
- ✅ `src/components/FooterKey.tsx` - Footer
- ✅ `src/components/Navbar.tsx` - Barra de navegación
- ✅ `src/components/Sidebar.tsx` - Barra lateral
- ✅ `src/components/Logo.tsx` - Componente de logo
- ✅ `src/components/ProjectCard.tsx` - Tarjeta de proyecto
- ✅ `src/pages/StudentDashboard.tsx` - Dashboard de estudiante
- ✅ `src/pages/StudentProjectDetailPage.tsx` - Detalles de proyecto (estudiante)
- ✅ `src/pages/ProfilePage.tsx` - Perfil de estudiante
- ✅ `src/pages/ConvocatoriasPage.tsx` - Página de convocatorias
- ✅ `src/pages/ProgresoPage.tsx` - Página de progreso
- ✅ `src/pages/InfoPage.tsx` - Página de información
- ✅ `src/pages/SupportPage.tsx` - Página de soporte
- ✅ `src/pages/QAPage.tsx` - Página de preguntas frecuentes
- ✅ `src/services/` - Todos los servicios de API
- ✅ `src/App.tsx` - Componente principal de routing
- ✅ `src/index.tsx` - Punto de entrada
- ✅ `public/` - Assets públicos
- ✅ Archivos de configuración (package.json, tsconfig.json, etc.)

**Funcionalidades:**
- Interfaz completa de estudiante
- Sistema de autenticación
- Aplicación a proyectos
- Visualización de proyectos y convocatorias
- Seguimiento de progreso personal
- Servicios de comunicación con el backend

### 🎨 **Diseño y Project Management**

#### **Adriana** (`diseño-pm/adriana/`)
- ✅ `src/index.css` - Estilos globales
- ✅ `src/styles/smooth-animations.css` - Animaciones
- ✅ `src/components/*.css` - Estilos de componentes
- ✅ `src/pages/*.css` - Estilos de páginas
- ✅ `public/` - Assets y recursos visuales
- ✅ `package.json` - Configuración de dependencias
- ✅ `tailwind.config.js` - Configuración de Tailwind CSS
- ✅ `tsconfig.json` - Configuración de TypeScript
- ✅ `postcss.config.js` - Configuración de PostCSS
- ✅ `README.md` - Documentación principal
- ✅ `DOCUMENTACION_TECNICA.md` - Documentación técnica
- ✅ `INVENTARIO_TECNICO.md` - Inventario técnico (si existe)

**Funcionalidades:**
- Diseño visual completo del proyecto
- Configuración de estilos y temas
- Assets y recursos gráficos
- Documentación técnica y de usuario
- Configuración de herramientas de desarrollo

## 📝 Notas Importantes

1. **Archivos Compartidos**: Algunos módulos como `users/` y `keyhours_backend/` están presentes en ambas carpetas de backend ya que son compartidos entre David y Marco.

2. **Dependencias**: Cada carpeta contiene los archivos necesarios para funcionar, pero algunas dependencias pueden requerir archivos de otras carpetas para funcionar completamente.

3. **Versión Actual**: Esta división refleja el estado **ACTUAL** del proyecto después de todas las mejoras y correcciones implementadas.

4. **Estructura Original**: Esta división sigue la misma estructura que la carpeta `partes/` pero con el contenido actualizado del proyecto.

## 🚀 Uso

Cada miembro puede trabajar en su carpeta correspondiente. Para integrar cambios, se debe copiar el contenido de vuelta a la carpeta raíz del proyecto.

---

**Última actualización:** Diciembre 2024
**Versión del proyecto:** Actual (post-limpieza y optimizaciones)

