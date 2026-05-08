from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from authentication.views import (
    RolesView, ManageRolesView,
    UserView, ManageUserView,
    UserRoleView,
)
from gym.views import (
    InstructorView, ManageInstructorView,
    GymClassView, ManageGymClassView,
    ScheduleView, ManageScheduleView,
    InstructorAvailableView,
)
from memberships.views import (
    MemberView, ManageMemberView,
    PlanView, ManagePlanView,
    MembershipView, ManageMembershipView,
    ActivateMembershipView,
    BookingView, ManageBookingView,
)

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='refresh'),

    path('users/', UserView.as_view(), name='users'),
    path('users/<int:pk>/', ManageUserView.as_view(), name='manage-user'),
    path('users/roles/', UserRoleView.as_view(), name='user-roles'),

    path('roles/', RolesView.as_view(), name='roles'),
    path('roles/<int:pk>/', ManageRolesView.as_view(), name='manage-role'),

    path('instructors/', InstructorView.as_view(), name='instructors'),
    path('instructors/available/', InstructorAvailableView.as_view(), name='instructor-available'),
    path('instructors/<int:pk>/', ManageInstructorView.as_view(), name='manage-instructor'),

    path('classes/', GymClassView.as_view(), name='classes'),
    path('classes/<int:pk>/', ManageGymClassView.as_view(), name='manage-class'),

    path('schedules/', ScheduleView.as_view(), name='schedules'),
    path('schedules/<int:pk>/', ManageScheduleView.as_view(), name='manage-schedule'),

    path('members/', MemberView.as_view(), name='members'),
    path('members/<int:pk>/', ManageMemberView.as_view(), name='manage-member'),

    path('plans/', PlanView.as_view(), name='plans'),
    path('plans/<int:pk>/', ManagePlanView.as_view(), name='manage-plan'),

    path('memberships/', MembershipView.as_view(), name='memberships'),
    path('memberships/activate/', ActivateMembershipView.as_view(), name='activate-membership'),
    path('memberships/<int:pk>/', ManageMembershipView.as_view(), name='manage-membership'),

    path('bookings/', BookingView.as_view(), name='bookings'),
    path('bookings/<int:pk>/', ManageBookingView.as_view(), name='manage-booking'),
]