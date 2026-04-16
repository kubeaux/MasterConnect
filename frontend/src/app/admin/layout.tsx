"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { href: '/admin', label: 'Vue d\'ensemble' },
    { href: '/admin/projects', label: 'Projets' },
    { href: '/admin/students', label: 'Étudiants' },
    { href: '/admin/settings', label: 'Paramètres' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
          <p className="text-slate-600">Gestion de la campagne 2025-2026</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-8 w-fit">
        {tabs.map(tab => {
          const isActive = pathname === tab.href;
          
          return (
            <Link 
              key={tab.href} 
              href={tab.href}
              className={clsx(
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <main className="fade-in">
        {children}
      </main>
    </div>
  );
}