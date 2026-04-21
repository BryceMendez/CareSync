import { useState, useMemo, useEffect } from "react";
import { C, F } from "../constants.js";
import { Badge, Btn, Card, Avatar, SectionHeader } from "./UI.jsx";
import "../styles/AlertsIncidents.css";

const INITIAL_INCIDENTS = [
    {
        id: "INC-041",
        type: "Fall Detected",
        resident: "Nora Johnson",
        room: "214",
        wing: "Sunrise",
        severity: "Critical",
        caregiver: "M. Santos",
        time: "2:12 PM",
        date: "Today",
        ai: "97%",
        status: "Active",
        description:
            "Resident fell near bedside. AI detected motion pattern consistent with fall event. Caregiver dispatched immediately.",
        camera: "CAM-04",
    },
    {
        id: "INC-040",
        type: "Prolonged Inactivity",
        resident: "Robert Chen",
        room: "216",
        wing: "Sunrise",
        severity: "Warning",
        caregiver: "J. Park",
        time: "1:30 PM",
        date: "Today",
        ai: "89%",
        status: "Active",
        description:
            "No movement detected in room for 3+ hours. Resident may be sleeping or unresponsive.",
        camera: "CAM-05",
    },
    {
        id: "INC-039",
        type: "Wandering Risk",
        resident: "James Wright",
        room: "220",
        wing: "Sunrise",
        severity: "Warning",
        caregiver: "T. Kim",
        time: "12:45 PM",
        date: "Today",
        ai: "76%",
        status: "Acknowledged",
        description:
            "Resident detected near restricted zone boundary. History of wandering behavior noted.",
        camera: "CAM-07",
    },
    {
        id: "INC-038",
        type: "Device Offline",
        resident: "—",
        room: "CAM-08",
        wing: "Garden",
        severity: "Device",
        caregiver: "IT Team",
        time: "11:20 AM",
        date: "Today",
        ai: "—",
        status: "Active",
        description:
            "Camera CAM-08 in Garden Wing lost connection. Last heartbeat 11:18 AM.",
        camera: "CAM-08",
    },
    {
        id: "INC-037",
        type: "Missed Medication",
        resident: "Helen Park",
        room: "218",
        wing: "Sunrise",
        severity: "Info",
        caregiver: "S. Lee",
        time: "9:00 AM",
        date: "Today",
        ai: "92%",
        status: "Resolved",
        description:
            "Scheduled 8:00 AM medication not administered. Caregiver notified and administered at 9:22 AM.",
        camera: "—",
    },
    {
        id: "INC-036",
        type: "Fall Detected",
        resident: "Evelyn Turner",
        room: "110",
        wing: "Garden",
        severity: "Critical",
        caregiver: "G. Wu",
        time: "7:45 AM",
        date: "Today",
        ai: "94%",
        status: "Resolved",
        description:
            "Resident slipped in bathroom. No serious injury. Medical assessment completed.",
        camera: "CAM-11",
    },
    {
        id: "INC-035",
        type: "Vital Sign Alert",
        resident: "Harold Scott",
        room: "307",
        wing: "Maple",
        severity: "Warning",
        caregiver: "S. Lee",
        time: "6:30 PM",
        date: "Yesterday",
        ai: "88%",
        status: "Resolved",
        description:
            "Heart rate sensor reported elevated readings. Nurse assessed, vitals stabilized.",
        camera: "—",
    },
    {
        id: "INC-034",
        type: "Elopement Attempt",
        resident: "Dorothy Lewis",
        room: "401",
        wing: "Oak",
        severity: "Critical",
        caregiver: "G. Wu",
        time: "3:15 PM",
        date: "Yesterday",
        ai: "99%",
        status: "Resolved",
        description:
            "Resident attempted to exit facility through Garden entrance. Intercepted by staff.",
        camera: "CAM-02",
    },
];

const SEV_ORDER = { Critical: 0, Warning: 1, Device: 2, Info: 3 };
const SEVERITY_COLOR = (s) =>
    s === "Critical"
        ? C.red
        : s === "Warning"
          ? C.amber
          : s === "Device"
            ? C.purple
            : C.teal;
const STATUS_COLOR = (s) =>
    s === "Active" ? C.red : s === "Acknowledged" ? C.amber : C.green;

const SEV_EMOJI = { Critical: "🔴", Warning: "🟡", Device: "🔵", Info: "ℹ️" };

