"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, setAccessToken, setOnAuthFailure } from "@/lib/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "staff" | string;
  avatar?: string;
  token?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Restore session via httpOnly refresh token on mount
  useEffect(() => {
    // Purge any stale legacy localStorage items
    localStorage.removeItem("medcare_theme");
    localStorage.removeItem("medcare_token");
    localStorage.removeItem("medcare_user");

    let isMounted = true;

    const restoreSession = async () => {
      try {
        const res = await api.auth.refresh();
        if (isMounted) {
          if (res.success && res.data) {
            const authData = res.data as any;
            setAccessToken(authData.token || null);
            setUser({
              id: authData.user?.id || authData.id,
              name: authData.user?.name || authData.name || "Doctor Tracker User",
              email: authData.user?.email || authData.email,
              role: authData.user?.role || authData.role || "admin",
              avatar: authData.user?.avatar || "",
              token: authData.token,
            });
            setIsAuthenticated(true);
          } else {
            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch {
        if (isMounted) {
          setAccessToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    setOnAuthFailure(() => {
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    });

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password?: string) => {
    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.data) {
        const authData = res.data as any;
        setAccessToken(authData.token || null);
        const userData: AuthUser = {
          id: authData.id,
          name: authData.name || "Administrator",
          email: authData.email || email,
          role: authData.role || "admin",
          avatar: authData.avatar || "",
          token: authData.token,
        };
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
      return {
        success: false,
        message: res.message || "Invalid work email or password.",
      };
    } catch {
      return {
        success: false,
        message: "Network error during authentication.",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore network errors on logout
    }
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
