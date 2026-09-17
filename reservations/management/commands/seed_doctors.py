"""
Management command to seed 6 real doctor accounts into the database.
Each doctor maps to a photo already present in media/doctor_profile_images/.
Run: python manage.py seed_doctors
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from reservations.models import Doctor

User = get_user_model()

DOCTORS = [
    {
        "email": "aisha.rahman@edoc.health",
        "first_name": "Aisha",
        "last_name": "Rahman",
        "password": "Doctor@1234",
        "doctorFName": "Aisha",
        "doctorLName": "Rahman",
        "doctorGender": "Female",
        "doctorNationality": "Pakistani",
        "doctorIdentification": "DR-001-PK",
        "Specialization": "Cardiology",
        "Qualifications": "MBBS, FCPS (Cardiology), Fellow American College of Cardiology",
        "chargePerSession": "3500.00",
        "doctorPhone": "+923001234501",
        "doctorImage": "doctor_profile_images/doctor1.jpg",
    },
    {
        "email": "james.whitfield@edoc.health",
        "first_name": "James",
        "last_name": "Whitfield",
        "password": "Doctor@1234",
        "doctorFName": "James",
        "doctorLName": "Whitfield",
        "doctorGender": "Male",
        "doctorNationality": "British",
        "doctorIdentification": "DR-002-GB",
        "Specialization": "Neurology",
        "Qualifications": "MBBS (London), MRCP, PhD Neuroscience",
        "chargePerSession": "4000.00",
        "doctorPhone": "+923001234502",
        "doctorImage": "doctor_profile_images/doctor-profile-02.jpg",
    },
    {
        "email": "priya.nair@edoc.health",
        "first_name": "Priya",
        "last_name": "Nair",
        "password": "Doctor@1234",
        "doctorFName": "Priya",
        "doctorLName": "Nair",
        "doctorGender": "Female",
        "doctorNationality": "Indian",
        "doctorIdentification": "DR-003-IN",
        "Specialization": "Dermatology",
        "Qualifications": "MBBS, MD (Dermatology), DDV",
        "chargePerSession": "2500.00",
        "doctorPhone": "+923001234503",
        "doctorImage": "doctor_profile_images/doctor_4.jpg",
    },
    {
        "email": "omar.farooq@edoc.health",
        "first_name": "Omar",
        "last_name": "Farooq",
        "password": "Doctor@1234",
        "doctorFName": "Omar",
        "doctorLName": "Farooq",
        "doctorGender": "Male",
        "doctorNationality": "Pakistani",
        "doctorIdentification": "DR-004-PK",
        "Specialization": "Orthopaedics",
        "Qualifications": "MBBS, FCPS (Orthopaedic Surgery), Fellowship Royal College of Surgeons",
        "chargePerSession": "4500.00",
        "doctorPhone": "+923001234504",
        "doctorImage": "doctor_profile_images/doctor6.jpg",
    },
    {
        "email": "sara.malik@edoc.health",
        "first_name": "Sara",
        "last_name": "Malik",
        "password": "Doctor@1234",
        "doctorFName": "Sara",
        "doctorLName": "Malik",
        "doctorGender": "Female",
        "doctorNationality": "Pakistani",
        "doctorIdentification": "DR-005-PK",
        "Specialization": "Gynaecology",
        "Qualifications": "MBBS, FCPS (Obs & Gynae), MRCOG (London)",
        "chargePerSession": "3000.00",
        "doctorPhone": "+923001234505",
        "doctorImage": "doctor_profile_images/doctor7.jpg",
    },
    {
        "email": "chen.wei@edoc.health",
        "first_name": "Chen",
        "last_name": "Wei",
        "password": "Doctor@1234",
        "doctorFName": "Chen",
        "doctorLName": "Wei",
        "doctorGender": "Male",
        "doctorNationality": "Chinese",
        "doctorIdentification": "DR-006-CN",
        "Specialization": "General Medicine",
        "Qualifications": "MBBS, MRCP (UK), Diploma in Internal Medicine",
        "chargePerSession": "2000.00",
        "doctorPhone": "+923001234506",
        "doctorImage": "doctor_profile_images/doctor_profile_image_3.png",
    },
]


class Command(BaseCommand):
    help = "Seed 6 real doctor accounts with profile images"

    def handle(self, *args, **kwargs):
        created_count = 0
        skipped_count = 0

        for data in DOCTORS:
            email = data["email"]

            if User.objects.filter(email=email).exists():
                self.stdout.write(f"  SKIP  {email} — already exists")
                skipped_count += 1
                continue

            user = User.objects.create_user(
                email=email,
                last_name=data["last_name"],
                first_name=data["first_name"],
                password=data["password"],
            )
            user.is_doctor = True
            user.save()

            Doctor.objects.create(
                user=user,
                email=email,
                doctorFName=data["doctorFName"],
                doctorLName=data["doctorLName"],
                doctorGender=data["doctorGender"],
                doctorNationality=data["doctorNationality"],
                doctorIdentification=data["doctorIdentification"],
                Specialization=data["Specialization"],
                Qualifications=data["Qualifications"],
                chargePerSession=data["chargePerSession"],
                doctorPhone=data["doctorPhone"],
                doctorImage=data["doctorImage"],
            )

            self.stdout.write(
                self.style.SUCCESS(f"  CREATE  Dr. {data['doctorFName']} {data['doctorLName']} ({data['Specialization']})")
            )
            created_count += 1

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(f"Done. {created_count} doctors created, {skipped_count} skipped."))
        self.stdout.write("")
        self.stdout.write("Login credentials for all seeded doctors: password = Doctor@1234")
