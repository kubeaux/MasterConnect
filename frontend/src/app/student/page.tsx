"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/components/providers/AuthProvider";
import { wishesApi, campaignApi, assignmentsApi } from "@/src/lib/api";
import KpiCard from "@/src/components/features/KpiCard";
import Card, { CardContent } from "@/src/components/ui/Card";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import {
  Heart,
  BookOpen,
  Clock,
  Trophy,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import type { Wish, Campaign, Assignment } from "@/src/types";
import toast from "react-hot-toast";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [wishRes, campRes] = await Promise.all([
        wishesApi.getMine(),
        campaignApi.getCurrent(),
      ]);
      
      let rawWishes = wishRes.data?.results || wishRes.data;
      if (!Array.isArray(rawWishes)) rawWishes = [];
      
      const myWishes = rawWishes.filter((w: any) => 
        w.student === user?.id || w.student?.id === user?.id || !w.student
      );
      setWishes(myWishes);
      
      setCampaign(campRes.data);

      if (campRes.data?.statut === "PUBLIEE") {
        try {
          const assignRes = await assignmentsApi.getMine();
          const assignData = assignRes.data?.results || assignRes.data;
          setAssignment(Array.isArray(assignData) ? assignData[0] : assignData);
        } catch {
        }
      }
    } catch {
      toast.error("Erreur lors du chargement du tableau de bord");
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return "—";
    const statusMap: Record<string, string> = {
      "OUVERTE": "Ouverte",
      "VERROUILLEE": "Verrouillée",
      "PUBLIEE": "Publiée",
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const isOpen = campaign?.statut === "OUVERTE";
  const isPublished = campaign?.statut === "PUBLIEE";

  return (
    <div className="page-container py-8 fade-in">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Bonjour{user ? `, ${user.username}` : ""} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Voici un résumé de votre campagne d&apos;attribution de projets.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Mes vœux"
          value={`${wishes.length} / 5`}
          icon={Heart}
          color="blue"
        />
        <KpiCard
          title="Statut campagne"
          value={formatStatus(campaign?.statut)}
          icon={Clock}
          color={isOpen ? "green" : isPublished ? "blue" : "yellow"}
        />
        <KpiCard
          title="Date limite"
          value={
            campaign?.date_fin
              ? new Date(campaign.date_fin).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })
              : "—"
          }
          icon={AlertTriangle}
          color="yellow"
        />
        <KpiCard
          title="Affectation"
          value={assignment ? "Publiée" : "En attente"}
          icon={Trophy}
          color={assignment ? "green" : "red"}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-gray-900 mb-1">
                  Explorer les projets
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Parcourez le catalogue de projets disponibles et ajoutez-les à
                  votre liste de vœux.
                </p>
                <Link href="/student/catalog">
                  <Button size="sm">
                    Voir les projets <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-gray-900 mb-1">
                  Gérer mes vœux
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {wishes.length === 0
                    ? "Vous n'avez pas encore de vœux. Commencez par explorer les projets."
                    : `Vous avez ${wishes.length} vœu${wishes.length > 1 ? "x" : ""}. Classez-les par ordre de préférence.`}
                </p>
                <Link href="/student/wishes">
                  <Button size="sm" variant="secondary">
                    Mes vœux <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {assignment && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading font-semibold text-green-800 mb-1">
                Votre projet a été attribué !
              </h3>
              <p className="text-green-700">
                <strong>{(assignment as any).projet?.titre || (assignment as any).project?.title || "Consultez les détails de votre affectation"}</strong>
              </p>
              <Link
                href="/student/result"
                className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800 mt-2"
              >
                Voir les détails <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}