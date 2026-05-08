from django.contrib import admin
from .models import Member, Plan, Membership, Booking

admin.site.register(Member)
admin.site.register(Plan)
admin.site.register(Membership)
admin.site.register(Booking)