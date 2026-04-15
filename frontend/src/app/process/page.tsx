"use client";

import React from 'react';
import { Calendar, Search, FileText, Award, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProcessPage() {
  const settings = {
    submissionStart: "2026-03-01T00:00:00",
    submissionEnd: "2026-03-31T23:59:59",
    wishStart: "2026-04-01T00:00:00",
    wishEnd: "2026-04-15T23:59:59",
  };

  const steps = [
    {
      id: 1,
      title: "Exploration des sujets",
      icon: Search,
      dateStart: settings.submissionStart,
      dateEnd: settings.submissionEnd,
      description: "Dès l'ouverture de la plateforme, consultez le catalogue complet des projets proposés par les enseignants et les partenaires industriels. Utilisez les filtres pour affiner votre recherche par domaine, technologies ou encadrant.",
      status: 'completed'
    },
    {
      id: 2,
      title: "Formulation des vœux",
      icon: FileText,
      dateStart: settings.wishStart,
      dateEnd: settings.wishEnd,
      description: "Sélectionnez jusqu'à 5 projets qui vous intéressent. Classez-les par ordre de préférence. C'est l'étape la plus critique : votre classement influe directement sur l'algorithme d'attribution.",
      status: 'active'
    },
    {
      id: 3,
      title: "Validation & Algorithme",
      icon: Clock,
      dateStart: settings.wishEnd,
      description: "Une fois la période de vœux close, les encadrants valident les profils. Ensuite, un algorithme d'optimisation (basé sur le mariage stable) est lancé pour maximiser la satisfaction globale des étudiants et des encadrants.",
      status: 'pending'
    },
    {
      id: 4,
      title: "Attribution Finale",
      icon: Award,
      description: "Les résultats sont publiés officiellement. Vous recevez une notification avec votre projet attribué et les coordonnées de votre encadrant pour démarrer le travail.",
      status: 'pending'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Démarches et Calendrier</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Comprendre le processus d&apos;attribution pour maximiser vos chances d&apos;obtenir le projet de vos rêves.
        </p>
      </div>

      <div className="space-y-12 relative">
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-200 hidden md:block"></div>

        {steps.map((step, index) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative flex flex-col md:flex-row gap-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="hidden md:flex flex-shrink-0 w-16 h-16 bg-blue-50 rounded-full items-center justify-center border-4 border-white shadow-sm z-10 relative">
              <step.icon className="h-6 w-6 text-blue-600" />
              <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {step.id}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="md:hidden bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{step.id}</span>
                    {step.title}
                </h3>
                {step.dateStart && (
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        <Calendar className="h-3.5 w-3.5 mr-2" />
                        {new Date(step.dateStart).toLocaleDateString()} 
                        {step.dateEnd ? ` - ${new Date(step.dateEnd).toLocaleDateString()}` : ' et après'}
                    </span>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                {step.description}
              </p>
              
              {step.id === 2 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                          <h4 className="font-bold text-amber-800 text-sm">Conseil important</h4>
                          <p className="text-amber-700 text-sm mt-1">
                              Ne classez pas uniquement les projets les plus populaires. Diversifiez vos choix pour garantir une affectation.
                          </p>
                      </div>
                  </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 bg-slate-900 text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Une question sur le processus ?</h2>
        <p className="text-slate-300 mb-8 max-w-xl mx-auto">
          L&apos;administration est disponible pour répondre à vos questions concernant les règles d&apos;attribution ou les cas particuliers.
        </p>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/50">
          Contacter le support administratif
        </button>
      </div>
    </div>
  );
}