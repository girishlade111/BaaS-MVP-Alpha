"use client";

import { CSSProperties, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
          color: "var(--text-secondary)",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={layoutStyles}>
      <Sidebar />
      <main style={mainStyles}>{children}</main>
    </div>
  );
}

const layoutStyles: CSSProperties = {
  display: "flex",
  minHeight: "100vh",
};

const mainStyles: CSSProperties = {
  flex: 1,
  marginLeft: "var(--sidebar-width)",
  minHeight: "100vh",
  background: "var(--bg-primary)",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthCheck>{children}</AuthCheck>
    </AuthProvider>
  );
}
