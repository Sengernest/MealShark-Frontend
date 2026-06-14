import { useState } from "react";
import {
  Dashboard,
  MenuBook,
  CalendarMonth,
  BarChart,
  FitnessCenter,
  ChevronLeft,
  ChevronRight,
  Add,
} from "@mui/icons-material";

type Page = "dashboard" | "recipes" | "mealplans" | "meallog";

type SidebarProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

const navItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: Dashboard },
  { id: "recipes" as Page, label: "Recipes", icon: MenuBook },
  { id: "mealplans" as Page, label: "Meal Plans", icon: CalendarMonth },
  { id: "meallog" as Page, label: "Meal Log", icon: BarChart },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? 64 : 220,
        minHeight: "100vh",
        background: "#111111",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "24px 12px" : "24px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <FitnessCenter style={{ color: "#60c8f5", fontSize: 28, flexShrink: 0 }} />
        {!collapsed && (
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 22,
              color: "#f0f0f0",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            MEAL<span style={{ color: "#60c8f5" }}>SHARK</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "10px 12px" : "10px 14px",
                marginBottom: 4,
                borderRadius: 6,
                border: "none",
                background: active ? "rgba(181,242,61,0.12)" : "transparent",
                color: active ? "#60c8f5" : "#888888",
                cursor: "pointer",
                transition: "all 0.15s",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.color = "#f0f0f0";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.color = "#888888";
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }
              }}
            >
              <Icon style={{ fontSize: 20, flexShrink: 0 }} />
              {!collapsed && (
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label.toUpperCase()}
                </span>
              )}
              {active && !collapsed && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#60c8f5",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Add */}
      {!collapsed && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            style={{
              fontSize: 10,
              color: "#555",
              letterSpacing: "0.1em",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            QUICK ADD
          </div>
          <button
            onClick={() => onNavigate("meallog")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid rgba(181,242,61,0.3)",
              background: "rgba(181,242,61,0.08)",
              color: "#60c8f5",
              cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.06em",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(181,242,61,0.16)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(181,242,61,0.08)";
            }}
          >
            <Add style={{ fontSize: 16 }} />
            LOG MEAL
          </button>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute",
          right: -12,
          top: 32,
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "#1a1a1a",
          color: "#888",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          padding: 0,
        }}
      >
        {collapsed ? <ChevronRight style={{ fontSize: 14 }} /> : <ChevronLeft style={{ fontSize: 14 }} />}
      </button>
    </aside>
  );
}
