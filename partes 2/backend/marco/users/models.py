from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator


class User(AbstractUser):
    """
    Modelo de usuario personalizado que extiende AbstractUser
    """
    
    # Sobreescribir campos para hacerlos opcionales
    first_name = models.CharField(max_length=150, blank=True, verbose_name='Nombre')
    last_name = models.CharField(max_length=150, blank=True, verbose_name='Apellido')
    email = models.EmailField(blank=True, null=True, verbose_name='Email')
    
    USER_TYPE_CHOICES = [
        ('student', 'Estudiante'),
        ('admin', 'Administrador'),
    ]
    
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='student',
        verbose_name='Tipo de Usuario'
    )
    
    carnet = models.CharField(
        max_length=20,
        unique=True,
        validators=[RegexValidator(
            regex=r'^[A-Z0-9]+$',
            message='El carnet debe contener solo letras mayúsculas y números'
        )],
        verbose_name='Carnet',
        help_text='Carnet del estudiante (ej: 20230001)'
    )
    
    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        verbose_name='Teléfono'
    )
    
    date_of_birth = models.DateField(
        blank=True,
        null=True,
        verbose_name='Fecha de Nacimiento'
    )
    
    temp_password = models.CharField(
        max_length=128,
        blank=True,
        null=True,
        verbose_name='Contraseña Temporal',
        help_text='Contraseña temporal para que el admin pueda verla'
    )
    
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        verbose_name='Foto de Perfil'
    )
    
    scholarship_type = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        default='KEY EXCELLENCE',
        verbose_name='Tipo de Beca',
        help_text='Nombre de la beca asignada al estudiante'
    )
    
    scholarship_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        default=100.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name='Porcentaje de Beca',
        help_text='Porcentaje de beca (0-100)'
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']
    
    def __str__(self):
        if self.first_name or self.last_name:
            return f"{self.first_name} {self.last_name} ({self.carnet})".strip()
        return f"{self.username} ({self.carnet})"
    
    @property
    def full_name(self):
        if self.first_name or self.last_name:
            return f"{self.first_name} {self.last_name}".strip()
        return self.username
    
    def get_total_hours(self):
        """Obtiene el total de horas del usuario"""
        from hours.models import HourLog
        from decimal import Decimal
        total = HourLog.objects.filter(
            user=self,
            status='approved'  # Solo contar horas aprobadas
        ).aggregate(
            total=models.Sum('hours')
        )['total'] or 0
        
        # Convertir Decimal a float si es necesario
        if isinstance(total, Decimal):
            return float(total)
        return float(total) if total else 0
    
    def get_completed_projects(self):
        """Obtiene los proyectos completados del usuario"""
        from applications.models import Application
        return Application.objects.filter(
            user=self,
            status='completed'
        ).count()


class Scholarship(models.Model):
    """
    Modelo para becas como KEY EXCELLENCE
    """
    
    SCHOLARSHIP_TYPE_CHOICES = [
        ('excellence', 'KEY EXCELLENCE'),
        ('merit', 'MERIT'),
        ('need', 'NECESIDAD'),
    ]
    
    name = models.CharField(
        max_length=100,
        verbose_name='Nombre de la Beca'
    )
    
    scholarship_type = models.CharField(
        max_length=20,
        choices=SCHOLARSHIP_TYPE_CHOICES,
        verbose_name='Tipo de Beca'
    )
    
    description = models.TextField(
        verbose_name='Descripción'
    )
    
    required_hours = models.PositiveIntegerField(
        verbose_name='Horas Requeridas por Año'
    )
    
    duration_years = models.PositiveIntegerField(
        default=1,
        verbose_name='Duración en Años'
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activa'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Beca'
        verbose_name_plural = 'Becas'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.scholarship_type})"


class UserScholarship(models.Model):
    """
    Relación entre usuarios y becas
    """
    
    STATUS_CHOICES = [
        ('active', 'Activa'),
        ('completed', 'Completada'),
        ('suspended', 'Suspendida'),
        ('cancelled', 'Cancelada'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='scholarships',
        verbose_name='Usuario'
    )
    
    scholarship = models.ForeignKey(
        Scholarship,
        on_delete=models.CASCADE,
        verbose_name='Beca'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name='Estado'
    )
    
    start_date = models.DateField(
        verbose_name='Fecha de Inicio'
    )
    
    end_date = models.DateField(
        verbose_name='Fecha de Fin'
    )
    
    current_year_hours = models.PositiveIntegerField(
        default=0,
        verbose_name='Horas del Año Actual'
    )
    
    total_hours_completed = models.PositiveIntegerField(
        default=0,
        verbose_name='Total de Horas Completadas'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Beca de Usuario'
        verbose_name_plural = 'Becas de Usuarios'
        unique_together = ['user', 'scholarship']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.scholarship.name}"
    
    def get_progress_percentage(self):
        """Calcula el porcentaje de progreso de la beca"""
        if self.scholarship.required_hours == 0:
            return 0
        return (self.current_year_hours / self.scholarship.required_hours) * 100
    
    def get_remaining_hours(self):
        """Calcula las horas restantes para completar la beca"""
        return max(0, self.scholarship.required_hours - self.current_year_hours)
