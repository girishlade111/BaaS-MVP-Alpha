"use client";

import { CSSProperties, useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout";
import { Card, Button, Badge, Modal, Input, useToast } from "@/components/ui";
import { api } from "@/lib/api";

interface StorageFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  path: string;
}

export default function StoragePage() {
  const { addToast } = useToast();
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await api.get("/api/storage");
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        const data = await res.json();
        setFiles(data);
      } catch (error) {
        console.error("Failed to fetch files:", error);
        addToast("Failed to load files", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, [addToast]);

  const handleDeleteFile = async (fileId: string) => {
    if (confirm(`Are you sure you want to delete this file?`)) {
      try {
        const res = await api.delete(`/api/storage/${fileId}`);
        
        if (!res.ok) {
          throw new Error("Failed to delete file");
        }
        
        setFiles(files.filter((f: StorageFile) => f.id !== fileId));
        if (selectedFile?.id === fileId) {
          setSelectedFile(null);
        }
        addToast("File deleted", "success");
      } catch (error) {
        addToast("Failed to delete file", "error");
      }
    }
  };

  const containerStyles: CSSProperties = {
    padding: "0 32px 32px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  if (loading) {
    return (
      <div style={containerStyles} className="page-transition">
        <Header
          title="Storage"
          description="Manage your files and assets"
        />
        <div className="animate-pulse" style={{ padding: "40px", textAlign: "center" }}>
          Loading files...
        </div>
      </div>
    );
  }

  const headerActionsStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const viewToggleStyles: CSSProperties = {
    display: "flex",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
  };

  const viewButtonStyles = (active: boolean): CSSProperties => ({
    padding: "8px 12px",
    background: active ? "var(--bg-tertiary)" : "transparent",
    border: "none",
    color: active ? "var(--text-primary)" : "var(--text-secondary)",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  });

  const gridStyles: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
  };

  const fileCardStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "16px",
    cursor: "pointer",
  };

  const fileIconStyles: CSSProperties = {
    width: "100%",
    aspectRatio: "1",
    background: "var(--bg-tertiary)",
    borderRadius: "var(--radius-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      );
    }
    if (mimeType.includes("pdf")) {
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    }
    if (mimeType.includes("json") || mimeType.includes("javascript")) {
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M10 13l-2 2 2 2M14 17l2-2-2-2" />
        </svg>
      );
    }
    return (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  };

  const totalStorage = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div style={containerStyles} className="page-transition">
      <Header
        title="Storage"
        description="Manage your files and assets"
        actions={
          <div style={headerActionsStyles}>
            <div style={viewToggleStyles}>
              <button
                style={viewButtonStyles(viewMode === "grid")}
                onClick={() => setViewMode("grid")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                style={viewButtonStyles(viewMode === "list")}
                onClick={() => setViewMode("list")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
            <Button variant="primary" onClick={() => setIsUploadModalOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              Upload
            </Button>
          </div>
        }
      />

      {/* Storage Stats */}
      <Card style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Storage Used</div>
            <div style={{ fontSize: "24px", fontWeight: 600 }}>{formatFileSize(totalStorage)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Files</div>
            <div style={{ fontSize: "24px", fontWeight: 600 }}>{files.length}</div>
          </div>
        </div>
      </Card>

      {/* Files */}
      {viewMode === "grid" ? (
        <div style={gridStyles}>
          {files.map((file) => (
            <Card
              key={file.id}
              style={fileCardStyles}
              onClick={() => setSelectedFile(file)}
            >
              <div style={fileIconStyles}>
                <span style={{ color: "var(--accent-primary)" }}>
                  {getFileIcon(file.mimeType)}
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {formatFileSize(file.size)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-tertiary)" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 500, textTransform: "uppercase", fontSize: "11px" }}>Name</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 500, textTransform: "uppercase", fontSize: "11px" }}>Type</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 500, textTransform: "uppercase", fontSize: "11px" }}>Size</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 500, textTransform: "uppercase", fontSize: "11px" }}>Uploaded</th>
                <th style={{ padding: "12px 16px", textAlign: "right", color: "var(--text-secondary)", fontWeight: 500, textTransform: "uppercase", fontSize: "11px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.id}
                  style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                  onClick={() => setSelectedFile(file)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--bg-tertiary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td style={{ padding: "12px 16px", color: "var(--text-primary)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>{file.name}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{file.mimeType}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{formatFileSize(file.size)}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{file.uploadedAt}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <Button variant="ghost" size="sm">Download</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={(newFiles) => {
          setFiles([...newFiles, ...files]);
          addToast(`${newFiles.length} file(s) uploaded`, "success");
        }}
      />

       {/* File Detail Modal */}
       {selectedFile && (
         <FileDetailModal
           file={selectedFile}
           onClose={() => setSelectedFile(null)}
           onDelete={() => handleDeleteFile(selectedFile.id)}
         />
       )}
    </div>
  );
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: StorageFile[]) => void;
}

function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const { addToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      const uploadedFiles: StorageFile[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await api.post("/api/storage", formData, false);
        
        if (!res.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
        
        const uploadedFile = await res.json();
        uploadedFiles.push(uploadedFile);
      }
      onUpload(uploadedFiles);
      addToast(`${uploadedFiles.length} file(s) uploaded`, "success");
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      addToast("Failed to upload file", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const modalStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const dropzoneStyles: CSSProperties = {
    border: `2px dashed ${isDragging ? "var(--accent-primary)" : "var(--border)"}`,
    borderRadius: "var(--radius-lg)",
    padding: "40px",
    textAlign: "center",
    background: isDragging ? "var(--accent-light)" : "var(--bg-primary)",
    transition: "all var(--transition-fast)",
    cursor: "pointer",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Files">
      <div style={modalStyles}>
        <div
          style={dropzoneStyles}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ color: "var(--text-muted)", marginBottom: "16px" }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <div style={{ color: "var(--text-primary)", marginBottom: "8px" }}>
            Drag and drop files here
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
            or click to browse
          </div>
        </div>
      </div>
    </Modal>
  );
}

interface FileDetailModalProps {
  file: StorageFile;
  onClose: () => void;
  onDelete: () => void;
}

function FileDetailModal({ file, onClose, onDelete }: FileDetailModalProps) {
  const { addToast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.origin + file.path);
    addToast("URL copied to clipboard", "success");
  };

  const modalStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const infoRowStyles: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid var(--border)",
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="File Details" size="md">
      <div style={modalStyles}>
        <div style={{ textAlign: "center", padding: "20px", background: "var(--bg-primary)", borderRadius: "var(--radius-md)" }}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ color: "var(--accent-primary)", marginBottom: "12px" }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <div style={{ fontSize: "18px", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
            {file.name}
          </div>
        </div>

        <div>
          <div style={infoRowStyles}>
            <span style={{ color: "var(--text-secondary)" }}>Size</span>
            <span style={{ fontFamily: "var(--font-mono)" }}>{formatFileSize(file.size)}</span>
          </div>
          <div style={infoRowStyles}>
            <span style={{ color: "var(--text-secondary)" }}>Type</span>
            <span style={{ fontFamily: "var(--font-mono)" }}>{file.mimeType}</span>
          </div>
          <div style={infoRowStyles}>
            <span style={{ color: "var(--text-secondary)" }}>Uploaded</span>
            <span style={{ fontFamily: "var(--font-mono)" }}>{file.uploadedAt}</span>
          </div>
          <div style={{ ...infoRowStyles, borderBottom: "none" }}>
            <span style={{ color: "var(--text-secondary)" }}>URL</span>
            <Button variant="ghost" size="sm" onClick={copyUrl}>
              Copy
            </Button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={() => addToast("Download started", "info")}>
            Download
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
