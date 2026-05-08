from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from datetime import time
from .models import Instructor, GymClass, Schedule
from .serializers import InstructorSerializer, GymClassSerializer, ScheduleSerializer

@extend_schema(tags=['Clases'])
class InstructorView(generics.ListCreateAPIView):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(tags=['Clases'])
class ManageInstructorView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(tags=['Clases'])
class GymClassView(generics.ListCreateAPIView):
    queryset = GymClass.objects.all()
    serializer_class = GymClassSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(tags=['Clases'])
class ManageGymClassView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GymClass.objects.all()
    serializer_class = GymClassSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(tags=['Clases'])
class ScheduleView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(tags=['Clases'])
class ManageScheduleView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(
    tags=['Clases'],
    parameters=[
        OpenApiParameter(
            name='day_of_week',
            description='Día de la semana (ej: MONDAY)',
            required=True,
            type=OpenApiTypes.STR,
        ),
        OpenApiParameter(
            name='hour',
            description='Hora en formato HH:MM (ej: 10:00)',
            required=True,
            type=OpenApiTypes.STR,
        )
    ]
)
class InstructorAvailableView(generics.ListAPIView):
    serializer_class = InstructorSerializer

    def get_queryset(self):
        day_of_week = self.request.query_params.get('day_of_week')
        hour = self.request.query_params.get('hour')
        hour_time = time.fromisoformat(hour)

        return Instructor.objects.filter(
            classes__schedules__day_of_week=day_of_week,
            classes__schedules__start_time__lte=hour_time,
            classes__schedules__end_time__gte=hour_time,
        ).distinct()