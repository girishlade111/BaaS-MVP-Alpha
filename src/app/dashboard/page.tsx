"use client";

import { CSSProperties, useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Card, Button, Badge } from "@/components/ui";
import { api } from "@/lib/api";

interface Stats {
  tables: number;
  storageUsed: number;
  functions: number;
  recentActivity: number;
}

interface Activity {
  id: string;
  action: string;
  target: string;
  time: string;
  type: "success" | "info" | "error";
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ tables: 0, storageUsed: 0, functions: 0, recentActivity: 0 });
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const statsRes = await api.get("/api/stats");
        
        if (!statsRes.ok) {
          if (statsRes.status === 401) {
            window.location.href = "/login";
            return;
          }
        }
        
        const statsData = await statsRes.json();
        setStats({
          tables: statsData.tables || 0,
          storageUsed: statsData.storageUsed || 0,
          functions: statsData.functions || 0,
          recentActivity: statsData.recentActivity || 0,
        });

        setActivity([
          { id: "1", action: "Dashboard loaded", target: "System", time: "Just now", type: "info" as const },
          { id: "2", action: "Stats fetched", target: "API", time: "Just now", type: "success" as const },
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatStorageSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };
  const containerStyles: CSSProperties = {
    padding: "0 32px 32px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const statsGridStyles: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  };

  const contentGridStyles: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  };

  const quickActionsStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const activityListStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const activityItemStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "var(--bg-tertiary)",
    borderRadius: "var(--radius-md)",
    fontSize: "13px",
  };

  return (
    <div style={containerStyles} className="page-transition">
      <Header
        title="Dashboard"
        description="Overview of your project activity and resources"
      />

      {/* Stats Grid */}
      <div style={statsGridStyles}>
        <StatCard
          title="Total Tables"
          value={stats.tables.toString()}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          }
        />
        <StatCard
          title="Storage Used"
          value={formatStorageSize(stats.storageUsed)}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
        <StatCard
          title="Edge Functions"
          value={stats.functions.toString()}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          }
        />
        <StatCard
          title="Recent Activity"
          value={stats.recentActivity.toString()}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
      </div>

      {/* Content Grid */}
      <div style={contentGridStyles}>
        {/* Quick Actions */}
        <Card>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px" }}>Quick Actions</h3>
          <div style={quickActionsStyles}>
            <Link href="/database" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create Table
              </Button>
            </Link>
            <Link href="/sql" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="md">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                Run SQL Query
              </Button>
            </Link>
            <Link href="/storage" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="md">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                Upload File
              </Button>
            </Link>
            <Link href="/functions" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="md">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                New Function
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Recent Activity</h3>
            <Badge variant="info">{stats.recentActivity} events</Badge>
          </div>
          <div style={activityListStyles}>
            {activity.map((item: Activity) => (
              <div key={item.id} style={activityItemStyles}>
                <Badge variant={item.type} style={{ minWidth: "60px", justifyContent: "center" }}>
                  {item.type}
                </Badge>
                <div style={{ flex: 1 }}>
                  <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{item.action}</span>
                  <span style={{ color: "var(--text-secondary)", marginLeft: "8px" }}>—</span>
                  <span style={{ color: "var(--text-secondary)", marginLeft: "8px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                    {item.target.length > 30 ? item.target.substring(0, 30) + "..." : item.target}
                  </span>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  const cardStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
  };

  const iconContainerStyles: CSSProperties = {
    width: "48px",
    height: "48px",
    background: "var(--accent-light)",
    borderRadius: "var(--radius-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--accent-primary)",
  };

  const valueStyles: CSSProperties = {
    fontSize: "28px",
    fontWeight: 600,
    color: "var(--text-primary)",
    lineHeight: 1.2,
  };

  const titleStyles: CSSProperties = {
    fontSize: "13px",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <Card style={cardStyles}>
      <div style={iconContainerStyles}>{icon}</div>
      <div>
        <div style={valueStyles}>{value}</div>
        <div style={titleStyles}>{title}</div>
      </div>
    </Card>
  );
}
