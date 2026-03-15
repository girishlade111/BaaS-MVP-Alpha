"use client";

import { CSSProperties } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  style,
  ...props
}: ButtonProps) {
  const baseStyles: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "var(--radius-md)",
    fontWeight: 500,
    fontFamily: "var(--font-sans)",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.6 : 1,
    transition: "all var(--transition-fast)",
    border: "1px solid transparent",
  };

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      background: "var(--accent-primary)",
      color: "#000",
    },
    secondary: {
      background: "transparent",
      color: "var(--text-primary)",
      borderColor: "var(--border)",
    },
    danger: {
      background: "var(--error)",
      color: "#fff",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-secondary)",
    },
  };

  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      padding: "6px 12px",
      fontSize: "12px",
    },
    md: {
      padding: "10px 16px",
      fontSize: "14px",
    },
    lg: {
      padding: "12px 20px",
      fontSize: "16px",
    },
  };

  const combinedStyle: CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      className={className}
      disabled={disabled || loading}
      style={combinedStyle}
      {...props}
    >
      {loading && (
        <span
          className="animate-spin"
          style={{
            width: size === "sm" ? 14 : size === "lg" ? 20 : 16,
            height: size === "sm" ? 14 : size === "lg" ? 20 : 16,
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
          }}
        />
      )}
      {children}
    </button>
  );
}
