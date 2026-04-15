"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1699787592432-8b54a9a1a868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwYnVpbGRpbmclMjBmcmFuY2UlMjBleHRlcmlvcnxlbnwxfHx8fDE3NzAzOTA1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080" 
            alt="University Building" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0f172a]/80 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Vos projets de master <br/>
              <span className="text-blue-400">commencent ici</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-light">
              La plateforme officielle d&apos;attribution des projets de fin d&apos;études pour l&apos;année universitaire 2025-2026.
            </p>
            
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transform hover:-translate-y-1"
            >
              Se connecter à la plateforme
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 pt-8 border-t border-white/10"
          >
            <figure>
              <blockquote className="text-lg italic text-gray-300 font-serif">
                « L&apos;excellence académique se construit par la recherche et l&apos;innovation. »
              </blockquote>
              <figcaption className="mt-2 text-sm text-blue-300 uppercase tracking-widest font-semibold">
                — Le Doyen de la Faculté
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Une gestion simplifiée et transparente</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Notre plateforme centralise l&apos;ensemble du processus d&apos;attribution des projets pour garantir l&apos;équité et simplifier les démarches administratives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: BookOpen,
                title: "Pour les Étudiants",
                desc: "Consultez le catalogue complet des projets, filtrez par domaine d'intérêt et classez vos vœux par ordre de préférence."
              },
              {
                icon: Users,
                title: "Pour les Encadrants",
                desc: "Proposez vos sujets de recherche, suivez les candidatures et validez les profils les plus adaptés à vos projets."
              },
              {
                icon: CheckCircle,
                title: "Pour l'Administration",
                desc: "Supervisez le processus d'attribution, gérez les cas particuliers et validez les affectations finales en un clic."
              }
            ].map((item, index) => (
              <div key={index} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white" id="process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">Comment ça marche ?</h2>
            <p className="mt-4 text-slate-400">Le processus d&apos;attribution en 4 étapes clés</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-700 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { step: "1", title: "Découverte", desc: "Exploration des sujets disponibles dès l'ouverture." },
                { step: "2", title: "Vœux", desc: "Classement des projets par ordre de préférence." },
                { step: "3", title: "Validation", desc: "Examen des candidatures par les encadrants." },
                { step: "4", title: "Attribution", desc: "Publication officielle des affectations finales." }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-blue-500 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-slate-950 py-12 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-4">&copy; 2026 Université de Paris. Tous droits réservés.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Support technique</a>
          </div>
        </div>
      </footer>
    </div>
  );
}