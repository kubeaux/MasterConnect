export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ROLES = {
  STUDENT: "etudiant",
  SUPERVISOR: "encadrant",
  ADMIN: "administrateur",
} as const;

export const CAMPAIGN_STATUS = {
  OPEN: "OUVERTE",
  LOCKED: "VERROUILLEE",
  PUBLISHED: "PUBLIEE",
} as const;

export const MAX_WISHES = 5;

export const DOMAINS = [
  "Intelligence Artificielle",
  "Développement Web",
  "Cybersécurité",
  "Data Science",
  "Recherche Opérationnelle",
  "Systèmes",
  "Finance",
  "Business Intelligence",
] as const;