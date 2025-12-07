from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User
from projects.models import Project
from applications.models import Application


class HourLog(models.Model):
    """
    Modelo para registro de horas de servicio comunitario
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('approved', 'Aprobado'),
        ('rejected', 'Rechazado'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='hour_logs',
        verbose_name='Usuario',
        limit_choices_to={'user_type': 'student'}
    )
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='hour_logs',
        verbose_name='Proyecto'
    )
    
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='hour_logs',
        blank=True,
        null=True,
        verbose_name='Aplicación'
    )
    
    hours = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0.25), MaxValueValidator(24)],
        verbose_name='Horas'
    )
    
    date = models.DateField(
        verbose_name='Fecha'
    )
    
    start_time = models.TimeField(
        verbose_name='Hora de Inicio'
    )
    
    end_time = models.TimeField(
        verbose_name='Hora de Fin'
    )
    
    activity_description = models.TextField(
        verbose_name='Descripción de la Actividad'
    )
    
    skills_developed = models.TextField(
        blank=True,
        verbose_name='Habilidades Desarrolladas'
    )
    
    impact_description = models.TextField(
        blank=True,
        verbose_name='Descripción del Impacto'
    )
    
    supervisor_name = models.CharField(
        max_length=200,
        verbose_name='Nombre del Supervisor'
    )
    
    supervisor_contact = models.CharField(
        max_length=200,
        verbose_name='Contacto del Supervisor'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Estado'
    )
    
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='reviewed_hour_logs',
        verbose_name='Revisado por',
        limit_choices_to={'user_type': 'admin'}
    )
    
    review_notes = models.TextField(
        blank=True,
        verbose_name='Notas de Revisión'
    )
    
    reviewed_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Fecha de Revisión'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Registro de Horas'
        verbose_name_plural = 'Registros de Horas'
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.project.name} - {self.hours}h ({self.date})"
    
    def clean(self):
        """Validación personalizada"""
        from django.core.exceptions import ValidationError
        
        if self.start_time and self.end_time:
            if self.start_time >= self.end_time:
                raise ValidationError('La hora de inicio debe ser anterior a la hora de fin')
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class HourLogDocument(models.Model):
    """
    Documentos adjuntos a registros de horas
    """
    
    DOCUMENT_TYPE_CHOICES = [
        ('attendance', 'Lista de Asistencia'),
        ('certificate', 'Certificado'),
        ('photo', 'Fotografía'),
        ('report', 'Reporte'),
        ('other', 'Otro'),
    ]
    
    hour_log = models.ForeignKey(
        HourLog,
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name='Registro de Horas'
    )
    
    title = models.CharField(
        max_length=200,
        verbose_name='Título'
    )
    
    document_type = models.CharField(
        max_length=20,
        choices=DOCUMENT_TYPE_CHOICES,
        verbose_name='Tipo de Documento'
    )
    
    file = models.FileField(
        upload_to='hour_log_documents/',
        verbose_name='Archivo'
    )
    
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Documento de Registro de Horas'
        verbose_name_plural = 'Documentos de Registros de Horas'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.hour_log} - {self.title}"


class HourSummary(models.Model):
    """
    Resumen de horas por usuario y período
    """
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='hour_summaries',
        verbose_name='Usuario'
    )
    
    year = models.PositiveIntegerField(
        verbose_name='Año'
    )
    
    month = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(12)],
        verbose_name='Mes'
    )
    
    total_hours = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        verbose_name='Total de Horas'
    )
    
    approved_hours = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        verbose_name='Horas Aprobadas'
    )
    
    pending_hours = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        verbose_name='Horas Pendientes'
    )
    
    rejected_hours = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        verbose_name='Horas Rechazadas'
    )
    
    projects_count = models.PositiveIntegerField(
        default=0,
        verbose_name='Número de Proyectos'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Resumen de Horas'
        verbose_name_plural = 'Resúmenes de Horas'
        unique_together = ['user', 'year', 'month']
        ordering = ['-year', '-month']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.year}/{self.month:02d} - {self.total_hours}h"


class HourGoal(models.Model):
    """
    Metas de horas para usuarios
    """
    
    GOAL_TYPE_CHOICES = [
        ('annual', 'Anual'),
        ('semester', 'Semestral'),
        ('monthly', 'Mensual'),
        ('project', 'Por Proyecto'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='hour_goals',
        verbose_name='Usuario'
    )
    
    goal_type = models.CharField(
        max_length=20,
        choices=GOAL_TYPE_CHOICES,
        verbose_name='Tipo de Meta'
    )
    
    target_hours = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        verbose_name='Horas Objetivo'
    )
    
    start_date = models.DateField(
        verbose_name='Fecha de Inicio'
    )
    
    end_date = models.DateField(
        verbose_name='Fecha de Fin'
    )
    
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activa'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Meta de Horas'
        verbose_name_plural = 'Metas de Horas'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.goal_type} - {self.target_hours}h"
    
    def get_progress_percentage(self):
        """Calcula el porcentaje de progreso hacia la meta"""
        if self.target_hours == 0:
            return 0
        
        # Calcular horas completadas en el período
        from django.utils import timezone
        completed_hours = HourLog.objects.filter(
            user=self.user,
            date__range=[self.start_date, self.end_date],
            status='approved'
        ).aggregate(
            total=models.Sum('hours')
        )['total'] or 0
        
        return (completed_hours / self.target_hours) * 100
    
    def get_remaining_hours(self):
        """Calcula las horas restantes para alcanzar la meta"""
        from django.utils import timezone
        completed_hours = HourLog.objects.filter(
            user=self.user,
            date__range=[self.start_date, self.end_date],
            status='approved'
        ).aggregate(
            total=models.Sum('hours')
        )['total'] or 0
        
        return max(0, self.target_hours - completed_hours)
