"use client";

import { useEffect, useState } from "react";
import { projectsApi, adminApi } from "@/src/lib/api";
import Card, { CardContent } from "@/src/components/ui/Card";
import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import { Users, CheckCircle, XCircle, Tag } from "lucide-react";
import type { Project } from "@/src/types";
import { truncate, parseKeywords } from "@/src/lib/utils";
import toast from "react-hot-toast";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data } = await projectsApi.getAll();
      setProjects(data.results || data);
    } catch {
      toast.error("Erreur lors du chargement des projets");
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id: number) => {
    try {
      await adminApi.validateProject(id);
      toast.success("Projet approuvé");
      loadProjects();
    } catch {
      toast.error("Erreur lors de la validation");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await adminApi.rejectProject(id);
      toast.success("Projet refusé");
      loadProjects();
    } catch {
      toast.error("Erreur lors du refus");
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    return p.statut_validation === filter;
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Gestion des projets
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {projects.length} projet{projects.length > 1 ? "s" : ""} soumis par
            les encadrants
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "all", label: "Tous" },
          { value: "EN_ATTENTE", label: "En attente" },
          { value: "APPROUVE", label: "Approuvés" },
          { value: "REFUSE", label: "Refusés" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-primary-700 text-white"
                : "bg-white text-gray-600 border border-surface-200 hover:bg-surface-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste des projets */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-400">Aucun projet trouvé pour ce filtre</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => {
            const keywords = parseKeywords(project.mots_cles);
            return (
              <Card key={project.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="info">{project.domaine}</Badge>
                        {project.priorite === "PRIORITAIRE" && (
                          <Badge variant="danger">Prioritaire</Badge>
                        )}
                        <Badge
                          variant={
                            project.statut_validation === "APPROUVE"
                              ? "success"
                              : project.statut_validation === "REFUSE"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {project.statut_validation === "APPROUVE"
                            ? "Approuvé"
                            : project.statut_validation === "REFUSE"
                            ? "Refusé"
                            : "En attente"}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-1">
                        {project.titre}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {truncate(project.description, 150)}
                      </p>

                      {keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {keywords.map((kw) => (
                            <span
                              key={kw}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-100 text-gray-500 rounded text-xs"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>
                          Par {project.encadrant.prenom} {project.encadrant.nom}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.capacite} places
                        </span>
                      </div>
                    </div>

                    {/* Actions de validation */}
                    {(!project.statut_validation ||
                      project.statut_validation === "EN_ATTENTE") && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleValidate(project.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleReject(project.id)}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Refuser
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
