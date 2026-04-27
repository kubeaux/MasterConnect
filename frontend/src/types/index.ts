export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_type: 'student' | 'teacher' | 'supervisor' | 'admin';
  num_etudiant?: string;
  is_staff: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  teacher: User; 
  capacity: number;
  domaine?: string;
  statut_validation?: string;
}

export interface Wish {
  id: number;
  student: User | number;
  project: Project;
  rank: number;
}

export interface Assignment {
  id: number;
  student: User;
  project: Project;
}

export interface Campaign {
  id: number;
  nom: string;
  statut: 'OUVERTE' | 'VERROUILLEE' | 'PUBLIEE';
  date_fin: string;
}

// ── Auth ──
export interface LoginRequest {
  identifiant_universitaire: string;
  mot_de_passe: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

// ── API Responses ──
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Formulaires ──
export interface ProjectFormData {
  titre: string;
  description: string;
  domaine: string;
  mots_cles: string;
  capacite: number;
  capacite_min?: number;
  nb_equipes_max?: number;
}