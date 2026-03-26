"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/src/lib/api";
import Card, { CardContent } from "@/src/components/ui/Card";
import Badge from "@/src/components/ui/Badge";
import { Search, Users } from "lucide-react";
import toast from "react-hot-toast";

interface StudentItem {
  id: number;
  numero_etudiant: string;
  prenom: string;
  nom: string;
  utilisateur: {
    email: string;
    identifiant_universitaire: string;
  };
  nb_voeux?: number;
  affecte?: boolean;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const { data } = await adminApi.getStudents();
      setStudents(data.results || data);
    } catch {
      toast.error("Erreur lors du chargement des étudiants");
    } finally {
      setLoading(false);
    }
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="page-container py-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Étudiants inscrits
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {students.length} étudiant{students.length > 1 ? "s" : ""}{" "}
            dans la campagne
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, prénom ou numéro étudiant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
        />
      </div>

      {/* Tableau */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">
                  Étudiant
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">
                  N° étudiant
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">
                  Email
                </th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">
                  Vœux
                </th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Aucun étudiant trouvé
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-surface-200 hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">
                        {student.prenom} {student.nom}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {student.numero_etudiant}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {student.utilisateur?.email || "—"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-50 text-primary-700 text-xs font-bold">
                        {student.nb_voeux ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Badge variant={student.affecte ? "success" : "warning"}>
                        {student.affecte ? "Affecté" : "En attente"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
