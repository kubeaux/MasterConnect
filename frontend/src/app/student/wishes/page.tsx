"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, ArrowRight, AlertCircle, GripVertical, Save, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Reorder } from 'framer-motion';
import { wishesApi } from "@/src/lib/api";
import { useAuth } from "@/src/components/providers/AuthProvider";
import toast from "react-hot-toast";

export default function StudentWishes() {
  const { user } = useAuth();
  const [wishes, setWishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      const res = await wishesApi.getMine();
      let rawWishes = res.data?.results || res.data || [];
      if (!Array.isArray(rawWishes)) rawWishes = [];
      
      const myWishes = rawWishes.filter((w: any) => 
        w.student === user?.id || w.student?.id === user?.id || !w.student
      );

      myWishes.sort((a: any, b: any) => (a.rank || 0) - (b.rank || 0));
      
      setWishes(myWishes);
    } catch (error) {
      toast.error("Erreur lors du chargement de vos vœux");
    } finally {
      setLoading(false);
    }
  };

  const removeWish = async (wishId: number) => {
    try {
      await wishesApi.delete(wishId);
      const updated = wishes.filter(w => w.id !== wishId);
      setWishes(updated);
      toast.success("Vœu supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleReorder = (newOrder: any[]) => {
      const updatedWishes = newOrder.map((w, idx) => ({ ...w, rank: idx + 1 }));
      setWishes(updatedWishes);
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      await Promise.all(wishes.map(w => 
        wishesApi.update(w.id, { rank: w.rank })
      ));
      toast.success("Votre classement a bien été enregistré !");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde du classement");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes Vœux</h1>
          <p className="text-slate-600 mt-1">Gérez et classez vos projets par ordre de préférence.</p>
        </div>
        
        {/* Nouveau bouton pour valider l'ordre auprès du serveur */}
        <button 
          onClick={saveOrder}
          disabled={saving || wishes.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
          Enregistrer le classement
        </button>
      </div>

      {wishes.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun vœu pour le moment</h3>
            <p className="text-slate-500 mb-6">Explorez le catalogue pour ajouter des projets à votre liste.</p>
            <Link href="/student/catalog" className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm">
                Voir le catalogue <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
      ) : (
        <Reorder.Group axis="y" values={wishes} onReorder={handleReorder} className="space-y-3">
          {wishes.map((wish) => {
            const projetInfo = wish.projet || wish.project || null;
            const title = projetInfo && typeof projetInfo === 'object' 
                ? (projetInfo.title || projetInfo.titre || "Projet en cours de chargement...") 
                : `Projet (ID: ${wish.project || 'Inconnu'})`;

            return (
              <Reorder.Item 
                key={wish.id} 
                value={wish}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex gap-6 items-center group relative cursor-grab active:cursor-grabbing"
              >
                  <GripVertical className="h-5 w-5 text-slate-400" />
                  <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border-2 flex-shrink-0", wish.rank === 1 ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-700 border-slate-300")}>
                      {wish.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 truncate">{title}</h3>
                  </div>
                  <button onClick={() => removeWish(wish.id)} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 rounded hover:bg-red-50 flex-shrink-0 transition-colors">
                      <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Supprimer</span>
                  </button>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}
    </div>
  );
}