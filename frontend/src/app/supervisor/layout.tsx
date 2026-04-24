"use client";

import { useAuth } from "@/src/components/providers/AuthProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderPlus, BookOpen } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useEffect } from "react";

const navItems = [
  { href: "/supervisor", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/supervisor/projects", label: "Mes projets", icon: BookOpen },
  { href: "/supervisor/projects/new", label: "Nouveau projet", icon: FolderPlus },
];

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isSupervisor } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isSupervisor)) {
      router.push("/login");
    }
  }, [user, isLoading, isSupervisor, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">

      <nav className="bg-white border-b border-surface-200">
        <div className="page-container">
          <div className="flex gap-1 overflow-x-auto py-1">
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
