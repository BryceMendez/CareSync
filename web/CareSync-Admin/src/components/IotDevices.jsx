import { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { C, F } from "../constants";
import {
    Badge,
    Btn,
    Card,
    SectionHeader,
    ProgressBar,
    Divider,
} from "./UI.jsx";
import "../styles/IoTDevices.css";

const DEVICES = [
    {
        id: "CAM-01",
        type: "Camera",
        name: "Main Entrance",
        location: "Lobby",
        wing: "Common",
        status: "online",
        battery: null,
        signal: 98,
        lastSeen: "Just now",
        firmware: "v3.2.1",
        ip: "192.168.1.101",
        uptime: "12d 4h",
        alerts: 0,
    },
    {
        id: "CAM-02",
        type: "Camera",
        name: "Garden Entrance",
        location: "Garden Wing",
        wing: "Garden",
        status: "online",
        battery: null,
        signal: 94,
        lastSeen: "1 min ago",
        firmware: "v3.2.1",
        ip: "192.168.1.102",
        uptime: "12d 4h",
        alerts: 0,
    },
    {
        id: "CAM-04",
        type: "Camera",
        name: "Room 214 Cam",
        location: "Room 214",
        wing: "Sunrise",
        status: "online",
        battery: null,
        signal: 91,
        lastSeen: "Just now",
        firmware: "v3.2.1",
        ip: "192.168.1.104",
        uptime: "5d 2h",
        alerts: 2,
    },
    {
        id: "CAM-08",
        type: "Camera",
        name: "Garden Hallway",
        location: "Garden Wing",
        wing: "Garden",
        status: "offline",
        battery: null,
        signal: 0,
        lastSeen: "11:18 AM",
        firmware: "v3.1.9",
        ip: "192.168.1.108",
        uptime: "—",
        alerts: 1,
    },
    {
        id: "SEN-01",
        type: "Motion Sensor",
        name: "Room 214 Motion",
        location: "Room 214",
        wing: "Sunrise",
        status: "online",
        battery: 78,
        signal: 87,
        lastSeen: "2 min ago",
        firmware: "v2.1.0",
        ip: "192.168.1.201",
        uptime: "30d 1h",
        alerts: 0,
    },
    {
        id: "SEN-12",
        type: "Motion Sensor",
        name: "Room 216 Motion",
        location: "Room 216",
        wing: "Sunrise",
        status: "online",
        battery: 12,
        signal: 72,
        lastSeen: "5 min ago",
        firmware: "v2.1.0",
        ip: "192.168.1.212",
        uptime: "30d 1h",
        alerts: 1,
    },
    {
        id: "SEN-15",
        type: "Door Sensor",
        name: "Garden Exit Door",
        location: "Garden Wing",
        wing: "Garden",
        status: "online",
        battery: 65,
        signal: 85,
        lastSeen: "Just now",
        firmware: "v1.8.3",
        ip: "192.168.1.215",
        uptime: "45d 6h",
        alerts: 0,
    },
    {
        id: "VIT-01",
        type: "Vital Monitor",
        name: "Room 110 Vitals",
        location: "Room 110",
        wing: "Garden",
        status: "online",
        battery: 90,
        signal: 96,
        lastSeen: "1 min ago",
        firmware: "v4.0.2",
        ip: "192.168.1.301",
        uptime: "8d 3h",
        alerts: 0,
    },
    {
        id: "VIT-03",
        type: "Vital Monitor",
        name: "Room 218 Vitals",
        location: "Room 218",
        wing: "Sunrise",
        status: "warning",
        battery: 34,
        signal: 61,
        lastSeen: "8 min ago",
        firmware: "v3.9.1",
        ip: "192.168.1.303",
        uptime: "8d 3h",
        alerts: 1,
    },
    {
        id: "DISP-01",
        type: "Nurse Dispenser",
        name: "Sunrise Station",
        location: "Nurse Station",
        wing: "Sunrise",
        status: "online",
        battery: null,
        signal: 99,
        lastSeen: "Just now",
        firmware: "v5.1.0",
        ip: "192.168.1.401",
        uptime: "22d 10h",
        alerts: 0,
    },
];

const TYPE_ICON = (t) =>
    t === "Camera"
        ? "📷"
        : t === "Motion Sensor"
          ? "📡"
          : t === "Door Sensor"
            ? "🚪"
            : t === "Vital Monitor"
              ? "💓"
              : "💊";

const STATUS_COLOR = (s) =>
    s === "online" ? C.green : s === "warning" ? C.amber : C.red;

const TYPES = [
    "All Types",
    "Camera",
    "Motion Sensor",
    "Door Sensor",
    "Vital Monitor",
    "Nurse Dispenser",
];
const WINGS = ["All Wings", "Common", "Sunrise", "Garden", "Maple", "Oak"];
const STATUSES = ["All Statuses", "online", "warning", "offline"];

export default function IoTDevices() {
    const [devices] = useState(DEVICES);
    const [typeFilter, setTypeFilter] = useState("All Types");
    const [wingFilter, setWingFilter] = useState("All Wings");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [view, setView] = useState("grid");

    const filtered = useMemo(() => {
        let list = [...devices];
        if (search)
            list = list.filter(
                (d) =>
                    d.id.toLowerCase().includes(search.toLowerCase()) ||
                    d.name.toLowerCase().includes(search.toLowerCase()) ||
                    d.location.toLowerCase().includes(search.toLowerCase()),
            );
        if (typeFilter !== "All Types")
            list = list.filter((d) => d.type === typeFilter);
        if (wingFilter !== "All Wings")
            list = list.filter((d) => d.wing === wingFilter);
        if (statusFilter !== "All Statuses")
            list = list.filter((d) => d.status === statusFilter);
        return list;
    }, [devices, search, typeFilter, wingFilter, statusFilter]);

    const counts = {
        online: devices.filter((d) => d.status === "online").length,
        warning: devices.filter((d) => d.status === "warning").length,
        offline: devices.filter((d) => d.status === "offline").length,
        lowBattery: devices.filter((d) => d.battery !== null && d.battery < 20)
            .length,
    };

    return (
        <div className="iot-page">
            {/* Stats */}
            <div className="iot-stats">
                {[
                    {
                        label: "Online",
                        v: counts.online,
                        color: C.green,
                        icon: "✅",
                    },
                    {
                        label: "Warning",
                        v: counts.warning,
                        color: C.amber,
                        icon: "⚠️",
                    },
                    {
                        label: "Offline",
                        v: counts.offline,
                        color: C.red,
                        icon: "🔴",
                    },
                    {
                        label: "Low Battery",
                        v: counts.lowBattery,
                        color: C.purple,
                        icon: "🔋",
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        className="iot-stat"
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

            {/* Network health bar */}
            <Card p="16px 20px">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                    }}
                >
                    <SectionHeader
                        title="Network Health"
                        sub={`${Math.round((counts.online / devices.length) * 100)}% devices online`}
                    />
                </div>
                <ProgressBar
                    value={(counts.online / devices.length) * 100}
                    color={C.green}
                    h={8}
                    bg={C.blue100}
                />
                <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                    {[
                        { l: "Online", c: C.green, v: counts.online },
                        { l: "Warning", c: C.amber, v: counts.warning },
                        { l: "Offline", c: C.red, v: counts.offline },
                    ].map((s) => (
                        <div
                            key={s.l}
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
                                    background: s.c,
                                }}
                            />
                            <span style={{ fontSize: 11, color: C.textSec }}>
                                {s.l}: {s.v}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>

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
                            placeholder="Search by ID, name, or location…"
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
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        {TYPES.map((t) => (
                            <option key={t}>{t}</option>
                        ))}
                    </select>
                    <select
                        className="cs-filter-select"
                        value={wingFilter}
                        onChange={(e) => setWingFilter(e.target.value)}
                    >
                        {WINGS.map((w) => (
                            <option key={w}>{w}</option>
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
                        {filtered.length} of {devices.length} devices
                    </span>
                    <button className="cs-toolbar__add" type="button">
                        <span className="cs-search__add-plus">+</span>
                        Register Device
                    </button>
                </div>
            </Card>

            <div className="iot-body">
                {view === "grid" ? (
                    <div className="iot-grid">
                        {filtered.map((d) => (
                            <div
                                key={d.id}
                                className={`device-card ${selected?.id === d.id ? "device-card--selected" : ""} ${d.status === "offline" ? "device-card--offline" : ""}`}
                                onClick={() =>
                                    setSelected(
                                        selected?.id === d.id ? null : d,
                                    )
                                }
                                style={{
                                    borderTop: `3px solid ${STATUS_COLOR(d.status)}`,
                                }}
                            >
                                <div className="device-card__top">
                                    <span style={{ fontSize: 22 }}>
                                        {TYPE_ICON(d.type)}
                                    </span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                fontFamily: F.mono,
                                                color: C.textMuted,
                                            }}
                                        >
                                            {d.id}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: C.text,
                                                marginTop: 1,
                                            }}
                                        >
                                            {d.name}
                                        </div>
                                    </div>
                                    <div
                                        className="device-card__status-dot"
                                        style={{
                                            background: STATUS_COLOR(d.status),
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: C.textMuted,
                                        margin: "8px 0",
                                    }}
                                >
                                    {d.location} · {d.wing} Wing
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 6,
                                        flexWrap: "wrap",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Badge
                                        color={STATUS_COLOR(d.status)}
                                        style={{ fontSize: 9 }}
                                    >
                                        {d.status}
                                    </Badge>
                                    <Badge
                                        color={C.blue500}
                                        style={{ fontSize: 9 }}
                                    >
                                        {d.type}
                                    </Badge>
                                </div>
                                {d.battery !== null && (
                                    <div style={{ marginTop: 4 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontSize: 10,
                                                color: C.textMuted,
                                                marginBottom: 3,
                                            }}
                                        >
                                            <span>Battery</span>
                                            <span
                                                style={{
                                                    color:
                                                        d.battery < 20
                                                            ? C.red
                                                            : C.green,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {d.battery}%
                                            </span>
                                        </div>
                                        <ProgressBar
                                            value={d.battery}
                                            color={
                                                d.battery < 20
                                                    ? C.red
                                                    : d.battery < 50
                                                      ? C.amber
                                                      : C.green
                                            }
                                            h={4}
                                            bg={C.blue100}
                                        />
                                    </div>
                                )}
                                <div
                                    style={{
                                        fontSize: 10,
                                        color: C.textMuted,
                                        marginTop: 6,
                                    }}
                                >
                                    Signal: {d.signal}% · Last: {d.lastSeen}
                                </div>
                                {d.alerts > 0 && (
                                    <div
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: C.red,
                                            marginTop: 4,
                                        }}
                                    >
                                        ⚠ {d.alerts} alert
                                        {d.alerts > 1 ? "s" : ""}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card p="0">
                        <table className="iot-table">
                            <thead>
                                <tr>
                                    {[
                                        "ID",
                                        "Name",
                                        "Type",
                                        "Location",
                                        "Status",
                                        "Signal",
                                        "Battery",
                                        "Last Seen",
                                        "Alerts",
                                        "",
                                    ].map((h) => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((d) => (
                                    <tr
                                        key={d.id}
                                        className={`iot-table__row ${selected?.id === d.id ? "iot-table__row--selected" : ""}`}
                                        onClick={() =>
                                            setSelected(
                                                selected?.id === d.id
                                                    ? null
                                                    : d,
                                            )
                                        }
                                    >
                                        <td
                                            style={{
                                                fontFamily: F.mono,
                                                fontSize: 11,
                                                color: C.textMuted,
                                            }}
                                        >
                                            {d.id}
                                        </td>
                                        <td
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: C.text,
                                            }}
                                        >
                                            {TYPE_ICON(d.type)} {d.name}
                                        </td>
                                        <td>
                                            <Badge
                                                color={C.blue500}
                                                style={{ fontSize: 9 }}
                                            >
                                                {d.type}
                                            </Badge>
                                        </td>
                                        <td
                                            style={{
                                                fontSize: 11,
                                                color: C.textSec,
                                            }}
                                        >
                                            {d.location}
                                        </td>
                                        <td>
                                            <Badge
                                                color={STATUS_COLOR(d.status)}
                                                style={{ fontSize: 9 }}
                                            >
                                                {d.status}
                                            </Badge>
                                        </td>
                                        <td
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color:
                                                    d.signal > 80
                                                        ? C.green
                                                        : d.signal > 50
                                                          ? C.amber
                                                          : C.red,
                                            }}
                                        >
                                            {d.signal}%
                                        </td>
                                        <td style={{ fontSize: 11 }}>
                                            {d.battery !== null
                                                ? `${d.battery}%`
                                                : "—"}
                                        </td>
                                        <td
                                            style={{
                                                fontSize: 11,
                                                color: C.textMuted,
                                            }}
                                        >
                                            {d.lastSeen}
                                        </td>
                                        <td>
                                            {d.alerts > 0 ? (
                                                <Badge
                                                    color={C.red}
                                                    style={{ fontSize: 9 }}
                                                >
                                                    ⚠ {d.alerts}
                                                </Badge>
                                            ) : (
                                                <span
                                                    style={{
                                                        color: C.textMuted,
                                                        fontSize: 11,
                                                    }}
                                                >
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="iot-table__btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelected(d);
                                                }}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                )}
            </div>

            {/* Detail modal */}
            {selected &&
                ReactDOM.createPortal(
                    <div
                        className="iot-modal-overlay"
                        onClick={(e) =>
                            e.target === e.currentTarget && setSelected(null)
                        }
                    >
                        <div className="iot-modal">
                            <div
                                className="iot-modal__stripe"
                                style={{
                                    background: STATUS_COLOR(selected.status),
                                }}
                            />
                            <div className="iot-modal__header">
                                <div>
                                    <div
                                        style={{
                                            fontSize: 10,
                                            fontFamily: F.mono,
                                            color: C.textMuted,
                                        }}
                                    >
                                        {selected.id}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 800,
                                            color: C.text,
                                        }}
                                    >
                                        {selected.name}
                                    </div>
                                </div>
                                <button
                                    className="iot-modal__close"
                                    onClick={() => setSelected(null)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="iot-modal__body">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    <span style={{ fontSize: 32 }}>
                                        {TYPE_ICON(selected.type)}
                                    </span>
                                    <div>
                                        <Badge
                                            color={STATUS_COLOR(
                                                selected.status,
                                            )}
                                        >
                                            {selected.status}
                                        </Badge>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: C.textMuted,
                                                marginTop: 4,
                                            }}
                                        >
                                            {selected.type}
                                        </div>
                                    </div>
                                </div>
                                {[
                                    {
                                        label: "Location",
                                        value: selected.location,
                                    },
                                    { label: "Wing", value: selected.wing },
                                    { label: "IP Address", value: selected.ip },
                                    {
                                        label: "Firmware",
                                        value: selected.firmware,
                                    },
                                    { label: "Uptime", value: selected.uptime },
                                    {
                                        label: "Last Seen",
                                        value: selected.lastSeen,
                                    },
                                    {
                                        label: "Signal",
                                        value: `${selected.signal}%`,
                                    },
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "6px 10px",
                                            background: C.bg,
                                            borderRadius: 8,
                                            fontSize: 12,
                                        }}
                                    >
                                        <span style={{ color: C.textMuted }}>
                                            {label}
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                color: C.text,
                                            }}
                                        >
                                            {value}
                                        </span>
                                    </div>
                                ))}
                                {selected.battery !== null && (
                                    <div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontSize: 11,
                                                marginBottom: 6,
                                            }}
                                        >
                                            <span
                                                style={{ color: C.textMuted }}
                                            >
                                                Battery Level
                                            </span>
                                            <span
                                                style={{
                                                    fontWeight: 700,
                                                    color:
                                                        selected.battery < 20
                                                            ? C.red
                                                            : C.green,
                                                }}
                                            >
                                                {selected.battery}%
                                            </span>
                                        </div>
                                        <ProgressBar
                                            value={selected.battery}
                                            color={
                                                selected.battery < 20
                                                    ? C.red
                                                    : C.green
                                            }
                                            h={6}
                                            bg={C.blue100}
                                        />
                                    </div>
                                )}
                                <div style={{ display: "flex", gap: 8 }}>
                                    <Btn
                                        variant="primary"
                                        size="sm"
                                        style={{ flex: 1 }}
                                    >
                                        Restart
                                    </Btn>
                                    <Btn
                                        variant="ghost"
                                        size="sm"
                                        style={{ flex: 1 }}
                                    >
                                        Update FW
                                    </Btn>
                                </div>
                                {selected.status === "offline" && (
                                    <Btn variant="danger" size="sm">
                                        Report Issue
                                    </Btn>
                                )}
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
}
