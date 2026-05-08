from rest_framework import serializers
from django.utils import timezone
from .models import Member, Plan, Membership, Booking
from gym.serializers import GymClassSerializer

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['member'] = MemberSerializer(instance.member).data
        representation['plan'] = PlanSerializer(instance.plan).data
        return representation

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['member'] = MemberSerializer(instance.member).data
        representation['gym_class'] = GymClassSerializer(instance.gym_class).data
        return representation

class ActivateMembershipRequestSerializer(serializers.Serializer):
    member_id = serializers.IntegerField()
    plan_id = serializers.IntegerField()

class BookingRequestSerializer(serializers.Serializer):
    member_id = serializers.IntegerField()
    gym_class_id = serializers.IntegerField()