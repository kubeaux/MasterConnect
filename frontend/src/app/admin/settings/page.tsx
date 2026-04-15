"use client";

import { useEffect, useState } from "react";
import { campaignApi } from "@/src/lib/api";
import Card, { CardContent, CardHeader } from "@/src/components/ui/Card";
import CampaignStatusBadge from "@/src/components/features/CampaignStatusBadge";
import Button from "@/src/components/ui/Button";
import {
  Lock,
  Unlock,
  Send,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import type { Campaign } from "@/src/types";
import { formatDate } from "@/src/lib/utils";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadCampaign();
  }, []);

  const loadCampaign = async () => {
    try {
      const { data } = await campaignApi.getCurrent();
      setCampaign(data);
    } catch {
      toast.error("Erreur lors du chargement de la campagne");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const confirm = window.confirm(
      `Êtes-vous sûr de vouloir passer la campagne en "${newStatus}" ? Cette action peut être irréversible.`
    );
    if (!confirm) return;

    setUpdating(true);
    try {
      await campaignApi.updateStatus(newStatus);
      toast.success(`Campagne passée en "${newStatus}"`);
      loadCampaign();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const steps = [
    {
      status: "OUVERTE",
      label: "Ouverte",
      desc: "Les étudiants peuvent soumettre et modifier leurs vœux.",
      icon: Unlock,
      color: "text-green-600 bg-green-50",
      active: campaign?.statut === "OUVERTE",
      done: ["VERROUILLEE", "PUBLIEE"].includes(campaign?.statut || ""),
    },
    {
      status: "VERROUILLEE",
      label: "Verrouillée",
      desc: "Les vœux sont figés. L'algorithme peut être lancé.",
      icon: Lock,
      color: "text-yellow-600 bg-yellow-50",
      active: campaign?.statut === "VERROUILLEE",
      done: ["PUBLIEE"].includes(campaign?.statut || ""),
    },
    {
      status: "PUBLIEE",
      label: "Publiée",
      desc: "Les résultats d'affectation sont visibles par les étudiants.",
      icon: Send,
      color: "text-blue-600 bg-blue-50",
      active: campaign?.statut === "PUBLIEE",
      done: false,
    },
  ];

  return (
    <div className="page-container py-8 max-w-3xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-1">
          Paramètres de campagne
        </h1>
        <p className="text-gray-500 text-sm">
          Configurez les phases de la campagne d&apos;attribution des projets.
        </p>
      </div>

      {/* Statut actuel */}
      {campaign && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Statut actuel</p>
                <CampaignStatusBadge
                  status={campaign.statut as "OUVERTE" | "VERROUILLEE" | "PUBLIEE"}
                />
              </div>
              <div className="text-right text-sm text-gray-500">
                {campaign.date_debut && (
                  <p>Début : {formatDate(campaign.date_debut)}</p>
                )}
                {campaign.date_fin && (
                  <p>Fin : {formatDate(campaign.date_fin)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étapes du processus */}
      <Card>
        <CardHeader>
          <h2 className="font-heading font-semibold text-gray-900">
            Phases de la campagne
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.status}>
                <div
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    step.active
                      ? "border-primary-300 bg-primary-50/50"
                      : step.done
                      ? "border-green-200 bg-green-50/30"
                      : "border-surface-200"
                  }`}
                >
                  {/* Icône */}
                  <div className={`p-2.5 rounded-xl ${step.color}`}>
                    {step.done ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {step.label}
                      </h3>
                      {step.active && (
                        <span className="text-xs bg-primary-700 text-white px-2 py-0.5 rounded-full">
                          En cours
                        </span>
                      )}
                      {step.done && (
                        <span className="text-xs text-green-600">
                          ✓ Terminé
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{step.desc}</p>
                  </div>

                  {/* Action */}
                  {!step.done && !step.active && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleStatusChange(step.status)}
                      isLoading={updating}
                      disabled={
                        // Ne peut verrouiller que si ouvert, publier que si verrouillé
                        (step.status === "VERROUILLEE" &&
                          campaign?.statut !== "OUVERTE") ||
                        (step.status === "PUBLIEE" &&
                          campaign?.statut !== "VERROUILLEE")
                      }
                    >
                      Activer <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>

                {/* Connecteur */}
                {index < steps.length - 1 && (
                  <div className="flex justify-start ml-7 py-1">
                    <div className="w-0.5 h-4 bg-surface-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Avertissement */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-800 font-medium">Attention</p>
          <p className="text-xs text-yellow-700 mt-1">
            Le passage d&apos;une phase à l&apos;autre est irréversible. Assurez-vous que
            tous les vœux ont été soumis avant de verrouiller, et que
            l&apos;algorithme a été lancé avant de publier.
          </p>
        </div>
      </div>
    </div>
  );
}
