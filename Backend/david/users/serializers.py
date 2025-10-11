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
    Solo requiere: username, carnet, password
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'carnet', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Las contraseñas no coinciden."})
        return attrs
    
    def validate_carnet(self, value):
        if User.objects.filter(carnet=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este carnet.")
        return value.upper()  # Convertir a mayúsculas
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este nombre de usuario.")
        return value
    
    def create(self, validated_data):
        password = validated_data['password']
        validated_data.pop('password_confirm')
        
        # Guardar la contraseña temporal para que el admin pueda verla
        validated_data['temp_password'] = password
        validated_data['user_type'] = 'student'
        
        user = User.objects.create_user(**validated_data)
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
    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'phone',
            'date_of_birth', 'profile_picture'
        ]
    
    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.filter(email=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("Ya existe un usuario con este email.")
        return value


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
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'user_type', 'carnet', 'phone', 'date_of_birth', 'profile_picture',
            'is_active', 'date_joined', 'scholarships', 'total_hours',
            'completed_projects', 'created_at', 'updated_at'
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
