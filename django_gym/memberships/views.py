from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from django.utils import timezone
from datetime import timedelta
from .models import Member, Plan, Membership, Booking
from .serializers import (
    MemberSerializer,
    PlanSerializer,
    MembershipSerializer,
    BookingSerializer,
    ActivateMembershipRequestSerializer,
    BookingRequestSerializer,
)

@extend_schema(tags=['Membresías'])
class MemberView(generics.ListCreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(tags=['Membresías'])
class ManageMemberView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(tags=['Membresías'])
class PlanView(generics.ListCreateAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(tags=['Membresías'])
class ManagePlanView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(tags=['Membresías'])
class MembershipView(generics.ListCreateAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(tags=['Membresías'])
class ManageMembershipView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(tags=['Membresías'])
class ManageBookingView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def partial_update(self, request, *args, **kwargs):
        booking = self.get_object()
        new_status = request.data.get('status')

        if new_status not in ['CONFIRMED', 'CANCELLED']:
            return Response(
                {'error': 'Estado inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = new_status
        booking.save()
        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_200_OK
        )
@extend_schema(
    tags=['Membresías'],
    request=ActivateMembershipRequestSerializer,
    responses={201: MembershipSerializer}
)
class ActivateMembershipView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        member_id = request.data.get('member_id')
        plan_id = request.data.get('plan_id')

        try:
            member = Member.objects.get(id=member_id)
        except Member.DoesNotExist:
            return Response(
                {'error': 'Miembro no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            plan = Plan.objects.get(id=plan_id)
        except Plan.DoesNotExist:
            return Response(
                {'error': 'Plan no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        active = Membership.objects.filter(
            member=member,
            status='ACTIVE'
        ).exists()

        if active:
            return Response(
                {'error': 'El miembro ya tiene una membresía activa'},
                status=status.HTTP_400_BAD_REQUEST
            )

        start_date = timezone.now().date()
        end_date = start_date + timedelta(days=plan.duration_days)

        membership = Membership.objects.create(
            member=member,
            plan=plan,
            start_date=start_date,
            end_date=end_date,
            status='ACTIVE'
        )

        return Response(
            MembershipSerializer(membership).data,
            status=status.HTTP_201_CREATED
        )


@extend_schema(
    tags=['Membresías'],
    request=BookingRequestSerializer,
    responses={201: BookingSerializer}
)
class BookingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.all()
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    def post(self, request):
        member_id = request.data.get('member_id')
        gym_class_id = request.data.get('gym_class_id')

        try:
            member = Member.objects.get(id=member_id)
        except Member.DoesNotExist:
            return Response(
                {'error': 'Miembro no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        today = timezone.now().date()
        active_membership = Membership.objects.filter(
            member=member,
            status='ACTIVE',
            end_date__gte=today
        ).exists()

        if not active_membership:
            return Response(
                {'error': 'El miembro no tiene una membresía activa vigente'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from gym.models import GymClass
        try:
            gym_class = GymClass.objects.get(id=gym_class_id)
        except GymClass.DoesNotExist:
            return Response(
                {'error': 'Clase no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )

        confirmed_bookings = Booking.objects.filter(
            gym_class=gym_class,
            status='CONFIRMED'
        ).count()

        if confirmed_bookings >= gym_class.capacity:
            return Response(
                {'error': 'La clase no tiene cupo disponible'},
                status=status.HTTP_400_BAD_REQUEST
            )

        already_booked = Booking.objects.filter(
            member=member,
            gym_class=gym_class,
            status='CONFIRMED'
        ).exists()

        if already_booked:
            return Response(
                {'error': 'El miembro ya tiene esta clase reservada'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking = Booking.objects.create(
            member=member,
            gym_class=gym_class,
            user=request.user,
            status='CONFIRMED'
        )

        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_201_CREATED
        )
        