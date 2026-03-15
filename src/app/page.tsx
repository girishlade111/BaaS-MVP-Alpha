"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const projectId = sessionStorage.getItem("project_id");
    const projectName = sessionStorage.getItem("project_name");
    if (projectId && projectName) {
      router.push("/dashboard");
    }
  }, [router]);

  const containerStyles: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    background: "var(--bg-primary)",
  };

  const heroStyles: React.CSSProperties = {
    textAlign: "center",
    maxWidth: "600px",
    marginBottom: "48px",
  };

  const titleStyles: React.CSSProperties = {
    fontSize: "48px",
    fontWeight: 700,
    marginBottom: "16px",
    background: "linear-gradient(135deg, var(--accent-primary), #00ff88)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: "18px",
    color: "var(--text-secondary)",
    lineHeight: 1.6,
  };

  const actionsStyles: React.CSSProperties = {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  const cardStyles: React.CSSProperties = {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "40px",
    textAlign: "center",
    maxWidth: "400px",
  };

  const cardTitleStyles: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "8px",
    color: "var(--text-primary)",
  };

  const cardDescStyles: React.CSSProperties = {
    fontSize: "14px",
    color: "var(--text-secondary)",
    marginBottom: "24px",
  };

  return (
    <div style={containerStyles}>
      <div style={heroStyles}>
        <h1 style={titleStyles}>DevDB</h1>
        <p style={subtitleStyles}>
          A minimal Backend-as-a-Service platform. Create projects, manage databases, 
          store files, and deploy edge functions — all with your unique project credentials.
        </p>
      </div>

      <div style={actionsStyles}>
        <div style={cardStyles}>
          <h2 style={cardTitleStyles}>New Project</h2>
          <p style={cardDescStyles}>
            Start fresh with a new project. Get instant access credentials.
          </p>
          <Link href="/create">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
        </div>

        <div style={cardStyles}>
          <h2 style={cardTitleStyles}>Existing Project</h2>
          <p style={cardDescStyles}>
            Access your project using your Project Name and Project ID.
          </p>
          <Link href="/login">
            <Button variant="secondary" size="lg">
              Access Project
            </Button>
          </Link>
        </div>
      </div>

      <div style={{ marginTop: "48px", color: "var(--text-muted)", fontSize: "12px" }}>
        <p>No account required. No passwords. Just your project credentials.</p>
      </div>
    </div>
  );
}
