"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Info, Loader2, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from "@/src/components/providers/AuthProvider";
import { wishesApi, projectsApi } from "@/src/lib/api";
import toast from "react-hot-toast";

export default function StudentCatalog() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [myWishes, setMyWishes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, wishRes] = await Promise.all([
        projectsApi.getAll(),
        wishesApi.getMine()
      ]);
      
      const rawProjects = projRes.data?.results || projRes.data || [];
      setProjects(Array.isArray(rawProjects) ? rawProjects : []);

      const rawWishes = wishRes.data?.results || wishRes.data || [];
      const filteredWishes = (Array.isArray(rawWishes) ? rawWishes : []).filter((w: any) => 
        w.student === user?.id || w.student?.id === user?.id || !w.student
      );
      setMyWishes(filteredWishes);

    } catch (error) {
      toast.error("Erreur lors du chargement du catalogue");
    } finally {
      setLoading(false);
    }
  };

  const handleAddWish = async (projectId: number) => {
    if (myWishes.length >= 5) {
      toast.error("Vous avez déjà atteint la limite maximale de 5 vœux.");
      return;
    }
    
    setAddingId(projectId);
    try {
      await wishesApi.create({
        project: projectId,
        rank: myWishes.length + 1
      });
      toast.success("Projet ajouté à vos vœux !");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du vœu");
    } finally {
      setAddingId(null);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.titre?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Catalogue des Projets</h1>
        <p className="text-slate-600 mt-1">Explorez les sujets de recherche et constituez votre liste de vœux (Maximum 5).</p>
      </div>

      <div className="relative mb-8 max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
          placeholder="Rechercher par titre ou mot-clé..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
           <div className="col-span-full text-center py-12 text-slate-500">Aucun projet ne correspond à votre recherche.</div>
        ) : (
          filteredProjects.map((project) => {
            const isAlreadyWished = myWishes.some(w => w.project === project.id || w.projet === project.id || w.project?.id === project.id);

            return (
              <div key={project.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Capacité : {project.capacity || project.capacite || 1} étudiant(s)
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{project.title || project.titre}</h3>
                  <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-4">
                    {project.description || "Aucune description détaillée n'a été fournie pour ce projet."}
                  </p>
                </div>
                
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 mt-auto">
                  <button
                    onClick={() => handleAddWish(project.id)}
                    disabled={isAlreadyWished || myWishes.length >= 5 || addingId === project.id}
                    className={clsx(
                      "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isAlreadyWished 
                        ? "bg-emerald-100 text-emerald-700 cursor-not-allowed"
                        : myWishes.length >= 5 
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    )}
                  >
                    {addingId === project.id ? (
                       <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isAlreadyWished ? (
                      <> <CheckCircle className="h-4 w-4" /> Déjà dans vos vœux </>
                    ) : (
                      <> <Plus className="h-4 w-4" /> Ajouter aux vœux </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}