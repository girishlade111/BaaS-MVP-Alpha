"use client";

import { CSSProperties, useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { Card, Button, Badge, Modal, Input, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, useToast } from "@/components/ui";

interface EdgeFunction {
  id: string;
  name: string;
  code: string;
  status: "deployed" | "error";
  createdAt: string;
  lastInvoked?: string;
  logs?: FunctionLog[];
}

interface FunctionLog {
  id: string;
  invokedAt: string;
  duration: number;
  success: boolean;
  response: any;
}

export default function FunctionsPage() {
  const { addToast } = useToast();
  const [functions, setFunctions] = useState<EdgeFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFunction, setSelectedFunction] = useState<EdgeFunction | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [testInput, setTestInput] = useState('{\n  "key": "value"\n}');
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    async function fetchFunctions() {
      try {
        const res = await fetch("/api/functions");
        const data = await res.json();
        setFunctions(data);
      } catch (error) {
        console.error("Failed to fetch functions:", error);
        addToast("Failed to load functions", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchFunctions();
  }, [addToast]);

  if (loading) {
    return (
      <div style={{ padding: "0 32px 32px", maxWidth: "1400px", margin: "0 auto" }} className="page-transition">
        <Header
          title="Edge Functions"
          description="Deploy and manage serverless functions"
        />
        <div className="animate-pulse" style={{ padding: "40px", textAlign: "center" }}>
          Loading functions...
        </div>
      </div>
    );
  }

  const containerStyles: CSSProperties = {
    padding: "0 32px 32px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const gridStyles: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  };

  const handleCreateFunction = async (name: string, code: string) => {
    try {
      const res = await fetch("/api/functions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, code }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to create function");
      }
      
      const newFunction = await res.json();
      setFunctions([newFunction, ...functions]);
      addToast(`Function "${name}" created`, "success");
    } catch (error) {
      addToast("Failed to create function", "error");
    }
  };

  const handleDeploy = async (functionId: string, code: string) => {
    try {
      const res = await fetch(`/api/functions/${functionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, status: "deployed" }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to deploy function");
      }
      
      const updatedFunction = await res.json();
      setFunctions(functions.map(f => f.id === functionId ? updatedFunction : f));
      addToast("Function deployed successfully", "success");
    } catch (error) {
      addToast("Failed to deploy function", "error");
    }
  };

  const handleDelete = async (functionId: string, functionName: string) => {
    if (confirm(`Are you sure you want to delete function "${functionName}"?`)) {
      try {
        const res = await fetch(`/api/functions/${functionId}`, {
          method: "DELETE",
        });
        
        if (!res.ok) {
          throw new Error("Failed to delete function");
        }
        
        setFunctions(functions.filter(f => f.id !== functionId));
        setSelectedFunction(null);
        addToast("Function deleted", "success");
      } catch (error) {
        addToast("Failed to delete function", "error");
      }
    }
  };

  const handleInvoke = async () => {
    if (!selectedFunction) return;
    
    try {
      const res = await fetch(`/api/functions/${selectedFunction.id}/invoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: testInput }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to invoke function");
      }
      
      const result = await res.json();
      setTestResult(result);
      addToast("Function invoked successfully", "success");
    } catch (error) {
      addToast("Failed to invoke function", "error");
    }
  };

  return (
    <div style={containerStyles} className="page-transition">
      <Header
        title="Edge Functions"
        description="Deploy and manage serverless functions"
        actions={
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Function
          </Button>
        }
      />

      {/* Functions Grid */}
      <div style={gridStyles}>
        {functions.map((fn) => (
          <Card
            key={fn.id}
            hover
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedFunction(fn);
              setIsEditorOpen(true);
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3
                  style={{
                    margin: "0 0 4px",
                    fontSize: "16px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--accent-primary)",
                  }}
                >
                  {fn.name}
                </h3>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Created {fn.createdAt}
                </div>
              </div>
              <Badge variant={fn.status === "deployed" ? "success" : "error"}>
                {fn.status}
              </Badge>
            </div>

            <div
              style={{
                background: "var(--bg-primary)",
                borderRadius: "var(--radius-md)",
                padding: "12px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-secondary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fn.code.split("\n")[0] || fn.code.substring(0, 50)}...
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {fn.lastInvoked ? `Last invoked: ${fn.lastInvoked}` : "Never invoked"}
              </div>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Function Editor Modal */}
      {isEditorOpen && selectedFunction && (
        <FunctionEditorModal
          function={selectedFunction}
          onClose={() => {
            setIsEditorOpen(false);
            setSelectedFunction(null);
          }}
          onDeploy={(code) => handleDeploy(selectedFunction.id, code)}
          onDelete={() => handleDelete(selectedFunction.id, selectedFunction.name)}
          onInvoke={handleInvoke}
          logs={selectedFunction.logs || []}
        />
      )}

      {/* Create Function Modal */}
      <CreateFunctionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateFunction}
      />
    </div>
  );
}

interface FunctionEditorModalProps {
  function: EdgeFunction;
  onClose: () => void;
  onDeploy: (code: string) => void;
  onDelete: () => void;
  onInvoke: () => void;
  logs?: FunctionLog[];
}

function FunctionEditorModal({
  function: fn,
  onClose,
  onDeploy,
  onDelete,
  onInvoke,
  logs = [],
}: FunctionEditorModalProps) {
  const [code, setCode] = useState(fn.code);
  const [activeTab, setActiveTab] = useState<"code" | "logs">("code");
  const [testInput, setTestInput] = useState('{\n  "key": "value"\n}');
  const [testResult, setTestResult] = useState<any>(null);

  const modalStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0",
    height: "calc(100vh - 200px)",
    overflow: "hidden",
  };

  const tabsStyles: CSSProperties = {
    display: "flex",
    borderBottom: "1px solid var(--border)",
    gap: "4px",
  };

  const tabStyles = (active: boolean): CSSProperties => ({
    padding: "12px 20px",
    background: active ? "var(--bg-tertiary)" : "transparent",
    border: "none",
    borderBottom: active ? "2px solid var(--accent-primary)" : "2px solid transparent",
    color: active ? "var(--text-primary)" : "var(--text-secondary)",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all var(--transition-fast)",
  });

  const editorContainerStyles: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    flex: 1,
    overflow: "hidden",
    padding: "20px",
  };

  const editorStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflow: "hidden",
  };

  const textareaStyles: CSSProperties = {
    flex: 1,
    background: "var(--bg-primary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "16px",
    color: "var(--text-primary)",
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    resize: "none",
    outline: "none",
    minHeight: "300px",
  };

    const handleTest = async () => {
      if (!fn.id) return;
      try {
        const res = await fetch(`/api/functions/${fn.id}/invoke`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: testInput }),
        });
        if (!res.ok) {
          throw new Error("Failed to invoke function");
        }
        const result = await res.json();
        setTestResult(result);
      } catch (error) {
        setTestResult({ error: error instanceof Error ? error.message : "An unknown error occurred" });
      }
    };

  if (activeTab === "logs") {
    return (
      <Modal isOpen={true} onClose={onClose} title={`Function: ${fn.name}`} size="xl">
        <div style={modalStyles}>
          <div style={tabsStyles}>
            <button style={tabStyles(false)} onClick={() => setActiveTab("code")}>
              Code
            </button>
            <button style={tabStyles(true)} onClick={() => setActiveTab("logs")}>
              Invocation Logs
            </button>
          </div>

          <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
            <Card padding="none">
              <Table>
                <TableHeader>
                  <TableHeaderCell>Timestamp</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Duration</TableHeaderCell>
                  <TableHeaderCell>Response</TableHeaderCell>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} style={{ textAlign: "center", padding: "40px" }}>
                        <div style={{ color: "var(--text-secondary)" }}>
                          No invocations yet
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                            {log.invokedAt}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.success ? "success" : "error"}>
                            {log.success ? "Success" : "Failed"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span style={{ fontFamily: "var(--font-mono)" }}>{log.duration}ms</span>
                        </TableCell>
                        <TableCell>
                          <code style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                            {JSON.stringify(log.response)}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`Function: ${fn.name}`} size="xl">
      <div style={modalStyles}>
        <div style={tabsStyles}>
          <button style={tabStyles(true)} onClick={() => setActiveTab("code")}>
            Code
          </button>
          <button style={tabStyles(false)} onClick={() => setActiveTab("logs")}>
            Invocation Logs
          </button>
        </div>

        <div style={editorContainerStyles}>
          {/* Code Editor */}
          <div style={editorStyles}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label>Function Code</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button variant="secondary" size="sm" onClick={() => setCode(fn.code)}>
                  Reset
                </Button>
                <Button variant="primary" size="sm" onClick={() => onDeploy(code)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Deploy
                </Button>
              </div>
            </div>
            <textarea
              style={textareaStyles}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* Test Panel */}
          <div style={editorStyles}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label>Test Function</label>
              <Button variant="primary" size="sm" onClick={handleTest}>
                Invoke
              </Button>
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
              Input (JSON)
            </div>
            <textarea
              style={{ ...textareaStyles, minHeight: "150px" }}
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              spellCheck={false}
            />
            {testResult && (
              <Card style={{ background: "var(--success-bg)", border: "1px solid var(--success)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <Badge variant="success">Success</Badge>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {testResult.duration}ms
                  </span>
                </div>
                <pre
                  style={{
                    background: "var(--bg-primary)",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "12px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-secondary)",
                    overflow: "auto",
                    margin: 0,
                  }}
                >
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </Card>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", borderTop: "1px solid var(--border)" }}>
          <Button variant="danger" size="sm" onClick={onDelete}>
            Delete Function
          </Button>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Created: {fn.createdAt} {fn.lastInvoked && `• Last invoked: ${fn.lastInvoked}`}
          </div>
        </div>
      </div>
    </Modal>
  );
}

interface CreateFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, code: string) => void;
}

