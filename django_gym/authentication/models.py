from django.db import models
from django.contrib.auth.models import User

class Roles(models.Model):
    ROLES = (
        ('ADMIN', 'ADMIN'),
        ('MEMBER', 'MEMBER'),
    )
    name = models.CharField(max_length=10, choices=ROLES)

    def __str__(self):
        return self.name

class UserRoles(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        db_column='user_id',
        related_name='user_role'
    )
    role = models.OneToOneField(
        Roles,
        on_delete=models.CASCADE,
        db_column='role_id',
        related_name='user_role'
    )

    def __str__(self):
        return f'{self.user.username} - {self.role.name}'