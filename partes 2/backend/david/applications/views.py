from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from .models import Application, ApplicationDocument, ApplicationEvaluation, ApplicationNotification
from projects.models import Project
from .serializers import (
    ApplicationSerializer, ApplicationCreateSerializer, ApplicationUpdateSerializer,
    ApplicationListSerializer, ApplicationStatsSerializer, ProjectApplicationSerializer,
    StudentApplicationSerializer, ApplicationBulkActionSerializer, ApplicationEvaluationSerializer,
    ApplicationNotificationSerializer
)


class ApplicationListView(generics.ListCreateAPIView):
    """
    Vista para listar y crear aplicaciones
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'project', 'user']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ApplicationCreateSerializer
        return ApplicationListSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        queryset = Application.objects.all()
        
        # Si es estudiante, solo sus propias aplicaciones
        if self.request.user.user_type == 'student':
            queryset = queryset.filter(user=self.request.user)
        
        return queryset.select_related('user', 'project', 'reviewed_by')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                application = serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {'error': f'Error al crear aplicación: {str(e)}'},
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


class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar y eliminar aplicaciones
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Application.objects.all()
        
        # Si es estudiante, solo sus propias aplicaciones
        if self.request.user.user_type == 'student':
            queryset = queryset.filter(user=self.request.user)
        
        return queryset.select_related('user', 'project', 'reviewed_by')


class ProjectApplicationListView(generics.ListAPIView):
    """
    Vista para listar aplicaciones de un proyecto específico
    """
    serializer_class = ProjectApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        project_id = self.kwargs['project_id']
        
        # Solo el manager del proyecto o admins pueden ver las aplicaciones
        try:
            project = Project.objects.get(id=project_id)
            if (self.request.user.user_type != 'admin' and 
                project.manager != self.request.user):
                raise permissions.PermissionDenied("No tienes permisos para ver estas aplicaciones")
        except Project.DoesNotExist:
            raise permissions.PermissionDenied("Proyecto no encontrado")
        
        return Application.objects.filter(
            project_id=project_id
        ).select_related('user', 'project')


class StudentApplicationListView(generics.ListAPIView):
    """
    Vista para listar aplicaciones de un estudiante específico
    """
    serializer_class = StudentApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.kwargs.get('user_id', self.request.user.id)
        
        # Solo el propio estudiante o admins pueden ver sus aplicaciones
        if (self.request.user.user_type != 'admin' and 
            self.request.user.id != user_id):
            raise permissions.PermissionDenied("No tienes permisos para ver estas aplicaciones")
        
        return Application.objects.filter(
            user_id=user_id
        ).select_related('user', 'project')


class ApplicationStatsView(generics.ListAPIView):
    """
    Vista para estadísticas de aplicaciones
    """
    serializer_class = ApplicationStatsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type != 'admin':
            raise permissions.PermissionDenied("Solo los administradores pueden ver estadísticas")
        
        # Retornar estadísticas como un objeto único
        return [{
            'total_applications': Application.objects.count(),
            'pending_applications': Application.objects.filter(status='pending').count(),
            'approved_applications': Application.objects.filter(status='approved').count(),
            'rejected_applications': Application.objects.filter(status='rejected').count(),
            'in_progress_applications': Application.objects.filter(status='in_progress').count(),
            'completed_applications': Application.objects.filter(status='completed').count(),
            'cancelled_applications': Application.objects.filter(status='cancelled').count(),
        }]


class ApplicationEvaluationListView(generics.ListCreateAPIView):
    """
    Vista para listar y crear evaluaciones de aplicaciones
    """
    serializer_class = ApplicationEvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        application_id = self.kwargs['application_id']
        return ApplicationEvaluation.objects.filter(application_id=application_id)
    
    def perform_create(self, serializer):
        application_id = self.kwargs['application_id']
        application = Application.objects.get(id=application_id)
        
        # Solo admins pueden evaluar aplicaciones
        if self.request.user.user_type != 'admin':
            raise permissions.PermissionDenied("Solo los administradores pueden evaluar aplicaciones")
        
        serializer.save(evaluator=self.request.user, application=application)


class ApplicationNotificationListView(generics.ListAPIView):
    """
    Vista para listar notificaciones de aplicaciones
    """
    serializer_class = ApplicationNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ApplicationNotification.objects.filter(
            recipient=self.request.user
        ).order_by('-created_at')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def review_application(request, application_id):
    """
    Revisar una aplicación (aprobar/rechazar)
    """
    try:
        application = Application.objects.select_related('project', 'user').get(id=application_id)
    except Application.DoesNotExist:
        return Response(
            {'error': 'Aplicación no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Solo admins pueden revisar aplicaciones
    if request.user.user_type != 'admin':
        return Response(
            {'error': 'Solo los administradores pueden revisar aplicaciones'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    new_status = request.data.get('status')
    review_notes = request.data.get('review_notes', '')
    
    if new_status not in ['approved', 'rejected']:
        return Response(
            {'error': 'Estado inválido'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    old_status = application.status
    
    # Actualizar aplicación
    application.status = new_status
    application.reviewed_by = request.user
    application.reviewed_at = timezone.now()
    application.review_notes = review_notes
    application.save()
    
    # Si se aprueba, agregar al estudiante como miembro del proyecto y actualizar contador
    if new_status == 'approved' and old_status != 'approved':
        project = application.project
        # Agregar al estudiante como miembro si no está ya
        if application.user not in project.members.all():
            project.members.add(application.user)
        # Actualizar contador de participantes
        project.current_participants = project.members.count()
        project.save()
    
    # Si se rechaza y estaba aprobada, remover del proyecto y actualizar contador
    if new_status == 'rejected' and old_status == 'approved':
        project = application.project
        if application.user in project.members.all():
            project.members.remove(application.user)
        project.current_participants = project.members.count()
        project.save()
    
    # Crear notificación
    ApplicationNotification.objects.create(
        application=application,
        recipient=application.user,
        notification_type=f'application_{new_status}',
        title=f'Aplicación {new_status}',
        message=f'Tu aplicación para el proyecto {application.project.name} ha sido {new_status}.'
    )
    
    # Recargar la aplicación desde la base de datos para obtener datos actualizados
    application.refresh_from_db()
    serializer = ApplicationSerializer(application)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_action_applications(request):
    """
    Acción masiva en aplicaciones (aprobar/rechazar múltiples)
    """
    serializer = ApplicationBulkActionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    application_ids = serializer.validated_data['application_ids']
    action = serializer.validated_data['action']
    notes = serializer.validated_data.get('notes', '')
    
    # Solo admins pueden realizar acciones masivas
    if request.user.user_type != 'admin':
        return Response(
            {'error': 'Solo los administradores pueden realizar acciones masivas'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    applications = Application.objects.filter(id__in=application_ids)
    
    if action == 'approve':
        new_status = 'approved'
    elif action == 'reject':
        new_status = 'rejected'
    elif action == 'cancel':
        new_status = 'cancelled'
    else:
        return Response(
            {'error': 'Acción inválida'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Actualizar aplicaciones
    updated_count = 0
    for application in applications:
        if application.status == 'pending':
            application.status = new_status
            application.reviewed_by = request.user
            application.reviewed_at = timezone.now()
            application.review_notes = notes
            application.save()
            updated_count += 1
            
            # Crear notificación
            ApplicationNotification.objects.create(
                application=application,
                recipient=application.user,
                notification_type=f'application_{new_status}',
                title=f'Aplicación {new_status}',
                message=f'Tu aplicación para el proyecto {application.project.name} ha sido {new_status}.'
            )
    
    return Response({
        'message': f'{updated_count} aplicaciones actualizadas',
        'updated_count': updated_count
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, notification_id):
    """
    Marcar notificación como leída
    """
    try:
        notification = ApplicationNotification.objects.get(
            id=notification_id,
            recipient=request.user
        )
    except ApplicationNotification.DoesNotExist:
        return Response(
            {'error': 'Notificación no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    notification.is_read = True
    notification.save()
    
    return Response({'message': 'Notificación marcada como leída'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def application_dashboard_stats(request):
    """
    Estadísticas para el dashboard de aplicaciones
    """
    user = request.user
    
    if user.user_type == 'admin':
        # Estadísticas para admin
        stats = {
            'total_applications': Application.objects.count(),
            'pending_applications': Application.objects.filter(status='pending').count(),
            'approved_applications': Application.objects.filter(status='approved').count(),
            'rejected_applications': Application.objects.filter(status='rejected').count(),
            'in_progress_applications': Application.objects.filter(status='in_progress').count(),
            'completed_applications': Application.objects.filter(status='completed').count(),
            'recent_applications': Application.objects.order_by('-applied_at')[:5].count(),
        }
        
        # Aplicaciones por proyecto
        project_stats = Application.objects.values('project__name').annotate(
            count=Count('id')
        ).order_by('-count')[:5]
        
        stats['applications_by_project'] = list(project_stats)
    
    else:
        # Estadísticas para estudiante
        stats = {
            'my_applications': user.applications.count(),
            'pending_applications': user.applications.filter(status='pending').count(),
            'approved_applications': user.applications.filter(status='approved').count(),
            'rejected_applications': user.applications.filter(status='rejected').count(),
            'completed_applications': user.applications.filter(status='completed').count(),
            'unread_notifications': ApplicationNotification.objects.filter(
                recipient=user,
                is_read=False
            ).count(),
        }
    
    return Response(stats, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cancel_application(request, application_id):
    """
    Cancelar una aplicación (solo el estudiante puede cancelar sus propias aplicaciones)
    """
    try:
        application = Application.objects.get(
            id=application_id,
            user=request.user
        )
    except Application.DoesNotExist:
        return Response(
            {'error': 'Aplicación no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Solo se puede cancelar si está pendiente o aprobada
    if application.status not in ['pending', 'approved']:
        return Response(
            {'error': 'No se puede cancelar esta aplicación'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    application.status = 'cancelled'
    application.save()
    
    # Crear notificación para el manager del proyecto
    ApplicationNotification.objects.create(
        application=application,
        recipient=application.project.manager,
        notification_type='application_cancelled',
        title='Aplicación cancelada',
        message=f'{application.user.full_name} ha cancelado su aplicación para el proyecto {application.project.name}.'
    )
    
    serializer = ApplicationSerializer(application)
    return Response(serializer.data, status=status.HTTP_200_OK)
