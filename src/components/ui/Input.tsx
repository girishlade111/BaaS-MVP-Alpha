"use client";

import { CSSProperties, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  fullWidth = true,
  className = "",
  style,
  ...props
}: InputProps) {
  const baseStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    width: fullWidth ? "100%" : "auto",
    fontFamily: "var(--font-sans)",
  };

  const inputStyles: CSSProperties = {
    background: "var(--bg-secondary)",
    border: `1px solid ${error ? "var(--error)" : "var(--border)"}`,
    borderRadius: "var(--radius-md)",
    padding: "10px 12px",
    fontSize: "14px",
    color: "var(--text-primary)",
    outline: "none",
    transition: "all var(--transition-fast)",
    fontFamily: "var(--font-mono)",
    ...style,
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = error
      ? "var(--error)"
      : "var(--accent-primary)";
    e.currentTarget.style.boxShadow = error
      ? "0 0 0 2px var(--error-bg)"
      : "0 0 0 2px var(--accent-light)";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = error
      ? "var(--error)"
      : "var(--border)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div className={className} style={baseStyles}>
      {label && <label>{label}</label>}
      <input
        style={inputStyles}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && (
        <span
          style={{
            fontSize: "12px",
            color: "var(--error)",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
