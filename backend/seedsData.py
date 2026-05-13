import os
import django
import random
from backend.wishes.models import Wish
from faker import Faker

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from projects.models import Project

fake = Faker(['fr_FR'])

def run():
    print("🧹 Nettoyage de la base...")
    Project.objects.all().delete()
    User.objects.all().delete()

    # 1. ADMINS (2)
    print("🔑 Création des 2 Admins...")
    for i in range(1, 3):
        User.objects.create_superuser(
            username=f'admin_{i}',
            email=f'admin{i}@univ-paris.fr',
            password='password123',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            user_type='administrateur' # Crucial pour le Frontend
        )

    # 2. ENCADRANTS (20)
    print("👨‍🏫 Création des 20 Encadrants...")
    supervisors = []
    for i in range(1, 21):
        u = User.objects.create_user(
            username=f'prof_{i}',
            email=fake.unique.email(),
            password='password123',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            user_type='encadrant'
        )
        supervisors.append(u)

    # 3. ÉTUDIANTS (300)
    print("🎓 Création des 300 Étudiants...")
    for i in range(1, 301):
        User.objects.create_user(
            username=f'etudiant_{i}',
            email=fake.unique.email(),
            password='password123',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            user_type='etudiant',
            num_etudiant=f'220{random.randint(10000, 99999)}'
        )

    # 4. PROJETS (50)
    print("📁 Création des 50 Projets...")
    sujets = ["IA", "Blockchain", "Web", "Mobile", "Sécurité", "Data Science", "Réseaux"]
    for i in range(50):
        Project.objects.create(
            title=f"{random.choice(['Optimisation', 'Analyse', 'Développement'])} d'un système {random.choice(sujets)} {fake.word()}",
            description=fake.paragraph(nb_sentences=3),
            domaine=random.choice(['IA', 'Web', 'Data']),
            teacher=random.choice(supervisors),
            capacity=random.randint(2, 5),
            statut_validation='APPROUVE'
        )

    # 5. VŒUX (5 par étudiant)
    #print("💖 Création des vœux pour chaque étudiant...")
    #from wishes.models import Wish

    #all_projects = list(Project.objects.all())
    #all_students = User.objects.filter(user_type='etudiant')

    #wishes_to_create = []
    #for student in all_students:
        #chosen_projects = random.sample(all_projects, k=min(5, len(all_projects)))
        #for rank, project in enumerate(chosen_projects, start=1):
            #wishes_to_create.append(
                #Wish(student=student, project=project, rank=rank)
            #)
    #Wish.objects.bulk_create(wishes_to_create)
    #print(f"✅ {len(wishes_to_create)} vœux créés ({all_students.count()} étudiants × 5).")

    print(f"✅ TERMINÉ ! {User.objects.count()} utilisateurs et {Project.objects.count()} projets créés.")

if __name__ == '__main__':
    run()