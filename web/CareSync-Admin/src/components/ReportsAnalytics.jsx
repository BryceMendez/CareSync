import { useState } from "react";
import { C, F } from "../constants";
import {
    Badge,
    Btn,
    Card,
    SectionHeader,
    ProgressBar,
    Divider,
} from "./UI.jsx";
import "../styles/ReportsAnalytics.css";

const MONTHLY_INCIDENTS = [
    { month: "Oct", total: 42, critical: 8, warning: 18, resolved: 38 },
    { month: "Nov", total: 38, critical: 6, warning: 15, resolved: 35 },
    { month: "Dec", total: 51, critical: 10, warning: 22, resolved: 44 },
    { month: "Jan", total: 35, critical: 5, warning: 14, resolved: 33 },
    { month: "Feb", total: 44, critical: 9, warning: 19, resolved: 40 },
    { month: "Mar", total: 39, critical: 7, warning: 16, resolved: 37 },
    { month: "Apr", total: 28, critical: 3, warning: 12, resolved: 25 },
];

const INCIDENT_TYPES = [
    { type: "Fall Detected", count: 24, pct: 30, color: C.red },
    { type: "Prolonged Inactivity", count: 18, pct: 22, color: C.amber },
    { type: "Wandering Risk", count: 14, pct: 17, color: C.purple },
    { type: "Missed Medication", count: 12, pct: 15, color: C.teal },
    { type: "Vital Sign Alert", count: 8, pct: 10, color: C.blue500 },
    { type: "Device Offline", count: 5, pct: 6, color: C.textMuted },
];

const WING_DATA = [
    { wing: "Sunrise", incidents: 35, residents: 5, compliance: 94 },
    { wing: "Garden", incidents: 22, residents: 3, compliance: 88 },
    { wing: "Maple", incidents: 14, residents: 2, compliance: 96 },
    { wing: "Oak", incidents: 9, residents: 2, compliance: 91 },
];

const SAVED_REPORTS = [
    {
        name: "Weekly Incident Summary",
        type: "Incidents",
        date: "Apr 7, 2026",
        size: "124 KB",
        format: "PDF",
    },
    {
        name: "Monthly Staff Performance",
        type: "Staff",
        date: "Apr 1, 2026",
        size: "89 KB",
        format: "XLSX",
    },
    {
        name: "Q1 Compliance Report",
        type: "Compliance",
        date: "Mar 31, 2026",
        size: "342 KB",
        format: "PDF",
    },
    {
        name: "Device Uptime Report",
        type: "IoT",
        date: "Mar 28, 2026",
        size: "56 KB",
        format: "CSV",
    },
    {
        name: "AI Model Accuracy Log",
        type: "AI",
        date: "Mar 25, 2026",
        size: "218 KB",
        format: "PDF",
    },
];

const maxInc = Math.max(...MONTHLY_INCIDENTS.map((m) => m.total));

