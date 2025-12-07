"""
Comando de gestión para agregar datos de prueba al usuario jose
Ejecutar con: python manage.py add_jose_data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from users.models import User
from projects.models import Project
from applications.models import Application
from hours.models import HourLog


class Command(BaseCommand):
    help = 'Agrega datos de prueba al usuario jose (2 proyectos completados con 50 horas cada uno)'

    def handle(self, *args, **options):
        # Buscar el usuario jose
        try:
            jose = User.objects.get(username__iexact='jose')
            self.stdout.write(self.style.SUCCESS(f'✅ Usuario encontrado: {jose.full_name} ({jose.username}, Carnet: {jose.carnet})'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('❌ Usuario "jose" no encontrado. Por favor crea el usuario primero.'))
            return

        # Obtener un admin para ser manager de los proyectos
        admin_user = User.objects.filter(user_type='admin').first()
        if not admin_user:
            self.stdout.write(self.style.ERROR('❌ No se encontró ningún usuario administrador. Por favor crea uno primero.'))
            return

        # Datos de los proyectos
        projects_data = [
            {
                'name': 'Teacher Assistant de Calculo',
                'description': 'Asistencia docente en cursos de cálculo. Apoyo en la preparación de materiales, tutorías y evaluación de tareas.',
                'max_hours': 50
            },
            {
                'name': 'Laboratorista',
                'description': 'Trabajo como laboratorista en laboratorios de la universidad. Mantenimiento de equipos, preparación de materiales y apoyo en prácticas.',
                'max_hours': 50
            }
        ]

        created_projects = []
        for proj_data in projects_data:
            project, created = Project.objects.get_or_create(
                name=proj_data['name'],
                defaults={
                    'description': proj_data['description'],
                    'manager': admin_user,
                    'max_hours': proj_data['max_hours'],
                    'hour_assignment': 'manual',
                    'visibility': 'published',
                    'start_date': timezone.now() - timedelta(days=60),
                    'end_date': timezone.now() - timedelta(days=1),
                    'max_participants': 10,
                    'current_participants': 0,
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✅ Proyecto creado: {project.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'ℹ️ Proyecto ya existe: {project.name}'))
            created_projects.append(project)

        # Crear aplicaciones completadas para jose en cada proyecto
        for project in created_projects:
            application, created = Application.objects.get_or_create(
                user=jose,
                project=project,
                defaults={
                    'status': 'completed',
                    'motivation': 'Completado como parte del servicio comunitario',
                    'available_hours_per_week': 10,
                    'start_date_preference': timezone.now().date() - timedelta(days=60),
                    'reviewed_by': admin_user,
                    'reviewed_at': timezone.now() - timedelta(days=50),
                    'hours_completed': 50,
                    'completion_date': timezone.now() - timedelta(days=1)
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✅ Aplicación creada y completada para: {project.name}'))
            else:
                # Actualizar la aplicación existente
                application.status = 'completed'
                application.hours_completed = 50
                application.reviewed_by = admin_user
                application.reviewed_at = timezone.now() - timedelta(days=50)
                application.completion_date = timezone.now() - timedelta(days=1)
                application.save()
                self.stdout.write(self.style.SUCCESS(f'✅ Aplicación actualizada y completada para: {project.name}'))

        # Agregar jose como miembro de los proyectos
        for project in created_projects:
            if jose not in project.members.all():
                project.members.add(jose)
                project.current_participants = project.members.count()
                project.save()
                self.stdout.write(self.style.SUCCESS(f'✅ {jose.username} agregado como miembro de: {project.name}'))

        # Crear registros de horas aprobadas (50 horas por proyecto)
        for project in created_projects:
            # Verificar si ya existen registros de horas para este proyecto
            existing_logs = HourLog.objects.filter(user=jose, project=project, status='approved')
            total_existing_hours = sum(float(log.hours) for log in existing_logs)
            
            if total_existing_hours >= 50:
                self.stdout.write(self.style.WARNING(f'ℹ️ Ya existen {total_existing_hours} horas aprobadas para {project.name}'))
                continue
            
            # Crear registros de horas para completar las 50 horas
            hours_needed = 50 - total_existing_hours
            num_logs = 5
            hours_per_log = hours_needed / num_logs
            
            for i in range(num_logs):
                log_date = timezone.now().date() - timedelta(days=30 - (i * 5))
                
                hour_log = HourLog.objects.create(
                    user=jose,
                    project=project,
                    hours=hours_per_log,
                    date=log_date,
                    start_time='08:00:00',
                    end_time='18:00:00',
                    activity_description=f'Actividades realizadas como parte del proyecto {project.name}',
                    skills_developed='Desarrollo de habilidades técnicas y de comunicación',
                    impact_description='Contribución significativa al proyecto',
                    supervisor_name='Supervisor del Proyecto',
                    supervisor_contact='supervisor@example.com',
                    status='approved',
                    reviewed_by=admin_user,
                    reviewed_at=timezone.now() - timedelta(days=25 - (i * 5)),
                    review_notes='Horas aprobadas automáticamente para datos de prueba'
                )
                self.stdout.write(self.style.SUCCESS(f'✅ Registro de horas creado: {hour_log.hours}h para {project.name} el {log_date}'))

        # Mostrar resumen
        self.stdout.write(self.style.SUCCESS('\n✅ Datos de prueba agregados exitosamente!'))
        self.stdout.write(self.style.SUCCESS(f'📊 Resumen para {jose.full_name}:'))
        self.stdout.write(self.style.SUCCESS(f'   - Total de horas: {jose.get_total_hours()}'))
        self.stdout.write(self.style.SUCCESS(f'   - Proyectos completados: {jose.get_completed_projects()}'))

