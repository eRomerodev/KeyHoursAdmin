# Key Hours Administrator - Backend

Backend del sistema de administración de horas de servicio comunitario para el Instituto Kriete de Ingeniería y Ciencias.

## 🚀 Características

- **API REST** completa con Django REST Framework
- **Autenticación JWT** con tokens de acceso y refresh
- **Modelos robustos** para usuarios, proyectos, aplicaciones y horas
- **Panel de administración** configurado
- **Documentación** de endpoints automática
- **Validaciones** y permisos por rol de usuario

## 🛠️ Tecnologías

- **Django 5.2.7** - Framework web
- **Django REST Framework** - API REST
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **Python 3.11+** - Lenguaje de programación

## 📦 Instalación

### 1. Clonar y configurar entorno virtual

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

Copia `env_example.txt` a `.env` y configura tus variables:

```env
DEBUG=True
SECRET_KEY=tu-secret-key-aqui
DATABASE_NAME=keyhours_db
DATABASE_USER=root
DATABASE_PASSWORD=tu-password-mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

### 4. Configurar MySQL

Crea la base de datos:

```sql
CREATE DATABASE keyhours_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Ejecutar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Crear superusuario

```bash
python manage.py createsuperuser
```

### 7. Ejecutar servidor

```bash
python manage.py runserver
```

## 📁 Estructura del Proyecto

```
backend/
├── keyhours_backend/          # Configuración del proyecto
│   ├── settings.py           # Configuración principal
│   ├── urls.py              # URLs principales
│   └── wsgi.py              # WSGI
├── users/                   # App de usuarios
│   ├── models.py           # Modelos de usuarios y becas
│   ├── serializers.py      # Serializers para API
│   ├── views.py            # Vistas de la API
│   ├── urls.py             # URLs de usuarios
│   └── admin.py            # Configuración del admin
├── projects/               # App de proyectos
│   ├── models.py          # Modelos de proyectos
│   ├── serializers.py     # Serializers para API
│   ├── views.py           # Vistas de la API
│   ├── urls.py            # URLs de proyectos
│   └── admin.py           # Configuración del admin
├── applications/          # App de aplicaciones
│   ├── models.py         # Modelos de aplicaciones
│   ├── serializers.py    # Serializers para API
│   ├── views.py          # Vistas de la API
│   ├── urls.py           # URLs de aplicaciones
│   └── admin.py          # Configuración del admin
├── hours/                # App de horas
│   ├── models.py        # Modelos de horas
│   ├── serializers.py   # Serializers para API
│   ├── views.py         # Vistas de la API
│   ├── urls.py          # URLs de horas
│   └── admin.py         # Configuración del admin
├── manage.py            # Script de gestión de Django
├── requirements.txt     # Dependencias
└── README.md           # Este archivo
```

## 🔗 Endpoints de la API

### Autenticación
- `POST /api/auth/register/` - Registro de usuarios
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `POST /api/token/refresh/` - Refrescar token

### Usuarios
- `GET /api/auth/profile/` - Perfil del usuario
- `PUT /api/auth/profile/` - Actualizar perfil
- `POST /api/auth/change-password/` - Cambiar contraseña
- `GET /api/auth/students/` - Listar estudiantes
- `GET /api/auth/admins/` - Listar administradores

### Proyectos
- `GET /api/projects/` - Listar proyectos
- `POST /api/projects/create/` - Crear proyecto
- `GET /api/projects/{id}/` - Detalle de proyecto
- `GET /api/projects/convocatorias/` - Listar convocatorias

### Aplicaciones
- `GET /api/applications/` - Listar aplicaciones
- `POST /api/applications/` - Crear aplicación
- `POST /api/applications/{id}/review/` - Revisar aplicación

### Horas
- `GET /api/hours/` - Listar registros de horas
- `POST /api/hours/` - Crear registro de horas
- `POST /api/hours/{id}/review/` - Revisar registro de horas

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación:

1. **Login**: Envía username y password a `/api/auth/login/`
2. **Recibe tokens**: access_token y refresh_token
3. **Usa access_token**: En header `Authorization: Bearer <token>`
4. **Refresca token**: Usa refresh_token cuando expire

## 👥 Roles de Usuario

### Estudiante
- Ver convocatorias disponibles
- Aplicar a proyectos
- Registrar horas de servicio
- Ver su progreso y estadísticas

### Administrador
- Crear y gestionar proyectos
- Revisar aplicaciones
- Aprobar/rechazar registros de horas
- Ver estadísticas globales
- Gestionar usuarios y becas

## 📊 Modelos de Datos

### Usuario
- Información personal y académica
- Tipo de usuario (estudiante/admin)
- Carnet y datos de contacto

### Proyecto
- Información del proyecto
- Manager y miembros
- Configuración de horas
- Visibilidad (unpublished/convocatoria/published)

### Aplicación
- Usuario y proyecto
- Estado (pending/approved/rejected)
- Motivación y experiencia
- Progreso de horas

### Registro de Horas
- Usuario y proyecto
- Fecha, horas y actividad
- Supervisor y descripción
- Estado de revisión

## 🚀 Comandos Útiles

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver

# Cargar datos de prueba
python manage.py loaddata fixtures/initial_data.json

# Ejecutar tests
python manage.py test
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno
- `DEBUG=True` - Modo desarrollo
- `SECRET_KEY` - Clave secreta de Django
- `DATABASE_*` - Configuración de MySQL

### CORS
Configurado para permitir requests desde `http://localhost:3000` (React)

### Archivos Estáticos
En desarrollo, Django sirve archivos estáticos automáticamente.

## 📝 Próximos Pasos

1. **Conectar con Frontend** - Integrar APIs con React
2. **Testing** - Implementar tests unitarios
3. **Documentación** - Swagger/OpenAPI
4. **Deployment** - Configurar para producción
5. **Notificaciones** - Sistema de notificaciones en tiempo real

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte del sistema Key Hours del Instituto Kriete de Ingeniería y Ciencias.