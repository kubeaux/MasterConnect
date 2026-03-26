"use client";

import { useEffect, useState } from "react";
import { projectsApi } from "@/src/lib/api";
import Card, { CardContent } from "@/src/components/ui/Card";
import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import { Plus, Pencil, Trash2, Users, Tag } from "lucide-react";
import type { Project } from "@/src/types";
import { parseKeywords } from "@/src/lib/utils";
import toast from "react-hot-toast";

export default function SupervisorProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data } = await projectsApi.getAll();
      setProjects(data.results || data);
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;
    try {
      await projectsApi.delete(id);
      toast.success("Projet supprimé");
      loadProjects();
    } catch {
      toast.error("Impossible de supprimer ce projet");
    }
  };

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
            Mes projets
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {projects.length} projet{projects.length > 1 ? "s" : ""} proposé
            {projects.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/supervisor/projects/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau projet
          </Button>
        </Link>
      </div>

      {/* Liste */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-16 text-center">
            <p className="text-gray-400 text-lg mb-4">Aucun projet pour le moment</p>
            <Link href="/supervisor/projects/new">
              <Button>Créer mon premier projet</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const keywords = parseKeywords(project.mots_cles);
            return (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="info">{project.domaine}</Badge>
                        {project.priorite === "PRIORITAIRE" && (
                          <Badge variant="danger">Prioritaire</Badge>
                        )}
                        {project.statut_validation && (
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
                        )}
                      </div>

                      {/* Titre + description */}
                      <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">
                        {project.titre}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Mots-clés */}
                      {keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {keywords.map((kw) => (
                            <span
                              key={kw}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-100 text-gray-600 rounded-md text-xs"
                            >
                              <Tag className="w-3 h-3" />
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Infos */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.capacite} places max
                        </span>
                        {project.nb_equipes_max && (
                          <span>Max {project.nb_equipes_max} équipe(s)</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          toast("Fonctionnalité de modification à venir", {
                            icon: "✏️",
                          })
                        }
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Supprimer
                      </Button>
                    </div>
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
