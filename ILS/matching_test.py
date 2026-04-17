import unittest
import matching  # Import your algorithm file

class TestMatchingILS(unittest.TestCase):
    def setUp(self):
        """
        Prepare the data.
        This function runs automatically before each test to provide clean dummy data.
        """
        self.standard_projects = {
            101: {'capacity': 4},
            102: {'capacity': 4}
        }
        self.standard_students = [1, 2, 3, 4, 5, 6]
    
    def test_calculate_cost_perfect(self):
        """
        Test 1: Verify the "Judge" with a perfect assignment.
        - Objective: Ensure no penalty is wrongly applied.
        - Scenario: 6 students divided into two groups of 3. Capacities respected. Top preference for all.
        - Expected result: 6 students * (Top preference = 10 points) = 60.
        """
        assignment = {1: 101, 2: 101, 3: 101, 4: 102, 5: 102, 6: 102}
        preferences = {
            1: [101], 2: [101], 3: [101],
            4: [102], 5: [102], 6: [102]
        }
        cost = matching.calculate_cost(assignment, preferences, self.standard_projects)
        self.assertEqual(cost, 60)
    
    def test_calculate_cost_with_penalties(self):
        """
        Test 2: Verify the "Judge" with a disastrous assignment.
        - Objective: Ensure each violation triggers the correct penalty.
        - Scenario: Capacity overrun (project 101), too small group (project 102), and unrequested preference (student 4).
        """
        projects = {
            101: {'capacity': 2},  # Max 2 spots
            102: {'capacity': 4}
        }
        # Assign 3 students to project 101 (overrun) and 1 student to project 102 (too small)
        assignment = {1: 101, 2: 101, 3: 101, 4: 102}
        # Student 4 did not request project 102
        preferences = {1: [101], 2: [101], 3: [101], 4: [101]}
        # Mathematical calculation:
        # - Top preference for students 1, 2, 3 = 30
        # - Unrequested project for student 4 = PENALTY_UNRANKED (500)
        # - Capacity overrun for project 101 (3 students instead of 2, 1 extra) = PENALTY_CAPACITY (1000000)
        # - Group size for project 102 (only 1 person) = PENALTY_NUMBER[1] (10000)
        expected_cost = 30 + matching.PENALTY_UNRANKED + matching.PENALTY_CAPACITY + matching.PENALTY_NUMBER[1]
        cost = matching.calculate_cost(assignment, preferences, projects)
        self.assertEqual(cost, expected_cost)
    
    def test_generate_initial_solution(self):
        """
        Test 3: Verify the validity of the initial solution.
        - Objective: Ensure the generator does not lose any students and does not invent new projects.
        """
        assignment = matching.generate_initial_solution(self.standard_students, self.standard_projects)
        # Completion rule: There must be exactly 6 students assigned
        self.assertEqual(len(assignment), len(self.standard_students))
        # Existence rule: Each assigned project must be part of the keys of 'standard_projects'
        valid_project_ids = list(self.standard_projects.keys())
        for project_id in assignment.values():
            self.assertIn(project_id, valid_project_ids)
    
    def test_run_ils_format_and_completion(self):
        """
        Test 4: Verify the global orchestrator and output formatting.
        - Objective: Ensure the final dictionary is in the format expected by Django {project: [students]} and that no student disappears during permutations.
        """
        preferences = {
            1: [101, 102], 2: [101, 102], 3: [101, 102],
            4: [102, 101], 5: [102, 101], 6: [102, 101]
        }
        result, cost = matching.run_ils(self.standard_students, self.standard_projects, preferences, max_iterations=10)
        placed_students = []
        # Read the output format {project_id: [list_of_students]}
        for project, student_list in result.items():
            self.assertIn(project, self.standard_projects)  # The project must exist
            placed_students.extend(student_list)  # Collect all placed students
        # Compare the list of placed students with the initial list to ensure no one is missing
        self.assertEqual(sorted(placed_students), sorted(self.standard_students))

if __name__ == '__main__':
    unittest.main()