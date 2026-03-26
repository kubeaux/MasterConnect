"use client";

import Link from "next/link";
import { useAuth } from "@/src/components/providers/AuthProvider";
import Button from "@/src/components/ui/Button";
import CampaignStatusBadge from "@/src/components/features/CampaignStatusBadge";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  campaignStatus?: "OUVERTE" | "VERROUILLEE" | "PUBLIEE";
}

export default function Navbar({ campaignStatus }: NavbarProps) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-surface-200 sticky top-0 z-50">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-1.5 bg-primary-700 rounded-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-heading font-bold text-primary-700 text-lg">
                MasterConnect
              </span>
              <span className="hidden sm:block text-[10px] text-gray-400 -mt-1 uppercase tracking-wider">
                Université de Paris
              </span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {!user && (
              <>
                <Link href="/" className="text-sm text-gray-600 hover:text-primary-700 transition-colors">
                  Accueil
                </Link>
                <Link href="/#demarches" className="text-sm text-gray-600 hover:text-primary-700 transition-colors">
                  Démarches
                </Link>
                <Link href="/login">
                  <Button size="sm">Se connecter</Button>
                </Link>
              </>
            )}

            {user && (
              <>
                {campaignStatus && <CampaignStatusBadge status={campaignStatus} />}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.identifiant_universitaire}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </nav>

          {/* Menu mobile */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-surface-200 fade-in">
            {!user ? (
              <div className="flex flex-col gap-3">
                <Link href="/" className="text-sm text-gray-600 py-2">Accueil</Link>
                <Link href="/#demarches" className="text-sm text-gray-600 py-2">Démarches</Link>
                <Link href="/login">
                  <Button className="w-full">Se connecter</Button>
                </Link>
              </div>
            ) : (
              <Button variant="danger" onClick={logout} className="w-full">
                Se déconnecter
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}