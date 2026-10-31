"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { decodeJwt } from "jose";
import { useRouter } from "next/navigation";

interface DecodedToken {
  sub: string;
  roles: string[];
  permissions: string[];
  exp: number;
}

interface AuthContextType {
  user: DecodedToken | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: (redirect?: boolean) => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "@imolakaya:token";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const router = useRouter();

  const logout = (redirect: boolean = false) => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    if (redirect) router.push("/proprietaire/connexion");
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const decoded = decodeJwt<DecodedToken>(token);
      if (decoded.exp * 1000 < Date.now()) {
        // Silencieux : pas de redirection forcée
        logout(false);
      } else {
        setUser(decoded);
      }
    } catch {
      logout(false);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    const decoded = decodeJwt<DecodedToken>(token);
    setUser(decoded);
  };

  const hasRole = (role: string) => user?.roles?.includes(role) || false;

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.permissions?.includes("*")) return true;
    return user.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, hasRole, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};