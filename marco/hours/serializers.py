from rest_framework import serializers
from django.db import models
from .models import HourLog, HourLogDocument, HourSummary, HourGoal
from projects.serializers import ProjectListSerializer
from users.serializers import UserSerializer


class HourLogDocumentSerializer(serializers.ModelSerializer):
    """
    Serializer para documentos de registros de horas
    """
    class Meta:
        model = HourLogDocument
        fields = '__all__'


class HourLogSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo HourLog
    """
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_carnet = serializers.CharField(source='user.carnet', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    reviewer_name = serializers.CharField(source='reviewed_by.full_name', read_only=True)
    documents = HourLogDocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = HourLog
        fields = [
            'id', 'user', 'user_name', 'user_carnet', 'project', 'project_name',
            'application', 'hours', 'date', 'start_time', 'end_time',
            'activity_description', 'skills_developed', 'impact_description',
            'supervisor_name', 'supervisor_contact', 'status', 'reviewed_by',
            'reviewer_name', 'review_notes', 'reviewed_at', 'documents',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'reviewed_by', 'reviewed_at', 'created_at', 'updated_at'
        ]
    
    def validate(self, attrs):
        # Validación personalizada para tiempo
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')
        
        if start_time and end_time:
            if start_time >= end_time:
                raise serializers.ValidationError(
                    "La hora de inicio debe ser anterior a la hora de fin."
                )
        
        return attrs


class HourLogCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para creación de registros de horas
    """
    class Meta:
        model = HourLog
        fields = [
            'project', 'application', 'hours', 'date', 'start_time', 'end_time',
            'activity_description', 'skills_developed', 'impact_description',
            'supervisor_name', 'supervisor_contact'
        ]
    
    def validate(self, attrs):
        user = self.context['request'].user
        project = attrs['project']
        application = attrs.get('application')
        
        # Verificar que el usuario tenga una aplicación aprobada para el proyecto
        if application:
            if application.user != user:
                raise serializers.ValidationError(
                    "No puedes registrar horas para esta aplicación."
                )
            if application.status not in ['approved', 'in_progress']:
                raise serializers.ValidationError(
                    "Solo puedes registrar horas para aplicaciones aprobadas o en progreso."
                )
        else:
            # Si no se especifica aplicación, verificar que el usuario esté en el proyecto
            if not project.members.filter(id=user.id).exists():
                raise serializers.ValidationError(
                    "No eres miembro de este proyecto."
                )
        
        # Verificar que la fecha esté dentro del rango del proyecto
        if attrs['date'] < project.start_date.date():
            raise serializers.ValidationError(
                "La fecha no puede ser anterior al inicio del proyecto."
            )
        
        if attrs['date'] > project.end_date.date():
            raise serializers.ValidationError(
                "La fecha no puede ser posterior al fin del proyecto."
            )
        
        return attrs


class HourLogUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para actualización de registros de horas
    """
    class Meta:
        model = HourLog
        fields = [
            'hours', 'date', 'start_time', 'end_time', 'activity_description',
            'skills_developed', 'impact_description', 'supervisor_name',
            'supervisor_contact', 'status', 'review_notes'
        ]
    
    def validate_status(self, value):
        instance = self.instance
        if instance:
            current_status = instance.status
            
            # Solo permitir ciertos cambios de estado
            valid_transitions = {
                'pending': ['approved', 'rejected'],
                'approved': [],  # Estado final
                'rejected': ['pending']  # Permitir reenvío
            }
            
            if value not in valid_transitions.get(current_status, []):
                raise serializers.ValidationError(
                    f"No se puede cambiar de '{current_status}' a '{value}'."
                )
        
        return value


class HourLogReviewSerializer(serializers.ModelSerializer):
    """
    Serializer para revisión de registros de horas
    """
    class Meta:
        model = HourLog
        fields = ['status', 'review_notes']
    
    def validate_status(self, value):
        if value not in ['approved', 'rejected']:
            raise serializers.ValidationError(
                "El estado debe ser 'approved' o 'rejected'."
            )
        return value


class HourSummarySerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo HourSummary
    """
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = HourSummary
        fields = [
            'id', 'user', 'user_name', 'year', 'month', 'total_hours',
            'approved_hours', 'pending_hours', 'rejected_hours',
            'projects_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class HourGoalSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo HourGoal
    """
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    progress_percentage = serializers.SerializerMethodField()
    remaining_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = HourGoal
        fields = [
            'id', 'user', 'user_name', 'goal_type', 'target_hours',
            'start_date', 'end_date', 'description', 'is_active',
            'progress_percentage', 'remaining_hours', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_progress_percentage(self, obj):
        return obj.get_progress_percentage()
    
    def get_remaining_hours(self, obj):
        return obj.get_remaining_hours()


class HourStatsSerializer(serializers.Serializer):
    """
    Serializer para estadísticas de horas
    """
    total_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    approved_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    pending_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    rejected_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    projects_count = serializers.IntegerField()
    current_month_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    current_year_hours = serializers.DecimalField(max_digits=8, decimal_places=2)


class UserHourSummarySerializer(serializers.ModelSerializer):
    """
    Serializer para resumen de horas de un usuario
    """
    project_name = serializers.CharField(source='project.name', read_only=True)
    project_manager = serializers.CharField(source='project.manager.full_name', read_only=True)
    
    class Meta:
        model = HourLog
        fields = [
            'id', 'project', 'project_name', 'project_manager', 'hours',
            'date', 'status', 'created_at'
        ]


class ProjectHourSummarySerializer(serializers.ModelSerializer):
    """
    Serializer para resumen de horas de un proyecto
    """
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_carnet = serializers.CharField(source='user.carnet', read_only=True)
    
    class Meta:
        model = HourLog
        fields = [
            'id', 'user', 'user_name', 'user_carnet', 'hours',
            'date', 'status', 'activity_description', 'created_at'
        ]


class HourLogListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listado de registros de horas
    """
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    
    class Meta:
        model = HourLog
        fields = [
            'id', 'user_name', 'project_name', 'hours', 'date',
            'status', 'created_at'
        ]


class MonthlyHourReportSerializer(serializers.Serializer):
    """
    Serializer para reportes mensuales de horas
    """
    month = serializers.IntegerField()
    year = serializers.IntegerField()
    total_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    approved_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    pending_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    rejected_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    projects_count = serializers.IntegerField()
    logs_count = serializers.IntegerField()


class YearlyHourReportSerializer(serializers.Serializer):
    """
    Serializer para reportes anuales de horas
    """
    year = serializers.IntegerField()
    total_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    approved_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    pending_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    rejected_hours = serializers.DecimalField(max_digits=8, decimal_places=2)
    projects_count = serializers.IntegerField()
    logs_count = serializers.IntegerField()
    monthly_breakdown = MonthlyHourReportSerializer(many=True)


class HourGoalCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para creación de metas de horas
    """
    class Meta:
        model = HourGoal
        fields = [
            'goal_type', 'target_hours', 'start_date', 'end_date', 'description'
        ]
    
    def validate(self, attrs):
        if attrs['start_date'] >= attrs['end_date']:
            raise serializers.ValidationError(
                "La fecha de inicio debe ser anterior a la fecha de fin."
            )
        
        if attrs['target_hours'] <= 0:
            raise serializers.ValidationError(
                "Las horas objetivo deben ser mayores a 0."
            )
        
        return attrs
