import copy
import random

# Penalty if a group has more than 4 members
PENALTY_CAPACITY = 1000000  
# Penalty if a student is assigned an unrequested project
PENALTY_UNRANKED = 500  
# Penalty based on the number of people per group
PENALTY_NUMBER = {
    1: 10000,
    2: 1000,
    3: 10,
    4: 0
}

def calculate_cost(assignment, preferences):
    """
    assignment : dictionary {student_id: project_id}
    preferences : dictionary {student_id: [projectA, projectB...]}
    """
    cost = 0
    # 1. Dynamically count the number of students per project
    project_sizes = {}
    for student, project in assignment.items():
        if project not in project_sizes:
            project_sizes[project] = 0
        project_sizes[project] += 1
    
    # 2. Calculate capacity and size penalties
    for project, num_people in project_sizes.items():
        if num_people < 5:
            cost += PENALTY_NUMBER.get(num_people, 0)
        else:
            cost += PENALTY_CAPACITY
            
    # 3. Calculate preference scores
    for student, project in assignment.items():
        requested_projects = preferences.get(student, [])
        if project in requested_projects:
            rank = requested_projects.index(project) + 1
            cost += rank * 10
        else:
            cost += PENALTY_UNRANKED
            
    return cost

def generate_initial_solution(students, projects):
    """
    Creates a completely random initial assignment.
    students : list of student IDs (e.g., [1, 2, 3, 4, 5])
    projects : dictionary of projects (e.g., {101: {...}, 102: {...}})
    Returns a dictionary {student_id: project_id}
    """
    assignment = {}
    available_project_ids = list(projects.keys())
    
    for student in students:
        assignment[student] = random.choice(available_project_ids)
        
    return assignment

def local_search(initial_assignment, preferences, projects):
    """
    Improves the assignment by testing shifts and swaps.
    """
    # 1. Make an independent copy of the assignment to work on
    assignment = copy.deepcopy(initial_assignment)
    current_cost = calculate_cost(assignment, preferences)
    improvement_found = True
    
    while improvement_found:
        improvement_found = False
        students_list = list(assignment.keys())
        project_ids = list(projects.keys())
        
        # --- PART 1: SHIFT ---
        for student in students_list:
            original_project = assignment[student]
            
            for target_project in project_ids:
                if original_project == target_project:
                    continue
                
                # 1. Assign the target project to this student
                assignment[student] = target_project
                new_cost = calculate_cost(assignment, preferences)
                
                if new_cost < current_cost:
                    current_cost = new_cost
                    improvement_found = True
                    break
                else:
                    # Revert the change if not better
                    assignment[student] = original_project
                    
            if improvement_found:
                break
        
        # --- PART 2: SWAP (if no shift improved) ---
        if not improvement_found:
            for i in range(len(students_list)):
                for j in range(i + 1, len(students_list)):
                    student_1 = students_list[i]
                    student_2 = students_list[j]
                    project_1 = assignment[student_1]
                    project_2 = assignment[student_2]
                    
                    if project_1 == project_2:
                        continue
                    
                    # Swap the projects
                    assignment[student_1] = project_2
                    assignment[student_2] = project_1
                    
                    new_cost = calculate_cost(assignment, preferences)
                    
                    if new_cost < current_cost:
                        current_cost = new_cost
                        improvement_found = True
                        break
                    else:
                        # Revert the swap if not better
                        assignment[student_1] = project_1
                        assignment[student_2] = project_2
                        
                if improvement_found:
                    break
        
    return assignment, current_cost

def perturbate(assignment, projects, force=0.2):
    """
    Partially destroys the solution to escape local minima.
    force = 0.2 means 20% of students will be randomly reassigned.
    """
    new_assignment = copy.deepcopy(assignment)
    student_list = list(new_assignment.keys())
    project_ids = list(projects.keys())
    
    num_to_perturb = int(len(student_list) * force)
    
    # Ensure at least one change if there are students
    if num_to_perturb == 0 and len(student_list) > 0:
        num_to_perturb = 1
        
    selected_students = random.sample(student_list, num_to_perturb)
    
    for student in selected_students:
        new_assignment[student] = random.choice(project_ids)
        
    return new_assignment

def run_ils(students, projects, preferences, max_iterations=100):
    """
    Main function of the iterative local search algorithm.
    max_iterations: number of times we perform (Local Search -> Perturbation).
    """
    if not students or not projects:
        return {}, 0
    
    best_assignment = generate_initial_solution(students, projects)
    best_cost = calculate_cost(best_assignment, preferences)
    
    current_assignment = copy.deepcopy(best_assignment)
    
    for _ in range(max_iterations):
        local_assignment, local_cost = local_search(current_assignment, preferences, projects)
        
        if local_cost < best_cost:
            best_assignment = copy.deepcopy(local_assignment)
            best_cost = local_cost
            
        # Perturb the current assignment
        current_assignment = perturbate(best_assignment, projects)
    
    # FORMAT FOR DJANGO OUTPUT
    final_result = {p_id: [] for p_id in projects.keys()}
    for student_id, project_id in best_assignment.items():
        final_result[project_id].append(student_id)
        
    # Clean the result to remove empty projects
    final_result = {p: student_list for p, student_list in final_result.items() if len(student_list) > 0}
    
    return final_result, best_cost