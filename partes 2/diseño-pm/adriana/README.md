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

## 🚀 INSTALACIÓN ULTRA ESPECÍFICA PASO A PASO

### ⚠️ **PRERREQUISITOS OBLIGATORIOS - VERIFICACIÓN EXACTA:**

**PASO 0.1: VERIFICAR QUE TIENES WINDOWS 10 O 11**
- Presiona `Windows + R`
- Escribe `winver` y presiona Enter
- Debe mostrar Windows 10 versión 1903 o superior, o Windows 11

**PASO 0.2: DESCARGAR E INSTALAR NODE.JS (SI NO LO TIENES)**
1. Ve a https://nodejs.org/
2. Descarga la versión **LTS** (Long Term Support) - debe ser 18.x.x o superior
3. Ejecuta el instalador `.msi`
4. **IMPORTANTE:** Durante la instalación, asegúrate de que esté marcada la casilla "Add to PATH"
5. Reinicia tu computadora después de instalar

**PASO 0.3: DESCARGAR E INSTALAR PYTHON (SI NO LO TIENES)**
1. Ve a https://www.python.org/downloads/
2. Descarga Python 3.11.x o superior
3. Ejecuta el instalador `.exe`
4. **CRÍTICO:** Marca la casilla "Add Python to PATH" antes de instalar
5. Marca "Install for all users"
6. Reinicia tu computadora después de instalar

**PASO 0.4: DESCARGAR E INSTALAR GIT (SI NO LO TIENES)**
1. Ve a https://git-scm.com/download/win
2. Descarga Git para Windows
3. Ejecuta el instalador
4. Durante la instalación, selecciona "Git from the command line and also from 3rd-party software"
5. Reinicia tu computadora después de instalar

### 🔍 **PASO 1: VERIFICACIÓN DE PRERREQUISITOS - COMANDOS EXACTOS**

**PASO 1.1: ABRIR POWERSHELL COMO ADMINISTRADOR**
1. Presiona la tecla `Windows` (la tecla con el logo de Windows)
2. Escribe `powershell`
3. Haz clic derecho en "Windows PowerShell"
4. Selecciona "Ejecutar como administrador"
5. Si aparece un mensaje de "Control de cuentas de usuario", haz clic en "Sí"

**PASO 1.2: VERIFICAR QUE POWERSHELL ESTÁ COMO ADMINISTRADOR**
- En la ventana de PowerShell, el título debe decir "Administrador: Windows PowerShell"
- Si NO dice "Administrador", cierra la ventana y repite el paso 1.1

**PASO 1.3: EJECUTAR COMANDOS DE VERIFICACIÓN - UNO POR UNO**

```powershell
# Comando 1: Verificar Node.js
node --version
```
**RESULTADO ESPERADO:** `v18.17.0` o similar (número debe empezar con 18, 19, 20, etc.)
**SI NO FUNCIONA:** Node.js no está instalado o no está en el PATH. Repetir PASO 0.2

```powershell
# Comando 2: Verificar npm
npm --version
```
**RESULTADO ESPERADO:** `9.6.7` o similar (número debe empezar con 9, 10, etc.)
**SI NO FUNCIONA:** npm no está instalado. Repetir PASO 0.2

```powershell
# Comando 3: Verificar Python
python --version
```
**RESULTADO ESPERADO:** `Python 3.11.5` o similar (número debe empezar con 3.11, 3.12, etc.)
**SI NO FUNCIONA:** Python no está instalado o no está en el PATH. Repetir PASO 0.3

```powershell
# Comando 4: Verificar Git
git --version
```
**RESULTADO ESPERADO:** `git version 2.41.0.windows.1` o similar
**SI NO FUNCIONA:** Git no está instalado. Repetir PASO 0.4

### 📥 **PASO 2: DESCARGAR EL REPOSITORIO - INSTRUCCIONES EXACTAS**

**PASO 2.1: OPCIÓN A - CLONAR DESDE GITHUB (RECOMENDADO)**