const TYPES = [
    "All Types",
    "Fall Detected",
    "Prolonged Inactivity",
    "Wandering Risk",
    "Device Offline",
    "Missed Medication",
    "Vital Sign Alert",
    "Elopement Attempt",
];
const SEVERITIES = ["All Severities", "Critical", "Warning", "Device", "Info"];
const STATUSES = ["All Statuses", "Active", "Acknowledged", "Resolved"];

// ── INCIDENT MODAL ─────────────────────────────────────────────────
function IncidentModal({ incident, onClose, onResolve, onAcknowledge }) {
    // Close on Escape key
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const sevColor = SEVERITY_COLOR(incident.severity);

    return (
        <div
            className="alert-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="alert-modal" role="dialog" aria-modal="true">
                {/* Accent bar */}
                <div
                    className="alert-modal__accent-bar"
                    style={{
                        background: sevColor,
                        borderRadius: "16px 16px 0 0",
                    }}
                />

                {/* Header */}
                <div className="alert-modal__header">
                    <div className="alert-modal__header-left">
                        <span className="alert-modal__id">{incident.id}</span>
                        <h2 className="alert-modal__title">{incident.type}</h2>
                    </div>
                    <button
                        className="alert-modal__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="alert-modal__body">
                    {/* Status + severity row */}
                    <div className="alert-modal__status-row">
                        <Badge color={sevColor}>
                            {SEV_EMOJI[incident.severity]} {incident.severity}
                        </Badge>
                        <Badge color={STATUS_COLOR(incident.status)}>
                            {incident.status}
                        </Badge>
                        {incident.ai !== "—" && (
                            <Badge color={C.blue600}>🤖 AI {incident.ai}</Badge>
                        )}
                    </div>

                    {/* Description */}
                    <p className="alert-modal__desc">{incident.description}</p>

                    {/* Detail grid */}
                    <div className="alert-modal__grid">
                        {[
                            { label: "RESIDENT", value: incident.resident },
                            { label: "ROOM", value: incident.room },
                            { label: "WING", value: incident.wing },
                            { label: "CAREGIVER", value: incident.caregiver },
                            { label: "CAMERA", value: incident.camera },
                            {
                                label: "DATE & TIME",
                                value: `${incident.date}, ${incident.time}`,
                            },
                        ].map(({ label, value }) => (
                            <div key={label} className="alert-modal__field">
                                <div className="alert-modal__field-label">
                                    {label}
                                </div>
                                <div className="alert-modal__field-value">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Caregiver card */}
                    {incident.resident !== "—" && (
                        <div className="alert-modal__caregiver">
                            <Avatar
                                name={incident.caregiver}
                                size={36}
                                color={C.blue600}
                            />
                            <div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: C.text,
                                    }}
                                >
                                    {incident.caregiver}
                                </div>
                                <div
                                    style={{ fontSize: 11, color: C.textMuted }}
                                >
                                    Assigned Caregiver
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {incident.status !== "Resolved" ? (
                        <div className="alert-modal__actions">
                            {incident.status === "Active" && (
                                <Btn
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onAcknowledge(incident.id)}
                                    style={{ flex: 1 }}
                                >
                                    Acknowledge
                                </Btn>
                            )}
                            <Btn
                                variant="success"
                                size="sm"
                                onClick={() => onResolve(incident.id)}
                                style={{ flex: 1 }}
                            >
                                ✓ Mark as Resolved
                            </Btn>
                        </div>
                    ) : (
                        <div className="alert-modal__resolved">
                            ✅ Incident Resolved
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────
export default function AlertsIncidents() {
    const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
    const [typeFilter, setTypeFilter] = useState("All Types");
    const [sevFilter, setSevFilter] = useState("All Severities");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [view, setView] = useState("list");

    const filtered = useMemo(() => {
        let list = [...incidents];
        if (search)
            list = list.filter(
                (i) =>
                    i.resident.toLowerCase().includes(search.toLowerCase()) ||
                    i.id.toLowerCase().includes(search.toLowerCase()) ||
                    i.type.toLowerCase().includes(search.toLowerCase()),
            );
        if (typeFilter !== "All Types")
            list = list.filter((i) => i.type === typeFilter);
        if (sevFilter !== "All Severities")
            list = list.filter((i) => i.severity === sevFilter);
        if (statusFilter !== "All Statuses")
            list = list.filter((i) => i.status === statusFilter);
        return list.sort(
            (a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity],
        );
    }, [incidents, search, typeFilter, sevFilter, statusFilter]);

    const counts = useMemo(
        () => ({
            active: incidents.filter((i) => i.status === "Active").length,
            critical: incidents.filter(
                (i) => i.severity === "Critical" && i.status === "Active",
            ).length,
            acknowledged: incidents.filter((i) => i.status === "Acknowledged")
                .length,
            resolved: incidents.filter((i) => i.status === "Resolved").length,
        }),
        [incidents],
    );

    const resolve = (id) => {
        setIncidents((prev) =>
            prev.map((i) => (i.id === id ? { ...i, status: "Resolved" } : i)),
        );
        setSelected((prev) => (prev ? { ...prev, status: "Resolved" } : null));
    };
    const acknowledge = (id) => {
        setIncidents((prev) =>
            prev.map((i) =>
                i.id === id ? { ...i, status: "Acknowledged" } : i,
            ),
        );
        setSelected((prev) =>
            prev ? { ...prev, status: "Acknowledged" } : null,
        );
    };

    // Sync selected incident with up-to-date incidents list
    const selectedFresh = useMemo(
        () =>
            selected
                ? incidents.find((i) => i.id === selected.id) || null
                : null,
        [selected, incidents],
    );

    return (
        <div className="alerts-page">
            {/* Critical banner */}
            {counts.critical > 0 && (
                <div className="alerts-banner">
                    <div className="alerts-banner__pulse" />
                    <span className="alerts-banner__text">
                        🚨 {counts.critical} CRITICAL ALERT
                        {counts.critical > 1 ? "S" : ""} REQUIRE IMMEDIATE
                        ATTENTION
                    </span>
                    <Btn
                        variant="danger"
                        size="sm"
                        onClick={() => setSevFilter("Critical")}
                    >
                        View Critical Only
                    </Btn>
                </div>
            )}

            {/* Summary cards */}
            <div className="alerts-summary">
                {[
                    {
                        label: "Active Alerts",
                        v: counts.active,
                        color: C.red,
                        icon: "🔴",
                    },
                    {
                        label: "Critical",
                        v: counts.critical,
                        color: C.red,
                        icon: "🚨",
                    },
                    {
                        label: "Acknowledged",
                        v: counts.acknowledged,
                        color: C.amber,
                        icon: "🟡",
                    },
                    {
                        label: "Resolved Today",
                        v: counts.resolved,
                        color: C.green,
                        icon: "✅",
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        className="alerts-stat"
                        style={{ borderTop: `3px solid ${s.color}` }}
                    >
                        <div className="alerts-stat__icon">{s.icon}</div>
                        <div
                            className="alerts-stat__val"
                            style={{ color: s.color }}
                        >
                            {s.v}
                        </div>
                        <div className="alerts-stat__label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <Card p="14px 18px">
                <div className="cs-toolbar">
                    <div className="cs-search">
                        <span className="cs-search__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-3.5-3.5" />
                            </svg>
                        </span>
                        <input
                            className="cs-search__input"
                            placeholder="Search incident, resident, ID…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                className="cs-search__clear"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                        <span className="cs-search__divider" />
                        <div className="cs-search__views" role="group" aria-label="View mode">
                            <button
                                type="button"
                                className={`cs-search__view-btn ${view === "list" ? "cs-search__view-btn--active" : ""}`}
                                onClick={() => setView("list")}
                                aria-pressed={view === "list"}
                                title="List view"
                            >
                                <span className="cs-search__view-icon">☰</span>
                                List
                            </button>
                            <button
                                type="button"
                                className={`cs-search__view-btn ${view === "timeline" ? "cs-search__view-btn--active" : ""}`}
                                onClick={() => setView("timeline")}
                                aria-pressed={view === "timeline"}
                                title="Timeline view"
                            >
                                <span className="cs-search__view-icon">⏱</span>
                                Timeline
                            </button>
                        </div>
                    </div>
                    <select
                        className="cs-filter-select"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        {TYPES.map((t) => (
                            <option key={t}>{t}</option>
                        ))}
                    </select>
                    <select
                        className="cs-filter-select"
                        value={sevFilter}
                        onChange={(e) => setSevFilter(e.target.value)}
                    >
                        {SEVERITIES.map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                    <select
                        className="cs-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                    <span className="cs-result-count">
                        {filtered.length} of {incidents.length} incidents
                    </span>
                    <button className="cs-toolbar__add" type="button">
                        <span className="cs-search__add-plus">+</span>
                        Log Incident
                    </button>
                </div>
            </Card>

            {/* List / Timeline */}
            {view === "list" ? (
                <Card p="0">
                    <div className="alerts-list-header">
                        <span
                            style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: C.textSec,
                            }}
                        >
                            {filtered.length} incidents
                        </span>
                    </div>
                    {filtered.map((inc, i) => (
                        <div
                            key={inc.id}
                            className={`alert-row ${inc.status === "Active" && inc.severity === "Critical" ? "alert-row--critical" : ""}`}
                            onClick={() => setSelected(inc)}
                            style={{
                                borderBottom:
                                    i < filtered.length - 1
                                        ? `1px solid ${C.border}`
                                        : "none",
                            }}
                        >
                            <div
                                className="alert-row__sev"
                                style={{
                                    background:
                                        SEVERITY_COLOR(inc.severity) + "18",
                                    border: `1px solid ${SEVERITY_COLOR(inc.severity)}30`,
                                }}
                            >
                                <div
                                    className="alert-row__sev-dot"
                                    style={{
                                        background: SEVERITY_COLOR(
                                            inc.severity,
                                        ),
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: SEVERITY_COLOR(inc.severity),
                                    }}
                                >
                                    {inc.severity}
                                </span>
                            </div>
                            <div className="alert-row__body">
                                <div className="alert-row__top">
                                    <span className="alert-row__type">
                                        {inc.type}
                                    </span>
                                    <span className="alert-row__id">
                                        {inc.id}
                                    </span>
                                </div>
                                <div className="alert-row__meta">
                                    <span>👤 {inc.resident}</span>
                                    <span>
                                        🏠 Room {inc.room} · {inc.wing}
                                    </span>
                                    <span>
                                        🕐 {inc.date}, {inc.time}
                                    </span>
                                </div>
                            </div>
                            <div className="alert-row__right">
                                <Badge
                                    color={STATUS_COLOR(inc.status)}
                                    style={{ fontSize: 9 }}
                                >
                                    {inc.status}
                                </Badge>
                                {inc.ai !== "—" && (
                                    <div
                                        style={{
                                            fontSize: 10,
                                            color: C.blue600,
                                            fontWeight: 700,
                                            marginTop: 4,
                                        }}
                                    >
                                        AI {inc.ai}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div
                            style={{
                                padding: 40,
                                textAlign: "center",
                                color: C.textMuted,
                                fontSize: 13,
                            }}
                        >
                            No incidents match filters.
                        </div>
                    )}
                </Card>
            ) : (
                <Card p="20px">
                    <SectionHeader
                        title="Incident Timeline"
                        sub="Chronological view"
                    />
                    <div className="alerts-timeline">
                        {filtered.map((inc, i) => (
                            <div
                                key={inc.id}
                                className="timeline-item"
                                onClick={() => setSelected(inc)}
                            >
                                <div className="timeline-item__line">
                                    <div
                                        className="timeline-item__dot"
                                        style={{
                                            background: SEVERITY_COLOR(
                                                inc.severity,
                                            ),
                                            boxShadow: `0 0 0 3px ${SEVERITY_COLOR(inc.severity)}25`,
                                        }}
                                    />
                                    {i < filtered.length - 1 && (
                                        <div className="timeline-item__connector" />
                                    )}
                                </div>
                                <div className="timeline-item__content">
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                            marginBottom: 4,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: C.text,
                                            }}
                                        >
                                            {inc.type}
                                        </span>
                                        <Badge
                                            color={SEVERITY_COLOR(inc.severity)}
                                            style={{ fontSize: 9 }}
                                        >
                                            {inc.severity}
                                        </Badge>
                                        <Badge
                                            color={STATUS_COLOR(inc.status)}
                                            style={{ fontSize: 9 }}
                                        >
                                            {inc.status}
                                        </Badge>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: C.textSec,
                                        }}
                                    >
                                        {inc.resident !== "—" && (
                                            <span>👤 {inc.resident} · </span>
                                        )}
                                        <span>Room {inc.room} · </span>
                                        <span>
                                            {inc.date}, {inc.time}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontSize: 10,
                                        color: C.textMuted,
                                        flexShrink: 0,
                                    }}
                                >
                                    {inc.id}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Modal popup */}
            {selectedFresh && (
                <IncidentModal
                    incident={selectedFresh}
                    onClose={() => setSelected(null)}
                    onResolve={resolve}
                    onAcknowledge={acknowledge}
                />
            )}
        </div>
    );
}
