"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { projectsApi } from "@/src/lib/api";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import Card, { CardContent } from "@/src/components/ui/Card";
import { DOMAINS } from "@/src/lib/constants";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    domaine: "",
    mots_cles: "",
    capacite: 3,
    capacite_min: 1,
    nb_equipes_max: 1,
  });

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Extraction basique de mots-clés depuis la description
  const handleAutoKeywords = () => {
    if (!form.description) {
      toast.error("Remplissez d'abord la description");
      return;
    }
    // Mots de plus de 5 lettres, uniques, hors mots courants
    const stopWords = new Set([
      "cette", "dans", "avec", "pour", "sera", "sont", "être", "avoir",
      "plus", "nous", "vous", "leur", "notre", "votre", "comme",
      "entre", "après", "avant", "aussi", "autre", "projet", "travail",
      "permettre", "permettra", "utiliser", "développer", "mettre",
    ]);
    const words = form.description
      .toLowerCase()
      .replace(/[^a-zàâäéèêëïîôùûüç\s-]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 5 && !stopWords.has(w));
    const unique = Array.from(new Set(words)).slice(0, 5);
    updateField("mots_cles", unique.join(", "));
    toast.success(`${unique.length} mot(s)-clé(s) extraits`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.titre || !form.description || !form.domaine) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);
    try {
      await projectsApi.create({
        titre: form.titre,
        description: form.description,
        domaine: form.domaine,
        mots_cles: form.mots_cles,
        capacite: form.capacite,
        capacite_min: form.capacite_min,
        nb_equipes_max: form.nb_equipes_max,
      });
      toast.success("Projet créé avec succès !");
      router.push("/supervisor/projects");
    } catch {
      toast.error("Erreur lors de la création du projet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container py-8 max-w-2xl mx-auto fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/supervisor/projects"
          className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Nouveau projet
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Proposez un sujet de recherche pour les étudiants de Master.
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <Input
              id="titre"
              label="Titre du projet *"
              placeholder="ex: Intelligence Artificielle pour la détection de fraudes"
              value={form.titre}
              onChange={(e) => updateField("titre", e.target.value)}
              required
            />

            {/* Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description détaillée *
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Décrivez le sujet, les objectifs, les technologies utilisées..."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 placeholder:text-gray-400 hover:border-primary-300 resize-none"
                required
              />
            </div>

            {/* Domaine */}
            <div className="space-y-1.5">
              <label
                htmlFor="domaine"
                className="block text-sm font-medium text-gray-700"
              >
                Domaine *
              </label>
              <select
                id="domaine"
                value={form.domaine}
                onChange={(e) => updateField("domaine", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 hover:border-primary-300"
                required
              >
                <option value="">Sélectionner un domaine</option>
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacités */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="capacite"
                label="Capacité maximale (étudiants)"
                type="number"
                min={1}
                max={10}
                value={form.capacite}
                onChange={(e) =>
                  updateField("capacite", parseInt(e.target.value) || 1)
                }
              />
              <Input
                id="nb_equipes_max"
                label="Nombre d'équipes max"
                type="number"
                min={1}
                max={5}
                value={form.nb_equipes_max}
                onChange={(e) =>
                  updateField("nb_equipes_max", parseInt(e.target.value) || 1)
                }
              />
            </div>

            {/* Mots-clés */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="mots_cles"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mots-clés (séparés par des virgules)
                </label>
                <button
                  type="button"
                  onClick={handleAutoKeywords}
                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800"
                >
                  <Sparkles className="w-3 h-3" />
                  Générer via IA
                </button>
              </div>
              <input
                id="mots_cles"
                type="text"
                placeholder="ex: Machine Learning, Python, TensorFlow"
                value={form.mots_cles}
                onChange={(e) => updateField("mots_cles", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 placeholder:text-gray-400 hover:border-primary-300"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-surface-200">
              <Link href="/supervisor/projects" className="flex-1">
                <Button type="button" variant="secondary" className="w-full">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" isLoading={isLoading} className="flex-1">
                Enregistrer le projet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
