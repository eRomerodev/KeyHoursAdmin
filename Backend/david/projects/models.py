from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User


class Project(models.Model):
    """
    Modelo para proyectos y convocatorias
    """
    
    VISIBILITY_CHOICES = [
        ('unpublished', 'No Publicado'),
        ('convocatoria', 'Convocatoria'),
        ('published', 'Publicado'),
    ]
    
    HOUR_ASSIGNMENT_CHOICES = [
        ('automatic', 'Automática'),
        ('manual', 'Manual'),
    ]
    
    name = models.CharField(
        max_length=200,
        verbose_name='Nombre del Proyecto'
    )
    
    description = models.TextField(
        verbose_name='Descripción'
    )
    
    manager = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='managed_projects',
        verbose_name='Encargado',
        limit_choices_to={'user_type': 'admin'}
    )
    
    members = models.ManyToManyField(
        User,
        related_name='participating_projects',
        blank=True,
        verbose_name='Miembros'
    )
    
    max_hours = models.PositiveIntegerField(
        verbose_name='Horas Máximas',
        help_text='Máximo de horas que se pueden registrar en este proyecto'
    )
    
    hour_assignment = models.CharField(
        max_length=20,
        choices=HOUR_ASSIGNMENT_CHOICES,
        default='automatic',
        verbose_name='Asignación de Horas'
    )
    
    automatic_hours = models.PositiveIntegerField(
        blank=True,
        null=True,
        verbose_name='Horas Automáticas',
        help_text='Horas que se asignan automáticamente al completar el proyecto'
    )
    
    visibility = models.CharField(
        max_length=20,
        choices=VISIBILITY_CHOICES,
        default='unpublished',
        verbose_name='Visibilidad'
    )
    
    start_date = models.DateTimeField(
        verbose_name='Fecha de Inicio'
    )
    
    end_date = models.DateTimeField(
        verbose_name='Fecha de Fin'
    )
    
    max_participants = models.PositiveIntegerField(
        default=10,
        verbose_name='Máximo de Participantes'
    )
    
    current_participants = models.PositiveIntegerField(
        default=0,
        verbose_name='Participantes Actuales'
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    def get_available_spots(self):
        """Calcula las plazas disponibles"""
        return max(0, self.max_participants - self.current_participants)
    
    def is_accepting_applications(self):
        """Verifica si el proyecto está aceptando aplicaciones"""
        from django.utils import timezone
        return (
            self.visibility == 'convocatoria' and
            self.is_active and
            timezone.now() <= self.end_date and
            self.get_available_spots() > 0
        )
    
    def get_duration_days(self):
        """Calcula la duración del proyecto en días"""
        return (self.end_date - self.start_date).days


class ProjectCategory(models.Model):
    """
    Categorías para proyectos
    """
    
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Nombre'
    )
    
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    
    color = models.CharField(
        max_length=7,
        default='#2196F3',
        help_text='Color en formato hexadecimal (ej: #2196F3)'
    )
    
    icon = models.CharField(
        max_length=50,
        blank=True,
        help_text='Nombre del icono (ej: education, healthcare)'
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Categoría de Proyecto'
        verbose_name_plural = 'Categorías de Proyectos'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class ProjectRequirement(models.Model):
    """
    Requisitos para participar en un proyecto
    """
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='requirements',
        verbose_name='Proyecto'
    )
    
    title = models.CharField(
        max_length=200,
        verbose_name='Título del Requisito'
    )
    
    description = models.TextField(
        verbose_name='Descripción'
    )
    
    is_mandatory = models.BooleanField(
        default=True,
        verbose_name='Obligatorio'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Requisito de Proyecto'
        verbose_name_plural = 'Requisitos de Proyectos'
        ordering = ['-is_mandatory', 'title']
    
    def __str__(self):
        return f"{self.project.name} - {self.title}"


class ProjectDocument(models.Model):
    """
    Documentos relacionados con proyectos
    """
    
    DOCUMENT_TYPE_CHOICES = [
        ('description', 'Descripción'),
        ('requirements', 'Requisitos'),
        ('manual', 'Manual'),
        ('template', 'Plantilla'),
        ('other', 'Otro'),
    ]
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name='Proyecto'
    )
    
    title = models.CharField(
        max_length=200,
        verbose_name='Título'
    )
    
    document_type = models.CharField(
        max_length=20,
        choices=DOCUMENT_TYPE_CHOICES,
        default='other',
        verbose_name='Tipo de Documento'
    )
    
    file = models.FileField(
        upload_to='project_documents/',
        verbose_name='Archivo'
    )
    
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    
    is_public = models.BooleanField(
        default=True,
        verbose_name='Público'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Documento de Proyecto'
        verbose_name_plural = 'Documentos de Proyectos'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.project.name} - {self.title}"
