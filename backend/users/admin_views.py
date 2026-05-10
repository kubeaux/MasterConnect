from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from projects.models import Project
from assignments.models import Assignment
from wishes.models import Wish
from .permissions import IsAdminUserType

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAdminUserType])
def admin_stats(request):
    """
    Retourne les KPIs du dashboard admin :
    - total étudiants
    - projets validés
    - taux d'affectation
    - étudiants sans affectation
    """
    total_etudiants = User.objects.filter(user_type='etudiant').count()
    projets_valides = Project.objects.filter(statut_validation='APPROUVE').count()
    nb_affectations = Assignment.objects.count()

    if total_etudiants > 0:
        taux_affectation = round((nb_affectations / total_etudiants) * 100, 1)
    else:
        taux_affectation = 0

    sans_affectation = total_etudiants - nb_affectations

    repartition_voeux = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 'non_demande': 0}
    for assignment in Assignment.objects.select_related('student', 'project').all():
        wish = Wish.objects.filter(
            student=assignment.student,
            project=assignment.project
        ).first()
        if wish and wish.rank in repartition_voeux:
            repartition_voeux[wish.rank] += 1
        else:
            repartition_voeux['non_demande'] += 1

    return Response({
        'total_etudiants': total_etudiants,
        'projets_valides': projets_valides,
        'taux_affectation': taux_affectation,
        'sans_affectation': sans_affectation,
        'repartition_voeux': repartition_voeux,
        'total_voeux': Wish.objects.count(),
        'total_projets': Project.objects.count(),
    })