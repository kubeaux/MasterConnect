"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { projectsApi } from '@/src/lib/api';
import { Save, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const projectSchema = z.object({
  titre: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
  domaine: z.string().min(2, "Le domaine est requis"),
  
  capacite: z.string()
    .min(1, "La capacité est requise")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, "Doit être un nombre supérieur ou égal à 1"),
    
  mots_cles: z.string().min(2, "Renseignez au moins un mot-clé (ex: Python, IA)"),
  description: z.string().min(20, "La description détaillée est requise (min. 20 caractères)"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        title: data.titre,
        department: data.domaine,
        capacity: parseInt(data.capacite),
        description: data.description,
      };

      await projectsApi.create(formattedData);
      
      toast.success("Projet publié avec succès !");
      router.push('/supervisor/projects');
      router.refresh();
    } catch (error: any) {
      console.error("Détail du refus Backend :", error.response?.data);
      toast.error("Erreur lors de la création du projet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-in">
      <div className="mb-8">
        <Link 
          href="/supervisor" 
          className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour au tableau de bord
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Publier un Nouveau Projet</h1>
            <p className="text-slate-500 mt-1">Définissez les contours de votre sujet de recherche.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          
          <div>
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6">Informations Générales</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Titre du projet *</label>
                <input 
                  type="text" 
                  {...register("titre")}
                  placeholder="Ex: Optimisation d'algorithmes par Deep Learning..."
                  className={`w-full p-3 rounded-lg border text-sm outline-none transition-all ${errors.titre ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
                />
                {errors.titre && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.titre.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Domaine / Parcours *</label>
                  <input 
                    type="text" 
                    {...register("domaine")}
                    placeholder="Ex: Intelligence Artificielle"
                    className={`w-full p-3 rounded-lg border text-sm outline-none transition-all ${errors.domaine ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
                  />
                  {errors.domaine && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.domaine.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Capacité (Nb. étudiants) *</label>
                  <input 
                    type="number" 
                    {...register("capacite")}
                    placeholder="Ex: 3"
                    className={`w-full p-3 rounded-lg border text-sm outline-none transition-all ${errors.capacite ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
                  />
                  {errors.capacite && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.capacite.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mots-clés *</label>
                <input 
                  type="text" 
                  {...register("mots_cles")}
                  placeholder="Ex: Machine Learning, Python, Base de données"
                  className={`w-full p-3 rounded-lg border text-sm outline-none transition-all ${errors.mots_cles ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
                />
                {errors.mots_cles && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.mots_cles.message}</p>}
                <p className="text-xs text-slate-400 mt-1.5">Séparez les mots-clés par des virgules pour faciliter la recherche des étudiants.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6">Détails du Sujet</h2>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description détaillée *</label>
              <textarea 
                {...register("description")}
                rows={5}
                placeholder="Décrivez les objectifs, les technologies attendues et les livrables..."
                className={`w-full p-3 rounded-lg border text-sm outline-none transition-all resize-none ${errors.description ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <Link href="/supervisor/projects">
            <button type="button" className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
              Annuler
            </button>
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Publier le projet
          </button>
        </div>
      </form>
    </div>
  );
}