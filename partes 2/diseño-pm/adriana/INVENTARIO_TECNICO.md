# Inventario Técnico Detallado — Carpeta `partes/`

Este documento centraliza el desglose sintáctico y funcional de las seis copias del proyecto ubicadas en `partes/`. Está dividido por carpetas principales y resalta los fragmentos de código más frecuentes que el profesor podría señalar durante la defensa.

---

## 1. `partes/backend/david`

### `manage.py`
```python
def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'keyhours_backend.settings')
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)
```
- `setdefault` asegura que todos los comandos CLI utilicen `keyhours_backend.settings`.
- `execute_from_command_line(sys.argv)` despacha subcomandos (`runserver`, `migrate`, etc.).

### `keyhours_backend/settings.py`
```python
SECRET_KEY = config('SECRET_KEY', default='django-insecure-...')
DEBUG = config('DEBUG', default=True, cast=bool)
INSTALLED_APPS = [
    'rest_framework', 'corsheaders', 'rest_framework_simplejwt', 'django_filters',
    'users', 'projects', 'hours', 'applications'
]
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
    ...
}
```
- Variables leídas con `python-decouple`.
- DRF + SimpleJWT activados; autenticación JWT obligatoria con permiso `IsAuthenticated`.
- Paginación y filtros (`?search=`, `?ordering=`) habilitados globalmente.

### `users/models.py`
```python
class User(AbstractUser):
    user_type = models.CharField(max_length=20, choices=[('student','Estudiante'),('admin','Administrador')], default='student')
    carnet = models.CharField(max_length=20, unique=True, validators=[RegexValidator(regex=r'^[A-Z0-9]+$')])
    def get_total_hours(self):
        from hours.models import HourLog
        return HourLog.objects.filter(user=self).aggregate(total=models.Sum('hours'))['total'] or 0
```
- `user_type` restringido a estudiante o admin.
- `carnet` validado con regex (solo mayúsculas y números).
- `get_total_hours()` agrega horas desde `HourLog` (import diferido evita ciclos).

### `projects/views.py`
```python
class ProjectListView(generics.ListCreateAPIView):
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    def get_queryset(self):
        queryset = Project.objects.all()
        visibility = self.request.query_params.get('visibility')
        if visibility:
            queryset = queryset.filter(visibility=visibility)
        if self.request.user.user_type == 'student':
            queryset = queryset.filter(Q(visibility='published') | Q(visibility='convocatoria'), is_active=True)
        return queryset.select_related('manager').prefetch_related('applications')
```
- Permite filtrar por `visibility`, restringe a los estudiantes a proyectos publicados/convocatoria activos.
- `select_related` evita consultas extra al acceder al manager.

```python
class ProjectCreateView(generics.CreateAPIView):
    def perform_create(self, serializer):
        if self.request.user.user_type != 'admin':
            raise permissions.PermissionDenied(...)
        serializer.save(manager=self.request.user)
```
- Solo admins pueden crear; se fuerza `manager` al usuario logueado.

```python
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def publish_project(request, project_id):
    project = Project.objects.get(id=project_id, manager=request.user)
    visibility = request.data.get('visibility')
    if visibility not in ['unpublished','convocatoria','published']:
        return Response({'error':'Visibilidad inválida'}, status=400)
    project.visibility = visibility
    project.save()
    return Response(ProjectDetailSerializer(project).data, status=200)
```
- Función decorada como vista DRF; valida visibilidad y asegura que sólo el manager pueda publicar.

### `applications/views.py`
```python
class ApplicationReviewView(APIView):
    def post(self, request, pk):
        application = Application.objects.get(pk=pk)
        if request.user.user_type != 'admin':
            raise permissions.PermissionDenied(...)
        status_choice = request.data.get('status')
        if status_choice not in ['approved','rejected','cancelled']:
            return Response({'error':'Estado inválido'}, status=400)
        application.status = status_choice
        application.reviewed_by = request.user
        application.reviewed_at = timezone.now()
        application.review_notes = request.data.get('review_notes', '')
        application.save()
        return Response(ApplicationSerializer(application).data)
```
- Admin puede aprobar, rechazar o cancelar; se registra revisor y fecha.

### `hours/views.py`
```python
class HourLogListCreateView(generics.ListCreateAPIView):
    def get_queryset(self):
        queryset = HourLog.objects.all()
        if self.request.user.user_type != 'admin':
            queryset = queryset.filter(user=self.request.user)
        return queryset.select_related('project','user')
    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status='pending')
```
- Estudiantes sólo ven sus registros; nuevos logs quedan en `pending`.

### Frontend (`src/`)
- Servicios (`authService`, `projectService`, `applicationService`, `studentService`) replican la lógica descrita en secciones siguientes.
- Componentes admin y student idénticos a los de las carpetas `frontend/...`.

---

## 2. `partes/backend/marco`

- Código backend idéntico a la versión de David.
- Diferencia principal en `src/services/projectService.ts`:
```typescript
const response = await fetch(`${API_BASE_URL}/projects/${id}/debug-update/`, {...});
if (!response.ok) {
  return this.simulateUpdateProject(id, projectData);
}
```
- Si el endpoint real falla, se usa simulación local (`localStorage`) para mantener la UI operativa.
- `applicationService` conserva métodos `simulate*` similares.

---

## 3. `partes/frontend/joshua`

### Servicios
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
private getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
}
```
- Encapsula autorización JWT en un helper reutilizable.

```typescript
async getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/projects/`, { headers: this.getAuthHeaders() });
  if (!response.ok) throw new Error('Error al obtener proyectos');
  const data = await response.json();
  return data.results || data;
}
```
- Devuelve `results` si la API responde paginada, o el arreglo directo.

