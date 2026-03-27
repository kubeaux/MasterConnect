"use client";

import { useAuth } from "@/src/components/providers/AuthProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, Settings } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useEffect } from "react";

const navItems = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projets", icon: BookOpen },
  { href: "/admin/students", label: "Étudiants", icon: Users },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, isLoading, isAdmin, router]);

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
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-surface-100"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
