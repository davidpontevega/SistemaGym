from django.db import models
from django.contrib.auth.models import User

class Member(models.Model):
    name = models.CharField(max_length=250)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    document_number = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

class Plan(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.IntegerField(help_text='Duración en días')

    def __str__(self):
        return self.name

class Membership(models.Model):
    STATUS = (
        ('ACTIVE', 'ACTIVE'),
        ('EXPIRED', 'EXPIRED'),
        ('CANCELLED', 'CANCELLED'),
    )
    member = models.ForeignKey(
        Member,
        on_delete=models.CASCADE,
        db_column='member_id',
        related_name='memberships'
    )
    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        db_column='plan_id',
        related_name='memberships'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.member.name} - {self.plan.name}'

class Booking(models.Model):
    STATUS = (
        ('CONFIRMED', 'CONFIRMED'),
        ('CANCELLED', 'CANCELLED'),
    )
    member = models.ForeignKey(
        Member,
        on_delete=models.CASCADE,
        db_column='member_id',
        related_name='bookings'
    )
    gym_class = models.ForeignKey(
        'gym.GymClass',
        on_delete=models.CASCADE,
        db_column='gym_class_id',
        related_name='bookings'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        db_column='user_id',
        related_name='bookings'
    )
    status = models.CharField(max_length=10, choices=STATUS, default='CONFIRMED')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.member.name} - {self.gym_class.name}'