"use client";

import { useState } from "react";
import useSWR from "swr";
import { adminApi, fetcher } from "@/src/lib/api";
import { Search, Users, Edit2, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface StudentItem {
  id: number;
  numero_etudiant: string;
  prenom: string;
  nom: string;
  utilisateur: { email: string; identifiant_universitaire: string; };
  niveau?: string;
  moyenne_academique?: number;
  nb_voeux?: number;
  affecte?: boolean;
  projet_attribue?: { id: number; titre: string } | null;
}

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: studentsData, error: studentsError, mutate: mutateStudents } = useSWR('/users/', fetcher);
  const { data: projectsData } = useSWR('/projects/', fetcher);

  const students: StudentItem[] = studentsData?.results || studentsData || [];
  const projects = projectsData?.results || projectsData || [];
  
  const isLoading = !studentsData && !studentsError;

  const OverrideModal = ({ studentId }: { studentId: number }) => {
    const student = students.find(s => s.id === studentId);
    const [selectedProjectId, setSelectedProjectId] = useState<string>(
      student?.projet_attribue ? String(student.projet_attribue.id) : ""
    );

    if (!student) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const projectId = selectedProjectId ? parseInt(selectedProjectId) : null;
            await adminApi.forceAssignment(studentId, projectId);
            toast.success("Attribution forcée avec succès");
            setEditingStudentId(null);
            
            mutateStudents(); 
        } catch (error) {
            toast.error("Échec de l'attribution");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-900">Forcer l'attribution</h3>
                    <button onClick={() => setEditingStudentId(null)} className="text-slate-400 hover:text-slate-600">
                        <XCircle className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                            {student.prenom?.charAt(0) || 'E'}{student.nom?.charAt(0) || 'T'}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-lg">{student.prenom} {student.nom}</p>
                            <p className="text-sm text-slate-500">
                                {student.numero_etudiant} • GPA: <span className="font-semibold">{student.moyenne_academique || 'N/A'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex gap-3">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                        <p>Cette attribution écrase l'algorithme.</p>
                    </div>

                    <div>
                        <select
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="w-full border-slate-300 rounded-xl p-3 text-sm focus:ring-indigo-500 outline-none border"
                        >
                            <option value="">-- Aucun projet (Désaffecter) --</option>
                            {/* @ts-ignore : On sécurise le typage de p au cas où */}
                            {projects.map((p: any) => (
                                <option key={p.id} value={p.id}>
                                    {p.titre} (Places: {p.capacite})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                    <button onClick={() => setEditingStudentId(null)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl">Annuler</button>
                    <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2">
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
    return s.prenom?.toLowerCase().includes(q) || s.nom?.toLowerCase().includes(q) || s.numero_etudiant?.toLowerCase().includes(q);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
        Erreur de connexion au serveur.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden fade-in">
      {editingStudentId && <OverrideModal studentId={editingStudentId} />}

      <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Liste des Étudiants</h3>
          <p className="text-slate-500 text-sm mt-1">{students.length} inscrits</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Étudiant</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Niveau</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Projet Attribué</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">{student.prenom} {student.nom}</div>
                  <div className="text-xs text-slate-500">{student.numero_etudiant}</div>
                </td>
                <td className="px-6 py-4 text-sm">{student.niveau || "—"}</td>
                <td className="px-6 py-4">
                    {student.affecte ? (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                            {student.projet_attribue?.titre || "Affecté"}
                        </span>
                    ) : (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                            En attente
                        </span>
                    )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                      onClick={() => setEditingStudentId(student.id)}
                      className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto"
                  >
                      <Edit2 className="h-4 w-4" /> Forcer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}