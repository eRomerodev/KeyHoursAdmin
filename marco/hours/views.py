from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Sum, Count
from django.utils import timezone
from datetime import datetime, timedelta

from .models import HourLog, HourLogDocument, HourSummary, HourGoal
from projects.models import Project
from .serializers import (
    HourLogSerializer, HourLogCreateSerializer, HourLogUpdateSerializer,
    HourLogReviewSerializer, HourSummarySerializer, HourGoalSerializer,
    HourStatsSerializer, UserHourSummarySerializer, ProjectHourSummarySerializer,
    HourLogListSerializer, MonthlyHourReportSerializer, YearlyHourReportSerializer,
    HourGoalCreateSerializer
)


class HourLogListView(generics.ListCreateAPIView):
    """
    Vista para listar y crear registros de horas
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return HourLogCreateSerializer
        return HourLogListSerializer
    
    def get_queryset(self):
        queryset = HourLog.objects.all()
        
        # Filtros
        user_id = self.request.query_params.get('user_id', None)
        project_id = self.request.query_params.get('project_id', None)
        status = self.request.query_params.get('status', None)
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        if status:
            queryset = queryset.filter(status=status)
        
        # Si es estudiante, solo sus propios registros
        if self.request.user.user_type == 'student':
            queryset = queryset.filter(user=self.request.user)
        
        return queryset.select_related('user', 'project', 'reviewed_by').order_by('-date', '-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class HourLogDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar y eliminar registros de horas
    """
    serializer_class = HourLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = HourLog.objects.all()
        
        # Si es estudiante, solo sus propios registros
        if self.request.user.user_type == 'student':
            queryset = queryset.filter(user=self.request.user)
        
        return queryset.select_related('user', 'project', 'reviewed_by')


class HourLogReviewView(generics.UpdateAPIView):
    """
    Vista para revisar registros de horas (solo admins)
    """
    serializer_class = HourLogReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type != 'admin':
            raise permissions.PermissionDenied("Solo los administradores pueden revisar registros de horas")
        
        return HourLog.objects.filter(status='pending')
    
    def perform_update(self, serializer):
        serializer.save(
            reviewed_by=self.request.user,
            reviewed_at=timezone.now()
        )


class HourSummaryListView(generics.ListAPIView):
    """
    Vista para listar resúmenes de horas
    """
    serializer_class = HourSummarySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', self.request.user.id)
        
        # Si es estudiante, solo sus propios resúmenes
        if self.request.user.user_type == 'student' and user_id != self.request.user.id:
            raise permissions.PermissionDenied("No tienes permisos para ver estos resúmenes")
        
        return HourSummary.objects.filter(user_id=user_id).order_by('-year', '-month')


class HourGoalListView(generics.ListCreateAPIView):
    """
    Vista para listar y crear metas de horas
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return HourGoalCreateSerializer
        return HourGoalSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', self.request.user.id)
        
        # Si es estudiante, solo sus propias metas
        if self.request.user.user_type == 'student' and user_id != self.request.user.id:
            raise permissions.PermissionDenied("No tienes permisos para ver estas metas")
        
        return HourGoal.objects.filter(user_id=user_id).order_by('-created_at')
    
    def perform_create(self, serializer):
        user_id = self.kwargs.get('user_id', self.request.user.id)
        serializer.save(user_id=user_id)


class HourGoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar y eliminar metas de horas
    """
    serializer_class = HourGoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', self.request.user.id)
        
        # Si es estudiante, solo sus propias metas
        if self.request.user.user_type == 'student' and user_id != self.request.user.id:
            raise permissions.PermissionDenied("No tienes permisos para ver estas metas")
        
        return HourGoal.objects.filter(user_id=user_id)


class UserHourSummaryView(generics.ListAPIView):
    """
    Vista para resumen de horas de un usuario específico
    """
    serializer_class = UserHourSummarySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        
        # Si es estudiante, solo sus propios registros
        if self.request.user.user_type == 'student' and user_id != self.request.user.id:
            raise permissions.PermissionDenied("No tienes permisos para ver estos registros")
        
        return HourLog.objects.filter(user_id=user_id).select_related('project').order_by('-date')


