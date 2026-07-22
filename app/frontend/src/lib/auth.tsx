"use client";

// JWT auth store + context. Token kept in memory and hydrated from localStorage.
// Wires POST /api/auth/register, POST /api/auth/login, GET /api/auth/me (M2).

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, ApiError } from "./api";

export type Role = "CONSUMER" | "PROVIDER" | "ADMIN";
export interface AuthUser {
  email: string;
  role: Role;
  fullName: string | null;
}

interface AuthResponse {
  token: string | null;
  email: string;
  role: Role;
  fullName: string | null;
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
  login: (email: string, password: string) => Promise<void>;
  // fullName is optional and there is deliberately no `role` param — public sign-up always
  // creates a CONSUMER (FR-16); the backend ignores any role sent anyway.
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toUser(res: AuthResponse): AuthUser {
  return { email: res.email, role: res.role, fullName: res.fullName };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const res = await api<AuthResponse>("/api/auth/me");
        if (!cancelled) setUser(toUser(res));
      } catch {
        // Expired/invalid token — clear it silently.
        setToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email: string, password: string) {
    const res = await api<AuthResponse>("/api/auth/login", { method: "POST", body: { email, password } });
    setToken(res.token);
    setUser(toUser(res));
  }

  async function register(email: string, password: string, fullName?: string) {
    const res = await api<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: { email, password, fullName },
    });
    setToken(res.token);
    setUser(toUser(res));
  }

  function signOut() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export { ApiError };
