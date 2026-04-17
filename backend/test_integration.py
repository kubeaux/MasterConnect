import os
import sys
import django
import random

# ==========================================
# 1. CONFIGURATION DE L'ENVIRONNEMENT DJANGO
# ==========================================
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from projects.models import Project
from wishes.models import Wish
from assignments.models import Assignment
from assignments.services import execute_ils_matching

User = get_user_model()

def run_scale_test():
    print("--- 1. NETTOYAGE DE LA BASE DE DONNÉES ---")
    Assignment.objects.all().delete()
    Wish.objects.all().delete()
    Project.objects.all().delete()
    User.objects.filter(user_type__in=['student', 'teacher']).delete()

    print("--- 2. CRÉATION DES DONNÉES MASSIVES ---")
    
    # a. Création de 15 professeurs
    profs = []
    for i in range(1, 16):
        prof = User.objects.create_user(username=f"prof_{i}", password="123", user_type="teacher")
        profs.append(prof)

    # b. Création de 30 projets avec des capacités aléatoires (4 à 6 places)
    # Capacité totale moyenne : 30 * 5 = 150 places environ
    projets_disponibles = []
    domaines = ["IA", "Cyber", "Web", "Data", "Cloud", "Reseau", "DevOps", "Mobile"]
    
    for i in range(1, 31):
        cap = random.randint(4, 6)
        domaine = random.choice(domaines)
        p = Project.objects.create(
            title=f"Projet {domaine} #{i}", 
            description="...", 
            teacher=random.choice(profs), 
            capacity=cap
        )
        projets_disponibles.append(p)

    capacite_totale = sum([p.capacity for p in projets_disponibles])

    # c. Création de 150 étudiants
    etudiants = []
    for i in range(1, 151):
        etu = User.objects.create_user(username=f"etudiant_{i}", password="123", user_type="student")
        etudiants.append(etu)

    # d. Création de 5 vœux par étudiant (750 vœux au total)
    voeux_a_creer = []
    for etu in etudiants:
        projets_melanges = random.sample(projets_disponibles, 5)
        for rank in range(1, 6):
            voeux_a_creer.append(
                Wish(student=etu, project=projets_melanges[rank-1], rank=rank)
            )
            
    # Sauvegarde ultra-rapide des 750 voeux en base de données
    Wish.objects.bulk_create(voeux_a_creer)

    print(f"✅ BDD prête : {len(etudiants)} Étudiants, {len(projets_disponibles)} Projets (Capacité globale: {capacite_totale} places), {len(voeux_a_creer)} Vœux.")

    print("\n--- 3. LANCEMENT DE L'ALGORITHME ILS ---")
    # On augmente les itérations car l'espace de recherche est énorme
    resultat_service = execute_ils_matching(max_iterations=100) 
    
    print(f"Statut : {resultat_service['message']}")

    print("\n--- 4. VÉRIFICATION ET STATISTIQUES ---")
    assignations_totales = Assignment.objects.count()

    print(f"Étudiants affectés : {assignations_totales} / {len(etudiants)}")

    # Calcul des statistiques de satisfaction
    stats = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, "Non demandé": 0}
    
    for etu in etudiants:
        try:
            affectation = Assignment.objects.get(student=etu)
            projet_obtenu = affectation.project
            
            # On cherche quel était le rang de ce projet pour cet étudiant
            voeu = Wish.objects.filter(student=etu, project=projet_obtenu).first()
            if voeu:
                stats[voeu.rank] += 1
            else:
                stats["Non demandé"] += 1
                
        except Assignment.DoesNotExist:
            pass # L'étudiant n'a pas eu de projet

    print("\n📊 TAUX DE SATISFACTION :")
    print(f"Vœu n°1 obtenu : {stats[1]} étudiants")
    print(f"Vœu n°2 obtenu : {stats[2]} étudiants")
    print(f"Vœu n°3 obtenu : {stats[3]} étudiants")
    print(f"Vœu n°4 obtenu : {stats[4]} étudiants")
    print(f"Vœu n°5 obtenu : {stats[5]} étudiants")
    print(f"Projet non désiré (Pénalité) : {stats['Non demandé']} étudiants")

if __name__ == "__main__":
    run_scale_test()