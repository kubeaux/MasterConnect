export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'etudiant' | 'encadrant' | 'administrateur';
  num_etudiant?: string;
}

export interface Project {
  id: number;
  titre: string;
  description: string;
  teacher: number;
  teacher_name?: string;
  capacite: number;
  capacite_min?: number;
  domaine: string;
  mots_cles?: string;
  statut_validation: 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE';
  priorite?: 'PRIORITAIRE' | 'NORMALE';
  nb_equipes_max?: number;
  encadrant?: { nom?: string; prenom?: string } | number;
}

export interface Wish {
  id: number;
  student: number;
  project: Project;
  rank: number;
}

export interface Campaign {
  id: number;
  nom: string;
  statut: 'OUVERTE' | 'VERROUILLEE' | 'PUBLIEE';
  date_fin: string;
}

export interface Assignment {
  id: number;
  student: number;
  project: Project;
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