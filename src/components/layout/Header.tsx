"use client";

import { CSSProperties, ReactNode } from "react";

interface HeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  style?: CSSProperties;
}

export function Header({ title, description, actions, style }: HeaderProps) {
  const containerStyles: CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "var(--bg-primary)",
    borderBottom: "1px solid var(--border)",
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    ...style,
  };

  const titleContainerStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const actionsContainerStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  return (
    <header style={containerStyles}>
      <div style={titleContainerStyles}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        {description && (
          <p style={{ margin: 0, fontSize: "13px" }}>{description}</p>
        )}
      </div>
      {actions && <div style={actionsContainerStyles}>{actions}</div>}
    </header>
  );
}
