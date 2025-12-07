from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from django.db import models

from .models import Project, ProjectCategory, ProjectRequirement, ProjectDocument
from users.models import User
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer, ProjectCreateSerializer,
    ProjectUpdateSerializer, ConvocatoriaSerializer, ProjectStatsSerializer,
    ProjectCategorySerializer, ProjectRequirementSerializer, ProjectDocumentSerializer
)


class ProjectListView(generics.ListCreateAPIView):
    """
    Vista para listar y crear proyectos
    """
    serializer_class = ProjectListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'manager__first_name', 'manager__last_name']
    ordering_fields = ['created_at', 'start_date', 'end_date', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Project.objects.all()
        
        # Filtros
        visibility = self.request.query_params.get('visibility', None)
        if visibility:
            queryset = queryset.filter(visibility=visibility)
        
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        manager_id = self.request.query_params.get('manager_id', None)
        if manager_id:
            queryset = queryset.filter(manager_id=manager_id)
        
        # Si es estudiante, solo mostrar proyectos publicados o convocatorias que estén activos
        if self.request.user.user_type == 'student':
            queryset = queryset.filter(
                Q(visibility='published') | Q(visibility='convocatoria'),
                is_active=True
            )
        
        return queryset.select_related('manager').prefetch_related('applications')


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar y eliminar proyectos
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProjectUpdateSerializer
        return ProjectDetailSerializer
    
    def get_queryset(self):
        queryset = Project.objects.all()
        
        # Si es estudiante, solo mostrar proyectos publicados o convocatorias que estén activos
        if self.request.user.user_type == 'student':
            queryset = queryset.filter(
                Q(visibility='published') | Q(visibility='convocatoria'),
                is_active=True
            )
        
        return queryset.select_related('manager').prefetch_related(
            'members', 'requirements', 'documents', 'applications'
        )
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Solo admins o el manager del proyecto pueden actualizar
        if request.user.user_type != 'admin' and instance.manager != request.user:
            return Response(
                {'error': 'No tienes permisos para editar este proyecto'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {'error': f'Error al actualizar proyecto: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Mejorar mensajes de error
        errors = {}
        for field, error_list in serializer.errors.items():
            if isinstance(error_list, list):
                errors[field] = error_list[0] if error_list else 'Error de validación'
            else:
                errors[field] = str(error_list)
        
        if len(errors) == 1:
            error_message = list(errors.values())[0]
            return Response(
                {'error': error_message, 'details': errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            combined_error_message = "Errores de validación: " + ", ".join(
                f"{field.replace('_', ' ').capitalize()}: {msg}" for field, msg in errors.items()
            )
            return Response(
                {'error': combined_error_message, 'details': errors},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def perform_destroy(self, instance):
        # Solo admins o el manager del proyecto pueden eliminar
        if self.request.user.user_type != 'admin' and instance.manager != self.request.user:
            raise permissions.PermissionDenied("No tienes permisos para eliminar este proyecto")
        instance.delete()


class ProjectCreateView(generics.CreateAPIView):
    """
    Vista para crear proyectos (solo admins)
    """
    serializer_class = ProjectCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        # Solo admins pueden crear proyectos
        if self.request.user.user_type != 'admin':
            raise permissions.PermissionDenied("Solo los administradores pueden crear proyectos")
        
        serializer.save(manager=self.request.user)


class ConvocatoriaListView(generics.ListAPIView):
    """
    Vista para listar convocatorias (proyectos con visibilidad 'convocatoria')
    """
    serializer_class = ConvocatoriaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'start_date', 'end_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Project.objects.filter(
            visibility='convocatoria',
            is_active=True
        ).select_related('manager').prefetch_related('requirements')


class ProjectStatsView(generics.ListAPIView):
    """
    Vista para estadísticas de proyectos (solo admins)
    """
    serializer_class = ProjectStatsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type != 'admin':
            raise permissions.PermissionDenied("Solo los administradores pueden ver estadísticas")
        
        return Project.objects.all().select_related('manager').prefetch_related('applications')


class ProjectCategoryListView(generics.ListCreateAPIView):
    """
    Vista para listar y crear categorías de proyectos
    """
    queryset = ProjectCategory.objects.filter(is_active=True)
    serializer_class = ProjectCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        # Solo admins pueden crear categorías
        if self.request.user.user_type != 'admin':
            raise permissions.PermissionDenied("Solo los administradores pueden crear categorías")
        
        serializer.save()


class ProjectCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar y eliminar categorías de proyectos
    """
    queryset = ProjectCategory.objects.all()
    serializer_class = ProjectCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class ProjectRequirementListView(generics.ListCreateAPIView):
    """
    Vista para listar y crear requisitos de proyectos
    """
    serializer_class = ProjectRequirementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return ProjectRequirement.objects.filter(project_id=project_id)
    
    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_id')
        project = Project.objects.get(id=project_id)
        
        # Solo el manager del proyecto puede agregar requisitos
        if project.manager != self.request.user:
            raise permissions.PermissionDenied("Solo el manager del proyecto puede agregar requisitos")
        
        serializer.save(project=project)


class ProjectRequirementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar y eliminar requisitos de proyectos
    """
    serializer_class = ProjectRequirementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return ProjectRequirement.objects.filter(project_id=project_id)


class ProjectDocumentListView(generics.ListCreateAPIView):
    """
    Vista para listar y crear documentos de proyectos
    """
    serializer_class = ProjectDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        queryset = ProjectDocument.objects.filter(project_id=project_id)
        
        # Si es estudiante, solo mostrar documentos públicos
        if self.request.user.user_type == 'student':
            queryset = queryset.filter(is_public=True)
        
        return queryset
    
    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_id')
        project = Project.objects.get(id=project_id)
        
        # Solo el manager del proyecto puede agregar documentos
        if project.manager != self.request.user:
            raise permissions.PermissionDenied("Solo el manager del proyecto puede agregar documentos")
        
        serializer.save(project=project)


class ProjectDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar y eliminar documentos de proyectos
    """
    serializer_class = ProjectDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        queryset = ProjectDocument.objects.filter(project_id=project_id)
        
        # Si es estudiante, solo mostrar documentos públicos
        if self.request.user.user_type == 'student':
            queryset = queryset.filter(is_public=True)
        
        return queryset


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def project_dashboard_stats(request):
    """
    Estadísticas para el dashboard de proyectos
    """
    user = request.user
    
    if user.user_type == 'admin':
        # Estadísticas para admin
        stats = {
            'total_projects': Project.objects.count(),
            'active_projects': Project.objects.filter(is_active=True).count(),
            'convocatorias': Project.objects.filter(visibility='convocatoria').count(),
            'published_projects': Project.objects.filter(visibility='published').count(),
            'unpublished_projects': Project.objects.filter(visibility='unpublished').count(),
            'my_projects': Project.objects.filter(manager=user).count(),
        }
        
        # Proyectos más populares (con más aplicaciones)
        popular_projects = Project.objects.annotate(
            applications_count=Count('applications')
        ).order_by('-applications_count')[:5]
        
        stats['popular_projects'] = ProjectListSerializer(popular_projects, many=True).data
    
    else:
        # Estadísticas para estudiante
        stats = {
            'available_convocatorias': Project.objects.filter(
                visibility='convocatoria',
                is_active=True
            ).count(),
            'my_applications': user.applications.count(),
            'approved_applications': user.applications.filter(status='approved').count(),
            'completed_projects': user.applications.filter(status='completed').count(),
        }
    
    return Response(stats, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def publish_project(request, project_id):
    """
    Publicar un proyecto (cambiar visibilidad)
    """
    try:
        project = Project.objects.get(id=project_id, manager=request.user)
    except Project.DoesNotExist:
        return Response(
            {'error': 'Proyecto no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    visibility = request.data.get('visibility')
    if visibility not in ['unpublished', 'convocatoria', 'published']:
        return Response(
            {'error': 'Visibilidad inválida'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    project.visibility = visibility
    project.save()
    
    serializer = ProjectDetailSerializer(project)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_project_member(request, project_id):
    """
    Agregar miembro a un proyecto
    """
    try:
        project = Project.objects.get(id=project_id, manager=request.user)
    except Project.DoesNotExist:
        return Response(
            {'error': 'Proyecto no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    user_id = request.data.get('user_id')
    try:
        user = User.objects.get(id=user_id, user_type='student')
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verificar que no exceda el máximo de participantes
    if project.current_participants >= project.max_participants:
        return Response(
            {'error': 'El proyecto ha alcanzado el máximo de participantes'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Agregar miembro
    project.members.add(user)
    project.current_participants += 1
    project.save()
    
    serializer = ProjectDetailSerializer(project)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_project_member(request, project_id, user_id):
    """
    Remover miembro de un proyecto
    """
    try:
        project = Project.objects.get(id=project_id, manager=request.user)
        user = User.objects.get(id=user_id)
    except (Project.DoesNotExist, User.DoesNotExist):
        return Response(
            {'error': 'Proyecto o usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Remover miembro
    project.members.remove(user)
    project.current_participants = max(0, project.current_participants - 1)
    project.save()
    
    serializer = ProjectDetailSerializer(project)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def debug_update_project(request, project_id):
    """
    Vista de debug para actualizar proyectos
    """
    try:
        print(f"=== DEBUG UPDATE PROJECT {project_id} ===")
        print(f"User: {request.user.username}")
        print(f"User type: {request.user.user_type}")
        print(f"Request method: {request.method}")
        print(f"Request data: {request.data}")
        print(f"Request headers: {dict(request.headers)}")
        
        project = Project.objects.get(id=project_id)
        print(f"Project found: {project.name}")
        print(f"Project manager: {project.manager.username}")
        
        # Permitir edición a cualquier usuario autenticado para testing
        print("Allowing update for testing purposes...")
        
        # Actualizar campos básicos
        if 'name' in request.data:
            project.name = request.data['name']
            print(f"Updated name to: {project.name}")
        if 'description' in request.data:
            project.description = request.data['description']
            print(f"Updated description to: {project.description}")
        if 'max_hours' in request.data:
            project.max_hours = request.data['max_hours']
            print(f"Updated max_hours to: {project.max_hours}")
        if 'visibility' in request.data:
            project.visibility = request.data['visibility']
            print(f"Updated visibility to: {project.visibility}")
        if 'is_active' in request.data:
            project.is_active = request.data['is_active']
            print(f"Updated is_active to: {project.is_active}")
        
        project.save()
        print("Project saved successfully!")
        
        serializer = ProjectDetailSerializer(project)
        print("Returning updated project data")
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Project.DoesNotExist:
        print("Project not found!")
        return Response(
            {'error': 'Proyecto no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Debug error: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_project(request, project_id):
    """
    Unirse a un proyecto (solo estudiantes, a través de aplicación aprobada o directamente)
    """
    if request.user.user_type != 'student':
        return Response(
            {'error': 'Solo los estudiantes pueden unirse a proyectos'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response(
            {'error': 'Proyecto no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verificar que el proyecto esté activo y aceptando miembros
    if not project.is_active:
        return Response(
            {'error': 'El proyecto no está activo'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if project.current_participants >= project.max_participants:
        return Response(
            {'error': 'El proyecto ya tiene el máximo de participantes'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar si el usuario ya es miembro
    if project.members.filter(id=request.user.id).exists():
        return Response(
            {'error': 'Ya estás inscrito en este proyecto'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar si hay una aplicación aprobada
    from applications.models import Application
    application = Application.objects.filter(
        user=request.user,
        project=project,
        status='approved'
    ).first()
    
    # Si no hay aplicación aprobada, verificar si el proyecto permite unirse directamente
    if not application and project.visibility != 'published':
        return Response(
            {'error': 'Debes aplicar primero a este proyecto'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Agregar miembro al proyecto
    project.members.add(request.user)
    project.current_participants += 1
    project.save()
    
    return Response({
        'message': 'Te has unido al proyecto exitosamente',
        'project': ProjectDetailSerializer(project).data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def leave_project(request, project_id):
    """
    Salir de un proyecto (solo estudiantes)
    """
    if request.user.user_type != 'student':
        return Response(
            {'error': 'Solo los estudiantes pueden salir de proyectos'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response(
            {'error': 'Proyecto no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verificar si el usuario es miembro
    if not project.members.filter(id=request.user.id).exists():
        return Response(
            {'error': 'No estás inscrito en este proyecto'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Remover miembro del proyecto
    project.members.remove(request.user)
    project.current_participants = max(0, project.current_participants - 1)
    project.save()
    
    return Response({
        'message': 'Has salido del proyecto exitosamente',
        'project': ProjectDetailSerializer(project).data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def is_member(request, project_id):
    """
    Verificar si el usuario es miembro de un proyecto
    """
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response(
            {'error': 'Proyecto no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    is_member = project.members.filter(id=request.user.id).exists()
    
    return Response({
        'is_member': is_member,
        'project_id': project_id
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_projects(request):
    """
    Obtener proyectos del usuario actual
    """
    if request.user.user_type == 'student':
        # Proyectos en los que el estudiante es miembro
        projects = Project.objects.filter(
            members=request.user,
            is_active=True
        ).select_related('manager').prefetch_related('members', 'applications')
    else:
        # Proyectos que el admin gestiona
        projects = Project.objects.filter(
            manager=request.user
        ).select_related('manager').prefetch_related('members', 'applications')
    
    serializer = ProjectListSerializer(projects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_projects(request):
    """
    Endpoint público para obtener proyectos publicados (sin autenticación)
    Usado en la landing page
    """
    projects = Project.objects.filter(
        Q(visibility='published') | Q(visibility='convocatoria'),
        is_active=True
    ).select_related('manager').prefetch_related('members')[:6]  # Limitar a 6 proyectos
    
    serializer = ProjectListSerializer(projects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)