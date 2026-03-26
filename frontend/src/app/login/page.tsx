"use client";

import { useState } from "react";
import { useAuth } from "@/src/components/providers/AuthProvider";
import Navbar from "@/src/components/layout/Navbar";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const [identifiant, setIdentifiant] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(identifiant, password);
      toast.success("Connexion réussie !");
    } catch {
      setError("Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Icône */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-primary-50 rounded-2xl mb-4">
              <KeyRound className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Connexion au portail
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Plateforme de gestion des projets de master
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <Input
                id="identifiant"
                label="Identifiant / Email"
                placeholder="ex: etudiant"
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}
                required
              />

              <Input
                id="password"
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
                Se connecter →
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/register"
                className="text-sm text-primary-600 hover:text-primary-800 hover:underline"
              >
                Vous êtes encadrant et vous n&apos;avez pas encore de compte ?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}