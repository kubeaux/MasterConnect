import os
from django.db import transaction
from django.contrib.auth import get_user_model

# Import your models
from projects.models import Project
from wishes.models import Wish
from assignments.models import Assignment

# Import your ILS algorithm with the correct relative path
from ILS.matching import run_ils

User = get_user_model()

def execute_ils_matching(max_iterations=100):
    """
    Service that orchestrates the entire assignment process.
    """
    print("--- START OF MATCHING ---")
    # ==========================================
    # 1. DATA EXTRACTION AND TRANSLATION
    # ==========================================
    student_ids = list(User.objects.filter(user_type='etudiant').values_list('id', flat=True))
    if not student_ids:
        return {"success": False, "message": "No students found in the database."}
    
    projects_db = Project.objects.all()
    projects_dict = {}
    for p in projects_db:
        projects_dict[p.id] = {
            'capacity': p.capacity,
            'is_priority': getattr(p, 'is_priority', False)
        }
    
    # Critical fix here: creation of an ordered list for the .index() function
    wishes_db = Wish.objects.all().order_by('student_id', 'rank')
    wishes_dict = {}
    for w in wishes_db:
        if w.student_id not in wishes_dict:
            wishes_dict[w.student_id] = []
        wishes_dict[w.student_id].append(w.project_id)
    
    print(f"Extracted data: {len(student_ids)} students, {len(projects_dict)} projects.")
    # ==========================================
    # 2. EXECUTION OF THE ILS ALGORITHM
    # ==========================================
    print("Starting the ILS algorithm...")
    algorithm_result, final_cost = run_ils(
        students=student_ids,
        projects=projects_dict,
        preferences=wishes_dict,
        max_iterations=max_iterations
    )
    print(f"Algorithm completed with a final cost of: {final_cost}")
    # ==========================================
    # 3. SAVING TO THE DATABASE
    # ==========================================
    try:
        with transaction.atomic():
            Assignment.objects.all().delete()
            new_assignments = []
            for project_id, student_list in algorithm_result.items():
                for student_id in student_list:
                    new_assignment = Assignment(
                        student_id=student_id,
                        project_id=project_id
                    )
                    new_assignments.append(new_assignment)
            Assignment.objects.bulk_create(new_assignments)
        print("--- SAVE SUCCESSFUL ---")
        return {
            "success": True,
            "message": f"Matching completed. Final cost: {final_cost}",
            "cost": final_cost
        }
    except Exception as e:
        print(f"Error during save: {e}")
        return {"success": False, "message": str(e)}