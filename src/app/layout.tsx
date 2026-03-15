import { Sidebar, Header } from "@/components/layout";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{
          display: "flex",
          minHeight: "100vh",
        }}>
          <Sidebar />
          <main style={{
            flex: 1,
            marginLeft: "var(--sidebar-width)",
            minHeight: "100vh",
            background: "var(--bg-primary)",
            display: "flex",
            flexDirection: "column",
          }}>
            <Header title="DevDB" description="Developer-first BaaS Platform" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
