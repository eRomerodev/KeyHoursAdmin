from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.UserLoginView.as_view(), name='user-login'),
    path('logout/', views.logout_view, name='user-logout'),
    
    # User profile endpoints
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('change-password/', views.PasswordChangeView.as_view(), name='change-password'),
    
    # User management endpoints
    path('students/', views.StudentListView.as_view(), name='student-list'),
    path('students/<int:pk>/', views.StudentDetailView.as_view(), name='student-detail'),
    path('admins/', views.AdminListView.as_view(), name='admin-list'),
    
    # Admin student management endpoints
    path('admin/students/create/', views.AdminStudentCreateView.as_view(), name='admin-student-create'),
    path('admin/students/credentials/', views.AdminStudentCredentialsView.as_view(), name='admin-student-credentials'),
    path('admin/students/<int:student_id>/', views.AdminStudentDetailView.as_view(), name='admin-student-detail'),
    
    # Statistics endpoints
    path('stats/', views.UserStatsView.as_view(), name='user-stats'),
    path('dashboard/', views.user_dashboard_stats, name='user-dashboard'),
    
    # Scholarship endpoints
    path('scholarships/', views.ScholarshipListView.as_view(), name='scholarship-list'),
    path('scholarships/<int:pk>/', views.ScholarshipDetailView.as_view(), name='scholarship-detail'),
    path('user-scholarships/', views.UserScholarshipListView.as_view(), name='user-scholarship-list'),
    path('user-scholarships/<int:pk>/', views.UserScholarshipDetailView.as_view(), name='user-scholarship-detail'),
    path('assign-scholarship/', views.assign_scholarship, name='assign-scholarship'),
]