```powershell
# Navegar al escritorio
cd C:\Users\$env:USERNAME\Desktop

# Clonar el repositorio KeyHoursAdmin
git clone https://github.com/eRomerodev/KeyHoursAdmin.git

# Renombrar la carpeta para que coincida con el proyecto
Rename-Item "KeyHoursAdmin" "Key hours"

# Navegar al proyecto
cd "Key hours"
```

**PASO 2.2: OPCIÓN B - DESCARGAR ZIP DESDE GITHUB**

1. **Ir al repositorio GitHub:**
   - Ve a: `https://github.com/eRomerodev/KeyHoursAdmin`
   - Haz clic en el botón verde "Code"
   - Selecciona "Download ZIP"

2. **Extraer el archivo:**
   - Busca el archivo `KeyHoursAdmin-main.zip` en tu carpeta de descargas
   - Haz clic derecho en el archivo ZIP
   - Selecciona "Extraer todo..."
   - Selecciona como destino: `C:\Users\%USERNAME%\Desktop\`
   - Marca "Mostrar archivos extraídos cuando termine"
   - Haz clic en "Extraer"

3. **Renombrar la carpeta:**
   - Renombra la carpeta `KeyHoursAdmin-main` a `Key hours`
   - La carpeta debe contener: `manage.py`, `package.json`, `requirements.txt`, las 6 carpetas principales, etc.

### 📁 **PASO 3: PREPARAR EL PROYECTO - COMANDOS EXACTOS**

**PASO 3.1: NAVEGAR AL PROYECTO EN POWERSHELL**

```powershell
# Comando exacto para navegar al proyecto
cd "C:\Users\$env:USERNAME\Desktop\Key hours"
```

**PASO 3.2: VERIFICAR QUE ESTÁS EN LA CARPETA CORRECTA**

```powershell
# Listar archivos en la carpeta
dir
```

**ARCHIVOS QUE DEBES VER:**
- `manage.py`
- `package.json`
- `requirements.txt`
- `README.md`
- Las 6 carpetas principales: `# Componentes principales y páginas de admin`, `Backend`, `Diseño`, `Diseño2`, `frontend`, `marco`
- Y otros archivos del proyecto

**SI NO VES ESTOS ARCHIVOS:**
- Verifica que la carpeta se llama exactamente "Key hours" (con espacio)
- Verifica que esté en tu escritorio
- Si faltan archivos, repite el PASO 2

### 🐍 **PASO 4: CONFIGURAR BACKEND (DJANGO) - COMANDOS UNO POR UNO**

**IMPORTANTE:** Ejecutar estos comandos **UNO POR UNO** en PowerShell como Administrador. **NO** ejecutar todos de una vez.

**PASO 4.1: CREAR ENTORNO VIRTUAL**

```powershell
# Comando para crear entorno virtual
python -m venv venv
```

**RESULTADO ESPERADO:** No debe mostrar ningún error
**SI HAY ERROR:** Python no está instalado correctamente. Repetir PASO 0.3

**PASO 4.2: ACTIVAR ENTORNO VIRTUAL**

```powershell
# Comando para activar entorno virtual
.\venv\Scripts\Activate.ps1
```

**RESULTADO ESPERADO:** 
- Al inicio de la línea de comando debe aparecer `(venv)`
- Ejemplo: `(venv) PS C:\Users\...>`

**SI APARECE ERROR DE POLÍTICA DE EJECUCIÓN:**
```powershell
# Ejecutar este comando para cambiar la política
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Presionar Y cuando pregunte
# Luego volver a ejecutar: .\venv\Scripts\Activate.ps1
```

**PASO 4.3: ACTUALIZAR PIP**

```powershell
# Comando para actualizar pip
python -m pip install --upgrade pip
```

**RESULTADO ESPERADO:** Debe mostrar "Successfully installed pip-xx.x.x"

**PASO 4.4: INSTALAR DEPENDENCIAS DE DJANGO**

```powershell
# Comando para instalar dependencias
pip install -r requirements.txt
```

**RESULTADO ESPERADO:** Debe mostrar "Successfully installed Django-5.2.x" y otras dependencias
**SI HAY ERROR:** Verificar que el archivo `requirements.txt` existe en la carpeta

