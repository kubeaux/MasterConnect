"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/components/providers/AuthProvider";
import { projectsApi } from "@/src/lib/api";
import KpiCard from "@/src/components/features/KpiCard";
import Card, { CardContent } from "@/src/components/ui/Card";
import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import { BookOpen, Users, Calendar, ArrowRight, Plus } from "lucide-react";
import type { Project } from "@/src/types";
import { truncate } from "@/src/lib/utils";
import toast from "react-hot-toast";

export default function SupervisorDashboardPage() {
  const { user } = useAuth();
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
      toast.error("Erreur lors du chargement des projets");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const totalCapacity = projects.reduce((sum, p) => sum + p.capacite, 0);

  return (
    <div className="page-container py-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Bonjour{user ? `, ${user.identifiant_universitaire}` : ""} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gérez vos projets et suivez les candidatures.
          </p>
        </div>
        <Link href="/supervisor/projects/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau projet
          </Button>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <KpiCard
          title="Projets proposés"
          value={projects.length}
          icon={BookOpen}
          color="blue"
        />
        <KpiCard
          title="Places totales"
          value={totalCapacity}
          icon={Users}
          color="green"
        />
        <KpiCard
          title="Date limite validation"
          value="15/03/2026"
          icon={Calendar}
          color="yellow"
        />
      </div>

      {/* Liste rapide des projets */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-gray-900">
          Mes Projets &amp; Candidatures
        </h2>
        <Link
          href="/supervisor/projects"
          className="text-sm text-primary-600 hover:text-primary-800 inline-flex items-center gap-1"
        >
          Voir tout <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">
              Vous n&apos;avez pas encore proposé de projet.
            </p>
            <Link href="/supervisor/projects/new">
              <Button>Créer mon premier projet</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.slice(0, 5).map((project) => (
            <Card key={project.id} hover>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
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
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {project.titre}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {truncate(project.description, 120)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-gray-500">
                      <Users className="w-4 h-4 inline mr-1" />
                      {project.capacite} places
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
