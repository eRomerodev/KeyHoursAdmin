from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Scholarship, UserScholarship


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Configuración del admin para el modelo User personalizado
    """
    list_display = ('username', 'email', 'first_name', 'last_name', 'carnet', 'user_type', 'is_active', 'date_joined')
    list_filter = ('user_type', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'carnet')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {'fields': ('first_name', 'last_name', 'email', 'carnet', 'phone', 'date_of_birth', 'profile_picture')}),
        ('Permisos', {'fields': ('user_type', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'user_type', 'carnet'),
        }),
    )
    
    readonly_fields = ('date_joined', 'last_login')


@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo Scholarship
    """
    list_display = ('name', 'scholarship_type', 'required_hours', 'duration_years', 'is_active')
    list_filter = ('scholarship_type', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)
    
    fieldsets = (
        ('Información Básica', {'fields': ('name', 'scholarship_type', 'description')}),
        ('Configuración', {'fields': ('required_hours', 'duration_years', 'is_active')}),
    )
    
    readonly_fields = ('created_at', 'updated_at')


@admin.register(UserScholarship)
class UserScholarshipAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo UserScholarship
    """
    list_display = ('user', 'scholarship', 'status', 'start_date', 'end_date', 'current_year_hours', 'total_hours_completed')
    list_filter = ('status', 'scholarship__scholarship_type', 'start_date')
    search_fields = ('user__first_name', 'user__last_name', 'user__carnet', 'scholarship__name')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Información Básica', {'fields': ('user', 'scholarship', 'status')}),
        ('Fechas', {'fields': ('start_date', 'end_date')}),
        ('Progreso', {'fields': ('current_year_hours', 'total_hours_completed')}),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'scholarship')
