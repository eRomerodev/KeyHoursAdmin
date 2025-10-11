# KeyHours - Backend (Marco)

## 🎯 Tu Responsabilidad

Como parte del equipo de backend, tu responsabilidad principal es trabajar en los módulos de **Applications** y **Hours**.

## 📁 Archivos Principales que Tienes

### 📝 Applications Module (applications/)
- **`models.py`** - Modelos de aplicaciones, documentos, evaluaciones y notificaciones
- **`serializers.py`** - Serializers para gestión de aplicaciones
- **`views.py`** - APIs de aplicaciones, revisión, estadísticas
- **`admin.py`** - Configuración del admin de aplicaciones
- **`urls.py`** - Rutas del módulo de aplicaciones

### ⏰ Hours Module (hours/)
- **`models.py`** - Modelos de registros de horas, documentos, resúmenes y metas
- **`serializers.py`** - Serializers para gestión de horas
- **`views.py`** - APIs de horas, reportes, estadísticas
- **`admin.py`** - Configuración del admin de horas
- **`urls.py`** - Rutas del módulo de horas

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

1. **Optimizar flujo de aplicaciones**
2. **Implementar sistema de notificaciones**
3. **Mejorar reportes de horas**
4. **Agregar validaciones de tiempo**
5. **Implementar metas de horas automáticas**

## 🔗 Colaboración con David

David está trabajando en **Users** y **Projects**. Coordínate con él para:
- Integración de APIs entre módulos
- Consistencia en la estructura de datos
- Testing conjunto

¡Tienes TODO el proyecto para trabajar! 🎉