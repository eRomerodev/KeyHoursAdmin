from django.urls import path
from . import views

urlpatterns = [
    # Hour log endpoints
    path('', views.HourLogListView.as_view(), name='hour-log-list'),
    path('<int:pk>/', views.HourLogDetailView.as_view(), name='hour-log-detail'),
    path('<int:pk>/review/', views.HourLogReviewView.as_view(), name='hour-log-review'),
    
    # Hour summary endpoints
    path('summaries/', views.HourSummaryListView.as_view(), name='hour-summary-list'),
    
    # Hour goal endpoints
    path('goals/', views.HourGoalListView.as_view(), name='hour-goal-list'),
    path('goals/<int:pk>/', views.HourGoalDetailView.as_view(), name='hour-goal-detail'),
    
    # User-specific hour summaries
    path('user/<int:user_id>/summary/', views.UserHourSummaryView.as_view(), name='user-hour-summary'),
    
    # Project-specific hour summaries
    path('project/<int:project_id>/summary/', views.ProjectHourSummaryView.as_view(), name='project-hour-summary'),
    
    # Statistics and reports
    path('stats/', views.hour_stats, name='hour-stats'),
    path('dashboard/', views.hour_dashboard_stats, name='hour-dashboard'),
    path('reports/monthly/<int:year>/<int:month>/', views.monthly_hour_report, name='monthly-hour-report'),
    path('reports/yearly/<int:year>/', views.yearly_hour_report, name='yearly-hour-report'),
]
