"use client";

import React, { useState } from 'react';
import { GraduationCap, ArrowRight, User, Lock } from 'lucide-react';
import { login } from '@/src/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log("Tentative de connexion au backend...");
      await login(username, password);
      window.location.href = '/student'; 
    } catch (err) {
      console.error('Erreur attrapée:', err);
      setError('Identifiants ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSignup(false);
      alert("Demande de création de compte envoyée ! (Simulation)");
    }, 1000);
  };

  if (showSignup) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Créer un compte encadrant</h2>
            <p className="mt-2 text-sm text-slate-600">Rejoignez la plateforme pour proposer vos projets</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                  <input type="text" required className="w-full border-slate-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                  <input type="text" required className="w-full border-slate-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email professionnel</label>
                <input type="email" required className="w-full border-slate-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500" placeholder="prenom.nom@univ.fr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Département</label>
                <select className="w-full border-slate-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500">
                  <option>Informatique</option>
                  <option>Mathématiques</option>
                  <option>Génie Industriel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                <input type="password" required className="w-full border-slate-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                {isLoading ? 'Création...' : 'Créer mon compte'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => setShowSignup(false)} className="text-sm text-slate-500 hover:text-slate-800 font-medium">
                Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[0%] left-[0%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-6">
            <GraduationCap className="h-8 w-8 text-blue-100" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Connexion au portail
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Plateforme de gestion des projets de master
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 text-center">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="identifiant" className="block text-sm font-medium text-slate-700">
                  Identifiant / Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="identifiant"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg p-2.5 border"
                    placeholder="ex: admin"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Mot de passe
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg p-2.5 border"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={() => setShowSignup(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Vous êtes encadrant et vous n'avez pas encore un compte ?
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-slate-400">
          © 2026 Université de Paris - Gestion des Projets de Master
        </p>
      </div>
    </div>
  );
}