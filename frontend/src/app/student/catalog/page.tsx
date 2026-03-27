"use client";

import { useEffect, useState } from "react";
import { projectsApi, wishesApi } from "@/src/lib/api";
import ProjectCard from "@/src/components/features/ProjectCard";
import { DOMAINS } from "@/src/lib/constants";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Project, Wish } from "@/src/types";
import toast from "react-hot-toast";

export default function CatalogPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projRes, wishRes] = await Promise.all([
        projectsApi.getAll(),
        wishesApi.getMine(),
      ]);
      setProjects(projRes.data.results || projRes.data);
      setWishes(wishRes.data.results || wishRes.data);
    } catch {
      toast.error("Erreur lors du chargement des projets");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishList = async (projectId: number) => {
    if (wishes.length >= 5) {
      toast.error("Vous ne pouvez pas dépasser 5 vœux");
      return;
    }
    try {
      await wishesApi.add(projectId, wishes.length + 1);
      toast.success("Projet ajouté aux vœux !");
      loadData();
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const wishProjectIds = wishes.map((w) => w.projet.id || w.projet);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.titre.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.mots_cles.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = !domainFilter || p.domaine === domainFilter;
    return matchesSearch && matchesDomain;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="page-container py-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Liste des projets disponibles
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Explorez et sélectionnez vos sujets de master pour l&apos;année 2025–2026.
          </p>
        </div>
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl text-sm font-medium">
          Vœux : {wishes.length} / 5
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-surface-200 p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par titre ou technologie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
          >
            <option value="">Tous les domaines</option>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Compteur */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredProjects.length} projet{filteredProjects.length > 1 ? "s" : ""} trouvé{filteredProjects.length > 1 ? "s" : ""}
      </p>

      {/* Grille de projets */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onAddToWishList={handleAddToWishList}
            isInWishList={wishProjectIds.includes(project.id)}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Aucun projet trouvé</p>
          <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
        </div>
      )}
    </div>
  );
}