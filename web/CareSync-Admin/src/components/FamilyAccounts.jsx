import { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import { C, F } from "../constants";
import { Badge, Btn, Card, Avatar, Divider } from "./UI.jsx";
import "../styles/FamilyAccounts.css";

const INITIAL_FAMILIES = [
    {
        id: "FA-001",
        familyName: "Johnson Family",
        resident: "Nora Johnson",
        residentId: "R-001",
        room: "214",
        wing: "Sunrise",
        members: [
            {
                name: "David Johnson",
                relation: "Son",
                email: "d.johnson@email.com",
                phone: "+1 555-2001",
                primary: true,
                lastLogin: "Today, 9:30 AM",
                notifications: true,
            },
            {
                name: "Sarah Johnson",
                relation: "Daughter-in-law",
                email: "s.johnson@email.com",
                phone: "+1 555-2002",
                primary: false,
                lastLogin: "Yesterday",
                notifications: false,
            },
        ],
        status: "Active",
        linked: true,
        accessLevel: "Full",
        joined: "Jan 15, 2024",
    },
    {
        id: "FA-002",
        familyName: "Chen Family",
        resident: "Robert Chen",
        residentId: "R-002",
        room: "216",
        wing: "Sunrise",
        members: [
            {
                name: "Linda Chen",
                relation: "Daughter",
                email: "l.chen@email.com",
                phone: "+1 555-2003",
                primary: true,
                lastLogin: "Today, 11:00 AM",
                notifications: true,
            },
            {
                name: "Michael Chen",
                relation: "Son",
                email: "m.chen@email.com",
                phone: "+1 555-2004",
                primary: false,
                lastLogin: "3 days ago",
                notifications: true,
            },
        ],
        status: "Active",
        linked: true,
        accessLevel: "Full",
        joined: "Mar 5, 2024",
    },
    {
        id: "FA-003",
        familyName: "Wright Family",
        resident: "James Wright",
        residentId: "R-003",
        room: "220",
        wing: "Sunrise",
        members: [
            {
                name: "Patricia Wright",
                relation: "Wife",
                email: "p.wright@email.com",
                phone: "+1 555-2005",
                primary: true,
                lastLogin: "2 hrs ago",
                notifications: true,
            },
        ],
        status: "Active",
        linked: true,
        accessLevel: "Limited",
        joined: "Feb 20, 2024",
    },
    {
        id: "FA-004",
        familyName: "Park Family",
        resident: "Helen Park",
        residentId: "R-004",
        room: "218",
        wing: "Sunrise",
        members: [
            {
                name: "Kevin Park",
                relation: "Son",
                email: "k.park@email.com",
                phone: "+1 555-2006",
                primary: true,
                lastLogin: "4 days ago",
                notifications: false,
            },
        ],
        status: "Inactive",
        linked: true,
        accessLevel: "Limited",
        joined: "Nov 8, 2023",
    },
    {
        id: "FA-005",
        familyName: "Davis Family",
        resident: "Clara Davis",
        residentId: "R-005",
        room: "222",
        wing: "Sunrise",
        members: [
            {
                name: "Mark Davis",
                relation: "Husband",
                email: "m.davis@email.com",
                phone: "+1 555-2007",
                primary: true,
                lastLogin: "Today, 8:00 AM",
                notifications: true,
            },
            {
                name: "Anna Davis",
                relation: "Daughter",
                email: "a.davis@email.com",
                phone: "+1 555-2008",
                primary: false,
                lastLogin: "Today, 7:45 AM",
                notifications: true,
            },
        ],
        status: "Active",
        linked: true,
        accessLevel: "Full",
        joined: "Mar 27, 2025",
    },
    {
        id: "FA-006",
        familyName: "(Unlinked)",
        resident: "George Miller",
        residentId: "R-006",
        room: "108",
        wing: "Garden",
        members: [],
        status: "Pending",
        linked: false,
        accessLevel: "—",
        joined: "—",
    },
];

const COND_COLOR = (s) =>
    s === "Active" ? C.green : s === "Inactive" ? C.textMuted : C.amber;

// ── FAMILY DETAIL MODAL ─────────────────────────────────────────────
function FamilyModal({ family: f, onClose }) {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const statusColor = COND_COLOR(f.status);
    const accentColor = f.linked ? C.blue600 : C.textMuted;

    const modal = (
        <div
            className="family-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="family-modal" role="dialog" aria-modal="true">
                {/* Accent stripe */}
                <div
                    className="family-modal__stripe"
                    style={{ background: accentColor }}
                />

                {/* Sticky header */}
                <div className="family-modal__header">
                    <span className="family-modal__header-title">
                        FAMILY ACCOUNT
                    </span>
                    <button
                        className="family-modal__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="family-modal__body">
                    {/* Identity hero */}
                    <div className="family-modal__identity">
                        <Avatar
                            name={f.resident}
                            size={60}
                            color={accentColor}
                        />
                        <h2 className="family-modal__name">{f.familyName}</h2>
                        <div className="family-modal__id">{f.id}</div>
                        <div className="family-modal__badges">
                            <Badge color={statusColor}>{f.status}</Badge>
                            <Badge color={C.blue500}>
                                {f.accessLevel} Access
                            </Badge>
                            {!f.linked && (
                                <Badge color={C.amber}>Unlinked</Badge>
                            )}
                        </div>
                    </div>

                    {/* Unlinked warning strip */}
                    {!f.linked && (
                        <div className="family-modal__alert-strip">
                            <span style={{ fontSize: 16 }}>⚠️</span>
                            <span>
                                This resident has no linked family account.
                            </span>
                        </div>
                    )}

                    {/* Info grid */}
                    <div className="family-modal__info-grid">
                        {[
                            { label: "RESIDENT", value: f.resident },
                            { label: "RESIDENT ID", value: f.residentId },
                            { label: "ROOM", value: f.room },
                            { label: "WING", value: f.wing },
                            { label: "ACCESS LEVEL", value: f.accessLevel },
                            { label: "JOINED", value: f.joined },
                        ].map(({ label, value }) => (
                            <div key={label} className="family-modal__field">
                                <div className="family-modal__field-label">
                                    {label}
                                </div>
                                <div className="family-modal__field-value">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Members */}
                    <div>
                        <div className="family-modal__section-label">
                            Family Members ({f.members.length})
                        </div>
                        {f.members.length === 0 ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "20px",
                                    color: C.textMuted,
                                    fontSize: 12,
                                }}
                            >
                                No members linked yet
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                }}
                            >
                                {f.members.map((m, i) => (
                                    <div
                                        key={i}
                                        className="family-modal__member"
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                marginBottom: 6,
                                            }}
                                        >
                                            <Avatar
                                                name={m.name}
                                                size={30}
                                                color={
                                                    m.primary
                                                        ? C.blue600
                                                        : C.textSec
                                                }
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        color: C.text,
                                                    }}
                                                >
                                                    {m.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 10,
                                                        color: C.textMuted,
                                                    }}
                                                >
                                                    {m.relation}
                                                </div>
                                            </div>
                                            {m.primary && (
                                                <Badge
                                                    color={C.blue600}
                                                    style={{ fontSize: 8 }}
                                                >
                                                    Primary
                                                </Badge>
                                            )}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 3,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 10,
                                                    color: C.textSec,
                                                }}
                                            >
                                                📧 {m.email}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 10,
                                                    color: C.textSec,
                                                }}
                                            >
                                                📱 {m.phone}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 10,
                                                    color: C.textMuted,
                                                }}
                                            >
                                                Last login: {m.lastLogin}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 10,
                                                    color: m.notifications
                                                        ? C.green
                                                        : C.textMuted,
                                                }}
                                            >
                                                {m.notifications
                                                    ? "🔔 Notifications on"
                                                    : "🔕 Notifications off"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="family-modal__actions">
                        <Btn variant="primary" size="sm" style={{ flex: 1 }}>
                            + Add Member
                        </Btn>
                        <Btn variant="ghost" size="sm" style={{ flex: 1 }}>
                            Manage Access
                        </Btn>
                        {f.linked && (
                            <Btn variant="ghost" size="sm" style={{ flex: 1 }}>
                                Message
                            </Btn>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modal, document.body);
}

// ── INVITE MODAL ────────────────────────────────────────────────────
function InviteModal({ families, onClose }) {
    const [inviteForm, setInviteForm] = useState({
        name: "",
        email: "",
        relation: "",
        residentId: "",
    });

    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const modal = (
        <div
            className="family-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="family-modal" role="dialog" aria-modal="true">
                <div
                    className="family-modal__stripe"
                    style={{ background: C.blue600 }}
                />
                <div className="family-modal__header">
                    <span className="family-modal__header-title">
                        INVITE FAMILY MEMBER
                    </span>
                    <button
                        className="family-modal__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
                <div className="family-modal__body">
                    <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>
                        Send an invite link to register and link to a resident.
                    </p>
                    {[
                        {
                            label: "Full Name",
                            key: "name",
                            placeholder: "e.g. John Smith",
                        },
                        {
                            label: "Email Address",
                            key: "email",
                            placeholder: "e.g. j.smith@email.com",
                        },
                        {
                            label: "Relation to Resident",
                            key: "relation",
                            placeholder: "e.g. Son, Daughter, Spouse",
                        },
                    ].map(({ label, key, placeholder }) => (
                        <div key={key} className="family-modal__form-field">
                            <label>{label}</label>
                            <input
                                type="text"
                                placeholder={placeholder}
                                value={inviteForm[key]}
                                onChange={(e) =>
                                    setInviteForm((p) => ({
                                        ...p,
                                        [key]: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    ))}
                    <div className="family-modal__form-field">
                        <label>Link to Resident</label>
                        <select
                            value={inviteForm.residentId}
                            onChange={(e) =>
                                setInviteForm((p) => ({
                                    ...p,
                                    residentId: e.target.value,
                                }))
                            }
                        >
                            <option value="">Select a resident…</option>
                            {families.map((f) => (
                                <option key={f.residentId} value={f.residentId}>
                                    {f.resident} — Room {f.room}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="family-modal__actions">
                        <Btn
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </Btn>
                        <Btn
                            variant="primary"
                            size="sm"
                            onClick={onClose}
                            style={{ flex: 1 }}
                        >
                            Send Invite →
                        </Btn>
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modal, document.body);
}

// ── MAIN PAGE ────────────────────────────────────────────────────────
export default function FamilyAccounts() {
    const [families] = useState(INITIAL_FAMILIES);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [view, setView] = useState("list");

    const filtered = useMemo(() => {
        let list = [...families];
        if (search)
            list = list.filter(
                (f) =>
                    f.familyName.toLowerCase().includes(search.toLowerCase()) ||
                    f.resident.toLowerCase().includes(search.toLowerCase()),
            );
        if (statusFilter !== "All")
            list = list.filter((f) => f.status === statusFilter);
        return list;
    }, [families, search, statusFilter]);

    const counts = {
        active: families.filter((f) => f.status === "Active").length,
        pending: families.filter((f) => f.status === "Pending").length,
        inactive: families.filter((f) => f.status === "Inactive").length,
        unlinked: families.filter((f) => !f.linked).length,
    };

    return (
        <div className="family-page">
            {/* Stats */}
            <div className="family-stats">
                {[
                    {
                        label: "Active Accounts",
                        v: counts.active,
                        color: C.green,
                    },
                    {
                        label: "Pending Setup",
                        v: counts.pending,
                        color: C.amber,
                    },
                    {
                        label: "Inactive",
                        v: counts.inactive,
                        color: C.textMuted,
                    },
                    {
                        label: "Residents Unlinked",
                        v: counts.unlinked,
                        color: C.red,
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        className="family-stat"
                        style={{ borderLeft: `3px solid ${s.color}` }}
                    >
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

            {/* Unlinked alert */}
            {counts.unlinked > 0 && (
                <div className="family-unlinked-alert">
                    <span>⚠️</span>
                    <span
                        style={{
                            flex: 1,
                            fontSize: 12,
                            fontWeight: 600,
                            color: C.amber,
                        }}
                    >
                        {counts.unlinked} resident
                        {counts.unlinked > 1 ? "s have" : " has"} no linked
                        family account. Consider inviting family members to
                        register.
                    </span>
                    <Btn variant="secondary" size="sm">
                        View Unlinked
                    </Btn>
                </div>
            )}

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
                            placeholder="Search by family or resident name…"
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
                                className={`cs-search__view-btn ${view === "grid" ? "cs-search__view-btn--active" : ""}`}
                                onClick={() => setView("grid")}
                                aria-pressed={view === "grid"}
                                title="Grid view"
                            >
                                <span className="cs-search__view-icon">⊞</span>
                                Grid
                            </button>
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
                        </div>
                    </div>
                    <select
                        className="cs-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {["All", "Active", "Inactive", "Pending"].map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                    <span className="cs-result-count">
                        {filtered.length} of {families.length}
                    </span>
                    <button
                        className="cs-toolbar__add"
                        type="button"
                        onClick={() => setShowInviteModal(true)}
                    >
                        <span className="cs-search__add-plus">+</span>
                        Invite Family
                    </button>
                </div>
            </Card>

            {/* Family grid / list */}
            {view === "grid" ? (
                <div className="family-grid">
                    {filtered.map((f) => (
                        <div
                            key={f.id}
                            className="family-card"
                            style={{ borderTop: `3px solid ${f.linked ? COND_COLOR(f.status) : C.textMuted}` }}
                            onClick={() => setSelectedFamily(f)}
                        >
                            <div className="family-card__top">
                                <Avatar name={f.resident} size={40} color={f.linked ? C.blue600 : C.textMuted} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{f.familyName}</div>
                                    <div style={{ fontSize: 10, color: C.textMuted, fontFamily: F.mono }}>{f.id}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", margin: "8px 0 6px" }}>
                                <Badge color={COND_COLOR(f.status)} style={{ fontSize: 9 }}>{f.status}</Badge>
                                <Badge color={C.blue500} style={{ fontSize: 9 }}>{f.accessLevel} Access</Badge>
                                {!f.linked && <Badge color={C.amber} style={{ fontSize: 9 }}>Unlinked</Badge>}
                            </div>
                            <div style={{ fontSize: 11, color: C.textSec, display: "flex", flexDirection: "column", gap: 2 }}>
                                <span><span style={{ color: C.textMuted }}>Resident:</span> {f.resident}</span>
                                <span><span style={{ color: C.textMuted }}>Room:</span> {f.room} · {f.wing} Wing</span>
                                <span>
                                    <span style={{ color: C.textMuted }}>Members:</span>{" "}
                                    {f.members.length > 0 ? f.members.length : "None linked"}
                                    {f.members.find((m) => m.lastLogin.startsWith("Today")) && (
                                        <span style={{ color: C.green, marginLeft: 6 }}>● Active today</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div style={{ gridColumn: "1/-1", padding: 40, textAlign: "center", color: C.textMuted, fontSize: 13 }}>
                            No family accounts match your filters.
                        </div>
                    )}
                </div>
            ) : (
                <Card p="0">
                    {filtered.map((f, i) => (
                        <div
                            key={f.id}
                            className="family-row"
                            style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }}
                            onClick={() => setSelectedFamily(f)}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                                <Avatar name={f.resident} size={38} color={f.linked ? C.blue600 : C.textMuted} />
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{f.familyName}</div>
                                    <div style={{ fontSize: 11, color: C.textMuted }}>
                                        Resident: <span style={{ color: C.textSec, fontWeight: 600 }}>{f.resident}</span> · Room {f.room} · {f.wing}
                                    </div>
                                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                                        {f.members.length > 0 ? `${f.members.length} member${f.members.length > 1 ? "s" : ""}` : "No members linked"}
                                        {f.members.find((m) => m.lastLogin.startsWith("Today")) && (
                                            <span style={{ color: C.green, marginLeft: 6 }}>● Active today</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                {!f.linked && <Badge color={C.amber} style={{ fontSize: 9 }}>Unlinked</Badge>}
                                <Badge color={COND_COLOR(f.status)} style={{ fontSize: 9 }}>{f.status}</Badge>
                                <Badge color={C.blue500} style={{ fontSize: 9 }}>{f.accessLevel}</Badge>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div style={{ padding: 40, textAlign: "center", color: C.textMuted, fontSize: 13 }}>
                            No family accounts match your filters.
                        </div>
                    )}
                </Card>
            )}

            {/* Family detail modal — portal onto document.body */}
            {selectedFamily && (
                <FamilyModal
                    family={selectedFamily}
                    onClose={() => setSelectedFamily(null)}
                />
            )}

            {/* Invite modal — portal onto document.body */}
            {showInviteModal && (
                <InviteModal
                    families={families}
                    onClose={() => setShowInviteModal(false)}
                />
            )}
        </div>
    );
}
