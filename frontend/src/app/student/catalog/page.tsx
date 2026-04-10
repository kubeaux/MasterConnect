"use client";

import React, { useState } from 'react';
import { Search, Plus, Info, XCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { toast, Toaster } from 'sonner';
// import { useAuth } from '@/src/components/providers/AuthProvider'; // A décommenter quand l'auth est branchée

const mockProjects = [
  { id: 1, title: "Optimisation IA", description: "Projet de recherche sur les LLM.", department: "Informatique", supervisor: "Dr. Martin", tags: ["Python", "TensorFlow"], slots: 2, maxTeams: 1 },
  { id: 2, title: "Application Mobile Santé", description: "Création d'une app React Native.", department: "Santé Publique", supervisor: "Pr. Dubois", tags: ["React Native", "Firebase"], slots: 4, maxTeams: 2 },
];
const mockSettings = { status: 'OPEN', wishEnd: '2026-05-01T23:59:59' };

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
};

export default function StudentDashboard() {
  // const { user } = useAuth(); // Vrai utilisateur
  const [wishes, setWishes] = useState<any[]>([]); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'slots'>('title');
  const [viewingProject, setViewingProject] = useState<any>(null);

  const allDepts = Array.from(new Set(mockProjects.map(p => p.department)));

  const handleAddToWishes = (projectId: number) => {
    if (wishes.length >= 5) {
      toast.error("Vous ne pouvez pas ajouter plus de 5 vœux.");
      return;
    }
    setWishes([...wishes, { projectId, rank: wishes.length + 1 }]);
    toast.success("Projet ajouté à vos vœux");
  };

  const handleRemoveFromWishes = (projectId: number) => {
    setWishes(wishes.filter(w => w.projectId !== projectId));
    toast.info("Projet retiré des vœux");
  };

  const filteredProjects = mockProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'all' || p.department === selectedDept;
    return matchesSearch && matchesDept;
  }).sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.slots - a.slots;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Liste des projets disponibles</h1>
            <p className="text-slate-600">Explorez et sélectionnez vos sujets de master pour l'année 2025-2026.</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm">
            <Clock className="h-4 w-4" />
            <span>Statut : <span className="text-blue-900">Ouvert</span></span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
                type="text"
                placeholder="Rechercher par titre..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <select
            className="border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
        >
            <option value="all">Tous les domaines</option>
            {allDepts.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const isSelected = wishes.some(w => w.projectId === project.id);
          return (
            <div key={project.id} className={clsx("bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow", isSelected ? "border-blue-300 ring-1 ring-blue-100" : "border-slate-200")}>
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full">{project.department}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{project.title}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button onClick={() => setViewingProject(project)} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-blue-50">
                  <Info className="h-4 w-4" /> Détails
                </button>
                <button
                  onClick={() => isSelected ? handleRemoveFromWishes(project.id) : handleAddToWishes(project.id)}
                  className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors", isSelected ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-blue-600 text-white hover:bg-blue-700")}
                >
                  {isSelected ? "Retirer" : <><Plus className="h-4 w-4" /> Ajouter</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {viewingProject && (
          <Modal isOpen={!!viewingProject} onClose={() => setViewingProject(null)} title="Détails du projet">
              <div className="space-y-4">
                  <h4 className="text-xl font-bold text-slate-900">{viewingProject.title}</h4>
                  <p className="text-slate-600">{viewingProject.description}</p>
                  <p className="text-sm font-bold mt-4">Encadrant : {viewingProject.supervisor}</p>
              </div>
          </Modal>
      )}
    </div>
  );
}