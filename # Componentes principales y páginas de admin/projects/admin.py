from django.contrib import admin
from .models import Project, ProjectCategory, ProjectRequirement, ProjectDocument


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo Project
    """
    list_display = ('name', 'manager', 'visibility', 'start_date', 'end_date', 'max_participants', 'current_participants', 'is_active')
    list_filter = ('visibility', 'is_active', 'hour_assignment', 'start_date', 'created_at')
    search_fields = ('name', 'description', 'manager__first_name', 'manager__last_name')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Información Básica', {'fields': ('name', 'description', 'manager')}),
        ('Configuración de Horas', {'fields': ('max_hours', 'hour_assignment', 'automatic_hours')}),
        ('Fechas y Participantes', {'fields': ('start_date', 'end_date', 'max_participants', 'current_participants')}),
        ('Estado', {'fields': ('visibility', 'is_active')}),
        ('Miembros', {'fields': ('members',)}),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    filter_horizontal = ('members',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('manager').prefetch_related('members')


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo ProjectCategory
    """
    list_display = ('name', 'color', 'icon', 'is_active')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(ProjectRequirement)
class ProjectRequirementAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo ProjectRequirement
    """
    list_display = ('title', 'project', 'is_mandatory', 'created_at')
    list_filter = ('is_mandatory', 'created_at')
    search_fields = ('title', 'description', 'project__name')
    ordering = ('-created_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('project')


@admin.register(ProjectDocument)
class ProjectDocumentAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo ProjectDocument
    """
    list_display = ('title', 'project', 'document_type', 'is_public', 'created_at')
    list_filter = ('document_type', 'is_public', 'created_at')
    search_fields = ('title', 'description', 'project__name')
    ordering = ('-created_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('project')
