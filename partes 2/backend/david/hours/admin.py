from django.contrib import admin
from .models import HourLog, HourLogDocument, HourSummary, HourGoal


@admin.register(HourLog)
class HourLogAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo HourLog
    """
    list_display = ('user', 'project', 'hours', 'date', 'status', 'created_at')
    list_filter = ('status', 'date', 'created_at', 'project__name')
    search_fields = ('user__first_name', 'user__last_name', 'user__carnet', 'project__name', 'activity_description')
    ordering = ('-date', '-created_at')
    
    fieldsets = (
        ('Información Básica', {'fields': ('user', 'project', 'application')}),
        ('Horas y Fecha', {'fields': ('hours', 'date', 'start_time', 'end_time')}),
        ('Descripción de la Actividad', {'fields': ('activity_description', 'skills_developed', 'impact_description')}),
        ('Supervisor', {'fields': ('supervisor_name', 'supervisor_contact')}),
        ('Revisión', {'fields': ('status', 'reviewed_by', 'reviewed_at', 'review_notes')}),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'reviewed_at')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'project', 'reviewed_by')


@admin.register(HourLogDocument)
class HourLogDocumentAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo HourLogDocument
    """
    list_display = ('title', 'hour_log', 'document_type', 'uploaded_at')
    list_filter = ('document_type', 'uploaded_at')
    search_fields = ('title', 'description', 'hour_log__user__first_name', 'hour_log__user__last_name')
    ordering = ('-uploaded_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('hour_log__user', 'hour_log__project')


@admin.register(HourSummary)
class HourSummaryAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo HourSummary
    """
    list_display = ('user', 'year', 'month', 'total_hours', 'approved_hours', 'pending_hours', 'projects_count')
    list_filter = ('year', 'month', 'created_at')
    search_fields = ('user__first_name', 'user__last_name', 'user__carnet')
    ordering = ('-year', '-month')
    
    fieldsets = (
        ('Usuario y Período', {'fields': ('user', 'year', 'month')}),
        ('Resumen de Horas', {'fields': ('total_hours', 'approved_hours', 'pending_hours', 'rejected_hours')}),
        ('Estadísticas', {'fields': ('projects_count',)}),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(HourGoal)
class HourGoalAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo HourGoal
    """
    list_display = ('user', 'goal_type', 'target_hours', 'start_date', 'end_date', 'is_active')
    list_filter = ('goal_type', 'is_active', 'start_date', 'created_at')
    search_fields = ('user__first_name', 'user__last_name', 'user__carnet', 'description')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Usuario y Tipo de Meta', {'fields': ('user', 'goal_type')}),
        ('Objetivo y Fechas', {'fields': ('target_hours', 'start_date', 'end_date')}),
        ('Descripción y Estado', {'fields': ('description', 'is_active')}),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
