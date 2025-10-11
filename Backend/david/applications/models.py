from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User
from projects.models import Project


class Application(models.Model):
    """
    Modelo para aplicaciones a proyectos/convocatorias
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('approved', 'Aprobada'),
        ('rejected', 'Rechazada'),
        ('in_progress', 'En Progreso'),
        ('completed', 'Completada'),
        ('cancelled', 'Cancelada'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='applications',
        verbose_name='Usuario',
        limit_choices_to={'user_type': 'student'}
    )
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='applications',
        verbose_name='Proyecto'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Estado'
    )
    
    motivation = models.TextField(
        verbose_name='Motivación',
        help_text='Explica por qué quieres participar en este proyecto'
    )
    
    relevant_experience = models.TextField(
        blank=True,
        verbose_name='Experiencia Relevante',
        help_text='Describe tu experiencia relacionada con este proyecto'
    )
    
    available_hours_per_week = models.PositiveIntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(40)],
        verbose_name='Horas Disponibles por Semana'
    )
    
    start_date_preference = models.DateField(
        verbose_name='Fecha de Inicio Preferida'
    )
    
    additional_notes = models.TextField(
        blank=True,
        verbose_name='Notas Adicionales'
    )
    
    applied_at = models.DateTimeField(auto_now_add=True)
    
    reviewed_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Fecha de Revisión'
    )
    
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='reviewed_applications',
        verbose_name='Revisado por',
        limit_choices_to={'user_type': 'admin'}
    )
    
    review_notes = models.TextField(
        blank=True,
        verbose_name='Notas de Revisión'
    )
    
    # Campos para seguimiento
    hours_completed = models.PositiveIntegerField(
        default=0,
        verbose_name='Horas Completadas'
    )
    
    completion_date = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Fecha de Completado'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Aplicación'
        verbose_name_plural = 'Aplicaciones'
        unique_together = ['user', 'project']
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.project.name}"
    
    def can_be_approved(self):
        """Verifica si la aplicación puede ser aprobada"""
        return (
            self.status == 'pending' and
            self.project.is_accepting_applications()
        )
    
    def get_progress_percentage(self):
        """Calcula el porcentaje de progreso"""
        if self.project.max_hours == 0:
            return 0
        return (self.hours_completed / self.project.max_hours) * 100
    
    def get_remaining_hours(self):
        """Calcula las horas restantes"""
        return max(0, self.project.max_hours - self.hours_completed)


class ApplicationDocument(models.Model):
    """
    Documentos adjuntos a aplicaciones
    """
    
    DOCUMENT_TYPE_CHOICES = [
        ('cv', 'Currículum Vitae'),
        ('transcript', 'Expediente Académico'),
        ('recommendation', 'Carta de Recomendación'),
        ('portfolio', 'Portafolio'),
        ('other', 'Otro'),
    ]
    
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name='Aplicación'
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
        upload_to='application_documents/',
        verbose_name='Archivo'
    )
    
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Documento de Aplicación'
        verbose_name_plural = 'Documentos de Aplicaciones'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.application} - {self.title}"


class ApplicationEvaluation(models.Model):
    """
    Evaluaciones de aplicaciones por parte de administradores
    """
    
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='evaluations',
        verbose_name='Aplicación'
    )
    
    evaluator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='application_evaluations',
        verbose_name='Evaluador',
        limit_choices_to={'user_type': 'admin'}
    )
    
    score = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        verbose_name='Puntuación (1-10)'
    )
    
    comments = models.TextField(
        verbose_name='Comentarios'
    )
    
    recommendation = models.CharField(
        max_length=20,
        choices=[
            ('approve', 'Aprobar'),
            ('reject', 'Rechazar'),
            ('interview', 'Entrevista'),
        ],
        verbose_name='Recomendación'
    )
    
    evaluated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Evaluación de Aplicación'
        verbose_name_plural = 'Evaluaciones de Aplicaciones'
        unique_together = ['application', 'evaluator']
        ordering = ['-evaluated_at']
    
    def __str__(self):
        return f"{self.application} - {self.evaluator.full_name}"


class ApplicationNotification(models.Model):
    """
    Notificaciones relacionadas con aplicaciones
    """
    
    NOTIFICATION_TYPE_CHOICES = [
        ('application_submitted', 'Aplicación Enviada'),
        ('application_reviewed', 'Aplicación Revisada'),
        ('application_approved', 'Aplicación Aprobada'),
        ('application_rejected', 'Aplicación Rechazada'),
        ('project_started', 'Proyecto Iniciado'),
        ('project_completed', 'Proyecto Completado'),
        ('hours_updated', 'Horas Actualizadas'),
    ]
    
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name='Aplicación'
    )
    
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='application_notifications',
        verbose_name='Destinatario'
    )
    
    notification_type = models.CharField(
        max_length=30,
        choices=NOTIFICATION_TYPE_CHOICES,
        verbose_name='Tipo de Notificación'
    )
    
    title = models.CharField(
        max_length=200,
        verbose_name='Título'
    )
    
    message = models.TextField(
        verbose_name='Mensaje'
    )
    
    is_read = models.BooleanField(
        default=False,
        verbose_name='Leído'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Notificación de Aplicación'
        verbose_name_plural = 'Notificaciones de Aplicaciones'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.recipient.full_name} - {self.title}"
