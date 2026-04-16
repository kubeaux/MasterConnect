"use client";

import React, { useState, useEffect } from 'react';
import { projectsApi, campaignApi } from '@/src/lib/api';
import { Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import type { Project, Campaign } from '@/src/types'; 

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, campaignRes] = await Promise.all([
        projectsApi.getAll(),
        campaignApi.getCurrent()
      ]);
      setProjects(projectsRes.data.results || projectsRes.data);
      setCampaign(campaignRes.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = async (targetProject: Project, newPriority: "PRIORITAIRE" | "NORMALE") => {
    try {
        setProjects(prevProjects => 
            prevProjects.map(p => p.id === targetProject.id ? { ...p, priorite: newPriority } : p)
        );
        
        await projectsApi.update(targetProject.id, { priorite: newPriority });
        toast.success("Priorité mise à jour");
    } catch (error) {
        toast.error("Échec de la mise à jour");
        loadData();
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
        try {
            await projectsApi.delete(id);
            setProjects(prevProjects => prevProjects.filter(p => p.id !== id));
            toast.success("Projet supprimé");
        } catch (error) {
            toast.error("Erreur lors de la suppression du projet");
        }
    }
  };

  if (loading) {
      return (
          <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
      );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden fade-in">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-700">Gestion des Projets ({projects.length})</h3>
          <button className="text-sm text-blue-600 font-medium hover:underline">Télécharger CSV</button>
      </div>
      <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Titre / Encadrant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Domaine</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Capacité</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priorité</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                  {projects.map((project: Project) => (
                      <tr key={project.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                              <div className="text-sm font-medium text-slate-900 line-clamp-1" title={project.titre}>
                                  {project.titre}
                              </div>
                              <div className="text-xs text-slate-500">
                                  {(project.encadrant as any)?.nom || "Encadrant"}
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {project.domaine}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {project.capacite} étudiants / {project.nb_equipes_max || 1} équipes
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <select 
                                  value={project.priorite || "NORMALE"}
                                  onChange={(e) => handlePriorityChange(project, e.target.value as "PRIORITAIRE" | "NORMALE")}
                                  className={clsx(
                                      "text-xs font-bold rounded-full px-2 py-1 border-0 focus:ring-2 cursor-pointer outline-none",
                                      project.priorite === 'PRIORITAIRE' ? "bg-red-100 text-red-800 ring-red-500" :
                                      "bg-gray-100 text-gray-800 ring-gray-500"
                                  )}
                                  disabled={campaign?.statut !== 'VERROUILLEE'}
                              >
                                  <option value="PRIORITAIRE">Prioritaire</option>
                                  <option value="NORMALE">Normale</option>
                              </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3" title="Éditer">
                                  <Edit2 className="h-4 w-4" />
                              </button>
                              <button 
                                  onClick={() => handleDeleteProject(Number(project.id))}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-30" 
                                  title="Supprimer"
                                  disabled={campaign?.statut !== 'VERROUILLEE'}
                              >
                                  <Trash2 className="h-4 w-4" />
                              </button>
                          </td>
                      </tr>
                  ))}
                  {projects.length === 0 && (
                      <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                              Aucun projet trouvé.
                          </td>
                      </tr>
                  )}
              </tbody>
          </table>
      </div>
    </div>
  );
}