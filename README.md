# 🎓 KeyHours - Sistema de Gestión de Horas de Servicio Comunitario

## 📋 Descripción del Proyecto

**KeyHours** es una plataforma web integral diseñada para gestionar las horas de servicio comunitario de los estudiantes del Instituto Kriete de Ingeniería y Ciencias. El sistema permite a los administradores crear proyectos, gestionar aplicaciones de estudiantes, y hacer seguimiento del progreso de las horas de servicio, mientras que los estudiantes pueden explorar oportunidades, aplicar a proyectos y registrar sus horas.

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

## 🚀 INSTALACIÓN PASO A PASO (MUY IMPORTANTE)

### ⚠️ **PRERREQUISITOS OBLIGATORIOS:**
Antes de continuar, verificar que tienes instalado:
- **Node.js 18.0 o superior** - [Descargar aquí](https://nodejs.org/)
- **Python 3.11 o superior** - [Descargar aquí](https://www.python.org/downloads/)
- **Git** - [Descargar aquí](https://git-scm.com/)

### 🔍 **VERIFICACIÓN DE PRERREQUISITOS:**
Abrir terminal/cmd y ejecutar:
```bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar 9.x.x o superior
python --version  # Debe mostrar Python 3.11.x o superior
git --version     # Debe mostrar git version 2.x.x
```

### 📁 **PASO 1: PREPARAR EL PROYECTO**
```bash
# 1. Navegar al directorio del proyecto
cd "C:\Users\[TU_USUARIO]\Desktop\Key hours"

# 2. Verificar que estás en la carpeta correcta (debe contener manage.py)
dir
# Debe mostrar: manage.py, package.json, requirements.txt, src/, etc.
```

### 🐍 **PASO 2: CONFIGURAR BACKEND (DJANGO) - ORDEN EXACTO**

```bash
# 1. Crear entorno virtual (MUY IMPORTANTE)
python -m venv venv

# 2. Activar entorno virtual
# En Windows:
venv\Scripts\activate
# Debe aparecer (venv) al inicio de la línea de comando

# 3. Actualizar pip
python -m pip install --upgrade pip

# 4. Instalar dependencias EXACTAS
pip install -r requirements.txt

# 5. Verificar instalación Django
python -c "import django; print(django.get_version())"
# Debe mostrar: 5.2.x

# 6. EJECUTAR MIGRACIONES (CRÍTICO)
python manage.py makemigrations
python manage.py migrate

# 7. Crear superusuario (OPCIONAL - para admin Django)
python manage.py createsuperuser
# Seguir las instrucciones en pantalla

# 8. INICIAR SERVIDOR BACKEND
python manage.py runserver
# Debe mostrar: Starting development server at http://127.0.0.1:8000/
```

### ⚛️ **PASO 3: CONFIGURAR FRONTEND (REACT) - ORDEN EXACTO**

**ABRIR NUEVA TERMINAL** (mantener Django corriendo en la anterior):

```bash
# 1. Navegar al directorio del proyecto
cd "C:\Users\[TU_USUARIO]\Desktop\Key hours"

# 2. Verificar que package.json existe
dir package.json

# 3. Limpiar caché npm (por seguridad)
npm cache clean --force

# 4. Instalar dependencias EXACTAS
npm install

# 5. Verificar instalación React
npm list react
# Debe mostrar: react@18.x.x

# 6. INICIAR SERVIDOR FRONTEND
npm start
# Debe abrir automáticamente http://localhost:3000
```

### 🌐 **PASO 4: VERIFICAR FUNCIONAMIENTO**

**Debes tener DOS terminales corriendo simultáneamente:**

1. **Terminal 1:** Django corriendo en http://127.0.0.1:8000/
2. **Terminal 2:** React corriendo en http://localhost:3000/

**URLs importantes:**
- **Aplicación Principal:** http://localhost:3000
- **API Backend:** http://127.0.0.1:8000/api/
- **Admin Django:** http://127.0.0.1:8000/admin/

## 🔐 CREDENCIALES DE PRUEBA

### **Estudiante (Usuario de Prueba):**
- **Usuario:** David
- **Carnet:** 00001
- **Contraseña:** s76cuzlA
- **URL de Login:** http://localhost:3000/login

### **Administrador:**
- **Usuario:** David
- **Carnet:** 00001
- **Contraseña:** s76cuzlA
- **URL de Login:** http://localhost:3000/admin-login

> **Nota:** Las mismas credenciales pueden usarse para probar ambos roles (estudiante y administrador)

## 🚨 SOLUCIÓN DE PROBLEMAS COMUNES

### **Error: "python no se reconoce"**
```bash
# Solución: Agregar Python al PATH
# 1. Buscar "Variables de entorno" en Windows
# 2. Agregar ruta de Python al PATH
# 3. Reiniciar terminal
```

### **Error: "npm no se reconoce"**
```bash
# Solución: Reinstalar Node.js
# 1. Desinstalar Node.js
# 2. Descargar e instalar Node.js 18+ desde nodejs.org
# 3. Reiniciar terminal
```

### **Error: "ModuleNotFoundError: No module named 'django'"**
```bash
# Solución: Activar entorno virtual
venv\Scripts\activate
pip install -r requirements.txt
```

### **Error: "npm ERR! code ENOENT"**
```bash
# Solución: Limpiar e reinstalar
npm cache clean --force
rmdir /s node_modules
npm install
```

### **Error: "Port 3000 is already in use"**
```bash
# Solución: Cambiar puerto
set PORT=3001
npm start
```

### **Error: "Port 8000 is already in use"**
```bash
# Solución: Cambiar puerto Django
python manage.py runserver 8001
```

## 📁 ESTRUCTURA DEL PROYECTO

```
Key hours/
├── 📂 applications/              # Módulo Django - Aplicaciones
│   ├── models.py                # Modelos de base de datos
│   ├── views.py                 # APIs REST
│   ├── serializers.py           # Serializadores
│   └── urls.py                  # Rutas del módulo
├── 📂 hours/                    # Módulo Django - Horas
│   ├── models.py                # Modelos de horas
│   ├── views.py                 # APIs de horas
│   └── serializers.py           # Serializadores de horas
├── 📂 projects/                 # Módulo Django - Proyectos
│   ├── models.py                # Modelos de proyectos
│   ├── views.py                 # APIs de proyectos
│   └── serializers.py           # Serializadores de proyectos
├── 📂 users/                    # Módulo Django - Usuarios
│   ├── models.py                # Modelos de usuarios
│   ├── views.py                 # APIs de usuarios
│   └── serializers.py           # Serializadores de usuarios
├── 📂 keyhours_backend/         # Configuración Django
│   ├── settings.py              # Configuración principal
│   ├── urls.py                  # Rutas principales
│   └── wsgi.py                  # Configuración WSGI
├── 📂 src/                      # Código React
│   ├── 📂 components/           # Componentes React
│   │   ├── DashboardAdminKeyHours.tsx
│   │   ├── KeyHoursHero.tsx
│   │   ├── LoginForm.tsx
│   │   └── ... (25+ componentes)
│   ├── 📂 pages/                # Páginas React
│   │   ├── AdminDashboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── LandingPage.tsx
│   │   └── ... (20+ páginas)
│   ├── 📂 services/             # Servicios API
│   │   ├── authService.ts
│   │   ├── projectService.ts
│   │   ├── studentService.ts
│   │   └── applicationService.ts
│   └── 📂 styles/               # Estilos CSS
│       └── smooth-animations.css
├── 📂 public/                   # Archivos públicos
│   ├── index.html               # HTML principal
│   └── logo-key-hours.svg       # Logo SVG
├── 📂 partes/                   # Distribución por equipos
│   ├── 📂 frontend/
│   │   ├── 📂 joshua/           # Trabajo de Joshua
│   │   └── 📂 emiliano/         # Trabajo de Emiliano
│   ├── 📂 backend/
│   │   ├── 📂 david/            # Trabajo de David
│   │   └── 📂 marco/            # Trabajo de Marco
│   └── 📂 diseño-pm/
│       └── 📂 adriana/          # Trabajo de Adriana
├── 📄 manage.py                 # Script principal Django
├── 📄 requirements.txt          # Dependencias Python
├── 📄 package.json              # Dependencias Node.js
├── 📄 db.sqlite3                # Base de datos SQLite
└── 📄 README.md                 # Este archivo
```

## 👥 ESTRUCTURA DEL EQUIPO

### **Frontend (50% - 50%):**
- **Joshua**: Componentes principales y páginas de administrador
  - DashboardAdminKeyHours.tsx
  - ProfileAdminKeyHours.tsx
  - NewProjectKeyHours.tsx
  - ProjectDetailKeyHours.tsx
  - StudentsScreenKeyHours.tsx

- **Emiliano**: Componentes de estudiante y servicios
  - LoginForm.tsx, UnifiedLogin.tsx
  - ApplicationForm.tsx
  - KeyHoursHero.tsx, MissionVision.tsx
  - StudentDashboard.tsx
  - ConvocatoriasPage.tsx

### **Backend (50% - 50%):**
- **David**: Módulos Users y Projects
  - users/models.py, users/views.py, users/serializers.py
  - projects/models.py, projects/views.py, projects/serializers.py

- **Marco**: Módulos Applications y Hours
  - applications/models.py, applications/views.py, applications/serializers.py
  - hours/models.py, hours/views.py, hours/serializers.py

### **Diseño y PM (100%):**
- **Adriana**: CSS, assets, documentación y configuración
  - src/styles/smooth-animations.css
  - src/index.css
  - public/logo-key-hours.svg
  - package.json, tailwind.config.js
  - tsconfig.json

## 🔧 COMANDOS ÚTILES

### **Backend (Django):**
```bash
# Verificar que Django funciona
python manage.py check

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Ejecutar servidor en puerto específico
python manage.py runserver 8001

# Shell de Django para pruebas
python manage.py shell

# Crear superusuario
python manage.py createsuperuser

# Ejecutar tests
python manage.py test
```

### **Frontend (React):**
```bash
# Verificar instalación
npm list react

# Instalar dependencia específica
npm install [nombre-paquete]

# Build para producción
npm run build

# Ejecutar tests
npm test

# Linting
npm run lint

# Iniciar en puerto específico
set PORT=3001 && npm start
```

## 📊 FUNCIONALIDADES IMPLEMENTADAS

### ✅ **Completadas:**
- [x] Sistema de autenticación JWT completo
- [x] Dashboard de administrador con estadísticas
- [x] Gestión completa de proyectos y convocatorias
- [x] Sistema de aplicaciones con revisión
- [x] Gestión de estudiantes y credenciales
- [x] Registro y seguimiento de horas de servicio
- [x] Interfaz responsiva (desktop, tablet, mobile)
- [x] Animaciones suaves y transiciones
- [x] Sistema de notificaciones
- [x] Reportes y estadísticas detalladas
- [x] Landing page con diseño institucional
- [x] Formularios de aplicación a proyectos
- [x] Perfiles de usuario personalizados

## 🎨 ESPECIFICACIONES DE DISEÑO

### **Paleta de Colores:**
```css
--primary-dark: #07070a      /* Fondo principal */
--secondary-dark: #0f1020    /* Fondo secundario */
--accent-blue: #2c2eff       /* Azul institucional */
--gradient-start: #07070a    /* Inicio gradiente */
--gradient-end: #2c2eff      /* Fin gradiente */
```

### **Responsive Breakpoints:**
- **Desktop:** 1200px+
- **Tablet:** 768px - 1199px
- **Mobile:** 320px - 767px

## 📈 MÉTRICAS DEL PROYECTO

- **116 archivos** de código fuente
- **27 directorios** organizados
- **5 módulos** Django principales
- **25+ componentes** React
- **20+ páginas** implementadas
- **4 servicios** API completos
- **1 base de datos** SQLite
- **1 sistema** de autenticación JWT

## 👨‍🏫 INFORMACIÓN PARA EL PROFESOR

### **Para Evaluar el Proyecto:**

1. **Seguir pasos de instalación** exactamente como se indican arriba
2. **Verificar que ambas aplicaciones corren** (Django en 8000, React en 3000)
3. **Probar credenciales** de admin y estudiante
4. **Revisar carpeta `partes/`** para evaluación individual del trabajo
5. **Explorar funcionalidades** navegando por la aplicación

### **URLs de Evaluación:**
- **Aplicación Principal:** http://localhost:3000
- **Login Admin:** http://localhost:3000/admin-login
- **Login Estudiante:** http://localhost:3000/login
- **Admin Django:** http://localhost:8000/admin
- **API Backend:** http://localhost:8000/api/

### **Puntos Clave del Proyecto:**
- ✅ Arquitectura full-stack moderna (React + Django)
- ✅ Separación clara de responsabilidades por módulos
- ✅ Diseño responsive y accesible
- ✅ Sistema de autenticación JWT robusto
- ✅ API REST bien estructurada y documentada
- ✅ Código limpio, comentado y bien organizado
- ✅ Distribución equitativa del trabajo en equipo
- ✅ Interfaz de usuario moderna y profesional

### **Contacto para Soporte:**
Si hay problemas técnicos durante la evaluación, contactar al equipo de desarrollo.

---

**Desarrollado por:** Equipo KeyHours  
**Miembros:** Joshua, Emiliano, David, Marco, Adriana  
**Institución:** Instituto Kriete de Ingeniería y Ciencias  
**Año:** 2025  
**Tecnologías:** React 18, Django 5.2, TypeScript, Tailwind CSS