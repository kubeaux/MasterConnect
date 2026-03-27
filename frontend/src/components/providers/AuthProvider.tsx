"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/src/lib/api";
import type { User } from "@/src/types";

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (identifiant: string, password: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      identifiant_universitaire: identifiant,
      mot_de_passe: password,
      username: identifiant, 
      password: password
    };
    const { data } = await authApi.login(payload);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loginData = data as any;
    const token = loginData.access || loginData.token;

    const userData = loginData.user || {
      id: 1,
      identifiant_universitaire: identifiant,
      email: `${identifiant}@univ.paris.fr`,
      role: "etudiant", 
      date_creation: new Date().toISOString()
    };

    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", loginData.refresh || token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    window.location.href = "/student";
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