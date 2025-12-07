from django.urls import path
from . import views

urlpatterns = [
    # Project endpoints
    path('', views.ProjectListView.as_view(), name='project-list'),
    path('create/', views.ProjectCreateView.as_view(), name='project-create'),
    path('<int:pk>/', views.ProjectDetailView.as_view(), name='project-detail'),
    path('<int:project_id>/debug-update/', views.debug_update_project, name='debug-update-project'),
    path('<int:project_id>/publish/', views.publish_project, name='publish-project'),
    path('<int:project_id>/add-member/', views.add_project_member, name='add-project-member'),
    path('<int:project_id>/remove-member/<int:user_id>/', views.remove_project_member, name='remove-project-member'),
    path('<int:project_id>/join/', views.join_project, name='join-project'),
    path('<int:project_id>/leave/', views.leave_project, name='leave-project'),
    path('<int:project_id>/is-member/', views.is_member, name='is-member'),
    path('my-projects/', views.my_projects, name='my-projects'),
    path('public/', views.public_projects, name='public-projects'),
    
    # Convocatoria endpoints
    path('convocatorias/', views.ConvocatoriaListView.as_view(), name='convocatoria-list'),
    
    # Statistics endpoints
    path('stats/', views.ProjectStatsView.as_view(), name='project-stats'),
    path('dashboard/', views.project_dashboard_stats, name='project-dashboard'),
    
    # Category endpoints
    path('categories/', views.ProjectCategoryListView.as_view(), name='project-category-list'),
    path('categories/<int:pk>/', views.ProjectCategoryDetailView.as_view(), name='project-category-detail'),
    
    # Requirement endpoints
    path('<int:project_id>/requirements/', views.ProjectRequirementListView.as_view(), name='project-requirement-list'),
    path('<int:project_id>/requirements/<int:pk>/', views.ProjectRequirementDetailView.as_view(), name='project-requirement-detail'),
    
    # Document endpoints
    path('<int:project_id>/documents/', views.ProjectDocumentListView.as_view(), name='project-document-list'),
    path('<int:project_id>/documents/<int:pk>/', views.ProjectDocumentDetailView.as_view(), name='project-document-detail'),
]
