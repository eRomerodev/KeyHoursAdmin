# KeyHours - Backend (David)

## 🎯 Tu Responsabilidad

Como parte del equipo de backend, tu responsabilidad principal es trabajar en los módulos de **Users** y **Projects**.

## 📁 Archivos Principales que Tienes

### 🔐 Users Module (users/)
- **`models.py`** - Modelo de usuario personalizado con campos como carnet, user_type, etc.
- **`serializers.py`** - Serializers para registro, login, perfil de usuario
- **`views.py`** - APIs de autenticación, gestión de usuarios, becas
- **`admin.py`** - Configuración del admin de Django
- **`urls.py`** - Rutas del módulo de usuarios

### 🏗️ Projects Module (projects/)
- **`models.py`** - Modelos de proyectos, categorías, requisitos y documentos
- **`serializers.py`** - Serializers para proyectos y convocatorias
- **`views.py`** - APIs de gestión de proyectos, CRUD completo
- **`admin.py`** - Configuración del admin de proyectos
- **`urls.py`** - Rutas del módulo de proyectos

### ⚙️ Configuración (keyhours_backend/)
- **`settings.py`** - Configuración principal de Django
- **`urls.py`** - Rutas principales del proyecto
- **`wsgi.py`** y **`asgi.py`** - Configuración de servidor

## 🚀 Comandos Útiles

```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver
```

## 📋 Tareas Sugeridas

1. **Optimizar modelos de Users y Projects**
2. **Mejorar validaciones en serializers**
3. **Agregar filtros y búsquedas avanzadas**
4. **Implementar paginación en las vistas**
5. **Añadir tests unitarios**

## 🔗 Colaboración con Marco

Marco está trabajando en **Applications** y **Hours**. Coordínate con él para:
- Integración de APIs entre módulos
- Consistencia en la estructura de datos
- Testing conjunto

¡Tienes TODO el proyecto para trabajar! 🎉