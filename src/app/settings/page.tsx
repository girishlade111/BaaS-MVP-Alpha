"use client";

import { CSSProperties, useState } from "react";
import { Header } from "@/components/layout";
import { Card, Button, Input, Badge, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, Modal, useToast } from "@/components/ui";

export default function SettingsPage() {
  const { addToast } = useToast();

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

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    addToast(message, "success");
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
            <div style={{ fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>
              DevDB Project
            </div>
          </div>
          <div style={rowStyles}>
            <div>
              <div style={{ fontWeight: 500, marginBottom: "4px" }}>Project ID</div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Unique project identifier</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-secondary)" }}>
                prj_abc123xyz789
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("prj_abc123xyz789", "Project ID copied")}
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
              January 15, 2024
            </div>
          </div>
        </Card>
      </section>

      {/* Database Connection */}
      <section style={sectionStyles}>
        <h2 style={{ fontSize: "18px", margin: 0 }}>Database Connection</h2>
        <Card>
          <div style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: "4px" }}>Connection String</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  PostgreSQL connection URL
                </div>
              </div>
              <Badge variant="success">Connected</Badge>
            </div>
            <div
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <code>postgresql://user:****@db.devdb.io:5432/devdb_project</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    "postgresql://user:password@db.devdb.io:5432/devdb_project",
                    "Connection string copied"
                  )
                }
              >
                Copy
              </Button>
            </div>
            <div style={{ marginTop: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
              ⚠️ Never share your connection string publicly. Rotate it if exposed.
            </div>
          </div>
        </Card>
      </section>

      {/* API Keys */}
      <section style={sectionStyles}>
        <h2 style={{ fontSize: "18px", margin: 0 }}>API Keys</h2>
        <Card>
          <div style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <div style={{ fontWeight: 500 }}>Service Role Key</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Full access API key - keep this secret
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => addToast("New API key generated", "success")}
              >
                Regenerate
              </Button>
            </div>
            <div
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <code>sk_test_abcdefghijklmnopqrstuvwxyz123456</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyToClipboard("sk_test_abcdefghijklmnopqrstuvwxyz123456", "API key copied")
                }
              >
                Copy
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Environment Variables */}
      <section style={sectionStyles}>
        <h2 style={{ fontSize: "18px", margin: 0 }}>Environment Variables</h2>
        <Card padding="none">
          <Table>
            <TableHeader>
              <TableHeaderCell>Key</TableHeaderCell>
              <TableHeaderCell>Value</TableHeaderCell>
              <TableHeaderCell align="right">Actions</TableHeaderCell>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>
                    DATABASE_URL
                  </span>
                </TableCell>
                <TableCell>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                    postgresql://****
                  </span>
                </TableCell>
                <TableCell align="right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>
                    STORAGE_BUCKET
                  </span>
                </TableCell>
                <TableCell>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                    devdb-files
                  </span>
                </TableCell>
                <TableCell align="right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>
                    MAX_UPLOAD_SIZE
                  </span>
                </TableCell>
                <TableCell>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                    10MB
                  </span>
                </TableCell>
                <TableCell align="right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div style={{ padding: "16px" }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => addToast("Add variable modal coming soon", "info")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Variable
            </Button>
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
                onClick={() => {
                  if (confirm("Are you sure? This action cannot be undone.")) {
                    addToast("Project deletion coming soon", "info");
                  }
                }}
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