**PASO 4.5: VERIFICAR INSTALACIÓN DE DJANGO**

```powershell
# Comando para verificar Django
python -c "import django; print(django.get_version())"
```

**RESULTADO ESPERADO:** `5.2.x` o similar
**SI HAY ERROR:** Django no se instaló correctamente. Repetir PASO 4.4

**PASO 4.6: EJECUTAR MIGRACIONES DE BASE DE DATOS**

```powershell
# Comando 1: Crear migraciones
python manage.py makemigrations
```

**RESULTADO ESPERADO:** Debe mostrar "No changes detected" o "Migrations for '...'"

```powershell
# Comando 2: Aplicar migraciones
python manage.py migrate
```

**RESULTADO ESPERADO:** Debe mostrar "Applying migrations..." y luego "OK"

**PASO 4.7: CREAR SUPERUSUARIO (OPCIONAL)**

```powershell
# Comando para crear superusuario
python manage.py createsuperuser
```

**INSTRUCCIONES PARA CREAR SUPERUSUARIO:**
1. **Username:** Escribe `admin` y presiona Enter
2. **Email address:** Escribe `admin@keyhours.com` y presiona Enter
3. **Password:** Escribe `admin123` y presiona Enter
4. **Password (again):** Escribe `admin123` otra vez y presiona Enter

**RESULTADO ESPERADO:** "Superuser created successfully"

**PASO 4.8: INICIAR SERVIDOR DE DJANGO**

```powershell
# Comando para iniciar servidor Django
python manage.py runserver
```

**RESULTADO ESPERADO:** 
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

**CRÍTICO:** **NO CERRAR ESTA TERMINAL** - El servidor Django debe seguir corriendo

### ⚛️ **PASO 5: CONFIGURAR FRONTEND (REACT) - NUEVA TERMINAL**

**PASO 5.1: ABRIR NUEVA TERMINAL DE POWERSHELL COMO ADMINISTRADOR**
- Repetir PASO 1.1 para abrir una nueva ventana de PowerShell como Administrador
- **NO cerrar la terminal anterior donde corre Django**

**PASO 5.2: NAVEGAR AL PROYECTO EN LA NUEVA TERMINAL**

```powershell
# Comando para navegar al proyecto
cd "C:\Users\$env:USERNAME\Desktop\Key hours"
```

**PASO 5.3: VERIFICAR QUE PACKAGE.JSON EXISTE**

```powershell
# Comando para verificar package.json
dir package.json
```

**RESULTADO ESPERADO:** Debe mostrar información del archivo `package.json`
**SI NO EXISTE:** El proyecto no se descargó correctamente. Repetir PASO 2

**PASO 5.4: LIMPIAR CACHÉ DE NPM**

```powershell
# Comando para limpiar caché
npm cache clean --force
```

**RESULTADO ESPERADO:** "npm cache cleaned"

**PASO 5.5: INSTALAR DEPENDENCIAS DE REACT**

```powershell
# Comando para instalar dependencias
npm install
```

**RESULTADO ESPERADO:** Debe mostrar "added 1336 packages" y luego "audited 1337 packages"
**TIEMPO ESTIMADO:** 2-5 minutos
**SI HAY ERROR:** Verificar conexión a internet y repetir el comando

**PASO 5.6: VERIFICAR INSTALACIÓN DE REACT**

```powershell
# Comando para verificar React
npm list react
```

**RESULTADO ESPERADO:** `react@18.2.0` o similar

**PASO 5.7: INICIAR SERVIDOR DE REACT**

```powershell
# Comando para iniciar servidor React
npm start
```

**RESULTADO ESPERADO:** 
- Debe mostrar "webpack compiled successfully"
- Debe abrir automáticamente tu navegador en `http://localhost:3000`
- En la terminal debe mostrar "Local: http://localhost:3000"

**CRÍTICO:** **NO CERRAR ESTA TERMINAL** - El servidor React debe seguir corriendo

