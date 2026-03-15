"use client";

import { CSSProperties } from "react";
import { Sidebar } from "@/components/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <div style={layoutStyles}>
      <Sidebar />
      <main style={mainStyles}>{children}</main>
    </div>
  );
}
