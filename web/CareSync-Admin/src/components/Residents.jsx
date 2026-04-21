import { useState, useMemo, useCallback } from "react";
import { C, F } from "../constants";
import { Badge, Btn, Card, Avatar } from "./UI.jsx";
import "../styles/Residents.css";

// ── STATIC DATA ────────────────────────────────────────────────────
const INITIAL_RESIDENTS = [
    {
        id: "R-001",
        name: "Nora Johnson",
        age: 82,
        room: "214",
        wing: "Sunrise",
        condition: "Critical",
        caregiver: "M. Santos",
        admitted: "Jan 12, 2024",
        diet: "Low Sodium",
        mobility: "Wheelchair",
        alerts: 2,
    },
    {
        id: "R-002",
        name: "Robert Chen",
        age: 76,
        room: "216",
        wing: "Sunrise",
        condition: "Warning",
        caregiver: "J. Park",
        admitted: "Mar 3, 2024",
        diet: "Diabetic",
        mobility: "Walker",
        alerts: 1,
    },
    {
        id: "R-003",
        name: "James Wright",
        age: 79,
        room: "220",
        wing: "Sunrise",
        condition: "Warning",
        caregiver: "T. Kim",
        admitted: "Feb 18, 2024",
        diet: "Regular",
        mobility: "Independent",
        alerts: 1,
    },
    {
        id: "R-004",
        name: "Helen Park",
        age: 88,
        room: "218",
        wing: "Sunrise",
        condition: "Active",
        caregiver: "S. Lee",
        admitted: "Nov 5, 2023",
        diet: "Soft Foods",
        mobility: "Wheelchair",
        alerts: 0,
    },
    {
        id: "R-005",
        name: "Clara Davis",
        age: 71,
        room: "222",
        wing: "Sunrise",
        condition: "Active",
        caregiver: "M. Santos",
        admitted: "Mar 25, 2025",
        diet: "Regular",
        mobility: "Independent",
        alerts: 0,
    },
    {
        id: "R-006",
        name: "George Miller",
        age: 84,
        room: "108",
        wing: "Garden",
        condition: "Resting",
        caregiver: "G. Wu",
        admitted: "Sep 14, 2023",
        diet: "Low Sodium",
        mobility: "Walker",
        alerts: 0,
    },
    {
        id: "R-007",
        name: "Evelyn Turner",
        age: 90,
        room: "110",
        wing: "Garden",
        condition: "Critical",
        caregiver: "G. Wu",
        admitted: "Dec 1, 2023",
        diet: "Tube Feeding",
        mobility: "Bedridden",
        alerts: 3,
    },
    {
        id: "R-008",
        name: "Frank Harris",
        age: 77,
        room: "112",
        wing: "Garden",
        condition: "Active",
        caregiver: "J. Park",
        admitted: "Jul 22, 2023",
        diet: "Diabetic",
        mobility: "Independent",
        alerts: 0,
    },
    {
        id: "R-009",
        name: "Alice Morgan",
        age: 83,
        room: "305",
        wing: "Maple",
        condition: "Resting",
        caregiver: "T. Kim",
        admitted: "Aug 9, 2023",
        diet: "Regular",
        mobility: "Walker",
        alerts: 0,
    },
    {
        id: "R-010",
        name: "Harold Scott",
        age: 86,
        room: "307",
        wing: "Maple",
        condition: "Active",
        caregiver: "S. Lee",
        admitted: "Oct 30, 2023",
        diet: "Low Sodium",
        mobility: "Wheelchair",
        alerts: 1,
    },
    {
        id: "R-011",
        name: "Dorothy Lewis",
        age: 80,
        room: "401",
        wing: "Oak",
        condition: "Warning",
        caregiver: "G. Wu",
        admitted: "Apr 17, 2024",
        diet: "Soft Foods",
        mobility: "Walker",
        alerts: 1,
    },
    {
        id: "R-012",
        name: "Raymond Hall",
        age: 75,
        room: "403",
        wing: "Oak",
        condition: "Active",
        caregiver: "M. Santos",
        admitted: "Jun 5, 2024",
        diet: "Regular",
        mobility: "Independent",
        alerts: 0,
    },
];

