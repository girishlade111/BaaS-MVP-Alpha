"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";

export default function CreateProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    if (name.trim().length > 100) {
      setError("Project name must be 100 characters or less");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      router.push(
        `/credentials?projectId=${encodeURIComponent(data.projectId)}&name=${encodeURIComponent(
          data.name
        )}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
    marginBottom: "24px",
  };

  const labelStyles: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--text-primary)",
    marginBottom: "8px",
  };

  const errorStyles: React.CSSProperties = {
    color: "var(--error)",
    fontSize: "13px",
    marginTop: "8px",
  };

  const backLinkStyles: React.CSSProperties = {
    marginTop: "24px",
    textAlign: "center",
  };

  return (
    <div style={containerStyles}>
      <div style={formStyles}>
        <Card>
          <h1 style={titleStyles}>Create Project</h1>
          <p style={subtitleStyles}>
            Give your project a unique name to get started
          </p>

          <form onSubmit={handleSubmit}>
            <div style={inputGroupStyles}>
              <label style={labelStyles} htmlFor="projectName">
                Project Name
              </label>
              <Input
                id="projectName"
                type="text"
                placeholder="e.g., my-app-backend"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoFocus
              />
              {error && <p style={errorStyles}>{error}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Project"}
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
