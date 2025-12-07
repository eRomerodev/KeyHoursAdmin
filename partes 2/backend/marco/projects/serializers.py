from rest_framework import serializers
from django.utils import timezone
from django.db import models
from .models import Project, ProjectCategory, ProjectRequirement, ProjectDocument
from users.serializers import UserSerializer


class ProjectCategorySerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo ProjectCategory
    """
    class Meta:
        model = ProjectCategory
        fields = '__all__'


class ProjectRequirementSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo ProjectRequirement
    """
    class Meta:
        model = ProjectRequirement
        fields = '__all__'


class ProjectDocumentSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo ProjectDocument
    """
    class Meta:
        model = ProjectDocument
        fields = '__all__'


class ProjectListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listado de proyectos
    """
    manager_name = serializers.CharField(source='manager.full_name', read_only=True)
    available_spots = serializers.SerializerMethodField()
    is_accepting_applications = serializers.SerializerMethodField()
    applications_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'manager_name', 'max_hours',
            'visibility', 'start_date', 'end_date', 'max_participants',
            'current_participants', 'available_spots', 'is_accepting_applications',
            'applications_count', 'is_active', 'created_at'
        ]
    
    def get_available_spots(self, obj):
        return obj.get_available_spots()
    
    def get_is_accepting_applications(self, obj):
        return obj.is_accepting_applications()
    
    def get_applications_count(self, obj):
        return obj.applications.count()


class ProjectDetailSerializer(serializers.ModelSerializer):
    """
    Serializer detallado para proyectos
    """
    manager = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    requirements = ProjectRequirementSerializer(many=True, read_only=True)
    documents = ProjectDocumentSerializer(many=True, read_only=True)
    # applications = ApplicationSerializer(many=True, read_only=True)  # Comentado para evitar import circular
    available_spots = serializers.SerializerMethodField()
    is_accepting_applications = serializers.SerializerMethodField()
    duration_days = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'manager', 'members', 'max_hours',
            'hour_assignment', 'automatic_hours', 'visibility', 'start_date',
            'end_date', 'max_participants', 'current_participants',
            'available_spots', 'is_accepting_applications', 'duration_days',
            'is_active', 'requirements', 'documents',
            'created_at', 'updated_at'
        ]
    
    def get_available_spots(self, obj):
        return obj.get_available_spots()
    
    def get_is_accepting_applications(self, obj):
        return obj.is_accepting_applications()
    
    def get_duration_days(self, obj):
        return obj.get_duration_days()


class ProjectCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para creación de proyectos
    """
    class Meta:
        model = Project
        fields = [
            'name', 'description', 'max_hours',
            'hour_assignment', 'automatic_hours', 'visibility',
            'start_date', 'end_date', 'max_participants'
        ]
        extra_kwargs = {
            'automatic_hours': {'required': False, 'allow_null': True}
        }
    
    def validate(self, attrs):
        # Validar horas automáticas
        if attrs['hour_assignment'] == 'automatic' and not attrs.get('automatic_hours'):
            raise serializers.ValidationError(
                "Debe especificar las horas automáticas cuando la asignación es automática."
            )
        
        # Validar fechas
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        
        if start_date and end_date:
            # Convertir strings a datetime si es necesario
            if isinstance(start_date, str):
                from datetime import datetime
                try:
                    start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                except ValueError:
                    start_date = datetime.fromisoformat(start_date)
                    
            if isinstance(end_date, str):
                from datetime import datetime
                try:
                    end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                except ValueError:
                    end_date = datetime.fromisoformat(end_date)
            
            if start_date >= end_date:
                raise serializers.ValidationError(
                    "La fecha de inicio debe ser anterior a la fecha de fin."
                )
        
        return attrs
    
    def create(self, validated_data):
        # Asegurar que las fechas tengan timezone
        start_date = validated_data.get('start_date')
        end_date = validated_data.get('end_date')
        
        if start_date and timezone.is_naive(start_date):
            validated_data['start_date'] = timezone.make_aware(start_date)
        
        if end_date and timezone.is_naive(end_date):
            validated_data['end_date'] = timezone.make_aware(end_date)
        
        return super().create(validated_data)


class ProjectUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para actualización de proyectos
    """
    class Meta:
        model = Project
        fields = [
            'name', 'description', 'max_hours', 'hour_assignment',
            'automatic_hours', 'visibility', 'start_date', 'end_date',
            'max_participants', 'is_active'
        ]
    
    def validate(self, attrs):
        if attrs.get('hour_assignment') == 'automatic' and not attrs.get('automatic_hours'):
            raise serializers.ValidationError(
                "Debe especificar las horas automáticas cuando la asignación es automática."
            )
        
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        
        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError(
                "La fecha de inicio debe ser anterior a la fecha de fin."
            )
        
        return attrs


class ConvocatoriaSerializer(serializers.ModelSerializer):
    """
    Serializer específico para convocatorias (proyectos con visibilidad 'convocatoria')
    """
    manager_name = serializers.CharField(source='manager.full_name', read_only=True)
    available_spots = serializers.SerializerMethodField()
    duration_days = serializers.SerializerMethodField()
    requirements_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'manager_name', 'max_hours',
            'start_date', 'end_date', 'max_participants', 'current_participants',
            'available_spots', 'duration_days', 'requirements_count',
            'created_at'
        ]
    
    def get_available_spots(self, obj):
        return obj.get_available_spots()
    
    def get_duration_days(self, obj):
        return obj.get_duration_days()
    
    def get_requirements_count(self, obj):
        return obj.requirements.count()


class ProjectStatsSerializer(serializers.ModelSerializer):
    """
    Serializer para estadísticas de proyectos
    """
    manager_name = serializers.CharField(source='manager.full_name', read_only=True)
    applications_count = serializers.SerializerMethodField()
    approved_applications_count = serializers.SerializerMethodField()
    pending_applications_count = serializers.SerializerMethodField()
    completed_applications_count = serializers.SerializerMethodField()
    total_hours_logged = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'manager_name', 'visibility', 'start_date',
            'end_date', 'max_participants', 'current_participants',
            'applications_count', 'approved_applications_count',
            'pending_applications_count', 'completed_applications_count',
            'total_hours_logged', 'is_active'
        ]
    
    def get_applications_count(self, obj):
        return obj.applications.count()
    
    def get_approved_applications_count(self, obj):
        return obj.applications.filter(status='approved').count()
    
    def get_pending_applications_count(self, obj):
        return obj.applications.filter(status='pending').count()
    
    def get_completed_applications_count(self, obj):
        return obj.applications.filter(status='completed').count()
    
    def get_total_hours_logged(self, obj):
        from hours.models import HourLog
        return HourLog.objects.filter(
            project=obj,
            status='approved'
        ).aggregate(
            total=models.Sum('hours')
        )['total'] or 0


class ProjectMemberSerializer(serializers.ModelSerializer):
    """
    Serializer para miembros de proyectos
    """
    user = UserSerializer(read_only=True)
    hours_completed = serializers.SerializerMethodField()
    application_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'user', 'hours_completed', 'application_status'
        ]
    
    def get_hours_completed(self, obj):
        from hours.models import HourLog
        return HourLog.objects.filter(
            project=obj,
            user=self.context.get('user'),
            status='approved'
        ).aggregate(
            total=models.Sum('hours')
        )['total'] or 0
    
    def get_application_status(self, obj):
        from applications.models import Application
        try:
            application = Application.objects.get(
                project=obj,
                user=self.context.get('user')
            )
            return application.status
        except Application.DoesNotExist:
            return None