const WINGS = ["All Wings", "Sunrise", "Garden", "Maple", "Oak"];
const CONDITIONS = [
    "All Conditions",
    "Critical",
    "Warning",
    "Active",
    "Resting",
];
const SORT_OPTIONS = [
    { value: "name", label: "Name (A–Z)" },
    { value: "room", label: "Room No." },
    { value: "age", label: "Age" },
    { value: "alerts", label: "Alerts" },
    { value: "admitted", label: "Date Admitted" },
];

const COND_COLOR = (c) =>
    c === "Critical"
        ? C.red
        : c === "Warning"
          ? C.amber
          : c === "Active"
            ? C.green
            : C.blue400;

const MOBILITY_ICON = (m) =>
    m === "Wheelchair"
        ? "♿"
        : m === "Walker"
          ? "🦯"
          : m === "Bedridden"
            ? "🛏"
            : "🚶";

// ── EDIT MODAL ─────────────────────────────────────────────────────
const EditModal = ({ resident, onSave, onClose }) => {
    const [form, setForm] = useState({ ...resident });
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    return (
        <div className="res-modal-overlay" onClick={onClose}>
            <div className="res-modal" onClick={(e) => e.stopPropagation()}>
                <div className="res-modal__head">
                    <div>
                        <div className="res-modal__title">Edit Resident</div>
                        <div className="res-modal__sub">
                            {resident.id} · {resident.name}
                        </div>
                    </div>
                    <button className="res-modal__close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="res-modal__body">
                    <div className="res-modal__grid">
                        {[
                            { label: "Full Name", key: "name", type: "text" },
                            { label: "Age", key: "age", type: "number" },
                            { label: "Room", key: "room", type: "text" },
                            {
                                label: "Caregiver",
                                key: "caregiver",
                                type: "text",
                            },
                            { label: "Diet", key: "diet", type: "text" },
                            {
                                label: "Admitted",
                                key: "admitted",
                                type: "text",
                            },
                        ].map(({ label, key, type }) => (
                            <div className="res-modal__field" key={key}>
                                <label>{label}</label>
                                <input
                                    type={type}
                                    value={form[key]}
                                    onChange={(e) =>
                                        set(
                                            key,
                                            type === "number"
                                                ? +e.target.value
                                                : e.target.value,
                                        )
                                    }
                                />
                            </div>
                        ))}

                        <div className="res-modal__field">
                            <label>Wing</label>
                            <select
                                value={form.wing}
                                onChange={(e) => set("wing", e.target.value)}
                            >
                                {WINGS.filter((w) => w !== "All Wings").map(
                                    (w) => (
                                        <option key={w}>{w}</option>
                                    ),
                                )}
                            </select>
                        </div>

                        <div className="res-modal__field">
                            <label>Condition</label>
                            <select
                                value={form.condition}
                                onChange={(e) =>
                                    set("condition", e.target.value)
                                }
                            >
                                {CONDITIONS.filter(
                                    (c) => c !== "All Conditions",
                                ).map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="res-modal__field">
                            <label>Mobility</label>
                            <select
                                value={form.mobility}
                                onChange={(e) =>
                                    set("mobility", e.target.value)
                                }
                            >
                                {[
                                    "Independent",
                                    "Walker",
                                    "Wheelchair",
                                    "Bedridden",
                                ].map((m) => (
                                    <option key={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="res-modal__foot">
                    <Btn variant="ghost" size="sm" onClick={onClose}>
                        Cancel
                    </Btn>
                    <Btn
                        variant="primary"
                        size="sm"
                        onClick={() => onSave(form)}
                    >
                        Save Changes
                    </Btn>
                </div>
            </div>
        </div>
    );
};

// ── CONFIRM MODAL ──────────────────────────────────────────────────
const ConfirmModal = ({ resident, onConfirm, onClose }) => (
    <div className="res-modal-overlay" onClick={onClose}>
        <div
            className="res-modal res-modal--sm"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="res-modal__head">
                <div className="res-modal__title">Remove Resident</div>
                <button className="res-modal__close" onClick={onClose}>
                    ✕
                </button>
            </div>
            <div className="res-modal__body">
                <div className="res-confirm__icon">🗑️</div>
                <p className="res-confirm__text">
                    Are you sure you want to remove{" "}
                    <strong>{resident.name}</strong> ({resident.id}) from the
                    registry? This action cannot be undone.
                </p>
            </div>
            <div className="res-modal__foot">
                <Btn variant="ghost" size="sm" onClick={onClose}>
                    Cancel
                </Btn>
                <Btn variant="danger" size="sm" onClick={onConfirm}>
                    Yes, Remove
                </Btn>
            </div>
        </div>
    </div>
);

// ── RESIDENT ROW ───────────────────────────────────────────────────
const ResidentRow = ({ r, onEdit, onRemove }) => (
    <tr className="res-table__row">
        <td className="res-table__id">{r.id}</td>
        <td>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Avatar
                    name={r.name}
                    size={30}
                    color={COND_COLOR(r.condition)}
                />
                <div>
                    <div className="res-table__name">{r.name}</div>
                    <div className="res-table__meta">Age {r.age}</div>
                </div>
            </div>
        </td>
        <td>
            <div className="res-table__room">{r.room}</div>
            <div className="res-table__wing">{r.wing}</div>
        </td>
        <td>
            <Badge color={COND_COLOR(r.condition)} style={{ fontSize: 10 }}>
                {r.condition}
            </Badge>
        </td>
        <td className="res-table__text">{r.caregiver}</td>
        <td>
            <span className="res-table__mobility">
                {MOBILITY_ICON(r.mobility)} {r.mobility}
            </span>
        </td>
        <td
            className="res-table__text"
            style={{ fontSize: 11, color: C.textMuted }}
        >
            {r.diet}
        </td>
        <td
            className="res-table__text"
            style={{ fontSize: 11, color: C.textMuted }}
        >
            {r.admitted}
        </td>
        <td>
            {r.alerts > 0 ? (
                <span className="res-table__alerts">
                    🔴 {r.alerts} alert{r.alerts > 1 ? "s" : ""}
                </span>
            ) : (
                <span style={{ fontSize: 11, color: C.textMuted }}>—</span>
            )}
        </td>
        <td>
            <div style={{ display: "flex", gap: 4 }}>
                <button
                    className="res-table__btn res-table__btn--edit"
                    onClick={() => onEdit(r)}
                >
                    ✏️ Edit
                </button>
                <button
                    className="res-table__btn res-table__btn--remove"
                    onClick={() => onRemove(r)}
                >
                    🗑 Remove
                </button>
            </div>
        </td>
    </tr>
);

// ── MAIN COMPONENT ─────────────────────────────────────────────────
export default function Residents() {
    const [residents, setResidents] = useState(INITIAL_RESIDENTS);
    const [search, setSearch] = useState("");
    const [wingFilter, setWingFilter] = useState("All Wings");
    const [condFilter, setCondFilter] = useState("All Conditions");
    const [sortBy, setSortBy] = useState("name");
    const [editTarget, setEditTarget] = useState(null);
    const [removeTarget, setRemoveTarget] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((msg, color = C.green) => {
        setToast({ msg, color });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const handleSave = useCallback(
        (updated) => {
            setResidents((prev) =>
                prev.map((r) => (r.id === updated.id ? updated : r)),
            );
            setEditTarget(null);
            showToast(`✅ ${updated.name}'s record updated.`);
        },
        [showToast],
    );

    const handleRemove = useCallback(() => {
        setResidents((prev) => prev.filter((r) => r.id !== removeTarget.id));
        showToast(`🗑️ ${removeTarget.name} removed from registry.`, C.red);
        setRemoveTarget(null);
    }, [removeTarget, showToast]);

    const filtered = useMemo(() => {
        let list = [...residents];
        const q = search.trim().toLowerCase();

        if (q)
            list = list.filter(
                (r) =>
                    r.name.toLowerCase().includes(q) ||
                    r.id.toLowerCase().includes(q) ||
                    r.room.includes(q) ||
                    r.caregiver.toLowerCase().includes(q),
            );
        if (wingFilter !== "All Wings")
            list = list.filter((r) => r.wing === wingFilter);
        if (condFilter !== "All Conditions")
            list = list.filter((r) => r.condition === condFilter);

        list.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "room") return a.room.localeCompare(b.room);
            if (sortBy === "age") return b.age - a.age;
            if (sortBy === "alerts") return b.alerts - a.alerts;
            if (sortBy === "admitted")
                return new Date(b.admitted) - new Date(a.admitted);
            return 0;
        });
        return list;
    }, [residents, search, wingFilter, condFilter, sortBy]);

    // Summary counts
    const counts = useMemo(
        () => ({
            total: residents.length,
            critical: residents.filter((r) => r.condition === "Critical")
                .length,
            warning: residents.filter((r) => r.condition === "Warning").length,
            active: residents.filter((r) => r.condition === "Active").length,
        }),
        [residents],
    );

    return (
        <div className="residents">
            {/* ── Toast ── */}
            {toast && (
                <div
                    className="res-toast"
                    style={{ borderLeft: `4px solid ${toast.color}` }}
                >
                    {toast.msg}
                </div>
            )}

            {/* ── Summary Badges ── */}
            <div className="residents__summary">
                {[
                    { label: "Total", v: counts.total, color: C.blue600 },
                    { label: "Active", v: counts.active, color: C.green },
                    { label: "Warning", v: counts.warning, color: C.amber },
                    { label: "Critical", v: counts.critical, color: C.red },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="res-summary-card"
                        style={{ borderTop: `3px solid ${s.color}` }}
                    >
                        <div
                            className="res-summary-card__val"
                            style={{ color: s.color }}
                        >
                            {s.v}
                        </div>
                        <div className="res-summary-card__label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Search + Filters ── */}
            <Card p="14px 18px">
                <div className="cs-toolbar">
                    {/* Unified search with embedded Add button */}
                    <div className="cs-search">
                        <span className="cs-search__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-3.5-3.5" />
                            </svg>
                        </span>
                        <input
                            className="cs-search__input"
                            placeholder="Search by name, ID, room, or caregiver…"
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

                    {/* Wing filter */}
                    <select
                        className="cs-filter-select"
                        value={wingFilter}
                        onChange={(e) => setWingFilter(e.target.value)}
                    >
                        {WINGS.map((w) => (
                            <option key={w}>{w}</option>
                        ))}
                    </select>

                    {/* Condition filter */}
                    <select
                        className="cs-filter-select"
                        value={condFilter}
                        onChange={(e) => setCondFilter(e.target.value)}
                    >
                        {CONDITIONS.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        className="cs-filter-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>

                    {/* Result count */}
                    <span className="cs-result-count">
                        {filtered.length} of {residents.length} residents
                    </span>

                    {/* Add button — last in row */}
                    <button className="cs-toolbar__add" type="button">
                        <span className="cs-search__add-plus">+</span>
                        Add Resident
                    </button>
                </div>
            </Card>

            {/* ── Table ── */}
            <Card p="0">
                <div style={{ overflowX: "auto" }}>
                    <table className="res-table">
                        <thead>
                            <tr>
                                {[
                                    "ID",
                                    "Resident",
                                    "Room · Wing",
                                    "Condition",
                                    "Caregiver",
                                    "Mobility",
                                    "Diet",
                                    "Admitted",
                                    "Alerts",
                                    "",
                                ].map((h) => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r) => (
                                <ResidentRow
                                    key={r.id}
                                    r={r}
                                    onEdit={setEditTarget}
                                    onRemove={setRemoveTarget}
                                />
                            ))}
                        </tbody>
                    </table>

                    {filtered.length === 0 && (
                        <div className="res-empty">
                            <div className="res-empty__icon">🔍</div>
                            <div className="res-empty__text">
                                No residents match your search or filters.
                            </div>
                            <button
                                className="res-empty__reset"
                                onClick={() => {
                                    setSearch("");
                                    setWingFilter("All Wings");
                                    setCondFilter("All Conditions");
                                }}
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </Card>

            {/* ── Modals ── */}
            {editTarget && (
                <EditModal
                    resident={editTarget}
                    onSave={handleSave}
                    onClose={() => setEditTarget(null)}
                />
            )}
            {removeTarget && (
                <ConfirmModal
                    resident={removeTarget}
                    onConfirm={handleRemove}
                    onClose={() => setRemoveTarget(null)}
                />
            )}
        </div>
    );
}
