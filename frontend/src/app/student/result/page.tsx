"use client";

import React, { useEffect, useState } from "react";
import { Trophy, CheckCircle, Clock, ArrowRight, Loader2, BookOpen } from "lucide-react";
import { assignmentsApi, campaignApi } from "@/src/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

export default function StudentResultPage() {
  const [assignment, setAssignment] = useState<any | null>(null);
  const [isCampaignClosed, setIsCampaignClosed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const campRes = await campaignApi.getCurrent();
      const status = campRes.data?.statut;
      
      if (status === "PUBLIEE" || status === "terminee") {
        setIsCampaignClosed(true);
        const assignRes = await assignmentsApi.getMine();
        const rawData = assignRes.data?.results || assignRes.data;
        if (Array.isArray(rawData) && rawData.length > 0) {
          setAssignment(rawData[0]);
        } else if (!Array.isArray(rawData) && rawData?.id) {
          setAssignment(rawData);
        }
      }
    } catch (error) {
      toast.error("Impossible de récupérer vos résultats.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
          <Trophy className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Résultat d&apos;Affectation</h1>
        <p className="text-slate-600 mt-2 max-w-xl mx-auto">
          Découvrez le projet qui vous a été attribué par l&apos;algorithme d&apos;optimisation pour cette année universitaire.
        </p>
      </div>

      {!isCampaignClosed ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <Clock className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-amber-900 mb-2">Campagne en cours</h2>
          <p className="text-amber-800 mb-6">
            L&apos;algorithme d&apos;affectation n&apos;a pas encore été exécuté ou les résultats ne sont pas encore publiés par l&apos;administration.
          </p>
          <Link href="/student" className="inline-flex items-center gap-2 bg-white text-amber-700 font-medium px-6 py-2.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors shadow-sm">
            Retour au tableau de bord
          </Link>
        </div>
      ) : assignment ? (
        <div className="bg-white border border-green-200 shadow-lg rounded-2xl p-8 max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
          <div className="flex items-center gap-4 mb-6">
            <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
            <h2 className="text-2xl font-bold text-slate-900">Félicitations !</h2>
          </div>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Projet Attribué</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {assignment.projet?.titre || "Titre du projet indisponible"}
            </h3>
            <p className="text-slate-600 text-sm">
              {assignment.projet?.description || "Aucune description détaillée."}
            </p>
          </div>
          <div className="flex justify-center">
             <Link href="/student" className="inline-flex items-center gap-2 bg-slate-900 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
               Tableau de bord <ArrowRight className="h-4 w-4" />
             </Link>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Aucune affectation trouvée</h2>
          <p className="text-slate-600 mb-6">
            Vous n&apos;avez pas reçu d&apos;affectation pour cette campagne. Veuillez contacter l&apos;administration.
          </p>
          <Link href="/student" className="inline-flex items-center gap-2 bg-white text-slate-700 font-medium px-6 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm">
            Retour
          </Link>
        </div>
      )}
    </div>
  );
}