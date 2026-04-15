import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/src/components/providers/AuthProvider";
import Navbar from "@/src/components/layout/Navbar"; // <-- 1. Import de la Navbar
import "./globals.css";

export const metadata: Metadata = {
  title: "MasterConnect — Université Paris Cité",
  description: "Plateforme de gestion et attribution des projets Master",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {/* 2. La Navbar est maintenant globale et protégera toutes les pages */}
          <Navbar /> 
          
          {/* Le contenu spécifique de chaque page viendra s'injecter ici */}
          <main>
            {children}
          </main>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}