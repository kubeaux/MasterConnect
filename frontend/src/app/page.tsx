import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import { GraduationCap, BookOpen, ListChecks, CheckCircle, ArrowRight, Users, Shield, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative page-container py-24 md:py-32 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Vos projets de master<br />
            <span className="text-blue-300">commencent ici</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            La plateforme officielle d&apos;attribution des projets de M1 et M2 
            pour l&apos;année universitaire 2025–2026.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-200 text-lg"
          >
            Se connecter à la plateforme
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Section Profils */}
      <section className="page-container py-20">
        <h2 className="font-heading text-3xl font-bold text-center text-gray-900 mb-4">
          Une gestion simplifiée et transparente
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
          Notre plateforme centralise l&apos;ensemble du processus d&apos;attribution des projets pour trois types d&apos;utilisateurs.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: GraduationCap,
              title: "Étudiants",
              desc: "Consultez les projets disponibles, formez vos vœux et suivez votre affectation en temps réel.",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: Users,
              title: "Encadrants",
              desc: "Proposez vos sujets de recherche, définissez vos critères et consultez les candidatures.",
              color: "bg-green-50 text-green-600",
            },
            {
              icon: Shield,
              title: "Administration",
              desc: "Gérez les campagnes, validez les projets et lancez l'algorithme d'attribution optimal.",
              color: "bg-purple-50 text-purple-600",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-surface-200 p-8 text-center shadow-card hover:shadow-card-hover transition-all duration-200">
              <div className={`inline-flex p-4 rounded-2xl ${item.color} mb-5`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section id="demarches" className="bg-surface-50 py-20">
        <div className="page-container">
          <h2 className="font-heading text-3xl font-bold text-center text-gray-900 mb-12">
            Comment ça marche ?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, icon: BookOpen, title: "Découverte", desc: "Explorez le catalogue de projets et filtrez par domaine ou encadrant." },
              { step: 2, icon: ListChecks, title: "Vœux", desc: "Sélectionnez jusqu'à 5 projets et classez-les par ordre de préférence." },
              { step: 3, icon: CheckCircle, title: "Validation", desc: "Validez définitivement vos vœux avant la date limite." },
              { step: 4, icon: BarChart3, title: "Attribution", desc: "L'algorithme optimise l'affectation selon vos préférences et les contraintes." },
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-xl p-6 border border-surface-200 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-700 text-white text-sm font-bold">
                    {item.step}
                  </span>
                  <item.icon className="w-5 h-5 text-primary-500" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-blue-200 py-8">
        <div className="page-container text-center text-sm">
          <p>© 2026 Université Paris Cité — Gestion des Projets de Master</p>
          <div className="flex justify-center gap-6 mt-3">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Contacter le support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}