class ProjectHourSummaryView(generics.ListAPIView):
    """
    Vista para resumen de horas de un proyecto específico
    """
    serializer_class = ProjectHourSummarySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        project_id = self.kwargs['project_id']
        
        # Solo el manager del proyecto o admins pueden ver las horas
        try:
            project = Project.objects.get(id=project_id)
            if (self.request.user.user_type != 'admin' and 
                project.manager != self.request.user):
                raise permissions.PermissionDenied("No tienes permisos para ver estas horas")
        except Project.DoesNotExist:
            raise permissions.PermissionDenied("Proyecto no encontrado")
        
        return HourLog.objects.filter(
            project_id=project_id
        ).select_related('user').order_by('-date')


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def hour_stats(request):
    """
    Estadísticas de horas para un usuario
    """
    user_id = request.query_params.get('user_id', request.user.id)
    
    # Si es estudiante, solo sus propias estadísticas
    if request.user.user_type == 'student' and user_id != request.user.id:
        return Response(
            {'error': 'No tienes permisos para ver estas estadísticas'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Estadísticas generales
    total_hours = HourLog.objects.filter(user_id=user_id).aggregate(
        total=Sum('hours')
    )['total'] or 0
    
    approved_hours = HourLog.objects.filter(
        user_id=user_id,
        status='approved'
    ).aggregate(
        total=Sum('hours')
    )['total'] or 0
    
    pending_hours = HourLog.objects.filter(
        user_id=user_id,
        status='pending'
    ).aggregate(
        total=Sum('hours')
    )['total'] or 0
    
    rejected_hours = HourLog.objects.filter(
        user_id=user_id,
        status='rejected'
    ).aggregate(
        total=Sum('hours')
    )['total'] or 0
    
    projects_count = HourLog.objects.filter(
        user_id=user_id,
        status='approved'
    ).values('project').distinct().count()
    
    # Estadísticas del mes actual
    current_month = timezone.now().month
    current_year = timezone.now().year
    
    current_month_hours = HourLog.objects.filter(
        user_id=user_id,
        date__year=current_year,
        date__month=current_month,
        status='approved'
    ).aggregate(
        total=Sum('hours')
    )['total'] or 0
    
    # Estadísticas del año actual
    current_year_hours = HourLog.objects.filter(
        user_id=user_id,
        date__year=current_year,
        status='approved'
    ).aggregate(
        total=Sum('hours')
    )['total'] or 0
    
    stats = {
        'total_hours': total_hours,
        'approved_hours': approved_hours,
        'pending_hours': pending_hours,
        'rejected_hours': rejected_hours,
        'projects_count': projects_count,
        'current_month_hours': current_month_hours,
        'current_year_hours': current_year_hours,
    }
    
    return Response(stats, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def monthly_hour_report(request, year, month):
    """
    Reporte mensual de horas
    """
    user_id = request.query_params.get('user_id', request.user.id)
    
    # Si es estudiante, solo sus propios reportes
    if request.user.user_type == 'student' and user_id != request.user.id:
        return Response(
            {'error': 'No tienes permisos para ver este reporte'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener registros del mes
    hour_logs = HourLog.objects.filter(
        user_id=user_id,
        date__year=year,
        date__month=month
    )
    
    total_hours = hour_logs.aggregate(total=Sum('hours'))['total'] or 0
    approved_hours = hour_logs.filter(status='approved').aggregate(total=Sum('hours'))['total'] or 0
    pending_hours = hour_logs.filter(status='pending').aggregate(total=Sum('hours'))['total'] or 0
    rejected_hours = hour_logs.filter(status='rejected').aggregate(total=Sum('hours'))['total'] or 0
    projects_count = hour_logs.filter(status='approved').values('project').distinct().count()
    logs_count = hour_logs.count()
    
    report = {
        'month': month,
        'year': year,
        'total_hours': total_hours,
        'approved_hours': approved_hours,
        'pending_hours': pending_hours,
        'rejected_hours': rejected_hours,
        'projects_count': projects_count,
        'logs_count': logs_count,
    }
    
    return Response(report, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def yearly_hour_report(request, year):
    """
    Reporte anual de horas
    """
    user_id = request.query_params.get('user_id', request.user.id)
    
    # Si es estudiante, solo sus propios reportes
    if request.user.user_type == 'student' and user_id != request.user.id:
        return Response(
            {'error': 'No tienes permisos para ver este reporte'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener registros del año
    hour_logs = HourLog.objects.filter(
        user_id=user_id,
        date__year=year
    )
    
    total_hours = hour_logs.aggregate(total=Sum('hours'))['total'] or 0
    approved_hours = hour_logs.filter(status='approved').aggregate(total=Sum('hours'))['total'] or 0
    pending_hours = hour_logs.filter(status='pending').aggregate(total=Sum('hours'))['total'] or 0
    rejected_hours = hour_logs.filter(status='rejected').aggregate(total=Sum('hours'))['total'] or 0
    projects_count = hour_logs.filter(status='approved').values('project').distinct().count()
    logs_count = hour_logs.count()
    
    # Desglose mensual
    monthly_breakdown = []
    for month in range(1, 13):
        month_logs = hour_logs.filter(date__month=month)
        month_total = month_logs.aggregate(total=Sum('hours'))['total'] or 0
        month_approved = month_logs.filter(status='approved').aggregate(total=Sum('hours'))['total'] or 0
        month_pending = month_logs.filter(status='pending').aggregate(total=Sum('hours'))['total'] or 0
        month_rejected = month_logs.filter(status='rejected').aggregate(total=Sum('hours'))['total'] or 0
        month_projects = month_logs.filter(status='approved').values('project').distinct().count()
        month_logs_count = month_logs.count()
        
        monthly_breakdown.append({
            'month': month,
            'year': year,
            'total_hours': month_total,
            'approved_hours': month_approved,
            'pending_hours': month_pending,
            'rejected_hours': month_rejected,
            'projects_count': month_projects,
            'logs_count': month_logs_count,
        })
    
    report = {
        'year': year,
        'total_hours': total_hours,
        'approved_hours': approved_hours,
        'pending_hours': pending_hours,
        'rejected_hours': rejected_hours,
        'projects_count': projects_count,
        'logs_count': logs_count,
        'monthly_breakdown': monthly_breakdown,
    }
    
    return Response(report, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def hour_dashboard_stats(request):
    """
    Estadísticas para el dashboard de horas
    """
    user = request.user
    
    if user.user_type == 'admin':
        # Estadísticas para admin
        stats = {
            'total_hours_logged': HourLog.objects.aggregate(total=Sum('hours'))['total'] or 0,
            'approved_hours': HourLog.objects.filter(status='approved').aggregate(total=Sum('hours'))['total'] or 0,
            'pending_hours': HourLog.objects.filter(status='pending').aggregate(total=Sum('hours'))['total'] or 0,
            'rejected_hours': HourLog.objects.filter(status='rejected').aggregate(total=Sum('hours'))['total'] or 0,
            'total_logs': HourLog.objects.count(),
            'pending_reviews': HourLog.objects.filter(status='pending').count(),
        }
        
        # Top usuarios por horas
        top_users = HourLog.objects.filter(status='approved').values(
            'user__first_name', 'user__last_name'
        ).annotate(
            total_hours=Sum('hours')
        ).order_by('-total_hours')[:5]
        
        stats['top_users'] = list(top_users)
    
    else:
        # Estadísticas para estudiante
        stats = {
            'total_hours': user.get_total_hours(),
            'approved_hours': HourLog.objects.filter(
                user=user,
                status='approved'
            ).aggregate(total=Sum('hours'))['total'] or 0,
            'pending_hours': HourLog.objects.filter(
                user=user,
                status='pending'
            ).aggregate(total=Sum('hours'))['total'] or 0,
            'rejected_hours': HourLog.objects.filter(
                user=user,
                status='rejected'
            ).aggregate(total=Sum('hours'))['total'] or 0,
            'projects_with_hours': HourLog.objects.filter(
                user=user,
                status='approved'
            ).values('project').distinct().count(),
            'recent_logs': HourLog.objects.filter(
                user=user
            ).order_by('-created_at')[:5].count(),
        }
    
    return Response(stats, status=status.HTTP_200_OK)