export default function ReportsAnalytics() {
    const [activeTab, setActiveTab] = useState("overview");
    const [dateRange, setDateRange] = useState("Last 30 Days");
    const [generating, setGenerating] = useState(false);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => setGenerating(false), 2000);
    };

    const tabs = ["overview", "incidents", "staff", "compliance", "ai"];

    return (
        <div className="reports-page">
            <div className="reports-header">
              
                <div style={{ display: "flex", gap: 8 }}>
                    <select
                        className="reports-select"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        {[
                            "Last 7 Days",
                            "Last 30 Days",
                            "Last 90 Days",
                            "This Year",
                        ].map((d) => (
                            <option key={d}>{d}</option>
                        ))}
                    </select>
                      <div>
                     </div>
                    <Btn variant="primary" onClick={handleGenerate}>
                        {generating ? "Generating…" : "⬇ Export Report"}
                    </Btn>
                </div>
            </div>

            {/* KPI cards */}
            <div className="reports-kpis">
                {[
                    {
                        label: "Total Incidents",
                        v: "277",
                        delta: "↓ 8% vs last month",
                        color: C.blue600,
                        good: true,
                    },
                    {
                        label: "Resolution Rate",
                        v: "91%",
                        delta: "↑ 3% vs last month",
                        color: C.green,
                        good: true,
                    },
                    {
                        label: "Avg Response Time",
                        v: "4.2 min",
                        delta: "↓ 0.8 min vs last month",
                        color: C.teal,
                        good: true,
                    },
                    {
                        label: "Compliance Score",
                        v: "93%",
                        delta: "→ Stable",
                        color: C.amber,
                        good: null,
                    },
                    {
                        label: "Device Uptime",
                        v: "97.2%",
                        delta: "↑ 1.1% vs last month",
                        color: C.green,
                        good: true,
                    },
                    {
                        label: "AI Avg Accuracy",
                        v: "87.6%",
                        delta: "↓ 0.9% vs last month",
                        color: C.purple,
                        good: false,
                    },
                ].map((k, i) => (
                    <div
                        key={i}
                        className="kpi-card"
                        style={{ borderTop: `3px solid ${k.color}` }}
                    >
                        <div
                            style={{
                                fontSize: 22,
                                fontWeight: 800,
                                color: k.color,
                            }}
                        >
                            {k.v}
                        </div>
                        <div
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: C.text,
                                marginTop: 2,
                            }}
                        >
                            {k.label}
                        </div>
                        <div
                            style={{
                                fontSize: 10,
                                color:
                                    k.good === true
                                        ? C.green
                                        : k.good === false
                                          ? C.red
                                          : C.textMuted,
                                marginTop: 4,
                            }}
                        >
                            {k.delta}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="reports-tabs">
                {tabs.map((t) => (
                    <button
                        key={t}
                        className={`reports-tab ${activeTab === t ? "reports-tab--active" : ""}`}
                        onClick={() => setActiveTab(t)}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {activeTab === "overview" && (
                <div className="reports-grid">
                    {/* Monthly trend bar chart */}
                    <Card style={{ gridColumn: "1 / -1" }}>
                        <SectionHeader
                            title="Monthly Incident Trend"
                            sub="Last 7 months — all incident types"
                        />
                        <div className="bar-chart">
                            {MONTHLY_INCIDENTS.map((m) => (
                                <div key={m.month} className="bar-chart__col">
                                    <div className="bar-chart__bars">
                                        <div
                                            className="bar-chart__bar"
                                            style={{
                                                height: `${(m.critical / maxInc) * 120}px`,
                                                background: C.red,
                                                title: `Critical: ${m.critical}`,
                                            }}
                                        />
                                        <div
                                            className="bar-chart__bar"
                                            style={{
                                                height: `${(m.warning / maxInc) * 120}px`,
                                                background: C.amber,
                                            }}
                                        />
                                        <div
                                            className="bar-chart__bar"
                                            style={{
                                                height: `${((m.total - m.critical - m.warning) / maxInc) * 120}px`,
                                                background: C.blue300,
                                            }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: C.textSec,
                                            marginBottom: 2,
                                        }}
                                    >
                                        {m.total}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 10,
                                            color: C.textMuted,
                                        }}
                                    >
                                        {m.month}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div
                            style={{ display: "flex", gap: 16, marginTop: 12 }}
                        >
                            {[
                                { l: "Critical", c: C.red },
                                { l: "Warning", c: C.amber },
                                { l: "Info/Other", c: C.blue300 },
                            ].map((l) => (
                                <div
                                    key={l.l}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 5,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: 2,
                                            background: l.c,
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: 11,
                                            color: C.textSec,
                                        }}
                                    >
                                        {l.l}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Incident types */}
                    <Card>
                        <SectionHeader
                            title="Incidents by Type"
                            sub="This month"
                        />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                            }}
                        >
                            {INCIDENT_TYPES.map((t) => (
                                <div key={t.type}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: 4,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: C.text,
                                            }}
                                        >
                                            {t.type}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: t.color,
                                            }}
                                        >
                                            {t.count} ({t.pct}%)
                                        </span>
                                    </div>
                                    <ProgressBar
                                        value={t.pct}
                                        color={t.color}
                                        h={5}
                                        bg={t.color + "20"}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Wing performance */}
                    <Card>
                        <SectionHeader
                            title="Wing Performance"
                            sub="Incidents & compliance score"
                        />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 14,
                            }}
                        >
                            {WING_DATA.map((w) => (
                                <div key={w.wing}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: 5,
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    color: C.text,
                                                }}
                                            >
                                                {w.wing} Wing
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 10,
                                                    color: C.textMuted,
                                                }}
                                            >
                                                {w.residents} residents ·{" "}
                                                {w.incidents} incidents
                                            </div>
                                        </div>
                                        <Badge
                                            color={
                                                w.compliance >= 90
                                                    ? C.green
                                                    : C.amber
                                            }
                                            style={{ fontSize: 10 }}
                                        >
                                            {w.compliance}%
                                        </Badge>
                                    </div>
                                    <ProgressBar
                                        value={w.compliance}
                                        color={
                                            w.compliance >= 90
                                                ? C.green
                                                : C.amber
                                        }
                                        h={5}
                                        bg={C.blue100}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Saved reports */}
                    <Card style={{ gridColumn: "1 / -1" }}>
                        <SectionHeader
                            title="Saved Reports"
                            sub="Download previously generated reports"
                            action={
                                <Btn variant="ghost" size="sm">
                                    View All
                                </Btn>
                            }
                        />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0,
                            }}
                        >
                            {SAVED_REPORTS.map((r, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "12px 0",
                                        borderBottom:
                                            i < SAVED_REPORTS.length - 1
                                                ? `1px solid ${C.border}`
                                                : "none",
                                    }}
                                >
                                    <div style={{ fontSize: 18 }}>
                                        {r.format === "PDF"
                                            ? "📄"
                                            : r.format === "XLSX"
                                              ? "📊"
                                              : "📋"}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 700,
                                                color: C.text,
                                            }}
                                        >
                                            {r.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: C.textMuted,
                                            }}
                                        >
                                            {r.date} · {r.size}
                                        </div>
                                    </div>
                                    <Badge
                                        color={C.blue500}
                                        style={{ fontSize: 9 }}
                                    >
                                        {r.type}
                                    </Badge>
                                    <Badge
                                        color={C.textSec}
                                        style={{ fontSize: 9 }}
                                    >
                                        {r.format}
                                    </Badge>
                                    <Btn variant="ghost" size="sm">
                                        ⬇ Download
                                    </Btn>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {activeTab !== "overview" && (
                <Card>
                    <div
                        style={{
                            textAlign: "center",
                            padding: "60px 20px",
                            color: C.textMuted,
                        }}
                    >
                        <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
                        <div
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: C.text,
                                marginBottom: 6,
                            }}
                        >
                            {activeTab.charAt(0).toUpperCase() +
                                activeTab.slice(1)}{" "}
                            Analytics
                        </div>
                        <div style={{ fontSize: 12, marginBottom: 20 }}>
                            Detailed {activeTab} reporting view — coming soon
                        </div>
                        <Btn variant="primary" onClick={handleGenerate}>
                            {generating ? "Generating…" : "Generate Report"}
                        </Btn>
                    </div>
                </Card>
            )}
        </div>
    );
}
