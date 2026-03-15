"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!projectName.trim() || !projectId.trim()) {
      setError("Project Name and Project ID are both required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/projects/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: projectName.trim(),
          projectId: projectId.trim().toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Invalid credentials. Please check your Project Name and Project ID."
        );
      }

      sessionStorage.setItem("project_id", data.project.projectId);
      sessionStorage.setItem("project_name", data.project.name);

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid credentials. Please check your Project Name and Project ID."
      );
    } finally {
      setLoading(false);
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    background: "var(--bg-primary)",
  };

  const formStyles: React.CSSProperties = {
    width: "100%",
    maxWidth: "400px",
  };

  const titleStyles: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: 600,
    marginBottom: "8px",
    color: "var(--text-primary)",
    textAlign: "center",
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: "14px",
    color: "var(--text-secondary)",
    marginBottom: "32px",
    textAlign: "center",
  };

  const inputGroupStyles: React.CSSProperties = {
    marginBottom: "16px",
  };

  const labelStyles: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--text-primary)",
    marginBottom: "8px",
  };

  const errorStyles: React.CSSProperties = {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid var(--error)",
    borderRadius: "var(--radius-md)",
    padding: "12px",
    marginBottom: "16px",
    fontSize: "13px",
    color: "var(--error)",
  };

  const backLinkStyles: React.CSSProperties = {
    marginTop: "24px",
    textAlign: "center",
  };

  return (
    <div style={containerStyles}>
      <div style={formStyles}>
        <Card>
          <h1 style={titleStyles}>Access Project</h1>
          <p style={subtitleStyles}>
            Enter your project credentials to continue
          </p>

          {error && <div style={errorStyles}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={inputGroupStyles}>
              <label style={labelStyles} htmlFor="projectName">
                Project Name
              </label>
              <Input
                id="projectName"
                type="text"
                placeholder="e.g., my-app-backend"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>

            <div style={inputGroupStyles}>
              <label style={labelStyles} htmlFor="projectId">
                Project ID
              </label>
              <Input
                id="projectId"
                type="text"
                placeholder="e.g., 9F2XK8A3"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value.toUpperCase())}
                disabled={loading}
                style={{ textTransform: "uppercase", fontFamily: "var(--font-mono)" }}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Access Project"}
            </Button>
          </form>

          <div style={backLinkStyles}>
            <Link
              href="/"
              style={{
                color: "var(--text-secondary)",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
