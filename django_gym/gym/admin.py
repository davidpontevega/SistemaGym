from django.contrib import admin
from .models import Instructor, GymClass, Schedule

admin.site.register(Instructor)
admin.site.register(GymClass)
admin.site.register(Schedule)