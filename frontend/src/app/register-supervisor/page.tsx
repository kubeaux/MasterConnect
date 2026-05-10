"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Loader2, Mail, User as UserIcon, Lock, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DEPARTEMENTS = [
  'Informatique',
  'Mathématiques',
  'Génie Industriel',
  'Physique',
  'MIAGE',
];

export default function RegisterSupervisorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    departement: 'Informatique',
    password: '',
    password_confirm: '',
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.password_confirm) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);
    try {
      // username = email (cohérent avec la maquette qui demande l'email pro)
      await axios.post(`${API_URL}/auth/register-supervisor/`, {
        username: form.email,
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        departement: form.departement,
      });
      
      toast.success("Compte créé ! Un administrateur va valider votre demande sous 48h.");
      router.push('/login');
    } catch (err: any) {
      const msg = err.response?.data?.error || "Erreur lors de la création du compte";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background décoratif (identique à ta maquette) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-6">
            <GraduationCap className="h-8 w-8 text-blue-100" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Créer un compte encadrant
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Rejoignez la plateforme pour proposer vos projets
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                <input
                  type="text"
                  required
                  value={form.first_name}
                  onChange={e => updateField('first_name', e.target.value)}
                  className="w-full border-slate-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                <input
                  type="text"
                  required
                  value={form.last_name}
                  onChange={e => updateField('last_name', e.target.value)}
                  className="w-full border-slate-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="Dupont"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email professionnel</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => updateField('email', e.target.value)}
                  className="w-full pl-10 border-slate-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="prenom.nom@univ.fr"
                />
              </div>
            </div>

            {/* Département */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Département</label>
              <select
                value={form.departement}
                onChange={e => updateField('departement', e.target.value)}
                className="w-full border-slate-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
              >
                {DEPARTEMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => updateField('password', e.target.value)}
                  className="w-full pl-10 border-slate-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="Min. 8 caractères"
                />
              </div>
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={form.password_confirm}
                  onChange={e => updateField('password_confirm', e.target.value)}
                  className="w-full pl-10 border-slate-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Info validation admin */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 text-xs text-amber-800">
              <Building2 className="h-4 w-4 shrink-0 mt-0.5" />
              <p>Votre compte sera validé manuellement par un administrateur sous 48h ouvrées.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 font-medium"
            >
              <ArrowLeft className="h-3 w-3" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}