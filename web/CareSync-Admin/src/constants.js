// ── DESIGN TOKENS ─────────────────────────────────────────────────
export const C = {
  // Base
  bg:           "#f0f6ff",
  bgAlt:        "#e8f1fc",
  surface:      "#ffffff",
  surfaceHov:   "#f7fbff",

  // Blue scale
  blue50:       "#eff6ff",
  blue100:      "#dbeafe",
  blue200:      "#bfdbfe",
  blue300:      "#93c5fd",
  blue400:      "#60a5fa",
  blue500:      "#3b82f6",
  blue600:      "#2563eb",
  blue700:      "#1d4ed8",

  // Borders
  border:       "#dde8f8",
  borderMid:    "#c8daff",
  borderStrong: "#a5c3f7",

  // Text
  text:         "#0f172a",
  textSec:      "#475569",
  textMuted:    "#94a3b8",
  textLight:    "#cbd5e1",

  // Status
  red:          "#ef4444",
  redSoft:      "#fef2f2",
  redBorder:    "#fecaca",
  amber:        "#f59e0b",
  amberSoft:    "#fffbeb",
  amberBorder:  "#fde68a",
  green:        "#10b981",
  greenSoft:    "#ecfdf5",
  greenBorder:  "#a7f3d0",
  purple:       "#8b5cf6",
  purpleSoft:   "#f5f3ff",
  purpleBorder: "#ddd6fe",
  teal:         "#0891b2",
  tealSoft:     "#ecfeff",
  tealBorder:   "#a5f3fc",
};

// ── TYPOGRAPHY ─────────────────────────────────────────────────────
export const F = {
  display: "'Plus Jakarta Sans', system-ui, sans-serif",
  body:    "'Plus Jakarta Sans', system-ui, sans-serif",
  mono:    "'JetBrains Mono', monospace",
};

// ── NAV LINKS ──────────────────────────────────────────────────────
export const NAV_LINKS = [
  // MAIN MENU (0–3)
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    id: "alerts",
    label: "Alerts & Incidents",
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    badge: 3,
    badgeColor: "#ef4444",
  },
  {
    id: "floorplan",
    label: "Live Floor Plan",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  },
  {
    id: "residents",
    label: "Residents",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },

  // MANAGEMENT (4–7)
  {
    id: "staff",
    label: "Staff & Caregivers",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    badge: 2,
    badgeColor: "#f59e0b",
  },
  {
    id: "family",
    label: "Family Accounts",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    id: "devices",
    label: "IoT Devices",
    icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },

  // FACILITY (8) — new group rendered separately in Navbar
  {
    id: "building",
    label: "Building Model",
    icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  },

  // SYSTEM (9–10)
  {
    id: "ai",
    label: "AI Models",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

// ── PAGE META ──────────────────────────────────────────────────────
export const PAGE_TITLE = {
  dashboard: "Dashboard",
  alerts:    "Alerts & Incidents",
  floorplan: "Live Floor Plan",
  residents: "Residents",
  staff:     "Staff & Caregivers",
  family:    "Family Accounts",
  devices:   "IoT Devices",
  reports:   "Reports & Analytics",
  building:  "Building Model",
  ai:        "AI Models",
  settings:  "Settings",
};

export const PAGE_SUB = {
  dashboard: "Sunrise Care Center · Live overview",
  alerts:    "Incident management and escalation tracking",
  floorplan: "Real-time room status across all wings",
  residents: "Patient registry and care assignment",
  staff:     "Staff management and shift monitoring",
  family:    "Family portal access and account management",
  devices:   "IoT sensor, camera, and device management",
  reports:   "Analytics, compliance reports, and KPIs",
  building:  "Sunrise Care Center · 3D Facility View",
  ai:        "Model performance, training, and configuration",
  settings:  "System configuration and facility preferences",
};