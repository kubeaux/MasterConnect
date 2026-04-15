"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/components/providers/AuthProvider";
import { projectsApi } from "@/src/lib/api";
import Link from "next/link";
import { Users, Plus, Briefcase, Clock, ArrowRight } from "lucide-react";
import type { Project } from "@/src/types";
import { clsx } from "clsx";
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

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  const totalCapacity = projects.reduce((sum, p) => sum + (p.capacite || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Espace Encadrant</h1>
          <p className="text-slate-600">Gérez vos propositions de projets et suivez les candidatures.</p>
        </div>
        <Link href="/supervisor/projects/new">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
            <Plus className="h-4 w-4" /> Nouveau projet
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Briefcase className="h-6 w-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Projets proposés</p>
            <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><Users className="h-6 w-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Places Totales</p>
            <p className="text-2xl font-bold text-slate-900">{totalCapacity}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Clock className="h-6 w-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Date limite validation</p>
            <p className="text-lg font-bold text-slate-900">15/03/2026</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-gray-900">Mes Projets récents</h2>
        <Link href="/supervisor/projects" className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
          Voir tout <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">Vous n'avez pas encore proposé de projet.</p>
          </div>
        ) : (
          projects.slice(0, 5).map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-blue-300 transition-colors">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{project.titre}</h3>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2 max-w-4xl">{project.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-600">
                        {project.domaine}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                        <Users className="h-3 w-3" /> {project.capacite} places
                      </span>
                      
                      {project.priorite && (
                        <span className={clsx("text-xs px-2 py-1 rounded font-bold", 
                          project.priorite === 'PRIORITAIRE' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                        )}>
                          Priorité: {project.priorite}
                        </span>
                      )}

                      {project.statut_validation && (
                        <span className={clsx("text-xs px-2 py-1 rounded font-bold ml-auto", 
                          project.statut_validation === 'APPROUVE' ? "bg-emerald-100 text-emerald-700" : 
                          project.statut_validation === 'REFUSE' ? "bg-red-100 text-red-700" : 
                          "bg-yellow-100 text-yellow-700"
                        )}>
                          {project.statut_validation === 'APPROUVE' ? 'Validé' : 
                           project.statut_validation === 'REFUSE' ? 'Refusé' : 'En attente d\'approbation'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}