```typescript
async getProject(id: number, useSimulation = true): Promise<Project> {
  const localProjects = JSON.parse(localStorage.getItem('projects') || '[]');
  const localProject = localProjects.find((p: any) => p.id === id);
  if (localProject) {
    let project = { ...localProject }; // copia defensiva
    if (useSimulation) {
      const projectCounters = JSON.parse(localStorage.getItem('projectCounters') || '{}');
      if (!projectCounters[id]) {
        projectCounters[id] = project.current_participants || 0;
        localStorage.setItem('projectCounters', JSON.stringify(projectCounters));
      } else {
        project.current_participants = projectCounters[id];
        project.available_spots = project.max_participants - projectCounters[id];
      }
    }
    return project;
  }
  // Fallback: fetch al backend ...
}
```
- Simulación opcional: persiste contadores y participantes en `localStorage`.
- Si `useSimulation=false`, intenta inyectar participantes para vistas admin.

### Componentes clave
```tsx
const DashboardAdminKeyHours: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => { loadProjects(); }, []);
  ...
  return (
    <div className="min-h-screen ...">
      <Navbar variant="dashboard" ... />
      <Sidebar ... />
      <main>
        {projects.map((project, index) => (
          <div
            key={project.id}
            onClick={() => navigate(`/admin/project/${project.id}`)}
            style={{ backgroundColor: projectService.getProjectColor(index) }}
          >
            {project.name}
          </div>
        ))}
      </main>
    </div>
  );
};
```
- Usa hooks (`useState`, `useEffect`) y servicios para poblar la UI.
- `projectService.getProjectColor(index)` retorna un color consistente según posición.

```tsx
const ApplicantsKeyHours: React.FC<Props> = ({ applications, onRefresh }) => {
  const handleAction = async (id: number, action: 'approve'|'reject'|'cancel') => {
    await applicationService.reviewApplication(id, action);
    await onRefresh();
  };
  ...
}
```
- Invoca `reviewApplication` y refresca el listado tras cada acción.

---

## 4. `partes/frontend/emiliano`

### `UnifiedLogin.tsx`
```tsx
const [formData, setFormData] = useState({ usuario: "", carnet: "", password: "" });
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const hasCarnet = formData.carnet.trim() !== "";
  const response = await authService.login({
    usuario: formData.usuario,
    carnet: hasCarnet ? formData.carnet : undefined,
    password: formData.password,
    isAdmin: !hasCarnet,
  });
  if (response.user.user_type === "admin") navigate("/admin/dashboard-new");
  else navigate("/student/dashboard");
};
```
- Admin deja el carnet vacío ⇒ `isAdmin=true`, se omite el campo al backend.
- Estudiante sí debe ingresar carnet ⇒ la API valida coincidencia.

### `ConvocatoriasPage.tsx`
```tsx
useEffect(() => { loadData(); }, []);
useEffect(() => {
  const loadApplicationStatuses = async () => {
    const statuses: Record<number, Status> = {};
    await Promise.all(projects.map(async (project) => {
      try {
        const status = await applicationService.getApplicationStatus(project.id);
        statuses[project.id] = status;
      } catch {
        statuses[project.id] = 'available';
      }
    }));
    setProjectStatuses(statuses);
  };
  if (projects.length > 0) loadApplicationStatuses();
}, [projects]);
```
- Calcula de forma paralela el estado de aplicación para cada proyecto (`available`, `applied`, etc.).

### `ApplicationForm.tsx`
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.motivation.trim()) {
    setError("La motivación es obligatoria");
    return;
  }
  await applicationService.createApplication({
    project,
    motivation: form.motivation,
    available_hours_per_week: Number(form.available_hours_per_week),
    start_date_preference: form.start_date_preference,
    additional_notes: form.additional_notes,
  });
  onSuccess();
};
```
- Valida campos, llama al servicio y ejecuta `onSuccess` (cierra modal + refresca datos).

---

## 5. `partes/diseño-pm/adriana` y `partes/diseÃ±o-pm/adriana`

### Sistema visual
```css
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  animation: fade-in-up 0.6s ease forwards;
}
```
- Animaciones utilizadas en el landing y dashboards para transiciones suaves.

### Landing
```tsx
return (
  <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0f1020] to-[#05050d] text-white">
    <Navbar />
    <main className="flex flex-col gap-20">
      <KeyHoursHero />
      <MissionVision />
      <ProjectsInspire />
    </main>
    <FooterKey />
  </div>
);
```
- Componentes modulares, gradientes y spacing definidos con Tailwind.
- Ambas carpetas contienen el mismo código (se mantiene duplicado por temas de codificación del nombre con `ñ`).

---

## 6. Referencias Rápidas para la Defensa

- **Login admin vs estudiante:** `UnifiedLogin.tsx` (administrador deja carnet vacío → vista admin).
- **Restricción de creación de proyectos:** `ProjectCreateView.perform_create` en backend verifica `user_type`.
- **Publicación de proyecto:** endpoint `publish_project` cambia visibilidad.
- **Aprobación de aplicaciones:** `ApplicationReviewView.post` y `ApplicantsKeyHours` en frontend.
- **Registro de horas:** `HourLogListCreateView.perform_create` y `HourLogReviewView.post`.
- **Simulaciones frontend:** `projectService` y `applicationService` trabajan con `localStorage` cuando el backend no responde.

Usa este `INVENTARIO_TECNICO.md` cuando necesites recordar qué hace cada bloque de código y cómo explicarlo rápidamente durante la defensa. Cada sección apunta a la sintaxis exacta que verás en los archivos reales.

