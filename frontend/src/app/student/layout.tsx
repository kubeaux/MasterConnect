"use client";

import { useAuth } from "@/src/components/providers/AuthProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, Heart, Trophy } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useEffect } from "react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isStudent } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isStudent)) {
      router.push("/login");
    }
  }, [user, isLoading, isStudent, router]);

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

      {/* Contenu */}
      {children}
    </div>
  );
}