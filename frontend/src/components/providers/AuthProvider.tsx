"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/src/lib/api";
import type { User, LoginResponse } from "@/src/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifiant: string, password: string) => Promise<void>;
  logout: () => void;
  isStudent: boolean;
  isSupervisor: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (identifiant: string, password: string) => {
    const { data } = await authApi.login({
      identifiant_universitaire: identifiant,
      mot_de_passe: password,
    });

    const loginData = data as LoginResponse;
    localStorage.setItem("access_token", loginData.access);
    localStorage.setItem("refresh_token", loginData.refresh);
    localStorage.setItem("user", JSON.stringify(loginData.user));
    setUser(loginData.user);

    // Rediriger selon le rôle
    switch (loginData.user.role) {
      case "etudiant":
        router.push("/student");
        break;
      case "encadrant":
        router.push("/supervisor");
        break;
      case "administrateur":
        router.push("/admin");
        break;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isStudent: user?.role === "etudiant",
        isSupervisor: user?.role === "encadrant",
        isAdmin: user?.role === "administrateur",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}