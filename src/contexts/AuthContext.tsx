"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Project {
  name: string;
  projectId: string;
}

interface AuthContextType {
  project: Project | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (projectName: string, projectId: string) => void;
  logout: () => void;
  updateProjectName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_PROJECT_ID = "project_id";
const STORAGE_KEY_PROJECT_NAME = "project_name";
const AUTH_COOKIE = "baas_auth";

async function setAuthCookie(value: string) {
  try {
    await fetch("/api/auth/cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
  } catch {
    document.cookie = `${AUTH_COOKIE}=${value}; path=/`;
  }
}

async function clearAuthCookie() {
  try {
    await fetch("/api/auth/cookie", {
      method: "DELETE",
    });
  } catch {
    document.cookie = `${AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedProjectId = sessionStorage.getItem(STORAGE_KEY_PROJECT_ID);
    const storedProjectName = sessionStorage.getItem(STORAGE_KEY_PROJECT_NAME);

    if (storedProjectId && storedProjectName) {
      setProject({
        projectId: storedProjectId,
        name: storedProjectName,
      });
    }
    setIsLoading(false);
  }, []);

  const login = (projectName: string, projectId: string) => {
    sessionStorage.setItem(STORAGE_KEY_PROJECT_ID, projectId);
    sessionStorage.setItem(STORAGE_KEY_PROJECT_NAME, projectName);
    setProject({ projectId, name: projectName });
    setAuthCookie("authenticated");
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY_PROJECT_ID);
    sessionStorage.removeItem(STORAGE_KEY_PROJECT_NAME);
    setProject(null);
    clearAuthCookie();
  };

  const updateProjectName = (name: string) => {
    if (project) {
      sessionStorage.setItem(STORAGE_KEY_PROJECT_NAME, name);
      setProject({ ...project, name });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        project,
        isAuthenticated: !!project,
        isLoading,
        login,
        logout,
        updateProjectName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
