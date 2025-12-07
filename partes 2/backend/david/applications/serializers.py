from rest_framework import serializers
from .models import Application, ApplicationDocument, ApplicationEvaluation, ApplicationNotification
from projects.serializers import ProjectListSerializer
from users.serializers import UserSerializer


class ApplicationDocumentSerializer(serializers.ModelSerializer):
    """
    Serializer para documentos de aplicaciones
    """
    class Meta:
        model = ApplicationDocument
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Application
    """
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_carnet = serializers.CharField(source='user.carnet', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    reviewer_name = serializers.CharField(source='reviewed_by.full_name', read_only=True)
    progress_percentage = serializers.SerializerMethodField()
    remaining_hours = serializers.SerializerMethodField()
    documents = ApplicationDocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'user', 'user_name', 'user_carnet', 'project', 'project_name',
            'status', 'motivation', 'relevant_experience', 'available_hours_per_week',
            'start_date_preference', 'additional_notes', 'applied_at', 'reviewed_at',
            'reviewed_by', 'reviewer_name', 'review_notes', 'hours_completed',
            'completion_date', 'progress_percentage', 'remaining_hours', 'documents',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'applied_at', 'reviewed_at', 'reviewed_by', 'hours_completed',
            'completion_date', 'created_at', 'updated_at'
        ]
    
    def get_progress_percentage(self, obj):
        return obj.get_progress_percentage()
    
    def get_remaining_hours(self, obj):
        return obj.get_remaining_hours()


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para creación de aplicaciones
    """
    class Meta:
        model = Application
        fields = [
            'project', 'motivation', 'relevant_experience',
            'available_hours_per_week', 'start_date_preference', 'additional_notes'
        ]
    
    def validate(self, attrs):
        if 'request' not in self.context:
            raise serializers.ValidationError("Contexto de request no disponible")
        
        user = self.context['request'].user
        project = attrs.get('project')
        
        if not project:
            raise serializers.ValidationError({"project": "El proyecto es requerido"})
        
        # Verificar que el usuario no haya aplicado previamente
        existing_application = Application.objects.filter(user=user, project=project).first()
        if existing_application:
            if existing_application.status in ['pending', 'approved', 'in_progress']:
                raise serializers.ValidationError(
                    {"project": "Ya has aplicado a este proyecto."}
                )
        
        # Verificar que el proyecto esté aceptando aplicaciones
        if not project.is_accepting_applications():
            raise serializers.ValidationError(
                {"project": "Este proyecto no está aceptando aplicaciones en este momento."}
            )
        
        # Verificar que el proyecto no esté lleno
        if project.current_participants >= project.max_participants:
            raise serializers.ValidationError(
                {"project": "Este proyecto ya ha alcanzado el máximo de participantes."}
            )
        
        return attrs


class ApplicationUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para actualización de aplicaciones
    """
    class Meta:
        model = Application
        fields = [
            'status', 'review_notes', 'hours_completed'
        ]
    
    def validate_status(self, value):
        # Solo permitir ciertos cambios de estado
        instance = self.instance
        if instance:
            current_status = instance.status
            
            # Reglas de transición de estado
            valid_transitions = {
                'pending': ['approved', 'rejected'],
                'approved': ['in_progress', 'cancelled'],
                'in_progress': ['completed', 'cancelled'],
                'completed': [],  # Estado final
                'rejected': [],   # Estado final
                'cancelled': []   # Estado final
            }
            
            if value not in valid_transitions.get(current_status, []):
                raise serializers.ValidationError(
                    f"No se puede cambiar de '{current_status}' a '{value}'."
                )
        
        return value


class ApplicationEvaluationSerializer(serializers.ModelSerializer):
    """
    Serializer para evaluaciones de aplicaciones
    """
    evaluator_name = serializers.CharField(source='evaluator.full_name', read_only=True)
    application_user = serializers.CharField(source='application.user.full_name', read_only=True)
    application_project = serializers.CharField(source='application.project.name', read_only=True)
    
    class Meta:
        model = ApplicationEvaluation
        fields = [
            'id', 'application', 'application_user', 'application_project',
            'evaluator', 'evaluator_name', 'score', 'comments', 'recommendation',
            'evaluated_at'
        ]
        read_only_fields = ['id', 'evaluated_at']


class ApplicationNotificationSerializer(serializers.ModelSerializer):
    """
    Serializer para notificaciones de aplicaciones
    """
    recipient_name = serializers.CharField(source='recipient.full_name', read_only=True)
    project_name = serializers.CharField(source='application.project.name', read_only=True)
    
    class Meta:
        model = ApplicationNotification
        fields = [
            'id', 'application', 'project_name', 'recipient', 'recipient_name',
            'notification_type', 'title', 'message', 'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ApplicationListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listado de aplicaciones
    """
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_carnet = serializers.CharField(source='user.carnet', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    project_manager = serializers.CharField(source='project.manager.full_name', read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'user_name', 'user_carnet', 'project_name', 'project_manager',
            'status', 'applied_at', 'reviewed_at', 'hours_completed'
        ]


class ApplicationStatsSerializer(serializers.Serializer):
    """
    Serializer para estadísticas de aplicaciones
    """
    total_applications = serializers.IntegerField()
    pending_applications = serializers.IntegerField()
    approved_applications = serializers.IntegerField()
    rejected_applications = serializers.IntegerField()
    in_progress_applications = serializers.IntegerField()
    completed_applications = serializers.IntegerField()
    cancelled_applications = serializers.IntegerField()


class ProjectApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer para aplicaciones de un proyecto específico
    """
    user = UserSerializer(read_only=True)
    progress_percentage = serializers.SerializerMethodField()
    remaining_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = [
            'id', 'user', 'status', 'motivation', 'available_hours_per_week',
            'start_date_preference', 'applied_at', 'reviewed_at', 'hours_completed',
            'progress_percentage', 'remaining_hours'
        ]
    
    def get_progress_percentage(self, obj):
        return obj.get_progress_percentage()
    
    def get_remaining_hours(self, obj):
        return obj.get_remaining_hours()


class StudentApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer para aplicaciones de un estudiante específico
    """
    project = ProjectListSerializer(read_only=True)
    progress_percentage = serializers.SerializerMethodField()
    remaining_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = [
            'id', 'project', 'status', 'motivation', 'available_hours_per_week',
            'start_date_preference', 'applied_at', 'reviewed_at', 'hours_completed',
            'progress_percentage', 'remaining_hours'
        ]
    
    def get_progress_percentage(self, obj):
        return obj.get_progress_percentage()
    
    def get_remaining_hours(self, obj):
        return obj.get_remaining_hours()


class ApplicationBulkActionSerializer(serializers.Serializer):
    """
    Serializer para acciones masivas en aplicaciones
    """
    application_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1
    )
    action = serializers.ChoiceField(
        choices=['approve', 'reject', 'cancel']
    )
    notes = serializers.CharField(
        required=False,
        allow_blank=True
    )
    
    def validate_application_ids(self, value):
        # Verificar que las aplicaciones existen
        from .models import Application
        existing_ids = Application.objects.filter(
            id__in=value
        ).values_list('id', flat=True)
        
        missing_ids = set(value) - set(existing_ids)
        if missing_ids:
            raise serializers.ValidationError(
                f"Las siguientes aplicaciones no existen: {list(missing_ids)}"
            )
        
        return value
