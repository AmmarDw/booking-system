"use client";

// Minimal JWT auth store + context. Token kept in memory and hydrated from localStorage.
// M2 wires register/login/me against /api/auth/*; guards + redirect-back (FR-2) build on this.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "CONSUMER" | "PROVIDER" | "ADMIN";
export interface AuthUser {
  email: string;
  role: Role;
}

const TOKEN_KEY = "bookit.token";
let inMemoryToken: string | null = null;

export function getToken(): string | null {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window !== "undefined") inMemoryToken = window.localStorage.getItem(TOKEN_KEY);
  return inMemoryToken;
}

export function setToken(token: string | null): void {
  inMemoryToken = token;
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  setSession: (token: string, user: AuthUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // M2: if a token exists, call GET /api/auth/me to hydrate `user`.
    setLoading(false);
  }, []);

  function setSession(token: string, u: AuthUser) {
    setToken(token);
    setUser(u);
  }
  function signOut() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, setSession, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
