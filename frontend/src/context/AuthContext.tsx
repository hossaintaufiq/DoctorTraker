"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  api,
  setAccessToken,
  setOnAuthFailure,
  getStoredSession,
  setStoredSession,
  clearStoredSession,
  getStoredRefreshToken,
} from "@/lib/api";

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

  // Restore session via persistent session token and refresh token on mount
  useEffect(() => {
    let isMounted = true;

    // Immediately restore stored session from localStorage to prevent layout flicker or logout on refresh
    const initialSession = getStoredSession();
    if (initialSession?.token && initialSession?.user) {
      setAccessToken(initialSession.token);
      setUser(initialSession.user);
      setIsAuthenticated(true);
    }

    const restoreSession = async () => {
      try {
        const storedRefresh = getStoredRefreshToken();
        const res = await api.auth.refresh(storedRefresh || undefined);
        if (isMounted) {
          if (res.success && res.data) {
            const authData = res.data as any;
            const newToken = authData.token || initialSession?.token || null;
            const newRefreshToken = authData.refreshToken || storedRefresh;
            const userData: AuthUser = {
              id: authData.user?.id || authData.id || initialSession?.user?.id,
              name: authData.user?.name || authData.name || initialSession?.user?.name || "Doctor Tracker User",
              email: authData.user?.email || authData.email || initialSession?.user?.email,
              role: authData.user?.role || authData.role || initialSession?.user?.role || "admin",
              avatar: authData.user?.avatar || initialSession?.user?.avatar || "",
              token: newToken,
            };
            setAccessToken(newToken);
            setStoredSession({
              token: newToken,
              refreshToken: newRefreshToken,
              user: userData,
            });
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // If refresh fails with 401, check if current access token is still valid via getMe()
            if (initialSession?.token) {
              try {
                const meRes = await api.auth.getMe();
                if (meRes.success && meRes.data) {
                  const meData = meRes.data as any;
                  const userData: AuthUser = {
                    id: meData.id || meData._id || initialSession.user?.id,
                    name: meData.name || initialSession.user?.name,
                    email: meData.email || initialSession.user?.email,
                    role: meData.role || initialSession.user?.role || "admin",
                    avatar: meData.avatar || "",
                    token: initialSession.token,
                  };
                  setUser(userData);
                  setIsAuthenticated(true);
                  return;
                }
              } catch {
                // getMe failed
              }
            }
            // Neither refresh nor stored token worked: clear stale session
            clearStoredSession();
            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch {
        if (isMounted) {
          // In offline / network transient errors, keep user logged in if they have a stored token
          if (!initialSession?.token) {
            clearStoredSession();
            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    setOnAuthFailure(() => {
      clearStoredSession();
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
        const newToken = authData.token || null;
        const newRefreshToken = authData.refreshToken || null;
        const userData: AuthUser = {
          id: authData.id,
          name: authData.name || "Administrator",
          email: authData.email || email,
          role: authData.role || "admin",
          avatar: authData.avatar || "",
          token: newToken,
        };
        setAccessToken(newToken);
        setStoredSession({
          token: newToken,
          refreshToken: newRefreshToken,
          user: userData,
        });
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
    clearStoredSession();
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
