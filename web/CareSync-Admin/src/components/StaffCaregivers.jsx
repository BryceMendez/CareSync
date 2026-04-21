import { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import { C, F } from "../constants";
import { Badge, Btn, Card, Avatar, Divider } from "./UI.jsx";
import "../styles/StaffCaregivers.css";

const INITIAL_STAFF = [
    {
        id: "S-001",
        name: "Maria Santos",
        role: "RN",
        wing: "Sunrise",
        status: "active",
        shift: "Morning",
        alerts: 2,
        residents: ["Nora Johnson", "Clara Davis", "Raymond Hall"],
        lastSeen: "2 min ago",
        phone: "+1 555-0101",
        email: "m.santos@caresync.com",
        joined: "Mar 2022",
        certifications: ["BLS", "ACLS", "Wound Care"],
    },
    {
        id: "S-002",
        name: "Jake Park",
        role: "LPN",
        wing: "Garden",
        status: "active",
        shift: "Morning",
        alerts: 1,
        residents: ["Frank Harris", "Robert Chen"],
        lastSeen: "5 min ago",
        phone: "+1 555-0102",
        email: "j.park@caresync.com",
        joined: "Jul 2023",
        certifications: ["BLS", "Dementia Care"],
    },
    {
        id: "S-003",
        name: "Tom Kim",
        role: "CNA",
        wing: "Maple",
        status: "break",
        shift: "Morning",
        alerts: 0,
        residents: ["Alice Morgan", "James Wright"],
        lastSeen: "12 min ago",
        phone: "+1 555-0103",
        email: "t.kim@caresync.com",
        joined: "Jan 2024",
        certifications: ["BLS"],
    },
    {
        id: "S-004",
        name: "Sara Lee",
        role: "Supervisor",
        wing: "All Wings",
        status: "active",
        shift: "Morning",
        alerts: 5,
        residents: [],
        lastSeen: "Just now",
        phone: "+1 555-0104",
        email: "s.lee@caresync.com",
        joined: "Oct 2020",
        certifications: ["BLS", "ACLS", "PALS", "Management"],
    },
    {
        id: "S-005",
        name: "Grace Wu",
        role: "RN",
        wing: "Oak",
        status: "active",
        shift: "Morning",
        alerts: 1,
        residents: ["Dorothy Lewis", "George Miller", "Evelyn Turner"],
        lastSeen: "8 min ago",
        phone: "+1 555-0105",
        email: "g.wu@caresync.com",
        joined: "May 2022",
        certifications: ["BLS", "ACLS"],
    },
    {
        id: "S-006",
        name: "Daniel Cruz",
        role: "CNA",
        wing: "Sunrise",
        status: "off",
        shift: "Afternoon",
        alerts: 0,
        residents: [],
        lastSeen: "3 hrs ago",
        phone: "+1 555-0106",
        email: "d.cruz@caresync.com",
        joined: "Sep 2023",
        certifications: ["BLS"],
    },
    {
        id: "S-007",
        name: "Lisa Nguyen",
        role: "RN",
        wing: "Garden",
        status: "active",
        shift: "Afternoon",
        alerts: 0,
        residents: ["George Miller"],
        lastSeen: "1 min ago",
        phone: "+1 555-0107",
        email: "l.nguyen@caresync.com",
        joined: "Feb 2023",
        certifications: ["BLS", "ACLS", "IV Therapy"],
    },
    {
        id: "S-008",
        name: "Kevin Adams",
        role: "LPN",
        wing: "Maple",
        status: "off",
        shift: "Night",
        alerts: 0,
        residents: [],
        lastSeen: "8 hrs ago",
        phone: "+1 555-0108",
        email: "k.adams@caresync.com",
        joined: "Jun 2021",
        certifications: ["BLS", "Geriatric Care"],
    },
];

const ROLES = ["All Roles", "RN", "LPN", "CNA", "Supervisor"];
const WINGS = ["All Wings", "Sunrise", "Garden", "Maple", "Oak"];
const STATUSES = ["All Statuses", "active", "break", "off"];

const STATUS_COLOR = (s) =>
    s === "active" ? C.green : s === "break" ? C.amber : C.textMuted;
const STATUS_LABEL = (s) =>
    s === "active" ? "On Duty" : s === "break" ? "On Break" : "Off Duty";
const ROLE_COLOR = (r) =>
    r === "RN"
        ? C.blue600
        : r === "LPN"
          ? C.purple
          : r === "Supervisor"
            ? C.red
            : C.teal;

// ── STAFF PROFILE MODAL ────────────────────────────────────────────
function StaffModal({ staff: s, onClose }) {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const roleColor = ROLE_COLOR(s.role);
    const statusColor = STATUS_COLOR(s.status);

    const modal = (
        <div
            className="staff-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="staff-modal" role="dialog" aria-modal="true">
                {/* Accent stripe */}
                <div
                    className="staff-modal__stripe"
                    style={{ background: roleColor }}
                />

                {/* Header */}
                <div className="staff-modal__header">
                    <span className="staff-modal__header-title">
                        STAFF PROFILE
                    </span>
                    <button
                        className="staff-modal__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="staff-modal__body">
                    {/* Identity hero */}
                    <div className="staff-modal__identity">
                        <div style={{ position: "relative" }}>
                            <Avatar name={s.name} size={60} color={roleColor} />
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 2,
                                    right: 2,
                                    width: 13,
                                    height: 13,
                                    borderRadius: "50%",
                                    background: statusColor,
                                    border: "2px solid #fff",
                                }}
                            />
                        </div>
                        <h2 className="staff-modal__name">{s.name}</h2>
                        <div className="staff-modal__id">{s.id}</div>
                        <div className="staff-modal__badges">
                            <Badge color={roleColor}>{s.role}</Badge>
                            <Badge color={statusColor}>
                                {STATUS_LABEL(s.status)}
                            </Badge>
                            {s.alerts > 0 && (
                                <Badge color={C.red}>
                                    🔔 {s.alerts} alert{s.alerts > 1 ? "s" : ""}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Alert strip if active alerts */}
                    {s.alerts > 0 && (
                        <div className="staff-modal__alert-strip">
                            <span style={{ fontSize: 16 }}>⚠️</span>
                            <span>
                                {s.alerts} active alert{s.alerts > 1 ? "s" : ""}{" "}
                                assigned to this staff member
                            </span>
                        </div>
                    )}

                    {/* Info grid */}
                    <div className="staff-modal__info-grid">
                        {[
                            { label: "WING", value: s.wing },
                            { label: "SHIFT", value: s.shift },
                            { label: "LAST SEEN", value: s.lastSeen },
                            { label: "JOINED", value: s.joined },
                            { label: "PHONE", value: s.phone },
                            { label: "EMAIL", value: s.email },
                        ].map(({ label, value }) => (
                            <div key={label} className="staff-modal__field">
                                <div className="staff-modal__field-label">
                                    {label}
                                </div>
                                <div className="staff-modal__field-value">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Certifications */}
                    <div>
                        <div className="staff-modal__section-label">
                            Certifications
                        </div>
                        <div className="staff-modal__certs">
                            {s.certifications.map((c) => (
                                <Badge
                                    key={c}
                                    color={C.blue600}
                                    style={{ fontSize: 11 }}
                                >
                                    {c}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Assigned residents */}
                    {s.residents.length > 0 && (
                        <div>
                            <div className="staff-modal__section-label">
                                Assigned Residents ({s.residents.length})
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                }}
                            >
                                {s.residents.map((r) => (
                                    <div
                                        key={r}
                                        className="staff-modal__resident"
                                    >
                                        <Avatar
                                            name={r}
                                            size={24}
                                            color={C.blue500}
                                        />
                                        <span
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: C.text,
                                            }}
                                        >
                                            {r}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="staff-modal__actions">
                        <Btn variant="primary" size="sm" style={{ flex: 1 }}>
                            Edit Profile
                        </Btn>
                        <Btn variant="ghost" size="sm" style={{ flex: 1 }}>
                            Message
                        </Btn>
                        {s.alerts > 0 && (
                            <Btn variant="danger" size="sm" style={{ flex: 1 }}>
                                View Alerts
                            </Btn>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modal, document.body);
}

// ── MAIN PAGE ──────────────────────────────────────────────────────
export default function StaffCaregivers() {
    const [staff] = useState(INITIAL_STAFF);
    const [roleFilter, setRoleFilter] = useState("All Roles");
    const [wingFilter, setWingFilter] = useState("All Wings");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);

    const filtered = useMemo(() => {
        let list = [...staff];
        if (search)
            list = list.filter(
                (s) =>
                    s.name.toLowerCase().includes(search.toLowerCase()) ||
                    s.id.toLowerCase().includes(search.toLowerCase()),
            );
        if (roleFilter !== "All Roles")
            list = list.filter((s) => s.role === roleFilter);
        if (wingFilter !== "All Wings")
            list = list.filter(
                (s) => s.wing === wingFilter || s.wing === "All Wings",
            );
        if (statusFilter !== "All Statuses")
            list = list.filter((s) => s.status === statusFilter);
        return list;
    }, [staff, search, roleFilter, wingFilter, statusFilter]);

    const counts = {
        onDuty: staff.filter((s) => s.status === "active").length,
        onBreak: staff.filter((s) => s.status === "break").length,
        off: staff.filter((s) => s.status === "off").length,
        totalAlerts: staff.reduce((a, s) => a + s.alerts, 0),
    };

    return (
        <div className="staff-page">
            {/* Summary stat cards */}
            <div className="staff-summary">
                {[
                    {
                        label: "On Duty",
                        v: counts.onDuty,
                        color: C.green,
                        icon: "✅",
                    },
                    {
                        label: "On Break",
                        v: counts.onBreak,
                        color: C.amber,
                        icon: "☕",
                    },
                    {
                        label: "Off Duty",
                        v: counts.off,
                        color: C.textMuted,
                        icon: "🌙",
                    },
                    {
                        label: "Active Alerts",
                        v: counts.totalAlerts,
                        color: C.red,
                        icon: "🔔",
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        className="staff-stat"
                        style={{ borderTop: `3px solid ${s.color}` }}
                    >
                        <span style={{ fontSize: 18 }}>{s.icon}</span>
                        <div
                            style={{
                                fontSize: 22,
                                fontWeight: 800,
                                color: s.color,
                            }}
                        >
                            {s.v}
                        </div>
                        <div
                            style={{
                                fontSize: 11,
                                color: C.textSec,
                                fontWeight: 600,
                            }}
                        >
                            {s.label}
                        </div>
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
                            placeholder="Search by name or ID…"
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
                    </div>
                    {[
                        { val: roleFilter, set: setRoleFilter, opts: ROLES },
                        { val: wingFilter, set: setWingFilter, opts: WINGS },
                        {
                            val: statusFilter,
                            set: setStatusFilter,
                            opts: STATUSES,
                        },
                    ].map((f, i) => (
                        <select
                            key={i}
                            className="cs-filter-select"
                            value={f.val}
                            onChange={(e) => f.set(e.target.value)}
                        >
                            {f.opts.map((o) => (
                                <option key={o}>{o}</option>
                            ))}
                        </select>
                    ))}
                    <span className="cs-result-count">
                        {filtered.length} of {staff.length}
                    </span>
                    <button className="cs-toolbar__add" type="button">
                        <span className="cs-search__add-plus">+</span>
                        Add Staff
                    </button>
                </div>
            </Card>

            {/* Staff grid */}
            <div className="staff-grid">
                {filtered.map((s) => (
                    <div
                        key={s.id}
                        className="staff-card"
                        onClick={() => setSelected(s)}
                        style={{
                            borderTop: `3px solid ${STATUS_COLOR(s.status)}`,
                        }}
                    >
                        <div className="staff-card__top">
                            <div
                                style={{ position: "relative", flexShrink: 0 }}
                            >
                                <Avatar
                                    name={s.name}
                                    size={44}
                                    color={ROLE_COLOR(s.role)}
                                />
                                <div
                                    className="staff-card__status-dot"
                                    style={{
                                        background: STATUS_COLOR(s.status),
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 800,
                                        color: C.text,
                                        marginBottom: 4,
                                    }}
                                >
                                    {s.name}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 5,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Badge
                                        color={ROLE_COLOR(s.role)}
                                        style={{ fontSize: 9 }}
                                    >
                                        {s.role}
                                    </Badge>
                                    <Badge
                                        color={STATUS_COLOR(s.status)}
                                        style={{ fontSize: 9 }}
                                    >
                                        {STATUS_LABEL(s.status)}
                                    </Badge>
                                </div>
                            </div>
                            {s.alerts > 0 && (
                                <div className="staff-card__alert">
                                    {s.alerts}
                                </div>
                            )}
                        </div>
                        <div
                            style={{
                                marginTop: 10,
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                            }}
                        >
                            <div style={{ fontSize: 11, color: C.textSec }}>
                                <span style={{ color: C.textMuted }}>
                                    Wing:{" "}
                                </span>
                                {s.wing}
                            </div>
                            <div style={{ fontSize: 11, color: C.textSec }}>
                                <span style={{ color: C.textMuted }}>
                                    Shift:{" "}
                                </span>
                                {s.shift}
                            </div>
                            <div style={{ fontSize: 11, color: C.textSec }}>
                                <span style={{ color: C.textMuted }}>
                                    Residents:{" "}
                                </span>
                                {s.residents.length > 0
                                    ? s.residents.length
                                    : "—"}
                            </div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: C.textMuted,
                                    marginTop: 2,
                                }}
                            >
                                Last seen: {s.lastSeen}
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div
                        style={{
                            gridColumn: "1/-1",
                            padding: 40,
                            textAlign: "center",
                            color: C.textMuted,
                            fontSize: 13,
                        }}
                    >
                        No staff members match your filters.
                    </div>
                )}
            </div>

            {/* Profile modal — rendered via portal onto document.body */}
            {selected && (
                <StaffModal
                    staff={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}
