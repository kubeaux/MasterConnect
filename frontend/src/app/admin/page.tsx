"use client";

import { useEffect, useState } from "react";
import { adminApi, campaignApi } from "@/src/lib/api";
import { Users, BookOpen, CheckCircle, AlertTriangle, Play } from "lucide-react";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Campaign } from "@/src/types";

interface AdminStats {
  total_etudiants: number;
  projets_valides: number;
  taux_affectation: number;
  sans_affectation: number;
  repartition_voeux?: {
    [key: string]: number;
    non_demande: number;
  };
  total_voeux?: number;
  total_projets?: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  const [isComputing, setIsComputing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, campRes] = await Promise.all([
        adminApi.getStats(),
        campaignApi.getCurrent(),
      ]);
      setStats(statsRes.data);
      setCampaign(campRes.data);
    } catch {
      setStats({ total_etudiants: 120, projets_valides: 45, taux_affectation: 0, sans_affectation: 120 });
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchAlgorithm = async () => {
    if (!confirm("Attention : Cette action est irréversible. L'algorithme d'optimisation va être lancé.")) return;

    setIsComputing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 3));
    }, 200);

    try {
      const { data } = await campaignApi.launchAlgorithm();
      clearInterval(interval);
      setProgress(100);

      await new Promise((r) => setTimeout(r, 400));

      setIsComputing(false);
      setShowResults(true);
      toast.success(`Attribution terminée ! Coût final : ${data.cost ?? "—"}`);
      await loadData();
    } catch (err: any) {
      clearInterval(interval);
      setIsComputing(false);
      const msg = err?.response?.data?.message || "Erreur lors du lancement de l'algorithme";
      toast.error(msg);
    }
  };

  const pieData = stats?.repartition_voeux
  ? [
      { name: "Vœu n°1", value: stats.repartition_voeux[1] || 0, color: "#10b981" },
      { name: "Vœu n°2", value: stats.repartition_voeux[2] || 0, color: "#3b82f6" },
      { name: "Vœu n°3", value: stats.repartition_voeux[3] || 0, color: "#6366f1" },
      { name: "Vœu n°4", value: stats.repartition_voeux[4] || 0, color: "#f59e0b" },
      { name: "Vœu n°5", value: stats.repartition_voeux[5] || 0, color: "#f97316" },
      { name: "Non désiré", value: stats.repartition_voeux.non_demande || 0, color: "#ef4444" },
    ].filter((d) => d.value > 0)
  : [];

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;

  return (
    <div className="page-container py-8 fade-in">
      {isComputing && (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-full max-w-md text-center p-8">
            <div className="mb-8 relative mx-auto w-24 h-24">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-bold text-xl">
                {Math.min(progress, 100)}%
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Optimisation en cours...</h2>
            <p className="text-slate-500 mb-8">L'algorithme analyse les vœux et maximise la satisfaction globale.</p>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden">
              <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
            <p className="text-xs text-slate-400">Ne fermez pas cette fenêtre.</p>
          </div>
        </div>
      )}

      {showResults && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 overflow-y-auto">
          <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full text-emerald-600 mb-4">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Attribution Terminée !</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 text-center">Répartition des Vœux</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex justify-between p-4 bg-white rounded-lg border shadow-sm">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Taux d'affectation</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats?.taux_affectation}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-200" />
                </div>
                <div className="flex justify-between p-4 bg-white rounded-lg border shadow-sm">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Non Affectés</p>
                    <p className="text-2xl font-bold text-red-600">{stats?.sans_affectation}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-200" />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button onClick={() => setShowResults(false)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                Fermer le rapport
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vue d'ensemble</h1>
          <p className="text-slate-600">Gestion de la campagne 2025-2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="p-3 w-fit rounded-lg bg-blue-100 text-blue-600 mb-4"><Users className="h-6 w-6" /></div>
          <p className="text-sm text-slate-500 font-medium">Total Étudiants</p>
          <h3 className="text-2xl font-bold text-slate-900">{stats?.total_etudiants ?? "—"}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="p-3 w-fit rounded-lg bg-emerald-100 text-emerald-600 mb-4"><BookOpen className="h-6 w-6" /></div>
          <p className="text-sm text-slate-500 font-medium">Projets Validés</p>
          <h3 className="text-2xl font-bold text-slate-900">{stats?.projets_valides ?? "—"}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="p-3 w-fit rounded-lg bg-indigo-100 text-indigo-600 mb-4"><CheckCircle className="h-6 w-6" /></div>
          <p className="text-sm text-slate-500 font-medium">Taux d'attribution</p>
          <h3 className="text-2xl font-bold text-slate-900">{stats?.taux_affectation ?? 0}%</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="p-3 w-fit rounded-lg bg-red-100 text-red-600 mb-4"><AlertTriangle className="h-6 w-6" /></div>
          <p className="text-sm text-slate-500 font-medium">Sans affectation</p>
          <h3 className="text-2xl font-bold text-slate-900">{stats?.sans_affectation ?? "—"}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Processus d'Attribution</h3>
          {campaign && (
            <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase", 
              campaign.statut === 'PUBLIEE' ? "bg-green-100 text-green-800" :
              campaign.statut === 'VERROUILLEE' ? "bg-amber-100 text-amber-800" :
              "bg-blue-100 text-blue-800"
            )}>
              Statut: {campaign.statut}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex-1">
            <h4 className="font-semibold text-lg text-slate-900 mb-2">Lancer l'algorithme d'attribution</h4>
            <p className="text-sm text-slate-600">Ceci prendra en compte les vœux des étudiants et les capacités des projets pour maximiser la satisfaction globale.</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle className="h-3 w-3 text-emerald-500" /> <span>Optimisation stable</span>
              <span className="mx-2">•</span>
              <CheckCircle className="h-3 w-3 text-emerald-500" /> <span>Vœux prioritaires respectés</span>
            </div>
          </div>
          <button 
            onClick={handleLaunchAlgorithm}
            disabled={campaign?.statut !== 'VERROUILLEE'}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-8 py-4 rounded-xl font-bold flex flex-col items-center gap-1 transition-all shadow-md"
          >
            {campaign?.statut === 'PUBLIEE' ? (
              <><CheckCircle className="h-6 w-6" /><span>Terminé</span></>
            ) : (
              <><Play className="h-6 w-6" /><span>Lancer l'attribution</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}