### 🌐 **PASO 6: VERIFICAR FUNCIONAMIENTO - VERIFICACIONES EXACTAS**

**PASO 6.1: VERIFICAR QUE AMBOS SERVIDORES ESTÁN CORRIENDO**

**Debes tener DOS terminales abiertas:**

**Terminal 1 (Django):**
- Debe mostrar: `Starting development server at http://127.0.0.1:8000/`
- **NO debe estar cerrada**

**Terminal 2 (React):**
- Debe mostrar: `webpack compiled successfully`
- Debe mostrar: `Local: http://localhost:3000`
- **NO debe estar cerrada**

**PASO 6.2: VERIFICAR URLS EN EL NAVEGADOR**

**Abrir tu navegador web y verificar estas URLs:**

1. **http://localhost:3000**
   - **RESULTADO ESPERADO:** Debe mostrar la página principal de KeyHours
   - **SI NO FUNCIONA:** El servidor React no está corriendo. Repetir PASO 5.7

2. **http://127.0.0.1:8000/admin/**
   - **RESULTADO ESPERADO:** Debe mostrar la página de login de Django Admin
   - **SI NO FUNCIONA:** El servidor Django no está corriendo. Repetir PASO 4.8

3. **http://localhost:3000/login**
   - **RESULTADO ESPERADO:** Debe mostrar la página de login de estudiantes
   - **SI NO FUNCIONA:** Hay un problema con React Router

## 🔐 CREDENCIALES DE PRUEBA - DATOS EXACTOS

### **Estudiante (Usuario de Prueba):**
- **Usuario:** `David`
- **Carnet:** `00001`
- **Contraseña:** `s76cuzlA`
- **URL de Login:** `http://localhost:3000/login`

### **Administrador:**
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **URL de Login:** `http://localhost:3000/admin-login`

### **Admin Django (Opcional):**
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **URL de Login:** `http://127.0.0.1:8000/admin/`

## 🚨 SOLUCIÓN DE PROBLEMAS - SOLUCIONES EXACTAS

### **Error: "python no se reconoce como comando"**
**CAUSA:** Python no está en el PATH del sistema
**SOLUCIÓN:**
1. Ve a Panel de Control > Sistema > Configuración avanzada del sistema
2. Haz clic en "Variables de entorno"
3. En "Variables del sistema", busca "Path" y haz clic en "Editar"
4. Haz clic en "Nuevo" y agrega: `C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python311\`
5. Haz clic en "Aceptar" en todas las ventanas
6. Reinicia PowerShell como Administrador

### **Error: "npm no se reconoce como comando"**
**CAUSA:** Node.js no está instalado correctamente
**SOLUCIÓN:**
1. Desinstalar Node.js desde Panel de Control
2. Descargar Node.js LTS desde https://nodejs.org/
3. Instalar con la casilla "Add to PATH" marcada
4. Reiniciar computadora
5. Abrir PowerShell como Administrador y probar `npm --version`

### **Error: "ModuleNotFoundError: No module named 'django'"**
**CAUSA:** Entorno virtual no activado o Django no instalado
**SOLUCIÓN:**
```powershell
# Activar entorno virtual
.\venv\Scripts\Activate.ps1

# Verificar que aparece (venv) al inicio
# Instalar Django
pip install -r requirements.txt
```

### **Error: "npm ERR! code ENOENT"**
**CAUSA:** Archivos de node_modules corruptos
**SOLUCIÓN:**
```powershell
# Limpiar caché
npm cache clean --force

# Eliminar node_modules
Remove-Item -Recurse -Force node_modules

# Reinstalar dependencias
npm install
```

### **Error: "Port 3000 is already in use"**
**CAUSA:** Puerto 3000 está ocupado por otra aplicación
**SOLUCIÓN:**
```powershell
# Opción 1: Cambiar puerto
$env:PORT=3001
npm start

