"use client";

import { useEffect, useState } from "react";
import { adminApi, projectsApi } from "@/src/lib/api";
import { Search, Users, Edit2, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import type { Project } from "@/src/types";

// Interface étendue pour l'affichage dans le tableau
interface StudentItem {
  id: number;
  numero_etudiant: string;
  prenom: string;
  nom: string;
  utilisateur: {
    email: string;
    identifiant_universitaire: string;
  };
  niveau?: string;
  moyenne_academique?: number;
  nb_voeux?: number;
  affecte?: boolean;
  projet_attribue?: { id: number; titre: string } | null; // Optionnel selon ton backend
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // État pour la modale d'édition
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // On charge les étudiants ET les projets en parallèle pour la modale
      const [studentsRes, projectsRes] = await Promise.all([
        adminApi.getStudents(),
        projectsApi.getAll() // Assure-toi que cette route existe dans api.ts
      ]);
      setStudents(studentsRes.data.results || studentsRes.data);
      setProjects(projectsRes.data.results || projectsRes.data);
    } catch {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // --- COMPOSANT MODALE INTÉGRÉ ---
  const OverrideModal = ({ studentId }: { studentId: number }) => {
    const student = students.find(s => s.id === studentId);
    // On initialise le select avec l'ID du projet actuel s'il en a un
    const [selectedProjectId, setSelectedProjectId] = useState<string>(
      student?.projet_attribue ? String(student.projet_attribue.id) : ""
    );

    if (!student) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const projectId = selectedProjectId ? parseInt(selectedProjectId) : null;
            // Appel API pour forcer l'attribution
            await adminApi.forceAssignment(studentId, projectId);
            
            toast.success("Attribution forcée avec succès");
            setEditingStudentId(null);
            loadData(); // On recharge les données pour mettre à jour le tableau
        } catch (error) {
            toast.error("Échec de l'attribution manuelle");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-900">Forcer l'attribution</h3>
                    <button onClick={() => setEditingStudentId(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <XCircle className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                            {student.prenom.charAt(0)}{student.nom.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-lg">{student.prenom} {student.nom}</p>
                            <p className="text-sm text-slate-500">
                                {student.numero_etudiant} • Niveau: {student.niveau || 'N/A'} • Moyenne: <span className="font-semibold">{student.moyenne_academique || 'N/A'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex gap-3">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                        <p>Attention : L'attribution manuelle ignore les contraintes de l'algorithme (capacités max, vœux) et écrase l'affectation précédente.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Sélectionner un projet</label>
                        <select
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="w-full border-slate-300 rounded-xl p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none border transition-shadow"
                        >
                            <option value="">-- Aucun projet (Désaffecter) --</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.titre} (Capacité: {p.capacite})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                      onClick={() => setEditingStudentId(null)} 
                      disabled={isSaving}
                      className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <CheckCircle className="h-4 w-4" />}
                      Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
  };

  const filteredStudents = students.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.prenom?.toLowerCase().includes(q) ||
      s.nom?.toLowerCase().includes(q) ||
      s.numero_etudiant?.toLowerCase().includes(q) ||
      s.utilisateur?.email?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden fade-in">
      
      {/* Affichage de la Modale si un ID est sélectionné */}
      {editingStudentId && <OverrideModal studentId={editingStudentId} />}

      <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Liste des Étudiants</h3>
          <p className="text-slate-500 text-sm mt-1">{students.length} inscrits dans la campagne</p>
        </div>
        
        {/* Barre de recherche */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-shadow"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Étudiant</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Niveau / Moyenne</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vœux</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Projet Attribué</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  Aucun étudiant ne correspond à votre recherche.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                            {student.prenom.charAt(0)}{student.nom.charAt(0)}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">{student.prenom} {student.nom}</div>
                            <div className="text-xs text-slate-500">{student.numero_etudiant}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{student.niveau || "—"}</div>
                    <div className="text-xs font-medium text-emerald-600">GPA: {student.moyenne_academique || "—"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {student.nb_voeux ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.affecte ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {student.projet_attribue?.titre 
                              ? (student.projet_attribue.titre.length > 25 ? student.projet_attribue.titre.substring(0, 25) + '...' : student.projet_attribue.titre) 
                              : "Affecté"}
                        </span>
                    ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            En attente
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        onClick={() => setEditingStudentId(student.id)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 justify-end ml-auto bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                        title="Modifier l'attribution manuellement"
                    >
                        <Edit2 className="h-4 w-4" />
                        <span>Forcer</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}