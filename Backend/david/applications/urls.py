from django.urls import path
from . import views

urlpatterns = [
    # Application endpoints
    path('', views.ApplicationListView.as_view(), name='application-list'),
    path('<int:pk>/', views.ApplicationDetailView.as_view(), name='application-detail'),
    path('<int:application_id>/review/', views.review_application, name='review-application'),
    path('<int:application_id>/cancel/', views.cancel_application, name='cancel-application'),
    
    # Project-specific applications
    path('project/<int:project_id>/', views.ProjectApplicationListView.as_view(), name='project-application-list'),
    
    # Student-specific applications
    path('student/<int:user_id>/', views.StudentApplicationListView.as_view(), name='student-application-list'),
    path('my-applications/', views.StudentApplicationListView.as_view(), name='my-applications'),
    
    # Bulk actions
    path('bulk-action/', views.bulk_action_applications, name='bulk-action-applications'),
    
    # Statistics endpoints
    path('stats/', views.ApplicationStatsView.as_view(), name='application-stats'),
    path('dashboard/', views.application_dashboard_stats, name='application-dashboard'),
    
    # Evaluation endpoints
    path('<int:application_id>/evaluations/', views.ApplicationEvaluationListView.as_view(), name='application-evaluation-list'),
    
    # Notification endpoints
    path('notifications/', views.ApplicationNotificationListView.as_view(), name='application-notification-list'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read, name='mark-notification-read'),
]