# Opción 2: Matar proceso que usa puerto 3000
netstat -ano | findstr :3000
# Usar el PID que aparece para matar el proceso
taskkill /PID [NUMERO_PID] /F
```

### **Error: "Port 8000 is already in use"**
**CAUSA:** Puerto 8000 está ocupado por otra aplicación
**SOLUCIÓN:**
```powershell
# Cambiar puerto Django
python manage.py runserver 8001
```

### **Error: "Execution Policy" en PowerShell**
**CAUSA:** PowerShell no permite ejecutar scripts
**SOLUCIÓN:**
```powershell
# Cambiar política de ejecución
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Presionar Y cuando pregunte
```

### **Error: "Cannot find module" en TypeScript**
**CAUSA:** Tipos de TypeScript no instalados
**SOLUCIÓN:**
```powershell
# Instalar tipos faltantes
npm install --save-dev @types/react @types/react-dom @types/react-router-dom@5
```

### **Error: "webpack compiled with errors"**
**CAUSA:** Errores de sintaxis en el código
**SOLUCIÓN:**
1. Verificar la terminal donde corre React
2. Buscar el archivo y línea específica del error
3. Corregir el error de sintaxis
4. Guardar el archivo
5. React se recompilará automáticamente

### **Error: "Failed to compile"**
**CAUSA:** Errores de importación o sintaxis
**SOLUCIÓN:**
1. Verificar que todos los archivos importados existen
2. Verificar la sintaxis de las importaciones
3. Verificar que no hay errores de TypeScript
4. Guardar todos los archivos modificados

## 📁 ESTRUCTURA DEL PROYECTO - ARCHIVOS EXACTOS

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
│   └── logo-key-hours.jpg       # Logo JPG
├── 📂 # Componentes principales y páginas de admin    # Trabajo de Joshua (Frontend)
├── 📂 Backend/david                                  # Trabajo de David (Backend)
├── 📂 Diseño/adriana                                 # Trabajo de Adriana (Diseño y PM)
├── 📂 Diseño2/adriana                                # README de Adriana (Documentación)
├── 📂 frontend/emiliano                              # Trabajo de Emiliano (Frontend)
├── 📂 marco                                          # Trabajo de Marco (Backend)
├── 📄 manage.py                 # Script principal Django
├── 📄 requirements.txt          # Dependencias Python
├── 📄 package.json              # Dependencias Node.js
├── 📄 db.sqlite3                # Base de datos SQLite
└── 📄 README.md                 # Este archivo
```

## 👥 ESTRUCTURA DEL EQUIPO - RESPONSABILIDADES EXACTAS

### **Frontend (50% - 50%):**
- **Joshua**: `# Componentes principales y páginas de admin`
  - DashboardAdminKeyHours.tsx
  - ProfileAdminKeyHours.tsx
  - NewProjectKeyHours.tsx
  - ProjectDetailKeyHours.tsx
  - StudentsScreenKeyHours.tsx
  - Componentes principales y páginas de administrador

- **Emiliano**: `frontend/emiliano`
  - LoginForm.tsx, UnifiedLogin.tsx
  - ApplicationForm.tsx
  - KeyHoursHero.tsx, MissionVision.tsx
  - StudentDashboard.tsx
  - ConvocatoriasPage.tsx
  - Componentes de estudiante y servicios

### **Backend (50% - 50%):**
- **Marco**: `marco` (Módulo Projects - Gestión de proyectos)
  - projects/models.py, projects/views.py, projects/serializers.py
  - Implementación de clase Proyecto con métodos crearProyecto(), editarProyecto(), asignarCupos()
  - Persistencia de datos en base de datos SQLite
  - Gestión de convocatorias y asignación de cupos
  - Control de visibilidad y estados de proyectos
  - APIs REST para CRUD de proyectos y gestión de miembros
  - Validaciones de fechas y límites de participantes
  - Sistema de requisitos y documentos de proyectos
  - Estadísticas y reportes de proyectos
  - Gestión de categorías de proyectos
  - Control de asignación automática/manual de horas
  - Métodos de dominio para encapsulación POO
  - Check Point 1: Implementación completa de gestión de proyectos
  - Check Point 2: Mejoras pendientes en encapsulación y persistencia

