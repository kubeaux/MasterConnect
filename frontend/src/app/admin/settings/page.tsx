"use client";

import React, { useState, useEffect } from 'react';
import { campaignApi } from '@/src/lib/api'; // L'import correct
import { Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Campaign } from '@/src/types';

export default function AdminSettingsPage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await campaignApi.getCurrent();
      setCampaign(data);
    } catch (error) {
      toast.error("Impossible de charger les paramètres");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (field: keyof Campaign, value: string | number) => {
    if (!campaign) return;
    
    // Mise à jour locale (Optimistic UI)
    const updatedCampaign = { ...campaign, [field]: value };
    setCampaign(updatedCampaign);

    try {
      setIsSaving(true);
      await campaignApi.update(campaign.id, { [field]: value });
      toast.success("Paramètre sauvegardé");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
      loadSettings(); // On annule en rechargeant depuis le serveur
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-slate-500" />
          Dates clés de la campagne {campaign?.annee_universitaire}
        </h3>
        {isSaving && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
      </div>

      <div className="space-y-6">
        {/* Section Soumission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Début soumission projets</label>
            <input
              type="date"
              className="w-full border-slate-300 rounded-lg text-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              value={campaign?.date_debut_soumission || ''}
              onChange={(e) => handleUpdate('date_debut_soumission', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fin soumission projets</label>
            <input
              type="date"
              className="w-full border-slate-300 rounded-lg text-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              value={campaign?.date_fin_soumission || ''}
              onChange={(e) => handleUpdate('date_fin_soumission', e.target.value)}
            />
          </div>
        </div>

        {/* Section Vœux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Début vœux étudiants</label>
            <input
              type="date"
              className="w-full border-slate-300 rounded-lg text-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              value={campaign?.date_debut_voeux || ''}
              onChange={(e) => handleUpdate('date_debut_voeux', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fin vœux étudiants</label>
            <input
              type="date"
              className="w-full border-slate-300 rounded-lg text-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              value={campaign?.date_fin_voeux || ''}
              onChange={(e) => handleUpdate('date_fin_voeux', e.target.value)}
            />
          </div>
        </div>

        {/* Paramètres Globaux */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Configuration par défaut</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre max. d'équipes par projet</label>
            <input
              type="number"
              min="1"
              className="w-full border-slate-300 rounded-lg text-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              value={campaign?.nb_equipes_max_defaut || 1}
              onChange={(e) => handleUpdate('nb_equipes_max_defaut', parseInt(e.target.value))}
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 italic mt-4">
          * Les modifications sont transmises en temps réel au serveur MasterConnect.
        </p>
      </div>
    </div>
  );
}