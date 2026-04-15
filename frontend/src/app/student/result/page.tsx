"use client";

import { useEffect, useState } from "react";
import { assignmentsApi } from "@/src/lib/api";
import Card, { CardContent } from "@/src/components/ui/Card";
import Badge from "@/src/components/ui/Badge";
import { Trophy, User as UserIcon, Calendar, Tag, BookOpen } from "lucide-react";
import type { Assignment } from "@/src/types";
import { formatDate, parseKeywords } from "@/src/lib/utils";

export default function StudentResultPage() {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadResult();
  }, []);

  const loadResult = async () => {
    try {
      const { data } = await assignmentsApi.getMine();
      setAssignment(data);
    } catch {
      setError(true);
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

  if (error || !assignment) {
    return (
      <div className="page-container py-8 fade-in">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="inline-flex p-4 bg-surface-100 rounded-2xl mb-4">
            <Trophy className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-2">
            Résultats non disponibles
          </h1>
          <p className="text-gray-500">
            Les résultats d&apos;affectation n&apos;ont pas encore été publiés.
            Vous serez notifié dès que la campagne sera terminée.
          </p>
        </div>
      </div>
    );
  }

  const project = assignment.projet;
  const keywords =
    typeof project === "object" && project.mots_cles
      ? parseKeywords(project.mots_cles)
      : [];

  return (
    <div className="page-container py-8 max-w-2xl mx-auto fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-green-50 rounded-2xl mb-4">
          <Trophy className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-2">
          Votre projet attribué
        </h1>
        <p className="text-gray-500">
          Félicitations ! Voici le projet qui vous a été assigné.
        </p>
      </div>

      {/* Carte résultat */}
      {typeof project === "object" && (
        <Card>
          <CardContent className="p-8">
            {/* Domaine + Priorité */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="info">{project.domaine}</Badge>
              {project.priorite === "PRIORITAIRE" && (
                <Badge variant="danger">Prioritaire</Badge>
              )}
            </div>

            {/* Titre */}
            <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">
              {project.titre}
            </h2>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Mots-clés */}
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-100 text-gray-600 rounded-lg text-xs"
                  >
                    <Tag className="w-3 h-3" />
                    {kw}
                  </span>
                ))}
              </div>
            )}

            {/* Infos complémentaires */}
            <div className="border-t border-surface-200 pt-5 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <UserIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Encadrant :</span>
                <span className="text-gray-900 font-medium">
                  {project.encadrant.prenom} {project.encadrant.nom}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Capacité :</span>
                <span className="text-gray-900 font-medium">
                  {project.capacite} étudiant{project.capacite > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Affecté le :</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(assignment.date_affectation)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
