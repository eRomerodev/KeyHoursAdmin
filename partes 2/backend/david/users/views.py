from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from django.db import models

from .models import User, Scholarship, UserScholarship
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    UserUpdateSerializer, PasswordChangeSerializer, UserProfileSerializer,
    StudentListSerializer, AdminListSerializer, ScholarshipSerializer,
    UserScholarshipSerializer, SimpleStudentRegistrationSerializer
)


class UserRegistrationView(generics.CreateAPIView):
    """
    Vista para registro de nuevos usuarios
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Usuario registrado exitosamente'
        }, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    """
    Vista para login de usuarios
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Login exitoso'
        }, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Vista para obtener y actualizar perfil del usuario autenticado
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class PasswordChangeView(APIView):
    """
    Vista para cambio de contraseña
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'message': 'Contraseña actualizada exitosamente'
        }, status=status.HTTP_200_OK)


class StudentListView(generics.ListAPIView):
    """
    Vista para listar estudiantes
    """
    serializer_class = StudentListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = User.objects.filter(user_type='student')
        
        # Filtros
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(carnet__icontains=search) |
                Q(email__icontains=search)
            )
        
        # Ordenamiento
        ordering = self.request.query_params.get('ordering', '-date_joined')
        if ordering:
            queryset = queryset.order_by(ordering)
        
        return queryset


class StudentDetailView(generics.RetrieveAPIView):
    """
    Vista para obtener detalles de un estudiante
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(user_type='student')


class AdminListView(generics.ListAPIView):
    """
    Vista para listar administradores
    """
    serializer_class = AdminListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = User.objects.filter(user_type='admin')
        
        # Filtros
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(username__icontains=search) |
                Q(email__icontains=search)
            )
        
        # Ordenamiento
        ordering = self.request.query_params.get('ordering', '-date_joined')
        if ordering:
            queryset = queryset.order_by(ordering)
        
        return queryset


class UserStatsView(APIView):
    """
    Vista para estadísticas de usuarios
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        stats = {
            'total_students': User.objects.filter(user_type='student').count(),
            'total_admins': User.objects.filter(user_type='admin').count(),
            'active_students': User.objects.filter(
                user_type='student',
                is_active=True
            ).count(),
            'active_admins': User.objects.filter(
                user_type='admin',
                is_active=True
            ).count(),
            'students_with_hours': User.objects.filter(
                user_type='student',
                hour_logs__isnull=False
            ).distinct().count(),
        }
        
        return Response(stats, status=status.HTTP_200_OK)


# Vistas para Becas

class ScholarshipListView(generics.ListCreateAPIView):
    """
    Vista para listar y crear becas
    """
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Scholarship.objects.filter(is_active=True)
        
        # Filtros
        scholarship_type = self.request.query_params.get('type', None)
        if scholarship_type:
            queryset = queryset.filter(scholarship_type=scholarship_type)
        
        return queryset.order_by('name')


class ScholarshipDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar y eliminar becas
    """
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserScholarshipListView(generics.ListCreateAPIView):
    """
    Vista para listar becas de usuarios
    """
    serializer_class = UserScholarshipSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        
        if user_id:
            return UserScholarship.objects.filter(user_id=user_id)
        
        # Si es admin, puede ver todas las becas
        if self.request.user.user_type == 'admin':
            return UserScholarship.objects.all()
        
        # Si es estudiante, solo sus propias becas
        return UserScholarship.objects.filter(user=self.request.user)


class UserScholarshipDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar y eliminar becas de usuario
    """
    serializer_class = UserScholarshipSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Si es admin, puede ver todas las becas
        if self.request.user.user_type == 'admin':
            return UserScholarship.objects.all()
        
        # Si es estudiante, solo sus propias becas
        return UserScholarship.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def assign_scholarship(request):
    """
    Asignar beca a un usuario
    """
    user_id = request.data.get('user_id')
    scholarship_id = request.data.get('scholarship_id')
    
    try:
        user = User.objects.get(id=user_id, user_type='student')
        scholarship = Scholarship.objects.get(id=scholarship_id)
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Scholarship.DoesNotExist:
        return Response(
            {'error': 'Beca no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verificar si ya tiene esta beca
    if UserScholarship.objects.filter(user=user, scholarship=scholarship).exists():
        return Response(
            {'error': 'El usuario ya tiene esta beca asignada'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Crear asignación de beca
    user_scholarship = UserScholarship.objects.create(
        user=user,
        scholarship=scholarship,
        start_date=request.data.get('start_date'),
        end_date=request.data.get('end_date')
    )
    
    serializer = UserScholarshipSerializer(user_scholarship)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_dashboard_stats(request):
    """
    Estadísticas para el dashboard del usuario
    """
    user = request.user
    
    stats = {
        'user': UserSerializer(user).data,
        'total_hours': user.get_total_hours(),
        'completed_projects': user.get_completed_projects(),
    }
    
    # Si es estudiante, agregar información de becas
    if user.user_type == 'student':
        scholarships = UserScholarship.objects.filter(user=user, status='active')
        stats['active_scholarships'] = scholarships.count()
        stats['scholarships'] = UserScholarshipSerializer(scholarships, many=True).data
    
    return Response(stats, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """
    Vista para logout (invalidar token)
    """
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(
            {'message': 'Logout exitoso'},
            status=status.HTTP_205_RESET_CONTENT
        )
    except Exception as e:
        return Response(
            {'error': 'Token inválido'},
            status=status.HTTP_400_BAD_REQUEST
        )


# Vistas para gestión de estudiantes por administradores

class AdminStudentCreateView(APIView):
    """
    Vista para que los administradores creen nuevos usuarios estudiantes
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        # Verificar que el usuario sea administrador
        if request.user.user_type != 'admin':
            return Response(
                {'error': 'No tienes permisos para realizar esta acción'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = SimpleStudentRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                
                # Incluir la contraseña temporal en la respuesta para que el admin la vea
                user_data = UserSerializer(user).data
                user_data['temp_password'] = user.temp_password
                
                return Response({
                    'user': user_data,
                    'message': 'Estudiante creado exitosamente',
                    'temp_password': user.temp_password  # También en el nivel superior para fácil acceso
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                # Capturar errores inesperados durante la creación
                import traceback
                print(f"Error al crear estudiante: {str(e)}")
                print(traceback.format_exc())
                return Response(
                    {'error': f'Error al crear estudiante: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        # Mejorar formato de errores de validación
        errors = {}
        for field, error_list in serializer.errors.items():
            if isinstance(error_list, list):
                errors[field] = error_list[0] if error_list else 'Error de validación'
            else:
                errors[field] = str(error_list)
        
        # Crear mensaje de error principal (usar el primer error)
        error_fields = list(errors.keys())
        if error_fields:
            first_field = error_fields[0]
            first_error = errors[first_field]
            # Crear mensaje más descriptivo
            field_name_map = {
                'username': 'Nombre de usuario',
                'carnet': 'Carnet',
                'password': 'Contraseña',
                'password_confirm': 'Confirmar contraseña',
                'scholarship_type': 'Tipo de beca',
                'scholarship_percentage': 'Porcentaje de beca'
            }
            field_display = field_name_map.get(first_field, first_field)
            error_message = f"{field_display}: {first_error}"
            
            # Si hay múltiples errores, agregar información
            if len(errors) > 1:
                error_message += f" (y {len(errors) - 1} error(es) más)"
        else:
            error_message = 'Error de validación'
        
        return Response(
            {'error': error_message, 'details': errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class AdminStudentCredentialsView(APIView):
    """
    Vista para que los administradores vean las credenciales de los estudiantes
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Verificar que el usuario sea administrador
        if request.user.user_type != 'admin':
            return Response(
                {'error': 'No tienes permisos para realizar esta acción'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Obtener todos los estudiantes con sus credenciales
        students = User.objects.filter(user_type='student').order_by('-date_joined')
        
        # Serializar con información completa incluyendo credenciales
        students_data = []
        for student in students:
            student_data = {
                'id': student.id,
                'username': student.username,
                'email': student.email,
                'first_name': student.first_name,
                'last_name': student.last_name,
                'full_name': student.full_name,
                'carnet': student.carnet,
                'phone': student.phone,
                'date_of_birth': student.date_of_birth,
                'is_active': student.is_active,
                'date_joined': student.date_joined,
                'last_login': student.last_login,
                'total_hours': student.get_total_hours(),
                'completed_projects': student.get_completed_projects(),
                'temp_password': student.temp_password,  # Agregar contraseña temporal
                'scholarship_type': student.scholarship_type or 'KEY EXCELLENCE',
                'scholarship_percentage': float(student.scholarship_percentage) if student.scholarship_percentage else 100.0,
            }
            students_data.append(student_data)
        
        return Response({
            'students': students_data,
            'total_count': len(students_data)
        }, status=status.HTTP_200_OK)


class AdminStudentDetailView(APIView):
    """
    Vista para que los administradores vean detalles completos de un estudiante
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, student_id):
        # Verificar que el usuario sea administrador
        if request.user.user_type != 'admin':
            return Response(
                {'error': 'No tienes permisos para realizar esta acción'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            student = User.objects.get(id=student_id, user_type='student')
        except User.DoesNotExist:
            return Response(
                {'error': 'Estudiante no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener información completa del estudiante
        from applications.models import Application
        from hours.models import HourLog
        
        student_data = {
            'id': student.id,
            'username': student.username,
            'email': student.email,
            'first_name': student.first_name,
            'last_name': student.last_name,
            'full_name': student.full_name,
            'carnet': student.carnet,
            'phone': student.phone,
            'date_of_birth': student.date_of_birth,
            'profile_picture': student.profile_picture.url if student.profile_picture else None,
            'is_active': student.is_active,
            'date_joined': student.date_joined,
            'last_login': student.last_login,
            'total_hours': student.get_total_hours(),
            'completed_projects': student.get_completed_projects(),
            'temp_password': student.temp_password,  # Contraseña temporal
            'scholarship_type': student.scholarship_type or 'KEY EXCELLENCE',
            'scholarship_percentage': float(student.scholarship_percentage) if student.scholarship_percentage else 100.0,
        }
        
        # Obtener proyectos en los que está el estudiante
        applications = Application.objects.filter(user=student).select_related('project')
        projects_data = []
        for app in applications:
            # Obtener horas por proyecto
            project_hours = HourLog.objects.filter(
                user=student,
                project=app.project,
                status='approved'
            ).aggregate(total=models.Sum('hours'))['total'] or 0
            
            projects_data.append({
                'project_id': app.project.id,
                'project_name': app.project.name,
                'status': app.status,
                'hours_completed': project_hours,
                'applied_at': app.applied_at,
            })
        
        student_data['projects'] = projects_data
        
        # Obtener becas del estudiante
        scholarships = UserScholarship.objects.filter(user=student)
        student_data['scholarships'] = UserScholarshipSerializer(scholarships, many=True).data
        
        return Response(student_data, status=status.HTTP_200_OK)
    
    def put(self, request, student_id):
        # Verificar que el usuario sea administrador
        if request.user.user_type != 'admin':
            return Response(
                {'error': 'No tienes permisos para realizar esta acción'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            student = User.objects.get(id=student_id, user_type='student')
        except User.DoesNotExist:
            return Response(
                {'error': 'Estudiante no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = UserUpdateSerializer(
            student, 
            data=request.data, 
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            updated_student = serializer.save()
            # Recargar el estudiante desde la base de datos para obtener los datos actualizados
            updated_student.refresh_from_db()
            return Response({
                'user': UserSerializer(updated_student).data,
                'message': 'Estudiante actualizado exitosamente'
            }, status=status.HTTP_200_OK)
        
        # Mejorar mensajes de error
        errors = {}
        for field, error_list in serializer.errors.items():
            if isinstance(error_list, list):
                errors[field] = error_list[0] if error_list else 'Error de validación'
            else:
                errors[field] = str(error_list)
        
        if len(errors) == 1:
            error_message = list(errors.values())[0]
            return Response(
                {'error': error_message, 'details': errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            combined_error_message = "Errores de validación: " + ", ".join(
                f"{field.replace('_', ' ').capitalize()}: {msg}" for field, msg in errors.items()
            )
            return Response(
                {'error': combined_error_message, 'details': errors},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def delete(self, request, student_id):
        # Verificar que el usuario sea administrador
        if request.user.user_type != 'admin':
            return Response(
                {'error': 'No tienes permisos para realizar esta acción'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            student = User.objects.get(id=student_id, user_type='student')
        except User.DoesNotExist:
            return Response(
                {'error': 'Estudiante no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        student.delete()
        return Response({
            'message': 'Estudiante eliminado exitosamente'
        }, status=status.HTTP_200_OK)