"use client";

import { CSSProperties, ReactNode, MouseEventHandler } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function Card({
  children,
  className = "",
  style,
  hover = false,
  padding = "md",
  onClick,
}: CardProps) {
  const baseStyles: CSSProperties = {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    transition: "all var(--transition-normal)",
    padding:
      padding === "none"
        ? "0"
        : padding === "sm"
        ? "12px"
        : padding === "lg"
        ? "28px"
        : "20px",
    ...style,
  };

  const hoverStyle: CSSProperties = hover || onClick
    ? {
        cursor: "pointer",
      }
    : {};

  const combinedStyle: CSSProperties = {
    ...baseStyles,
    ...hoverStyle,
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (hover || onClick) {
      e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 217, 255, 0.1)";
      e.currentTarget.style.borderColor = "var(--accent-primary)";
    }
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (hover || onClick) {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "var(--border)";
    }
  };

  return (
    <div
      className={className}
      style={combinedStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