function CreateFunctionModal({ isOpen, onClose, onCreate }: CreateFunctionModalProps) {
  const [name, setName] = useState("");
  const [template, setTemplate] = useState("basic");

  const templates: Record<string, string> = {
    basic: `export async function handler(request) {
  const body = await request.json();
  
  // Your code here
  
  return {
    status: 200,
    body: { message: "Hello from edge function!" }
  };
}`,
    webhook: `export async function handler(request) {
  const payload = await request.json();
  
  // Process webhook payload
  console.log("Webhook received:", payload);
  
  return {
    status: 200,
    body: { received: true }
  };
}`,
    api: `export async function handler(request) {
  const { method, headers, body } = request;
  
  // Handle different HTTP methods
  if (method === "GET") {
    return { status: 200, body: { data: [] } };
  }
  
  if (method === "POST") {
    const data = await body.json();
    return { status: 201, body: { created: data } };
  }
  
  return { status: 405, body: { error: "Method not allowed" } };
}`,
  };

  const handleCreate = () => {
    if (!name.trim()) {
      return;
    }
    onCreate(name, templates[template]);
    onClose();
  };

  const modalStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Function" size="lg">
      <div style={modalStyles}>
        <Input
          label="Function Name"
          placeholder="e.g., process-image, send-email"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />

        <div>
          <label>Template</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "12px" }}>
            {Object.entries(templates).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTemplate(key)}
                style={{
                  padding: "16px",
                  background: template === key ? "var(--accent-light)" : "var(--bg-tertiary)",
                  border: template === key ? "1px solid var(--accent-primary)" : "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all var(--transition-fast)",
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: "4px", textTransform: "capitalize" }}>
                  {key}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                  {key === "basic" && "Simple handler template"}
                  {key === "webhook" && "Webhook receiver template"}
                  {key === "api" && "REST API handler template"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={!name.trim()}>
            Create Function
          </Button>
        </div>
      </div>
    </Modal>
  );
}
