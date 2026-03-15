"use client";

import { CSSProperties, useEffect, useState, createContext, useContext, ReactNode } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  id: string;
  message: string;
  type: Toast["type"];
  onClose: () => void;
}

function ToastItem({ id, message, type, onClose }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 200);
    }, 3800);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 18px",
    borderRadius: "var(--radius-lg)",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    minWidth: "280px",
    maxWidth: "400px",
    fontFamily: "var(--font-sans)",
    fontSize: "14px",
    animation: isExiting
      ? "slideInRight 0.2s ease-in reverse"
      : "slideInRight 0.2s ease-out",
    transition: "all 0.2s ease-in",
    opacity: isExiting ? 0 : 1,
    transform: isExiting ? "translateX(100%)" : "translateX(0)",
  };

  const typeStyles: Record<string, CSSProperties> = {
    success: {
      borderLeft: "3px solid var(--success)",
    },
    error: {
      borderLeft: "3px solid var(--error)",
    },
    info: {
      borderLeft: "3px solid var(--accent-primary)",
    },
  };

  const iconStyles: Record<string, CSSProperties> = {
    success: {
      color: "var(--success)",
    },
    error: {
      color: "var(--error)",
    },
    info: {
      color: "var(--accent-primary)",
    },
  };

  const icons = {
    success: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    error: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
    info: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  };

  return (
    <div style={{ ...baseStyles, ...typeStyles[type] }}>
      <span style={iconStyles[type]}>{icons[type]}</span>
      <span style={{ color: "var(--text-primary)", flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
