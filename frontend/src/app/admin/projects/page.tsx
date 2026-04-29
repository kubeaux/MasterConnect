"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { projectsApi, adminApi } from '@/src/lib/api';
import { Trash2, Check, X, Clock, ShieldCheck, ShieldX } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import type { Project } from '@/src/types';

type StatusFilter = 'TOUS' | 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('EN_ATTENTE');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const { data } = await projectsApi.getAll();
      setProjects(data.results || data);
    } catch {
      toast.error("Erreur lors du chargement des projets");
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => ({
    TOUS: projects.length,
    EN_ATTENTE: projects.filter(p => p.statut_validation === 'EN_ATTENTE').length,
    APPROUVE: projects.filter(p => p.statut_validation === 'APPROUVE').length,
    REFUSE: projects.filter(p => p.statut_validation === 'REFUSE').length,
  }), [projects]);

  const filtered = useMemo(() => {
    if (filter === 'TOUS') return projects;
    return projects.filter(p => p.statut_validation === filter);
  }, [projects, filter]);

  const handleApprove = async (id: number) => {
    const previous = projects;
    setProjects(prev => prev.map(p => p.id === id ? { ...p, statut_validation: 'APPROUVE' } : p));
    try {
      await adminApi.validateProject(id);
      toast.success("Projet approuvé");
    } catch {
      setProjects(previous);
      toast.error("Échec de l'approbation");
    }
  };

  const handleReject = async (id: number) => {
    const previous = projects;
    setProjects(prev => prev.map(p => p.id === id ? { ...p, statut_validation: 'REFUSE' } : p));
    try {
      await adminApi.rejectProject(id);
      toast.success("Projet refusé");
    } catch {
      setProjects(previous);
      toast.error("Échec du refus");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer définitivement ce projet ?")) return;
    try {
      await projectsApi.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success("Projet supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const tabs: { id: StatusFilter; label: string; count: number; icon?: any }[] = [
    { id: 'EN_ATTENTE', label: 'En attente', count: counts.EN_ATTENTE, icon: Clock },
    { id: 'APPROUVE', label: 'Approuvés', count: counts.APPROUVE, icon: ShieldCheck },
    { id: 'REFUSE', label: 'Refusés', count: counts.REFUSE, icon: ShieldX },
    { id: 'TOUS', label: 'Tous', count: counts.TOUS },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden fade-in">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="font-bold text-slate-700">Validation des projets ({counts.TOUS})</h3>
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  )}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {tab.label}
                  <span className={clsx(
                    "px-1.5 py-0.5 rounded text-[10px] font-black",
                    isActive ? "bg-white/20" : "bg-slate-100"
                  )}>{tab.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Titre / Encadrant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Domaine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Capacité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {filtered.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900 line-clamp-1" title={project.titre}>
                    {project.titre}
                  </div>
                  <div className="text-xs text-slate-500">
                    {(project as any).teacher_name || "Encadrant inconnu"}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{project.domaine}</td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {project.capacite} étudiants
                </td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1",
                    project.statut_validation === 'APPROUVE' && "bg-emerald-100 text-emerald-800",
                    project.statut_validation === 'REFUSE' && "bg-red-100 text-red-800",
                    project.statut_validation === 'EN_ATTENTE' && "bg-amber-100 text-amber-800",
                  )}>
                    {project.statut_validation === 'APPROUVE' && 'Approuvé'}
                    {project.statut_validation === 'REFUSE' && 'Refusé'}
                    {project.statut_validation === 'EN_ATTENTE' && 'En attente'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {project.statut_validation === 'EN_ATTENTE' && (
                      <>
                        <button
                          onClick={() => handleApprove(Number(project.id))}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Check className="h-3.5 w-3.5" /> Approuver
                        </button>
                        <button
                          onClick={() => handleReject(Number(project.id))}
                          className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <X className="h-3.5 w-3.5" /> Refuser
                        </button>
                      </>
                    )}
                    {project.statut_validation === 'REFUSE' && (
                      <button
                        onClick={() => handleApprove(Number(project.id))}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1"
                        title="Réactiver ce projet"
                      >
                        <Check className="h-3.5 w-3.5" /> Réapprouver
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(Number(project.id))}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                  Aucun projet dans cette catégorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}