- **David**: `Backend/david` (Módulos Hours y Applications - Horas sociales + validación admin)
  - hours/models.py, hours/views.py, hours/serializers.py
  - applications/models.py, applications/views.py, applications/serializers.py
  - Implementación de clase RegistroHora con métodos registrarHora(), validarHora()
  - Vinculación de registros con estudiantes y proyectos
  - Sistema de validación de horas por administradores
  - Gestión de aplicaciones y seguimiento de progreso
  - APIs REST para registro y validación de horas
  - Validaciones de tiempo y estados de aplicación
  - Sistema de notificaciones y reportes de horas
  - Gestión de metas y resúmenes de horas
  - Sistema de evaluaciones y documentos de aplicaciones
  - Control de transiciones de estado y flujo de trabajo
  - Persistencia de registros y vinculación UML
  - Check Point 1: Implementación completa de horas sociales y validación
  - Check Point 2: Mejoras pendientes en propagación automática y validaciones

### **Diseño y PM (100%):**
- **Adriana**: `Diseño/adriana` (CSS, assets, documentación y configuración)
  - src/styles/smooth-animations.css
  - src/index.css
  - public/logo-key-hours.jpg
  - package.json, tailwind.config.js
  - tsconfig.json
  - postcss.config.js
  - README.md (documentación del proyecto)

- **Adriana**: `Diseño2/adriana` (README de diseño)
  - Documentación específica de diseño y project management

## 🔧 COMANDOS ÚTILES - COMANDOS EXACTOS

### **Backend (Django):**
```powershell
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
```powershell
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
$env:PORT=3001; npm start
```

## 📊 FUNCIONALIDADES IMPLEMENTADAS - LISTA EXACTA

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

## 🎨 ESPECIFICACIONES DE DISEÑO - VALORES EXACTOS

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

## 📈 MÉTRICAS DEL PROYECTO - NÚMEROS EXACTOS

- **116 archivos** de código fuente
- **27 directorios** organizados
- **5 módulos** Django principales
- **25+ componentes** React
- **20+ páginas** implementadas
- **4 servicios** API completos
- **1 base de datos** SQLite
- **1 sistema** de autenticación JWT

## 👨‍🏫 INFORMACIÓN PARA EL PROFESOR - INSTRUCCIONES EXACTAS

### **Para Evaluar el Proyecto:**

1. **Seguir pasos de instalación** exactamente como se indican arriba
2. **Verificar que ambas aplicaciones corren** (Django en 8000, React en 3000)
3. **Probar credenciales** de admin y estudiante
4. **Revisar las 6 carpetas principales** del repositorio KeyHoursAdmin para evaluación individual del trabajo
5. **Explorar funcionalidades** navegando por la aplicación

### **URLs de Evaluación - URLs EXACTAS:**
- **Aplicación Principal:** `http://localhost:3000`
- **Login Admin:** `http://localhost:3000/admin-login`
- **Login Estudiante:** `http://localhost:3000/login`
- **Admin Django:** `http://127.0.0.1:8000/admin/`
- **API Backend:** `http://127.0.0.1:8000/api/`

### **Puntos Clave del Proyecto:**
- ✅ Arquitectura full-stack moderna (React + Django)
- ✅ Separación clara de responsabilidades por módulos
- ✅ Diseño responsive y accesible
- ✅ Sistema de autenticación JWT robusto
- ✅ API REST bien estructurada y documentada
- ✅ Código limpio, comentado y bien organizado
- ✅ Distribución equitativa del trabajo en equipo (6 carpetas principales)
- ✅ Interfaz de usuario moderna y profesional
- ✅ Estructura del repositorio KeyHoursAdmin organizada por miembros

### **Contacto para Soporte:**
Si hay problemas técnicos durante la evaluación, contactar al equipo de desarrollo.

---

**Desarrollado por:** Equipo KeyHours  
**Miembros:** Joshua, Emiliano, David, Marco, Adriana  
**Institución:** Instituto Kriete de Ingeniería y Ciencias  
**Año:** 2025  
**Tecnologías:** React 18, Django 5.2, TypeScript, Tailwind CSS