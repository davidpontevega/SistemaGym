from django.db import models

class Instructor(models.Model):
    name = models.CharField(max_length=250)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    speciality = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class GymClass(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField()
    capacity = models.IntegerField()
    duration = models.IntegerField(help_text='Duración en minutos')
    instructor = models.ForeignKey(
        Instructor,
        on_delete=models.CASCADE,
        db_column='instructor_id',
        related_name='classes'
    )

    def __str__(self):
        return self.name

class Schedule(models.Model):
    DAYS_OF_WEEK = (
        ('MONDAY', 'MONDAY'),
        ('TUESDAY', 'TUESDAY'),
        ('WEDNESDAY', 'WEDNESDAY'),
        ('THURSDAY', 'THURSDAY'),
        ('FRIDAY', 'FRIDAY'),
        ('SATURDAY', 'SATURDAY'),
        ('SUNDAY', 'SUNDAY'),
    )
    day_of_week = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    gym_class = models.ForeignKey(
        GymClass,
        on_delete=models.CASCADE,
        db_column='gym_class_id',
        related_name='schedules'
    )

    def __str__(self):
        return f'{self.gym_class.name} - {self.day_of_week}'