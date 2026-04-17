import os
import django
import random
from Faker import Faker

# 1. Configuration de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from projects.models import Project
from wishes.models import Wish

fake = Faker('fr_FR') # On utilise le français pour les noms

def run_seed():
    print("--- Début de la génération des données (Seeding) ---")

    # Nettoyage des anciennes données : this is an optional step
    # Wish.objects.all().delete()
    # Project.objects.all().delete()
    # User.objects.exclude(username='imen').delete()

    # 2. Création de 5 teachers
    teachers = []
    for _ in range(5):
        teacher = User.objects.create_user(
            username=fake.unique.user_name(),
            email=fake.unique.email(),
            password='password123',
            user_type='teacher'
        )
        teachers.append(teacher)
    print(f" {len(teachers)} enseignants créés")

    # 3. Création de 15 Projets de recherche
    projects = []
    topics = ["Intelligence Artificielle", "Blockchain", "Cybersécurité", "Optimisation ILS", "Web Sémantique", "Data Science"]
    for _ in range(15):
        project = Project.objects.create(
            title=f"Étude sur {random.choice(topics)} - {fake.word().capitalize()}",
            description=fake.text(max_nb_chars=200),
            teacher=random.choice(teachers),
            capacity=random.randint(2, 4)
        )
        projects.append(project)
    print(f" {len(projects)} projets créés")

    # 4. Création de 30 Étudiants et de leurs Vœux
    for _ in range(30):
        student = User.objects.create_user(
            username=fake.unique.user_name(),
            email=fake.unique.email(),
            password='password123',
            user_type='student',
            num_etudiant=fake.unique.random_number(digits=8)
        )
        
        # Chaque étudiant choisit 5 projets au hasard et les classe par preference
        selected_projects = random.sample(projects, 5)
        for i, project in enumerate(selected_projects):
            Wish.objects.create(
                student=student,
                project=project,
                rank=i + 1
            )
            
    print(f" 30 étudiants et 150 vœux générés")
    print("--- Seeding terminé avec succès ! ---")

if __name__ == '__main__':
    run_seed()