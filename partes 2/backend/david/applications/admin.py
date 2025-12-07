from django.contrib import admin
from .models import Application, ApplicationDocument, ApplicationEvaluation, ApplicationNotification


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo Application
    """
    list_display = ('user', 'project', 'status', 'applied_at', 'reviewed_at', 'hours_completed')
    list_filter = ('status', 'applied_at', 'reviewed_at', 'project__visibility')
    search_fields = ('user__first_name', 'user__last_name', 'user__carnet', 'project__name')
    ordering = ('-applied_at',)
    
    fieldsets = (
        ('Información Básica', {'fields': ('user', 'project', 'status')}),
        ('Detalles de la Aplicación', {'fields': ('motivation', 'relevant_experience', 'available_hours_per_week', 'start_date_preference', 'additional_notes')}),
        ('Revisión', {'fields': ('reviewed_by', 'reviewed_at', 'review_notes')}),
        ('Progreso', {'fields': ('hours_completed', 'completion_date')}),
    )
    
    readonly_fields = ('applied_at', 'reviewed_at', 'created_at', 'updated_at')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'project', 'reviewed_by')


@admin.register(ApplicationDocument)
class ApplicationDocumentAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo ApplicationDocument
    """
    list_display = ('title', 'application', 'document_type', 'uploaded_at')
    list_filter = ('document_type', 'uploaded_at')
    search_fields = ('title', 'description', 'application__user__first_name', 'application__user__last_name')
    ordering = ('-uploaded_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('application__user', 'application__project')


@admin.register(ApplicationEvaluation)
class ApplicationEvaluationAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo ApplicationEvaluation
    """
    list_display = ('application', 'evaluator', 'score', 'recommendation', 'evaluated_at')
    list_filter = ('score', 'recommendation', 'evaluated_at')
    search_fields = ('application__user__first_name', 'application__user__last_name', 'evaluator__first_name', 'evaluator__last_name')
    ordering = ('-evaluated_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('application__user', 'evaluator')


@admin.register(ApplicationNotification)
class ApplicationNotificationAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo ApplicationNotification
    """
    list_display = ('recipient', 'notification_type', 'title', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('recipient__first_name', 'recipient__last_name', 'title', 'message')
    ordering = ('-created_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('recipient', 'application__user', 'application__project')
