"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Plus, Info, Users, XCircle, Clock, 
  Trash2, ArrowUpDown, Tag, Building2, UserCircle, Layers, Loader2
} from 'lucide-react';
import { wishesApi, projectsApi, campaignApi } from "@/src/lib/api";
import { useAuth } from "@/src/components/providers/AuthProvider";
import { clsx } from 'clsx';
import toast from "react-hot-toast";

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">{children}</div>
        </div>
      </div>
    );
};

export default function StudentCatalogFigma() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [myWishes, setMyWishes] = useState<any[]>([]);
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [filterDomaine, setFilterDomaine] = useState('Tous');
  const [filterTech, setFilterTech] = useState('Toutes');
  const [filterSupervisor, setFilterSupervisor] = useState('Tous');
  const [filterCapacity, setFilterCapacity] = useState('Toutes');
  const [sortBy, setSortBy] = useState<'title' | 'capacity'>('title');
  
  const [viewingProject, setViewingProject] = useState<any | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [projRes, wishRes, campRes] = await Promise.all([
        projectsApi.getAll(),
        wishesApi.getMine(),
        campaignApi.getCurrent()
      ]);
      setProjects(projRes.data?.results || projRes.data || []);
      setMyWishes(wishRes.data?.results || wishRes.data || []);
      setCampaign(campRes.data);
    } catch (error) {
      toast.error("Erreur de chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const daysRemaining = useMemo(() => {
    if (!campaign?.date_fin) return null;
    const diff = Math.ceil((new Date(campaign.date_fin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [campaign]);

  const getTags = (project: any) => {
    const rawTags = project.mots_cles || project.tags || project.keywords || "";
    return rawTags ? rawTags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
  };

  const domaines = ['Tous', ...Array.from(new Set(projects.map(p => p.department || p.domaine).filter(Boolean)))];
  const supervisors = ['Tous', ...Array.from(new Set(projects.map(p => p.teacher_name).filter(Boolean)))];
  const allTechs = Array.from(new Set(projects.flatMap(p => getTags(p))));
  const techOptions = ['Toutes', ...allTechs];

  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        const matchesSearch = (p.title || p.titre || "").toLowerCase().includes(search.toLowerCase());
        const matchesDomaine = filterDomaine === 'Tous' || (p.department || p.domaine) === filterDomaine;
        const matchesSupervisor = filterSupervisor === 'Tous' || p.teacher?.username === filterSupervisor;
        const matchesCapacity = filterCapacity === 'Toutes' || p.capacity === parseInt(filterCapacity);
        const matchesTech = filterTech === 'Toutes' || getTags(p).includes(filterTech);
        
        return matchesSearch && matchesDomaine && matchesSupervisor && matchesCapacity && matchesTech;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return (a.title || a.titre || "").localeCompare(b.title || b.titre || "");
        return (b.capacity || 0) - (a.capacity || 0);
      });
  }, [projects, search, filterDomaine, filterSupervisor, filterCapacity, filterTech, sortBy]);

  const handleToggleWish = async (project: any) => {
    const existingWish = myWishes.find(w => (w.project?.id || w.project) === project.id);

    if (existingWish) {
      try {
        await wishesApi.delete(existingWish.id);
        toast.success("Projet retiré de vos vœux");
        loadData();
      } catch (e) { toast.error("Erreur lors de la suppression"); }
    } else {
      if (myWishes.length >= 5) {
        toast.error("Vous avez déjà atteint la limite de 5 vœux");
        return;
      }
      try {
        const maxRank = Math.max(0, ...myWishes.map(w => w.rank || 0));
        await wishesApi.create({ project: project.id, rank: maxRank + 1 });
        toast.success("Projet ajouté à vos vœux");
        loadData();
      } catch (e) { toast.error("Erreur lors de l'ajout"); }
    }
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in bg-slate-50 min-h-screen">
      
      {daysRemaining !== null && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 text-amber-800">
            <div className="p-2 bg-amber-100 rounded-lg"><Clock className="h-5 w-5" /></div>
            <div>
              <p className="font-bold text-sm">Clôture de la campagne de vœux</p>
              <p className="text-xs opacity-80">Plus que {daysRemaining} jours pour finaliser votre sélection.</p>
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">{daysRemaining} j</div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Catalogue des projets</h1>
        <p className="text-slate-500 mt-2 font-medium">Filtrez, analysez et sélectionnez jusqu'à 5 sujets de recherche.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <Search className="h-5 w-5 text-slate-400 mr-3" />
          <input 
            type="text" 
            placeholder="Rechercher un sujet par mots-clés..." 
            className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1"><Building2 className="h-3 w-3"/> Domaine</label>
            <select value={filterDomaine} onChange={(e) => setFilterDomaine(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500">
              {domaines.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1"><Tag className="h-3 w-3"/> Technologies</label>
            <select value={filterTech} onChange={(e) => setFilterTech(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500">
              {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1"><UserCircle className="h-3 w-3"/> Encadrant</label>
            <select value={filterSupervisor} onChange={(e) => setFilterSupervisor(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500">
              {supervisors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1"><Users className="h-3 w-3"/> Taille du groupe</label>
            <select value={filterCapacity} onChange={(e) => setFilterCapacity(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500">
              <option value="Toutes">Toutes tailles</option>
              <option value="1">1 place</option>
              <option value="2">2 places</option>
              <option value="3">3 places</option>
              <option value="4">4 places</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-lg font-bold text-slate-700">
          <span className="text-blue-600 font-black">{filteredProjects.length}</span> projets trouvés
        </h2>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)} 
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 outline-none hover:border-slate-300 cursor-pointer"
          >
            <option value="title">Trier par Titre (A-Z)</option>
            <option value="capacity">Trier par Places (Max-Min)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const isAdded = myWishes.some(w => (w.project?.id || w.project) === project.id);
          const isLimitReached = myWishes.length >= 5 && !isAdded;
          const tags = getTags(project);

          return (
            <div key={project.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-md">
                    {project.department || project.domaine || "Sujet de Recherche"}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <Users className="h-3.5 w-3.5" />
                    {project.capacity} places
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {project.title || project.titre}
                </h3>
                
                <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mb-4">
                   <UserCircle className="h-4 w-4 opacity-70"/> {project.teacher_name || "Non assigné"}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {tags.slice(0, 3).map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold rounded-md">
                      #{tag}
                    </span>
                  ))}
                  {tags.length > 3 && <span className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-md">+{tags.length - 3}</span>}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
                <button 
                  onClick={() => setViewingProject(project)}
                  className="flex-1 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <Info className="h-4 w-4" /> Détails
                </button>

                <button
                  onClick={() => handleToggleWish(project)}
                  disabled={isLimitReached}
                  className={clsx(
                    "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-1.5",
                    isAdded 
                      ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100" // BOUTON SUPPRIMER (Figma)
                      : isLimitReached 
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed" // BOUTON GRISÉ (Figma)
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200" // BOUTON NORMAL
                  )}
                >
                  {isAdded ? (
                    <><Trash2 className="h-4 w-4" /> Supprimer</>
                  ) : isLimitReached ? (
                     <><XCircle className="h-4 w-4" /> Complet</>
                  ) : (
                    <><Plus className="h-4 w-4" /> Ajouter</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 mt-6">
          <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
             <Search className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Aucun projet trouvé</h3>
          <p className="text-slate-500 mt-1 text-sm">Modifiez vos filtres pour voir plus de résultats.</p>
        </div>
      )}

      {viewingProject && (
        <Modal isOpen={!!viewingProject} onClose={() => setViewingProject(null)} title="Informations détaillées du projet">
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <div className="flex gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md uppercase tracking-wider">
                    {viewingProject.department || viewingProject.domaine || "Sujet"}
                  </span>
               </div>
               <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">{viewingProject.title || viewingProject.titre}</h2>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100"><UserCircle className="h-5 w-5 text-slate-500" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Encadrant</p>
                      <p className="text-sm font-bold text-slate-900">{viewingProject.teacher?.username || "Non assigné"}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100"><Users className="h-5 w-5 text-slate-500" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Capacité max.</p>
                      <p className="text-sm font-bold text-slate-900">{viewingProject.capacity} places</p>
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2"><Layers className="h-4 w-4 text-blue-600"/> Description du projet</h4>
               <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                 {viewingProject.description}
               </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2"><Tag className="h-4 w-4 text-blue-600"/> Mots-clés / Technologies</h4>
               <div className="flex flex-wrap gap-2">
                 {getTags(viewingProject).length > 0 ? (
                    getTags(viewingProject).map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                        #{tag}
                      </span>
                    ))
                 ) : (
                    <span className="text-sm text-slate-400 italic">Aucun mot-clé défini.</span>
                 )}
               </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                  onClick={() => handleToggleWish(viewingProject)}
                  disabled={myWishes.length >= 5 && !myWishes.some(w => (w.project?.id || w.project) === viewingProject.id)}
                  className={clsx(
                    "px-8 py-3.5 rounded-xl font-black uppercase text-sm tracking-wider transition-all flex items-center gap-2",
                    myWishes.some(w => (w.project?.id || w.project) === viewingProject.id)
                      ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                  )}
                >
                   {myWishes.some(w => (w.project?.id || w.project) === viewingProject.id) ? (
                      <><Trash2 className="h-5 w-5" /> Retirer de mes vœux</>
                   ) : (
                      <><Plus className="h-5 w-5" /> Sélectionner ce projet</>
                   )}
                </button>
            </div>

          </div>
        </Modal>
      )}
    </div>
  );
}