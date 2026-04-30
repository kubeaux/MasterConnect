import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge des classes Tailwind intelligemment */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formater une date ISO en français */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Tronquer un texte */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export function parseKeywords(keywords?: string | null): string[] {
  if (!keywords) return [];
  
  return keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

export function getUserDisplayName(user: { 
  first_name?: string; 
  last_name?: string; 
  username: string 
} | null | undefined): string {
  if (!user) return '';
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  return fullName || user.username;
}

export function getUserInitials(user: { 
  first_name?: string; 
  last_name?: string;
  username: string 
} | null | undefined): string {
  if (!user) return '?';
  if (user.first_name && user.last_name) {
    return (user.first_name[0] + user.last_name[0]).toUpperCase();
  }
  return (user.username[0] || '?').toUpperCase();
}