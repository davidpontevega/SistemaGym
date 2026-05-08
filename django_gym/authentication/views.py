from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from .models import Roles, UserRoles
from .serializers import RoleSerializer, UserSerializer, UserRoleSerializer

@extend_schema(tags=['Usuarios'])
class RolesView(generics.ListCreateAPIView):
    queryset = Roles.objects.all()
    serializer_class = RoleSerializer

@extend_schema(tags=['Usuarios'])
class ManageRolesView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Roles.objects.all()
    serializer_class = RoleSerializer

@extend_schema(tags=['Usuarios'])
class UserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@extend_schema(tags=['Usuarios'])
class ManageUserView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(tags=['Usuarios'])
class UserRoleView(generics.ListCreateAPIView):
    queryset = UserRoles.objects.all()
    serializer_class = UserRoleSerializer