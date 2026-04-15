"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/src/lib/api";
import Navbar from "@/src/components/layout/Navbar";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    identifiant_universitaire: "",
    email: "",
    mot_de_passe: "",
    mot_de_passe_confirm: "",
    prenom: "",
    nom: "",
  });
  const [error, setError] = useState("");

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validations
    if (form.mot_de_passe !== form.mot_de_passe_confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.mot_de_passe.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.register({
        identifiant_universitaire: form.identifiant_universitaire,
        email: form.email,
        mot_de_passe: form.mot_de_passe,
        prenom: form.prenom,
        nom: form.nom,
        role: "encadrant",
      });
      toast.success("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      router.push("/login");
    } catch {
      setError("Erreur lors de la création du compte. Vérifiez que l'identifiant n'est pas déjà utilisé.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Icône */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-green-50 rounded-2xl mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Inscription Encadrant
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Créez votre compte pour proposer des projets de Master
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="prenom"
                  label="Prénom"
                  placeholder="Jean"
                  value={form.prenom}
                  onChange={(e) => updateField("prenom", e.target.value)}
                  required
                />
                <Input
                  id="nom"
                  label="Nom"
                  placeholder="Dupont"
                  value={form.nom}
                  onChange={(e) => updateField("nom", e.target.value)}
                  required
                />
              </div>

              <Input
                id="identifiant"
                label="Identifiant universitaire"
                placeholder="ex: jdupont"
                value={form.identifiant_universitaire}
                onChange={(e) =>
                  updateField("identifiant_universitaire", e.target.value)
                }
                required
              />

              <Input
                id="email"
                label="Adresse email"
                type="email"
                placeholder="jean.dupont@u-paris.fr"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />

              <Input
                id="password"
                label="Mot de passe"
                type="password"
                placeholder="Minimum 6 caractères"
                value={form.mot_de_passe}
                onChange={(e) => updateField("mot_de_passe", e.target.value)}
                required
              />

              <Input
                id="password_confirm"
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••"
                value={form.mot_de_passe_confirm}
                onChange={(e) =>
                  updateField("mot_de_passe_confirm", e.target.value)
                }
                required
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                Créer mon compte
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800"
              >
                <ArrowLeft className="w-3 h-3" />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
