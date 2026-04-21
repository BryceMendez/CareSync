import { useState, useEffect } from "react";
import { C, F } from "../constants";
import {
    Badge,
    Btn,
    Card,
    SectionHeader,
    Divider,
    Avatar,
    ProgressBar,
} from "./UI.jsx";
import "../styles/Dashboard.css";

// ── DONUT CHART ────────────────────────────────────────────────────
const DonutChart = ({ data }) => {
    const total = data.reduce((a, b) => a + b.v, 0);
    const r = 52,
        cx = 68,
        cy = 68,
        stroke = 13;
    const circ = 2 * Math.PI * r;
    const segs = data.reduce((acc, d) => {
        const currentOffset =
            acc.length > 0
                ? acc[acc.length - 1].offset + acc[acc.length - 1].len
                : 0;
        const len = (d.v / total) * circ;
        acc.push({
            len,
            offset: currentOffset,
            color: d.color,
            label: d.label,
            v: d.v,
            pct: Math.round((d.v / total) * 100),
        });
        return acc;
    }, []);
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <svg width={136} height={136} style={{ flexShrink: 0 }}>
                {segs.map((s, i) => (
                    <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke={s.color}
                        strokeWidth={stroke}
                        strokeDasharray={`${s.len} ${circ - s.len}`}
                        strokeDashoffset={-s.offset}
                        transform={`rotate(-90 ${cx} ${cy})`}
                        strokeLinecap="butt"
                    />
                ))}
                <circle
                    cx={cx}
                    cy={cy}
                    r={r - stroke / 2 - 4}
                    fill={C.blue50}
                />
                <text
                    x={cx}
                    y={cy - 6}
                    textAnchor="middle"
                    fill={C.text}
                    fontSize={20}
                    fontFamily={F.display}
                    fontWeight="800"
                >
                    {total}
                </text>
                <text
                    x={cx}
                    y={cy + 10}
                    textAnchor="middle"
                    fill={C.textMuted}
                    fontSize={9}
                    fontFamily={F.body}
                    fontWeight="600"
                    letterSpacing="0.05em"
                >
                    RESIDENTS
                </text>
            </svg>
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                }}
            >
                {data.map((d, i) => (
                    <div key={i}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 3,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 2,
                                        background: d.color,
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: C.textSec,
                                        fontWeight: 600,
                                    }}
                                >
                                    {d.label}
                                </span>
                            </div>
                            <span
                                style={{
                                    fontFamily: F.mono,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: C.text,
                                }}
                            >
                                {d.v}
                            </span>
                        </div>
                        <ProgressBar
                            value={segs[i].pct}
                            color={d.color}
                            h={4}
                            bg={d.color + "20"}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── MINI BAR CHART ─────────────────────────────────────────────────
const MiniBarChart = ({ data, color = C.blue500 }) => {
    const max = Math.max(...data.map((d) => d.v));
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 4,
                height: 40,
            }}
        >
            {data.map((d, i) => (
                <div
                    key={i}
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            borderRadius: "3px 3px 0 0",
                            background:
                                i === data.length - 1 ? color : color + "50",
                            height: `${(d.v / max) * 32}px`,
                            minHeight: 3,
                            transition: "height 0.5s",
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

// ── DASHBOARD PAGE ─────────────────────────────────────────────────
export default function Dashboard() {
    const [, setTick] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setTick((x) => x + 1), 5000);
        return () => clearInterval(t);
    }, []);

    const statCards = [
        {
            label: "Critical Alerts",
            value: "3",
            delta: "+1 since 8AM",
            color: C.red,
            bg: C.redSoft,
            border: C.redBorder,
            icon: "🚨",
            trend: [2, 1, 3, 2, 4, 3, 3],
            trendColor: C.red,
        },
        {
            label: "Total Residents",
            value: "48",
            delta: "2 admitted this week",
            color: C.blue600,
            bg: C.blue50,
            border: C.blue200,
            icon: "👥",
            trend: [44, 45, 46, 46, 47, 47, 48],
            trendColor: C.blue500,
        },
        {
            label: "Staff on Duty",
            value: "12",
            delta: "4 wings covered",
            color: C.green,
            bg: C.greenSoft,
            border: C.greenBorder,
            icon: "👩‍⚕️",
            trend: [10, 11, 12, 11, 13, 12, 12],
            trendColor: C.green,
        },
        {
            label: "Devices Online",
            value: "91%",
            delta: "2 offline — action needed",
            color: C.amber,
            bg: C.amberSoft,
            border: C.amberBorder,
            icon: "📡",
            trend: [95, 93, 97, 91, 94, 92, 91],
            trendColor: C.amber,
        },
    ];

    const incidents = [
        {
            id: "INC-041",
            type: "Fall Detected",
            resident: "Nora Johnson",
            room: "214",
            wing: "Sunrise",
            sev: "Critical",
            caregiver: "M. Santos",
            time: "2:12 PM",
            ai: "97%",
        },
        {
            id: "INC-040",
            type: "Prolonged Inactivity",
            resident: "Robert Chen",
            room: "216",
            wing: "Sunrise",
            sev: "Warning",
            caregiver: "J. Park",
            time: "1:30 PM",
            ai: "89%",
        },
        {
            id: "INC-039",
            type: "Wandering Risk",
            resident: "James Wright",
            room: "220",
            wing: "Sunrise",
            sev: "Warning",
            caregiver: "T. Kim",
            time: "12:45 PM",
            ai: "76%",
        },
        {
            id: "INC-038",
            type: "Device Offline",
            resident: "—",
            room: "CAM-08",
            wing: "Garden",
            sev: "Device",
            caregiver: "IT Team",
            time: "11:20 AM",
            ai: "—",
        },
        {
            id: "INC-037",
            type: "Missed Medication",
            resident: "Helen Park",
            room: "218",
            wing: "Sunrise",
            sev: "Info",
            caregiver: "S. Lee",
            time: "9:00 AM",
            ai: "92%",
        },
    ];

    const activity = [
        {
            text: "INC-037 resolved — Medication administered by S. Lee",
            time: "9:22 AM",
            color: C.green,
        },
        {
            text: "Fall alert triggered in Room 214 — AI confidence 97%",
            time: "2:12 PM",
            color: C.red,
        },
        {
            text: "New resident admitted: Clara Davis, Room 222",
            time: "1:05 PM",
            color: C.blue600,
        },
        {
            text: "Camera CAM-08 in Garden Wing went offline",
            time: "11:40 AM",
            color: C.amber,
        },
        {
            text: "Weekly compliance report auto-generated",
            time: "8:00 AM",
            color: C.teal,
        },
        {
            text: "Sensor SEN-12 battery critical — 12% remaining",
            time: "7:30 AM",
            color: C.amber,
        },
        {
            text: "Staff shift handover completed — Morning to Afternoon",
            time: "6:58 AM",
            color: C.purple,
        },
    ];

    const staffDuty = [
        {
            name: "Maria Santos",
            role: "RN",
            wing: "Sunrise",
            status: "active",
            alerts: 2,
            lastSeen: "2 min ago",
        },
        {
            name: "Jake Park",
            role: "LPN",
            wing: "Garden",
            status: "active",
            alerts: 1,
            lastSeen: "5 min ago",
        },
        {
            name: "Tom Kim",
            role: "CNA",
            wing: "Maple",
            status: "break",
            alerts: 0,
            lastSeen: "12 min ago",
        },
        {
            name: "Sara Lee",
            role: "Supervisor",
            wing: "All Wings",
            status: "active",
            alerts: 5,
            lastSeen: "Just now",
        },
        {
            name: "Grace Wu",
            role: "RN",
            wing: "Oak",
            status: "active",
            alerts: 1,
            lastSeen: "8 min ago",
        },
    ];

    const donutData = [
        { label: "Active", v: 28, color: C.green },
        { label: "Resting", v: 12, color: C.blue400 },
        { label: "Warning", v: 5, color: C.amber },
        { label: "Critical", v: 3, color: C.red },
    ];

    const aiHealth = [
        {
            name: "Fall Detection CNN",
            acc: 97.3,
            status: "Healthy",
            inferences: "1.2M",
            color: C.green,
        },
        {
            name: "Inactivity LSTM",
            acc: 89.1,
            status: "Healthy",
            inferences: "890K",
            color: C.blue500,
        },
        {
            name: "Anomaly Autoencoder",
            acc: 76.4,
            status: "Degraded",
            inferences: "540K",
            color: C.amber,
        },
    ];

    const weeklyTrend = [
        { v: 12, l: "M" },
        { v: 8, l: "T" },
        { v: 15, l: "W" },
        { v: 9, l: "T" },
        { v: 18, l: "F" },
        { v: 11, l: "S" },
        { v: 7, l: "S" },
    ];

    const sevColor = (s) =>
        s === "Critical"
            ? C.red
            : s === "Warning"
              ? C.amber
              : s === "Device"
                ? C.purple
                : s === "Info"
                  ? C.teal
                  : C.green;

    return (
        <div className="dashboard">
            {/* Critical banner */}
            <div className="dashboard__alert-banner">
                <div className="dashboard__alert-dot" />
                <span className="dashboard__alert-text">
                    🚨 ACTIVE EMERGENCY: Fall detected in Room 214 — Nora
                    Johnson · Caregiver M. Santos dispatched at 2:14 PM
                </span>
                <Btn variant="danger" size="sm">
                    View Incident →
                </Btn>
            </div>

            {/* Stat cards */}
            <div className="dashboard__stats">
                {statCards.map((s, i) => (
                    <div
                        key={i}
                        className="stat-card"
                        style={{
                            border: `1.5px solid ${s.border}`,
                            boxShadow: `0 2px 12px ${s.color}10`,
                        }}
                    >
                        <div className="stat-card__top">
                            <div
                                className="stat-card__icon"
                                style={{
                                    background: s.bg,
                                    border: `1px solid ${s.border}`,
                                }}
                            >
                                {s.icon}
                            </div>
                            <MiniBarChart
                                data={s.trend.map((v) => ({ v }))}
                                color={s.trendColor}
                            />
                        </div>
                        <div
                            className="stat-card__value"
                            style={{ color: s.color }}
                        >
                            {s.value}
                        </div>
                        <div className="stat-card__label">{s.label}</div>
                        <div className="stat-card__delta">{s.delta}</div>
                    </div>
                ))}
            </div>

            {/* Row 2: Incidents + Donut */}
            <div className="dashboard__row2">
                <Card p="0">
                    <div className="dashboard__section-head">
                        <div>
                            <div className="dashboard__section-title">
                                Active Incident Stream
                            </div>
                            <div className="dashboard__section-sub">
                                Real-time monitoring across all wings
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                            }}
                        >
                            <Badge color={C.red}>3 Critical</Badge>
                            <Btn variant="ghost" size="sm">
                                View All
                            </Btn>
                        </div>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table className="dash-table">
                            <thead>
                                <tr>
                                    {[
                                        "Incident ID",
                                        "Type",
                                        "Resident",
                                        "Room · Wing",
                                        "Severity",
                                        "AI Conf.",
                                        "Assigned To",
                                        "Time",
                                        "",
                                    ].map((h) => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {incidents.map((r, i) => (
                                    <tr
                                        key={i}
                                        style={{
                                            background:
                                                r.sev === "Critical"
                                                    ? `${C.red}06`
                                                    : "transparent",
                                        }}
                                    >
                                        <td className="dash-table__id">
                                            {r.id}
                                        </td>
                                        <td className="dash-table__type">
                                            {r.sev === "Critical" && (
                                                <span
                                                    style={{ marginRight: 4 }}
                                                >
                                                    🔴
                                                </span>
                                            )}
                                            {r.sev === "Warning" && (
                                                <span
                                                    style={{ marginRight: 4 }}
                                                >
                                                    🟡
                                                </span>
                                            )}
                                            {r.sev === "Device" && (
                                                <span
                                                    style={{ marginRight: 4 }}
                                                >
                                                    🔵
                                                </span>
                                            )}
                                            {r.type}
                                        </td>
                                        <td className="dash-table__text">
                                            {r.resident}
                                        </td>
                                        <td>
                                            <div className="dash-table__room">
                                                {r.room}
                                            </div>
                                            <div className="dash-table__wing">
                                                {r.wing}
                                            </div>
                                        </td>
                                        <td>
                                            <Badge
                                                color={sevColor(r.sev)}
                                                style={{ fontSize: 10 }}
                                            >
                                                {r.sev}
                                            </Badge>
                                        </td>
                                        <td
                                            className="dash-table__ai"
                                            style={{
                                                color:
                                                    r.ai !== "—"
                                                        ? C.blue600
                                                        : C.textMuted,
                                                fontWeight:
                                                    r.ai !== "—" ? 700 : 400,
                                            }}
                                        >
                                            {r.ai}
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                }}
                                            >
                                                <Avatar
                                                    name={
                                                        r.caregiver === "—"
                                                            ? "IT"
                                                            : r.caregiver
                                                    }
                                                    size={22}
                                                    color={C.blue500}
                                                />
                                                <span className="dash-table__text">
                                                    {r.caregiver}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="dash-table__time">
                                            {r.time}
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 4,
                                                }}
                                            >
                                                <button className="dash-table__btn dash-table__btn--view">
                                                    View
                                                </button>
                                                <button className="dash-table__btn dash-table__btn--resolve">
                                                    Resolve
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card>
                    <SectionHeader
                        title="Resident Status"
                        sub="Live breakdown by condition"
                    />
                    <DonutChart data={donutData} />
                    <Divider />
                    <div
                        style={{
                            paddingTop: 14,
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}
                    >
                        {[
                            {
                                label: "New admissions this week",
                                v: 2,
                                color: C.blue600,
                            },
                            {
                                label: "Discharge planned",
                                v: 1,
                                color: C.purple,
                            },
                            { label: "Requiring review", v: 3, color: C.amber },
                        ].map((r, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{ fontSize: 11, color: C.textSec }}
                                >
                                    {r.label}
                                </span>
                                <span
                                    style={{
                                        fontFamily: F.mono,
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: r.color,
                                    }}
                                >
                                    {r.v}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Row 3: Staff + Activity + AI */}
            <div className="dashboard__row3">
                {/* Staff */}
                <Card p="0">
                    <div className="dashboard__section-head">
                        <div>
                            <div className="dashboard__section-title">
                                Staff on Duty
                            </div>
                            <div className="dashboard__section-sub">
                                Morning shift · 12 total active
                            </div>
                        </div>
                        <Badge color={C.green}>12 Online</Badge>
                    </div>
                    {staffDuty.map((s, i) => (
                        <div
                            key={i}
                            className="staff-row"
                            style={{
                                borderBottom:
                                    i < staffDuty.length - 1
                                        ? `1px solid ${C.border}`
                                        : "none",
                                background:
                                    s.status === "break"
                                        ? C.amberSoft
                                        : "transparent",
                            }}
                        >
                            <div
                                style={{ position: "relative", flexShrink: 0 }}
                            >
                                <Avatar
                                    name={s.name}
                                    size={34}
                                    color={
                                        s.status === "active"
                                            ? C.blue600
                                            : C.amber
                                    }
                                />
                                <div
                                    className="staff-row__dot"
                                    style={{
                                        background:
                                            s.status === "active"
                                                ? C.green
                                                : C.amber,
                                    }}
                                />
                            </div>
                            <div className="staff-row__info">
                                <div className="staff-row__name">{s.name}</div>
                                <div className="staff-row__meta">
                                    {s.role} · {s.wing} · {s.lastSeen}
                                </div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <Badge
                                    color={
                                        s.status === "active"
                                            ? C.green
                                            : C.amber
                                    }
                                    style={{ fontSize: 9 }}
                                >
                                    {s.status === "active"
                                        ? "On Duty"
                                        : "On Break"}
                                </Badge>
                                {s.alerts > 0 && (
                                    <div className="staff-row__alerts">
                                        {s.alerts} alert
                                        {s.alerts > 1 ? "s" : ""}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </Card>

                {/* Activity */}
                <Card p="0">
                    <div className="dashboard__section-head">
                        <div>
                            <div className="dashboard__section-title">
                                Activity Feed
                            </div>
                            <div className="dashboard__section-sub">
                                Last 60 minutes
                            </div>
                        </div>
                        <Btn variant="ghost" size="sm">
                            Full Log
                        </Btn>
                    </div>
                    <div style={{ padding: "6px 0" }}>
                        {activity.map((a, i) => (
                            <div
                                key={i}
                                className="activity-row"
                                style={{ borderLeft: `3px solid ${a.color}30` }}
                            >
                                <div
                                    className="activity-row__dot"
                                    style={{ background: a.color }}
                                />
                                <div>
                                    <div className="activity-row__text">
                                        {a.text}
                                    </div>
                                    <div className="activity-row__time">
                                        {a.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* AI + 7-day */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                >
                    <Card>
                        <SectionHeader
                            title="AI Model Health"
                            sub="Live accuracy metrics"
                        />
                        {aiHealth.map((m, i) => (
                            <div
                                key={i}
                                style={{
                                    marginBottom:
                                        i < aiHealth.length - 1 ? 14 : 0,
                                }}
                            >
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
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: C.text,
                                            }}
                                        >
                                            {m.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 9,
                                                color: C.textMuted,
                                                fontFamily: F.mono,
                                            }}
                                        >
                                            {m.inferences} inferences
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div
                                            style={{
                                                fontFamily: F.mono,
                                                fontSize: 13,
                                                fontWeight: 800,
                                                color: m.color,
                                            }}
                                        >
                                            {m.acc}%
                                        </div>
                                        <Badge
                                            color={
                                                m.status === "Healthy"
                                                    ? C.green
                                                    : C.amber
                                            }
                                            style={{ fontSize: 8 }}
                                        >
                                            {m.status}
                                        </Badge>
                                    </div>
                                </div>
                                <ProgressBar
                                    value={m.acc}
                                    color={m.color}
                                    h={5}
                                    bg={m.color + "20"}
                                />
                            </div>
                        ))}
                        {aiHealth.some((m) => m.acc < 80) && (
                            <div className="ai-warning">
                                ⚠ Anomaly model below 80% threshold
                            </div>
                        )}
                    </Card>

                    <Card>
                        <SectionHeader
                            title="7-Day Incidents"
                            sub="Daily incident count"
                        />
                        <div className="week-chart">
                            {weeklyTrend.map((d, i) => {
                                const max = Math.max(
                                    ...weeklyTrend.map((x) => x.v),
                                );
                                const isToday = i === weeklyTrend.length - 1;
                                return (
                                    <div key={i} className="week-chart__col">
                                        <span
                                            className="week-chart__val"
                                            style={{
                                                color: isToday
                                                    ? C.blue600
                                                    : C.textMuted,
                                                fontWeight: isToday ? 700 : 400,
                                            }}
                                        >
                                            {d.v}
                                        </span>
                                        <div
                                            className="week-chart__bar"
                                            style={{
                                                background: isToday
                                                    ? `linear-gradient(180deg, ${C.blue500}, ${C.blue700})`
                                                    : C.blue200,
                                                height: `${(d.v / max) * 44}px`,
                                            }}
                                        />
                                        <span
                                            className="week-chart__day"
                                            style={{
                                                color: isToday
                                                    ? C.blue600
                                                    : C.textMuted,
                                                fontWeight: isToday ? 700 : 400,
                                            }}
                                        >
                                            {d.l}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="week-summary">
                            {[
                                { l: "Total", v: 80, c: C.text },
                                { l: "Daily Avg", v: 11.4, c: C.amber },
                                { l: "Peak", v: 18, c: C.red },
                            ].map((s, i) => (
                                <div key={i} style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            fontFamily: F.mono,
                                            fontSize: 14,
                                            fontWeight: 800,
                                            color: s.c,
                                        }}
                                    >
                                        {s.v}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 9,
                                            color: C.textMuted,
                                        }}
                                    >
                                        {s.l}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
