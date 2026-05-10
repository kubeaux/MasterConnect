"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Trash2, AlertCircle, GripVertical, 
  Save, Loader2, Info, XCircle, ArrowLeft, MessageSquare, ArrowRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { Reorder } from 'framer-motion';
import { wishesApi, campaignApi } from "@/src/lib/api";
import toast from "react-hot-toast";

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
};

export default function StudentWishesFigma() {
  const [wishes, setWishes] = useState<any[]>([]);
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewingProject, setViewingProject] = useState<any | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [wishRes, campRes] = await Promise.all([
        wishesApi.getMine(),
        campaignApi.getCurrent()
      ]);
      let rawWishes = wishRes.data?.results || wishRes.data || [];
      if (!Array.isArray(rawWishes)) rawWishes = [];
      rawWishes.sort((a: any, b: any) => (a.rank || 0) - (b.rank || 0));
      
      const normalizedWishes = rawWishes.map((w: any, index: number) => ({
        ...w,
        rank: index + 1,
      }));
      setWishes(normalizedWishes);
      setCampaign(campRes.data);
    } catch (error) {
      toast.error("Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (newOrder: any[]) => {
    setWishes(newOrder.map((w, index) => ({ ...w, rank: index + 1 })));
  };

  const removeWish = async (id: number) => {
    try {
      await wishesApi.delete(id);
      const remaining = wishes.filter(w => w.id !== id);
      setWishes(remaining.map((w, index) => ({ ...w, rank: index + 1 })));
      toast.success("Vœu retiré");
    } catch (error) { toast.error("Erreur de suppression"); }
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      const payload = wishes.map(w => ({ id: w.id, rank: w.rank }));
      await wishesApi.reorder(payload);
      toast.success("Classement enregistré !");
      loadData();
    } catch (error) { toast.error("Erreur de sauvegarde"); }
    finally { setSaving(false); }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-yellow-200 shadow-md shadow-yellow-200/50";
      case 2: return "bg-gradient-to-br from-slate-300 to-slate-500 text-white border-slate-100 shadow-md shadow-slate-200/50";
      case 3: return "bg-gradient-to-br from-orange-400 to-orange-600 text-white border-orange-200 shadow-md shadow-orange-200/50";
      default: return "bg-blue-600 text-white border-blue-200";
    }
  };

  const getTags = (project: any) => {
    if (!project) return [];
    const rawTags = project.mots_cles || project.tags || project.keywords || "";
    return rawTags ? rawTags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
  };

  const isLocked = campaign?.statut === 'VERROUILLEE' || campaign?.statut === 'PUBLIEE';

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ma Liste de Vœux</h1>
          <p className="text-slate-500 mt-1">Organisez vos choix et précisez vos motivations.</p>
        </div>
        {!isLocked && wishes.length > 0 && (
          <button
            onClick={saveOrder}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 shrink-0"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Enregistrer le classement
          </button>
        )}
      </div>

      {isLocked && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">La campagne est verrouillée. Le classement est définitif.</p>
        </div>
      )}

      {wishes.length > 0 ? (
        <Reorder.Group axis="y" values={wishes} onReorder={handleReorder} className="space-y-4">
          {wishes.map((wish) => {
            const project = wish.project;
            const title = project?.titre || project?.title || `Projet #${wish.id}`;
            const domain = project?.department || project?.domaine || "Domaine non précisé";
            const teacher = project?.teacher_name || "Superviseur non assigné";

            return (
              <Reorder.Item 
                key={wish.id} 
                value={wish} 
                dragListener={!isLocked}
                whileDrag={{ scale: 1.02, zIndex: 50, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0, 0 / 0.1)" }}
                className={clsx(
                  "bg-white rounded-2xl border border-slate-200 p-5 transition-colors relative",
                  isLocked ? "cursor-default opacity-90" : "cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-md"
                )}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-3">
                      {!isLocked && <GripVertical className="text-slate-300" />}
                      <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2", getRankStyle(wish.rank))}>
                        {wish.rank}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 truncate">{title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{domain}</span>
                         <span className="text-slate-400 text-xs">|</span>
                         <span className="text-sm text-slate-500 font-medium">Superviseur : {teacher}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => setViewingProject(project)} 
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-all"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      {!isLocked && (
                        <button 
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => removeWish(wish.id)} 
                          className="p-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all shadow-sm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Votre liste est vide</h3>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Parcourez le catalogue pour sélectionner les projets qui vous passionnent.</p>
            <Link href="/student/catalog" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
               Parcourir les projets <ArrowLeft className="w-4 h-4" />
            </Link>
        </div>
      )}

      {viewingProject && (
        <Modal isOpen={!!viewingProject} onClose={() => setViewingProject(null)} title="Fiche Projet">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{viewingProject.department || viewingProject.domaine}</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">{viewingProject.title || viewingProject.titre}</h2>
              <p className="text-slate-500 text-sm mt-2">Sujet proposé par {viewingProject.teacher_name}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Description</h4>
               <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{viewingProject.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Capacité</p>
                 <p className="font-bold text-slate-900 text-sm">{viewingProject.capacity} étudiants</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Équipes</p>
                 <p className="font-bold text-slate-900 text-sm">1 max</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}