"use client";

import { CSSProperties, ReactNode } from "react";

interface BadgeProps {
  variant?: "success" | "error" | "warning" | "info" | "default";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Badge({
  variant = "default",
  children,
  className = "",
  style,
}: BadgeProps) {
  const baseStyles: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: 500,
    fontFamily: "var(--font-sans)",
    ...style,
  };

  const variantStyles: Record<string, CSSProperties> = {
    success: {
      background: "var(--success-bg)",
      color: "var(--success)",
    },
    error: {
      background: "var(--error-bg)",
      color: "var(--error)",
    },
    warning: {
      background: "var(--warning-bg)",
      color: "var(--warning)",
    },
    info: {
      background: "var(--info-bg)",
      color: "var(--info)",
    },
    default: {
      background: "var(--bg-tertiary)",
      color: "var(--text-secondary)",
    },
  };

  return (
    <span
      className={className}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}
