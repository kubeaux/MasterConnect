// ── Utilisateurs ──
export interface User {
  id: number;
  username: string;
  email: string;
  role: "etudiant" | "encadrant" | "administrateur";
  date_creation: string;
}

export interface Student {
  id: number;
  utilisateur: User;
  numero_etudiant: string;
  prenom: string;
  nom: string;
  niveau?: "M1" | "M2";
  moyenne_academique?: number;
}

export interface Supervisor {
  id: number;
  utilisateur: User;
  prenom: string;
  nom: string;
}

// ── Projets ──
export interface Project {
  id: number;
  titre: string;
  description: string;
  domaine: string;
  mots_cles: string;
  capacite: number;
  capacite_min?: number;
  nb_equipes_max?: number;
  priorite?: "NORMALE" | "PRIORITAIRE";
  statut_validation?: "EN_ATTENTE" | "APPROUVE" | "REFUSE";
  encadrant: Supervisor;
  campagne: number;
  date_creation: string;
}

// ── Voeux ──
export interface Wish {
  id: number;
  etudiant: number;
  projet: Project;
  campagne: number;
  rang: number;
  justification?: string;
  date_creation: string;
}

// ── Affectation ──
export interface Assignment {
  id: number;
  etudiant: Student;
  projet: Project;
  campagne: number;
  date_affectation: string;
}

// ── Campagne ──
export interface Campaign {
  id: number;
  statut: "OUVERTE" | "VERROUILLEE" | "PUBLIEE";
  date_debut: string;
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