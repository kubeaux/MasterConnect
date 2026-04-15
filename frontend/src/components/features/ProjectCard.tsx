"use client";

import { Users, User as UserIcon, Tag } from "lucide-react";
import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import { parseKeywords, truncate } from "@/src/lib/utils";
import type { Project } from "@/src/types";

interface ProjectCardProps {
  project: Project;
  onAddToWishList?: (projectId: number) => void;
  isInWishList?: boolean;
  showActions?: boolean;
}

export default function ProjectCard({
  project,
  onAddToWishList,
  isInWishList = false,
  showActions = true,
}: ProjectCardProps) {
  const keywords = parseKeywords(project.mots_cles);

  return (
    <div className="project-card p-5 fade-in">
      {/* Header : domaine + priorité */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant="info">{project.domaine}</Badge>
        {project.priorite === "PRIORITAIRE" && (
          <Badge variant="danger">Prioritaire</Badge>
        )}
      </div>

      {/* Titre */}
      <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">
        {project.titre}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        {truncate(project.description, 150)}
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

      {/* Footer : infos + action */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-200">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {project.capacite} places
          </span>
          <span className="flex items-center gap-1">
            <UserIcon className="w-4 h-4" />
            {project.encadrant.prenom} {project.encadrant.nom}
          </span>
        </div>

        {showActions && onAddToWishList && (
          <Button
            size="sm"
            variant={isInWishList ? "ghost" : "primary"}
            disabled={isInWishList}
            onClick={() => onAddToWishList(project.id)}
          >
            {isInWishList ? "Déjà ajouté" : "Ajouter aux vœux"}
          </Button>
        )}
      </div>
    </div>
  );
}