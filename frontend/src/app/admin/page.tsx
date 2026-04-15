"use client";

import { useEffect, useState } from "react";
import { adminApi, campaignApi } from "@/src/lib/api";
import KpiCard from "@/src/components/features/KpiCard";
import CampaignStatusBadge from "@/src/components/features/CampaignStatusBadge";
import Card, { CardContent, CardHeader } from "@/src/components/ui/Card";
import Button from "@/src/components/ui/Button";
import {
  Users,
  BookOpen,
  BarChart3,
  AlertTriangle,
  Play,
  CheckCircle,
} from "lucide-react";
import type { Campaign } from "@/src/types";
import toast from "react-hot-toast";

interface AdminStats {
  total_etudiants: number;
  projets_valides: number;
  taux_affectation: number;
  sans_affectation: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      // Si l'API stats n'existe pas encore, utiliser des valeurs par défaut
      setStats({
        total_etudiants: 0,
        projets_valides: 0,
        taux_affectation: 0,
        sans_affectation: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchAlgorithm = async () => {
    setLaunching(true);
    try {
      await campaignApi.launchAlgorithm();
      toast.success("Algorithme d'attribution lancé avec succès !");
      setShowConfirm(false);
      loadData();
    } catch {
      toast.error("Erreur lors du lancement de l'algorithme");
    } finally {
      setLaunching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="page-container py-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Administration
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestion de la campagne 2025–2026
          </p>
        </div>
        {campaign && (
          <CampaignStatusBadge
            status={campaign.statut as "OUVERTE" | "VERROUILLEE" | "PUBLIEE"}
          />
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Total Étudiants"
          value={stats?.total_etudiants ?? "—"}
          icon={Users}
          color="blue"
        />
        <KpiCard
          title="Projets Validés"
          value={stats?.projets_valides ?? "—"}
          icon={BookOpen}
          color="green"
        />
        <KpiCard
          title="Taux d'attribution"
          value={stats?.taux_affectation ? `${stats.taux_affectation}%` : "0%"}
          icon={BarChart3}
          color="yellow"
        />
        <KpiCard
          title="Sans affectation"
          value={stats?.sans_affectation ?? "—"}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Processus d'attribution */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-gray-900">
              Processus d&apos;Attribution
            </h2>
            {campaign && (
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                Statut : {campaign.statut}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Lancer l&apos;algorithme d&apos;attribution
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Cela prendra en compte les vœux des étudiants, les capacités des
                projets et les priorités définies pour maximiser la satisfaction
                globale.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Optimisation stable
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Vœux prioritaires respectés
                </span>
              </div>
            </div>

            <div className="flex-shrink-0">
              {!showConfirm ? (
                <Button
                  onClick={() => setShowConfirm(true)}
                  disabled={campaign?.statut !== "VERROUILLEE"}
                  className="whitespace-nowrap"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Lancer l&apos;attribution
                </Button>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-xs">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-700">
                      Cette action est irréversible. Les affectations seront
                      calculées et enregistrées.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={handleLaunchAlgorithm}
                      isLoading={launching}
                    >
                      Confirmer
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowConfirm(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {campaign?.statut !== "VERROUILLEE" && (
            <div className="mt-4 bg-surface-100 rounded-lg p-3 text-xs text-gray-500">
              ⓘ L&apos;algorithme ne peut être lancé que lorsque la campagne est
              verrouillée. Rendez-vous dans les{" "}
              <a href="/admin/settings" className="text-primary-600 underline">
                paramètres
              </a>{" "}
              pour changer le statut.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
