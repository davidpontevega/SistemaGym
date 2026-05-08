from rest_framework import serializers
from .models import Instructor, GymClass, Schedule

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = '__all__'

class GymClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = GymClass
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'