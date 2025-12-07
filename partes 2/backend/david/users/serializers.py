from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, Scholarship, UserScholarship


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo User
    """
    full_name = serializers.ReadOnlyField()
    total_hours = serializers.SerializerMethodField()
    completed_projects = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'user_type', 'carnet', 'phone', 'date_of_birth', 'profile_picture',
            'scholarship_type', 'scholarship_percentage',
            'is_active', 'total_hours', 'completed_projects', 'date_joined',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'date_joined', 'created_at', 'updated_at']
    
    def get_total_hours(self, obj):
        return obj.get_total_hours()
    
    def get_completed_projects(self, obj):
        return obj.get_completed_projects()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer para registro de nuevos usuarios
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'user_type', 'carnet',
            'phone', 'date_of_birth'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return attrs
    
    def validate_carnet(self, value):
        if User.objects.filter(carnet=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este carnet.")
        return value
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class SimpleStudentRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para registro de estudiantes por administradores
    Acepta: username (opcional), first_name, last_name, carnet, password
    """
    password = serializers.CharField(write_only=True, min_length=8, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'carnet', 'password', 'password_confirm', 'scholarship_type', 'scholarship_percentage']
    
    
    def validate_carnet(self, value):
        if not value:
            raise serializers.ValidationError("El carnet es requerido.")
        # Convertir a mayúsculas y validar formato
        value = value.upper().strip()
        if not value:
            raise serializers.ValidationError("El carnet no puede estar vacío.")
        if User.objects.filter(carnet=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este carnet.")
        return value
    
    def validate_username(self, value):
        if value:
            value = value.strip()
            # Validar formato de username (sin espacios)
            if ' ' in value:
                raise serializers.ValidationError("El nombre de usuario no puede contener espacios.")
            if User.objects.filter(username=value).exists():
                raise serializers.ValidationError("Ya existe un usuario con este nombre de usuario.")
        return value
    
    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({"password_confirm": "Las contraseñas no coinciden."})
        
        # Si no hay username, generar uno automáticamente
        if not attrs.get('username'):
            first_name = attrs.get('first_name', '').strip()
            last_name = attrs.get('last_name', '').strip()
            carnet = attrs.get('carnet', '').strip().lower()
            
            if first_name and last_name:
                # Generar username basado en nombre y apellido
                first = ''.join(c for c in first_name.lower() if c.isalnum())
                last = ''.join(c for c in last_name.lower() if c.isalnum())
                if first and last:
                    base_username = f"{first}.{last}"[:30]
                    username = base_username
                    counter = 1
                    # Asegurar que sea único
                    while User.objects.filter(username=username).exists():
                        username = f"{base_username}{counter}"[:30]
                        counter += 1
                    attrs['username'] = username
                elif carnet:
                    attrs['username'] = carnet
                else:
                    raise serializers.ValidationError({"username": "Se requiere nombre y apellido, o un nombre de usuario."})
            elif carnet:
                attrs['username'] = carnet
            else:
                raise serializers.ValidationError({"username": "Se requiere nombre y apellido, o un nombre de usuario."})
        
        return attrs
    
    def validate_scholarship_percentage(self, value):
        if value is not None:
            if value < 0 or value > 100:
                raise serializers.ValidationError("El porcentaje de beca debe estar entre 0 y 100.")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('password_confirm', None)
        
        # Guardar la contraseña temporal para que el admin pueda verla
        validated_data['temp_password'] = password
        validated_data['user_type'] = 'student'
        
        # Asegurar valores por defecto para scholarship
        if 'scholarship_type' not in validated_data or not validated_data['scholarship_type']:
            validated_data['scholarship_type'] = 'KEY EXCELLENCE'
        if 'scholarship_percentage' not in validated_data or validated_data['scholarship_percentage'] is None:
            validated_data['scholarship_percentage'] = 100.0
        
        user = User.objects.create_user(password=password, **validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer para login de usuarios
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Credenciales inválidas.')
            if not user.is_active:
                raise serializers.ValidationError('La cuenta está desactivada.')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Debe proporcionar username y password.')


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para actualización de usuarios
    """
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'username', 'carnet', 'email', 'first_name', 'last_name', 'phone',
            'date_of_birth', 'profile_picture', 'scholarship_type', 'scholarship_percentage',
            'password', 'password_confirm'
        ]
    
    def validate(self, attrs):
        # Validar contraseña si se proporciona
        if attrs.get('password'):
            if not attrs.get('password_confirm'):
                raise serializers.ValidationError({"password_confirm": "Confirma la contraseña."})
            if attrs['password'] != attrs['password_confirm']:
                raise serializers.ValidationError({"password_confirm": "Las contraseñas no coinciden."})
        return attrs
    
    def validate_username(self, value):
        user = self.instance
        if user and User.objects.filter(username=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("Ya existe un usuario con este nombre de usuario.")
        # Validar formato (sin espacios)
        if ' ' in value:
            raise serializers.ValidationError("El nombre de usuario no puede contener espacios.")
        return value
    
    def validate_carnet(self, value):
        user = self.instance
        if not value:
            raise serializers.ValidationError("El carnet es requerido.")
        value = value.upper().strip()
        if user and User.objects.filter(carnet=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("Ya existe un usuario con este carnet.")
        return value
    
    def validate_email(self, value):
        user = self.instance
        if value and User.objects.filter(email=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("Ya existe un usuario con este email.")
        return value
    
    def validate_scholarship_percentage(self, value):
        if value is not None:
            if value < 0 or value > 100:
                raise serializers.ValidationError("El porcentaje de beca debe estar entre 0 y 100.")
        return value
    
    def update(self, instance, validated_data):
        # Manejar contraseña si se proporciona
        password = validated_data.pop('password', None)
        validated_data.pop('password_confirm', None)
        
        if password:
            instance.set_password(password)
        
        # Actualizar otros campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer para cambio de contraseña
    """
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Las nuevas contraseñas no coinciden.")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("La contraseña actual es incorrecta.")
        return value
    
    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class ScholarshipSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Scholarship
    """
    class Meta:
        model = Scholarship
        fields = '__all__'


class UserScholarshipSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo UserScholarship
    """
    scholarship_name = serializers.CharField(source='scholarship.name', read_only=True)
    scholarship_type = serializers.CharField(source='scholarship.scholarship_type', read_only=True)
    required_hours = serializers.IntegerField(source='scholarship.required_hours', read_only=True)
    progress_percentage = serializers.SerializerMethodField()
    remaining_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = UserScholarship
        fields = [
            'id', 'scholarship', 'scholarship_name', 'scholarship_type',
            'status', 'start_date', 'end_date', 'current_year_hours',
            'total_hours_completed', 'required_hours', 'progress_percentage',
            'remaining_hours', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_progress_percentage(self, obj):
        return obj.get_progress_percentage()
    
    def get_remaining_hours(self, obj):
        return obj.get_remaining_hours()


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer completo para perfil de usuario
    """
    scholarships = UserScholarshipSerializer(many=True, read_only=True)
    total_hours = serializers.SerializerMethodField()
    completed_projects = serializers.SerializerMethodField()
    projects = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'user_type', 'carnet', 'phone', 'date_of_birth', 'profile_picture',
            'scholarship_type', 'scholarship_percentage',
            'is_active', 'date_joined', 'scholarships', 'total_hours',
            'completed_projects', 'projects', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user_type', 'is_active',
            'date_joined', 'created_at', 'updated_at'
        ]
    
    def validate_username(self, value):
        """Validar que el username sea único"""
        user = self.instance
        if user and User.objects.filter(username=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value
    
    def validate_carnet(self, value):
        """Validar que el carnet sea único"""
        user = self.instance
        if user and User.objects.filter(carnet=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("Este carnet ya está en uso.")
        return value
    
    def get_total_hours(self, obj):
        return obj.get_total_hours()
    
    def get_completed_projects(self, obj):
        return obj.get_completed_projects()
    
    def get_projects(self, obj):
        """Obtener proyectos del estudiante con información de horas"""
        if obj.user_type != 'student':
            return []
        
        from applications.models import Application
        from hours.models import HourLog
        from django.db.models import Sum
        
        applications = Application.objects.filter(user=obj).select_related('project')
        projects_data = []
        for app in applications:
            # Obtener horas por proyecto
            project_hours = HourLog.objects.filter(
                user=obj,
                project=app.project,
                status='approved'
            ).aggregate(total=Sum('hours'))['total'] or 0
            
            projects_data.append({
                'project_id': app.project.id,
                'project_name': app.project.name,
                'status': app.status,
                'hours_completed': float(project_hours),
                'applied_at': app.applied_at.isoformat() if app.applied_at else None,
            })
        
        return projects_data


class StudentListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listado de estudiantes
    """
    full_name = serializers.ReadOnlyField()
    total_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'full_name', 'carnet', 'email', 'user_type',
            'scholarship_type', 'scholarship_percentage',
            'total_hours', 'is_active', 'date_joined'
        ]
    
    def get_total_hours(self, obj):
        return obj.get_total_hours()


class AdminListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listado de administradores
    """
    full_name = serializers.ReadOnlyField()
    managed_projects_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'full_name', 'username', 'email', 'user_type',
            'managed_projects_count', 'is_active', 'date_joined'
        ]
    
    def get_managed_projects_count(self, obj):
        return obj.managed_projects.count()
