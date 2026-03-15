"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function CredentialsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState<string | null>(null);

  const projectId = searchParams.get("projectId");
  const projectName = searchParams.get("name");

  useEffect(() => {
    if (projectId && projectName) {
      sessionStorage.setItem("project_id", projectId);
      sessionStorage.setItem("project_name", projectName);
    } else {
      router.push("/");
    }
  }, [projectId, projectName, router]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  if (!projectId || !projectName) {
    return null;
  }

  const containerStyles: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    background: "var(--bg-primary)",
  };

  const cardStyles: React.CSSProperties = {
    width: "100%",
    maxWidth: "500px",
  };

  const titleStyles: React.CSSProperties = {
    fontSize: "24px",
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

  const credentialBoxStyles: React.CSSProperties = {
    background: "var(--bg-tertiary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "16px",
    marginBottom: "16px",
  };

  const credentialLabelStyles: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "8px",
  };

  const credentialValueStyles: React.CSSProperties = {
    fontSize: "18px",
    fontFamily: "var(--font-mono)",
    color: "var(--accent-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const copyButtonStyles: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: "4px 8px",
    fontSize: "12px",
    borderRadius: "4px",
    transition: "all 0.2s",
  };

  const warningStyles: React.CSSProperties = {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid var(--error)",
    borderRadius: "var(--radius-md)",
    padding: "16px",
    marginBottom: "24px",
  };

  const warningTitleStyles: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--error)",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const warningTextStyles: React.CSSProperties = {
    fontSize: "13px",
    color: "var(--text-secondary)",
    lineHeight: 1.5,
  };

  const buttonStyles: React.CSSProperties = {
    width: "100%",
    marginBottom: "12px",
  };

  return (
    <div style={containerStyles}>
      <Card style={cardStyles}>
        <h1 style={titleStyles}>Project Created!</h1>
        <p style={subtitleStyles}>
          Your new project has been created. Save your credentials below.
        </p>

        <div style={warningStyles}>
          <div style={warningTitleStyles}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Important Warning
          </div>
          <p style={warningTextStyles}>
            Save your <strong>Project ID</strong> now. It will{" "}
            <strong>never be shown again</strong> and cannot be recovered if lost.
            There is no password reset or recovery option.
          </p>
        </div>

        <div style={credentialBoxStyles}>
          <div style={credentialLabelStyles}>Project Name</div>
          <div style={credentialValueStyles}>
            <span>{projectName}</span>
            <button
              style={copyButtonStyles}
              onClick={() => copyToClipboard(projectName, "name")}
            >
              {copied === "name" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div style={credentialBoxStyles}>
          <div style={credentialLabelStyles}>Project ID</div>
          <div style={credentialValueStyles}>
            <span>{projectId}</span>
            <button
              style={copyButtonStyles}
              onClick={() => copyToClipboard(projectId, "id")}
            >
              {copied === "id" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          style={buttonStyles}
          onClick={handleGoToDashboard}
        >
          Go to Dashboard
        </Button>

        <Link href="/" style={{ textDecoration: "none" }}>
          <Button variant="secondary" size="lg" style={{ width: "100%" }}>
            Back to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
}
