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
    
  nb_equipes_max: z.string()
    .min(1, "Le nombre d'équipes est requis")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, "Doit être un nombre supérieur ou égal à 1"),
    
  mots_cles: z.string().min(2, "Renseignez au moins un mot-clé (ex: Python, IA)"),
  description: z.string().min(20, "La description est trop courte (minimum 20 caractères)"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      capacite: "1",
      nb_equipes_max: "1",
    }
  });

  const titre = watch("titre");
  const description = watch("description");

  const generateTags = () => {
    if (!titre || !description || titre.length < 5) {
        toast.error("Remplissez le titre et la description d'abord");
        return;
    }
    setIsGenerating(true);
    
    setTimeout(() => {
        const text = `${titre} ${description}`.toLowerCase();
        const commonTags = ["python", "java", "react", "ia", "data", "web", "mobile", "docker", "sql", "django", "api"];
        const foundTags = commonTags.filter(tag => text.includes(tag));
        
        if (foundTags.length > 0) {
            setValue("mots_cles", foundTags.join(", "), { shouldValidate: true });
            toast.success("Mots-clés générés !");
        } else {
            toast("Aucun mot-clé détecté", { icon: 'ℹ️' });
        }
        setIsGenerating(false);
    }, 800);
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const payload = {
          ...data,
          capacite: parseInt(data.capacite, 10),
          nb_equipes_max: parseInt(data.nb_equipes_max, 10),
      };

      await projectsApi.create(payload as any); 
      toast.success("Projet créé avec succès !");
      router.push("/supervisor"); 
    } catch (error) {
      toast.error("Erreur lors de la création du projet");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-in">
      <div className="mb-6">
        <Link href="/supervisor" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-2 mb-4 w-fit transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Nouveau Projet</h1>
        <p className="text-slate-600">Proposez un sujet aux étudiants pour la campagne en cours.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Titre du projet *</label>
              <input 
                {...register("titre")}
                type="text" 
                placeholder="Ex: Application de gestion..."
                className={`w-full p-3 rounded-lg border text-sm outline-none transition-all ${errors.titre ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
              />
              {errors.titre && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.titre.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Domaine principal *</label>
              <input 
                {...register("domaine")}
                type="text" 
                placeholder="Ex: Intelligence Artificielle"
                className={`w-full p-3 rounded-lg border text-sm outline-none transition-all ${errors.domaine ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
              />
              {errors.domaine && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.domaine.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Capacité totale (Étudiants) *</label>
              <input 
                {...register("capacite")}
                type="number" 
                min="1"
                className={`w-full p-3 rounded-lg border text-sm outline-none transition-all ${errors.capacite ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
              />
              {errors.capacite && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.capacite.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre d'équipes max *</label>
              <input 
                {...register("nb_equipes_max")}
                type="number" 
                min="1"
                className={`w-full p-3 rounded-lg border text-sm outline-none transition-all ${errors.nb_equipes_max ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
              />
              {errors.nb_equipes_max && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.nb_equipes_max.message}</p>}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">Mots-clés *</label>
                <button 
                    type="button" 
                    onClick={generateTags}
                    disabled={isGenerating}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                    {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    Générer via IA
                </button>
            </div>
            <input 
              {...register("mots_cles")}
              type="text" 
              placeholder="Séparés par des virgules (Ex: Python, React, API)"
              className={`w-full p-3 rounded-lg border text-sm outline-none transition-all ${errors.mots_cles ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
            />
            {errors.mots_cles && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.mots_cles.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description détaillée *</label>
            <textarea 
              {...register("description")}
              rows={5}
              placeholder="Décrivez les objectifs, les technologies attendues et les livrables..."
              className={`w-full p-3 rounded-lg border text-sm outline-none transition-all resize-none ${errors.description ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.description.message}</p>}
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link href="/supervisor">
              <button type="button" className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Annuler
              </button>
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Publier le projet
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}