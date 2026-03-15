"use client";

import { CSSProperties, useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { Card, Button, Input, Badge, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, Modal, useToast } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectInfo {
  name: string;
  projectId: string;
  createdAt: string;
}

export default function SettingsPage() {
  const { addToast } = useToast();
  const { project, updateProjectName, logout } = useAuth();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    async function fetchProjectInfo() {
      try {
        const res = await api.get("/api/projects/me");
        if (res.ok) {
          const data = await res.json();
          setProjectInfo(data);
          setNewName(data.name);
        }
      } catch (error) {
        console.error("Failed to fetch project info:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectInfo();
  }, []);

  const handleSaveName = async () => {
    if (!newName.trim() || newName === projectInfo?.name) {
      setEditingName(false);
      return;
    }

    setSavingName(true);
    try {
      const res = await api.patch("/api/projects/me", { name: newName.trim() });
      if (res.ok) {
        const data = await res.json();
        setProjectInfo({ ...projectInfo!, name: data.name });
        updateProjectName(data.name);
        addToast("Project name updated", "success");
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to update name", "error");
      }
    } catch (error) {
      addToast("Failed to update name", "error");
    } finally {
      setSavingName(false);
      setEditingName(false);
    }
  };

  const handleDeleteProject = async () => {
    addToast("Project deletion is not available in the MVP", "info");
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    addToast(message, "success");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "0 32px 32px",
          maxWidth: "900px",
          margin: "0 auto",
          color: "var(--text-secondary)",
        }}
      >
        Loading...
      </div>
    );
  }

  const containerStyles: CSSProperties = {
    padding: "0 32px 32px",
    maxWidth: "900px",
    margin: "0 auto",
  };

  const sectionStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "32px",
  };

  const rowStyles: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid var(--border)",
  };

  return (
    <div style={containerStyles} className="page-transition">
      <Header
        title="Settings"
        description="Manage your project configuration"
      />

      {/* Project Info */}
      <section style={sectionStyles}>
        <h2 style={{ fontSize: "18px", margin: 0 }}>Project Information</h2>
        <Card>
          <div style={rowStyles}>
            <div>
              <div style={{ fontWeight: 500, marginBottom: "4px" }}>Project Name</div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Your project display name</div>
            </div>
            {editingName ? (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  autoFocus
                  style={{ width: "200px" }}
                />
                <Button variant="primary" size="sm" onClick={handleSaveName} disabled={savingName}>
                  {savingName ? "Saving..." : "Save"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingName(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent-primary)",
                  cursor: "pointer",
                }}
                onClick={() => setEditingName(true)}
              >
                {projectInfo?.name}
              </div>
            )}
          </div>
          <div style={rowStyles}>
            <div>
              <div style={{ fontWeight: 500, marginBottom: "4px" }}>Project ID</div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Unique project identifier (cannot be changed)</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--text-secondary)" }}>
                {projectInfo?.projectId}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(projectInfo?.projectId || "", "Project ID copied")}
              >
                Copy
              </Button>
            </div>
          </div>
          <div style={{ ...rowStyles, borderBottom: "none" }}>
            <div>
              <div style={{ fontWeight: 500, marginBottom: "4px" }}>Created</div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Project creation date</div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
              {projectInfo?.createdAt ? formatDate(projectInfo.createdAt) : "Unknown"}
            </div>
          </div>
        </Card>
      </section>

      {/* Session Info */}
      <section style={sectionStyles}>
        <h2 style={{ fontSize: "18px", margin: 0 }}>Session</h2>
        <Card>
          <div style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: "4px" }}>Active Session</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Your credentials are stored in browser sessionStorage
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div style={{ marginTop: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
              Session is cleared when you close the browser tab.
            </div>
            <div style={{ marginTop: "16px" }}>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Danger Zone */}
      <section style={sectionStyles}>
        <h2 style={{ fontSize: "18px", margin: 0, color: "var(--error)" }}>Danger Zone</h2>
        <Card style={{ border: "1px solid var(--error)" }}>
          <div style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 500, color: "var(--error)", marginBottom: "4px" }}>
                  Delete Project
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Permanently delete this project and all its data
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteProject}
              >
                Delete Project
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
