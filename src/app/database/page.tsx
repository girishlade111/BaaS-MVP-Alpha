"use client";

import { CSSProperties, useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { Card, Button, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, Badge, Modal, Input } from "@/components/ui";
import { useToast } from "@/components/ui";

interface DbTable {
  id: string;
  name: string;
  rowCount: number;
  size: string;
  createdAt: string;
  schema?: any;
}

const columnTypes = [
  "String",
  "Integer",
  "Boolean",
  "DateTime",
  "JSON",
  "Float",
  "Text",
];

export default function DatabasePage() {
  const { addToast } = useToast();
  const [tables, setTables] = useState<DbTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<DbTable | null>(null);

  useEffect(() => {
    async function fetchTables() {
      try {
        const res = await fetch("/api/tables");
        const data = await res.json();
        setTables(data);
      } catch (error) {
        console.error("Failed to fetch tables:", error);
        addToast("Failed to load tables", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchTables();
  }, [addToast]);

  const containerStyles: CSSProperties = {
    padding: "0 32px 32px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const handleCreateTable = async (tableName: string, schema: any) => {
    try {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tableName, schema }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create table");
      }
      
      const newTable = await res.json();
      setTables([{ ...newTable, rowCount: 0, size: "0 MB" }, ...tables]);
      addToast(`Table "${tableName}" created successfully`, "success");
      setIsCreateModalOpen(false);
    } catch (error: any) {
      addToast(error.message, "error");
    }
  };

  const handleDeleteTable = async (tableName: string) => {
    if (confirm(`Are you sure you want to delete table "${tableName}"?`)) {
      try {
        const res = await fetch(`/api/tables/${tableName}`, {
          method: "DELETE",
        });
        
        if (!res.ok) {
          throw new Error("Failed to delete table");
        }
        
        setTables(tables.filter((t) => t.name !== tableName));
        addToast(`Table "${tableName}" deleted`, "success");
      } catch (error) {
        addToast("Failed to delete table", "error");
      }
    }
  };

  if (loading) {
    return (
      <div style={containerStyles} className="page-transition">
        <Header
          title="Database"
          description="Manage your database tables and schema"
        />
        <div className="animate-pulse" style={{ padding: "40px", textAlign: "center" }}>
          Loading tables...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles} className="page-transition">
      <Header
        title="Database"
        description="Manage your database tables and schema"
        actions={
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create Table
          </Button>
        }
      />

      {/* Tables List */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableHeaderCell>Table Name</TableHeaderCell>
            <TableHeaderCell>Rows</TableHeaderCell>
            <TableHeaderCell>Size</TableHeaderCell>
            <TableHeaderCell>Created</TableHeaderCell>
            <TableHeaderCell align="right">Actions</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {tables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                  <div style={{ color: "var(--text-secondary)" }}>
                    No tables yet. Create your first table to get started.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tables.map((table) => (
                <TableRow key={table.name}>
                  <TableCell>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>
                      {table.name}
                    </span>
                  </TableCell>
                  <TableCell>{table.rowCount.toLocaleString()}</TableCell>
                  <TableCell>{table.size}</TableCell>
                  <TableCell>{table.createdAt}</TableCell>
                  <TableCell align="right">
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTable(table)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addToast("Export coming soon", "info")}
                      >
                        Export
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteTable(table.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create Table Modal */}
      <CreateTableModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTable}
      />

      {/* Table Detail Modal */}
      {selectedTable && (
        <TableDetailModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
        />
      )}
    </div>
  );
}

interface CreateTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (tableName: string, schema: any) => void;
}

function CreateTableModal({ isOpen, onClose, onCreate }: CreateTableModalProps) {
  const { addToast } = useToast();
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState<{ name: string; type: string; nullable: boolean; isPrimary: boolean }[]>([
    { name: "id", type: "Integer", nullable: false, isPrimary: true },
  ]);

  useEffect(() => {
    if (!isOpen) {
      setTableName("");
      setColumns([{ name: "id", type: "Integer", nullable: false, isPrimary: true }]);
    }
  }, [isOpen]);

  const addColumn = () => {
    setColumns([...columns, { name: "", type: "String", nullable: true, isPrimary: false }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: string, value: any) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setColumns(newColumns);
  };

  const handleCreate = () => {
    if (!tableName.trim()) {
      addToast("Please enter a table name", "error");
      return;
    }
    const validColumns = columns.filter(c => c.name.trim());
    if (validColumns.length === 0) {
      addToast("Please add at least one column", "error");
      return;
    }
    onCreate(tableName, { columns: validColumns });
  };

  const modalStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const columnEditorStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "12px",
  };

  const columnRowStyles: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "2fr 1.5fr 1fr 1fr auto",
    gap: "10px",
    alignItems: "center",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Table" size="lg">
      <div style={modalStyles}>
        <Input
          label="Table Name"
          placeholder="e.g., users, products, orders"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          fullWidth
        />

        <div>
          <label>Columns</label>
          <div style={columnEditorStyles}>
            {/* Header */}
            <div style={columnRowStyles}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Name</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Type</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Nullable</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Primary</span>
              <span />
            </div>

            {/* Columns */}
            {columns.map((col, index) => (
              <div key={index} style={columnRowStyles}>
                <Input
                  placeholder="column_name"
                  value={col.name}
                  onChange={(e) => updateColumn(index, "name", e.target.value)}
                  fullWidth
                  style={{ fontFamily: "var(--font-mono)" }}
                />
                <select
                  value={col.type}
                  onChange={(e) => updateColumn(index, "type", e.target.value)}
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 12px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    fontFamily: "var(--font-mono)",
                    outline: "none",
                  }}
                >
                  {columnTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  type="checkbox"
                  checked={col.nullable}
                  onChange={(e) => updateColumn(index, "nullable", e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <input
                  type="checkbox"
                  checked={col.isPrimary}
                  onChange={(e) => updateColumn(index, "isPrimary", e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                {index > 0 && (
                  <button
                    onClick={() => removeColumn(index)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--error)",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            <Button variant="secondary" size="sm" onClick={addColumn} style={{ width: "fit-content" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Column
            </Button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate}>Create Table</Button>
        </div>
      </div>
    </Modal>
  );
}

interface TableDetailModalProps {
  table: DbTable;
  onClose: () => void;
}

function TableDetailModal({ table, onClose }: TableDetailModalProps) {
  const containerStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const infoStyles: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    padding: "16px",
    background: "var(--bg-tertiary)",
    borderRadius: "var(--radius-md)",
  };

  const infoItemStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Table: ${table.name}`} size="xl">
      <div style={containerStyles}>
        <div style={infoStyles}>
          <div style={infoItemStyles}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Rows</span>
            <span style={{ fontSize: "18px", fontWeight: 600 }}>{table.rowCount.toLocaleString()}</span>
          </div>
          <div style={infoItemStyles}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Size</span>
            <span style={{ fontSize: "18px", fontWeight: 600 }}>{table.size}</span>
          </div>
          <div style={infoItemStyles}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Created</span>
            <span style={{ fontSize: "18px", fontWeight: 600 }}>{table.createdAt}</span>
          </div>
        </div>

        <div>
          <h4 style={{ margin: "0 0 12px", fontSize: "14px" }}>Schema</h4>
          <Card padding="none">
            <Table>
              <TableHeader>
                <TableHeaderCell>Column</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Nullable</TableHeaderCell>
                <TableHeaderCell>Primary Key</TableHeaderCell>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>id</span>
                  </TableCell>
                  <TableCell>Integer</TableCell>
                  <TableCell>
                    <Badge variant="default">No</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">Yes</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>name</span>
                  </TableCell>
                  <TableCell>String</TableCell>
                  <TableCell>
                    <Badge variant="default">No</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">No</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>email</span>
                  </TableCell>
                  <TableCell>String</TableCell>
                  <TableCell>
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">No</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>created_at</span>
                  </TableCell>
                  <TableCell>DateTime</TableCell>
                  <TableCell>
                    <Badge variant="default">No</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">No</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0, fontSize: "14px" }}>Data</h4>
          <Button variant="primary" size="sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Row
          </Button>
        </div>

        <Card padding="none">
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            Data preview coming soon...
          </div>
        </Card>
      </div>
    </Modal>
  );
}
