"use client";

import { CSSProperties, useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { Card, Button, Badge, useToast } from "@/components/ui";

interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  executionTime: number;
  rowCount: number;
}

interface QueryHistoryItem {
  id: string;
  query: string;
  executedAt: string;
  duration: number;
  success: boolean;
}

const sampleQueries = [
  "SELECT * FROM users LIMIT 10;",
  "SELECT COUNT(*) FROM orders;",
  "SELECT * FROM products WHERE price > 100;",
];

export default function SQLPage() {
  const { addToast } = useToast();
  const [query, setQuery] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);

  const containerStyles: CSSProperties = {
    padding: "0 32px 32px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const contentStyles: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: "20px",
  };

  const editorContainerStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  const editorStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const textareaStyles: CSSProperties = {
    width: "100%",
    minHeight: "200px",
    background: "var(--bg-primary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "16px",
    color: "var(--text-primary)",
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
  };

  const toolbarStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  };

  const sampleQueriesStyles: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px",
  };

  const runQuery = async () => {
    if (!query.trim()) {
      addToast("Please enter a SQL query", "error");
      return;
    }

    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/sql/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Query execution failed");
      }

      setResult(data);
      setHistory((prev) => [
        {
          id: Date.now().toString(),
          query: query.trim(),
          executedAt: "Just now",
          duration: data.executionTime || 0,
          success: true,
        },
        ...prev,
      ]);
      addToast("Query executed successfully", "success");
    } catch (err: any) {
      setError(err.message || "Failed to execute query. Please check your SQL syntax.");
      setHistory((prev) => [
        {
          id: Date.now().toString(),
          query: query.trim(),
          executedAt: "Just now",
          duration: 0,
          success: false,
        },
        ...prev,
      ]);
      addToast("Query execution failed", "error");
    } finally {
      setIsRunning(false);
    }
  };

  const loadSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
  };

  if (isRunning) {
    return (
      <div style={containerStyles} className="page-transition">
        <Header
          title="SQL Runner"
          description="Execute raw SQL queries against your database"
        />
        <div className="animate-pulse" style={{ padding: "40px", textAlign: "center" }}>
          Executing query...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles} className="page-transition">
      <Header
        title="SQL Runner"
        description="Execute raw SQL queries against your database"
      />

      <div style={contentStyles}>
        {/* Main Editor Area */}
        <div style={editorContainerStyles}>
          <Card style={editorStyles}>
            <div style={toolbarStyles}>
              <label>New Query</label>
              <div style={{ display: "flex", gap: "12px" }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setQuery("")}
                >
                  Clear
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={runQuery}
                  loading={isRunning}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Run Query
                </Button>
              </div>
            </div>

            <textarea
              style={textareaStyles}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here...&#10;&#10;Examples:&#10;SELECT * FROM users;&#10;SELECT COUNT(*) FROM orders;&#10;INSERT INTO products (name, price) VALUES ('Widget', 9.99);"
              spellCheck={false}
            />

            <div>
              <label style={{ fontSize: "11px" }}>Sample Queries</label>
              <div style={sampleQueriesStyles}>
                {sampleQueries.map((sample, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => loadSampleQuery(sample)}
                    style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}
                  >
                    {sample.length > 40 ? sample.substring(0, 40) + "..." : sample}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Results */}
          {error && (
            <Card
              style={{
                borderLeft: "3px solid var(--error)",
                background: "var(--error-bg)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--error)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>{error}</span>
              </div>
            </Card>
          )}

          {result && (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px" }}>Results</h3>
                  <Badge variant="success">{result.rowCount} rows</Badge>
                  <Badge variant="info">{result.executionTime}ms</Badge>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {result.columns.map((col) => (
                        <th
                          key={col}
                          style={{
                            padding: "12px",
                            textAlign: "left",
                            color: "var(--text-secondary)",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            fontSize: "11px",
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: "1px solid var(--border)",
                          background: index % 2 === 0 ? "transparent" : "var(--bg-tertiary)",
                        }}
                      >
                        {result.columns.map((col) => (
                          <td key={col} style={{ padding: "12px", color: "var(--text-primary)" }}>
                            {typeof row[col] === "object" ? JSON.stringify(row[col]) : String(row[col] ?? "NULL")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Query History Sidebar */}
        <Card>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px" }}>Query History</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {history.length === 0 ? (
              <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "20px" }}>
                No queries yet
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setQuery(item.query)}
                  style={{
                    padding: "12px",
                    background: "var(--bg-tertiary)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--border)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--bg-tertiary)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <Badge variant={item.success ? "success" : "error"} style={{ fontSize: "10px" }}>
                      {item.success ? "Success" : "Failed"}
                    </Badge>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.executedAt}</span>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.query}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                    {item.duration}ms
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
