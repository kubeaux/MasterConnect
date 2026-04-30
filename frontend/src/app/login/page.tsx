"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, User, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/src/components/providers/AuthProvider';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); 
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await login(username, password);
      
      toast.success("Connexion réussie !");

      const role = response.user.user_type;
      if (role === 'administrateur') {
        router.push('/admin');
      } else if (role === 'encadrant') {
        router.push('/supervisor');
      } else {
        router.push('/student');
      }
      
    } catch (error: any) {
      console.error(error);
      toast.error("Identifiants incorrects");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">MasterConnect</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Identifiant</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                placeholder="ex: etudiant_1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
          </button>
          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-sm text-slate-500">Vous êtes encadrant et vous n'avez pas encore de compte ? </span>{' '}
            <Link 
              href="/register-supervisor" 
              className="text-sm text-indigo-600 font-semibold hover:text-indigo-800"
            >
              Créer un compte
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}