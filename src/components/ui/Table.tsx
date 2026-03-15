"use client";

import { CSSProperties, ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Table({ children, className = "", style }: TableProps) {
  const baseStyles: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    ...style,
  };

  return (
    <table className={className} style={baseStyles}>
      {children}
    </table>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  const baseStyles: CSSProperties = {
    background: "var(--bg-tertiary)",
    borderBottom: "1px solid var(--border)",
  };

  return (
    <thead style={baseStyles}>
      <tr className={className}>{children}</tr>
    </thead>
  );
}

interface TableHeaderCellProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  align?: "left" | "center" | "right";
}

export function TableHeaderCell({
  children,
  className = "",
  style,
  align = "left",
}: TableHeaderCellProps) {
  const baseStyles: CSSProperties = {
    padding: "12px 16px",
    fontWeight: 500,
    color: "var(--text-secondary)",
    textAlign: align,
    textTransform: "uppercase",
    fontSize: "11px",
    letterSpacing: "0.05em",
    ...style,
  };

  return <th className={className} style={baseStyles}>{children}</th>;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className = "" }: TableBodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
}

export function TableRow({
  children,
  className = "",
  style,
  hover = true,
}: TableRowProps) {
  const baseStyles: CSSProperties = {
    borderBottom: "1px solid var(--border)",
    transition: "background var(--transition-fast)",
    ...style,
  };

  const hoverStyles: CSSProperties = hover
    ? {
        cursor: "pointer",
      }
    : {};

  const handleMouseEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (hover) {
      e.currentTarget.style.background = "var(--bg-tertiary)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (hover) {
      e.currentTarget.style.background = "transparent";
    }
  };

  return (
    <tr
      className={className}
      style={{ ...baseStyles, ...hoverStyles }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  align?: "left" | "center" | "right";
  colSpan?: number;
  rowSpan?: number;
}

export function TableCell({
  children,
  className = "",
  style,
  align = "left",
  colSpan,
  rowSpan,
}: TableCellProps) {
  const baseStyles: CSSProperties = {
    padding: "12px 16px",
    color: "var(--text-primary)",
    textAlign: align,
    ...style,
  };

  return (
    <td
      className={className}
      style={baseStyles}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {children}
    </td>
  );
}
