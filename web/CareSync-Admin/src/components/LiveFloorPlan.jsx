import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { C, F } from "../constants";
import { Badge, Btn, Card, Avatar, SectionHeader } from "./UI.jsx";
import "../styles/LiveFloorPlan.css";

const WINGS = {
    Sunrise: {
        color: C.amber,
        rooms: [
            {
                id: "214",
                resident: "Nora Johnson",
                condition: "Critical",
                caregiver: "M. Santos",
                device: "online",
                alerts: 2,
                hr: 102,
                spo2: 94,
                temp: 37.8,
            },
            {
                id: "216",
                resident: "Robert Chen",
                condition: "Warning",
                caregiver: "J. Park",
                device: "online",
                alerts: 1,
                hr: 88,
                spo2: 97,
                temp: 37.1,
            },
            {
                id: "218",
                resident: "Helen Park",
                condition: "Active",
                caregiver: "S. Lee",
                device: "online",
                alerts: 0,
                hr: 72,
                spo2: 98,
                temp: 36.6,
            },
            {
                id: "220",
                resident: "James Wright",
                condition: "Warning",
                caregiver: "T. Kim",
                device: "online",
                alerts: 1,
                hr: 95,
                spo2: 96,
                temp: 37.3,
            },
            {
                id: "222",
                resident: "Clara Davis",
                condition: "Active",
                caregiver: "M. Santos",
                device: "online",
                alerts: 0,
                hr: 68,
                spo2: 99,
                temp: 36.4,
            },
        ],
    },
    Garden: {
        color: C.green,
        rooms: [
            {
                id: "108",
                resident: "George Miller",
                condition: "Resting",
                caregiver: "G. Wu",
                device: "online",
                alerts: 0,
                hr: 61,
                spo2: 98,
                temp: 36.5,
            },
            {
                id: "110",
                resident: "Evelyn Turner",
                condition: "Critical",
                caregiver: "G. Wu",
                device: "online",
                alerts: 3,
                hr: 118,
                spo2: 91,
                temp: 38.2,
            },
            {
                id: "112",
                resident: "Frank Harris",
                condition: "Active",
                caregiver: "J. Park",
                device: "offline",
                alerts: 0,
                hr: null,
                spo2: null,
                temp: null,
            },
        ],
    },
    Maple: {
        color: C.purple,
        rooms: [
            {
                id: "305",
                resident: "Alice Morgan",
                condition: "Resting",
                caregiver: "T. Kim",
                device: "online",
                alerts: 0,
                hr: 64,
                spo2: 99,
                temp: 36.3,
            },
            {
                id: "307",
                resident: "Harold Scott",
                condition: "Active",
                caregiver: "S. Lee",
                device: "online",
                alerts: 1,
                hr: 78,
                spo2: 97,
                temp: 36.9,
            },
        ],
    },
    Oak: {
        color: C.teal,
        rooms: [
            {
                id: "401",
                resident: "Dorothy Lewis",
                condition: "Warning",
                caregiver: "G. Wu",
                device: "online",
                alerts: 1,
                hr: 91,
                spo2: 96,
                temp: 37.4,
            },
            {
                id: "403",
                resident: "Raymond Hall",
                condition: "Active",
                caregiver: "M. Santos",
                device: "online",
                alerts: 0,
                hr: 74,
                spo2: 98,
                temp: 36.7,
            },
        ],
    },
};

const COND_COLOR = (c) =>
    c === "Critical"
        ? C.red
        : c === "Warning"
          ? C.amber
          : c === "Active"
            ? C.green
            : C.blue400;

const COND_ICON = (c) =>
    c === "Critical"
        ? "🔴"
        : c === "Warning"
          ? "🟡"
          : c === "Active"
            ? "🟢"
            : "🔵";

// ── ROOM MODAL ─────────────────────────────────────────────────────
function RoomModal({ room, wingName, onClose }) {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const cc = COND_COLOR(room.condition);

    const modal = (
        <div
            className="room-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="room-modal" role="dialog" aria-modal="true">
                {/* Top accent stripe */}
                <div
                    className="room-modal__stripe"
                    style={{ background: cc }}
                />

                {/* Header */}
                <div className="room-modal__header">
                    <div>
                        <div className="room-modal__room-num">
                            ROOM {room.id} · {wingName} WING
                        </div>
                        <h2 className="room-modal__resident-name">
                            {room.resident}
                        </h2>
                    </div>
                    <button
                        className="room-modal__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="room-modal__body">
                    {/* Identity row */}
                    <div className="room-modal__identity">
                        <Avatar name={room.resident} size={52} color={cc} />
                        <div className="room-modal__identity-info">
                            <div className="room-modal__badges">
                                <Badge color={cc}>
                                    {COND_ICON(room.condition)} {room.condition}
                                </Badge>
                                {room.alerts > 0 && (
                                    <Badge color={C.red}>
                                        ⚠ {room.alerts} alert
                                        {room.alerts > 1 ? "s" : ""}
                                    </Badge>
                                )}
                                {room.device === "offline" && (
                                    <Badge color={C.purple}>📡 Offline</Badge>
                                )}
                            </div>
                            <div style={{ fontSize: 12, color: C.textSec }}>
                                Caregiver:{" "}
                                <strong style={{ color: C.text }}>
                                    {room.caregiver}
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* Live vitals */}
                    {room.device === "online" && room.hr ? (
                        <div className="room-modal__vitals">
                            <div className="room-modal__vital">
                                <div className="room-modal__vital-label">
                                    Heart Rate
                                </div>
                                <div
                                    className="room-modal__vital-val"
                                    style={{
                                        color:
                                            room.hr > 100
                                                ? C.red
                                                : room.hr > 90
                                                  ? C.amber
                                                  : C.green,
                                    }}
                                >
                                    {room.hr}
                                </div>
                                <div className="room-modal__vital-unit">
                                    bpm
                                </div>
                            </div>
                            <div className="room-modal__vital">
                                <div className="room-modal__vital-label">
                                    SpO₂
                                </div>
                                <div
                                    className="room-modal__vital-val"
                                    style={{
                                        color:
                                            room.spo2 < 94
                                                ? C.red
                                                : room.spo2 < 96
                                                  ? C.amber
                                                  : C.green,
                                    }}
                                >
                                    {room.spo2}%
                                </div>
                                <div className="room-modal__vital-unit">
                                    oxygen
                                </div>
                            </div>
                            <div className="room-modal__vital">
                                <div className="room-modal__vital-label">
                                    Temp
                                </div>
                                <div
                                    className="room-modal__vital-val"
                                    style={{
                                        color:
                                            room.temp > 38
                                                ? C.red
                                                : room.temp > 37.5
                                                  ? C.amber
                                                  : C.green,
                                    }}
                                >
                                    {room.temp}
                                </div>
                                <div className="room-modal__vital-unit">°C</div>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                background: C.purple + "12",
                                border: `1px solid ${C.purple}30`,
                                borderRadius: 10,
                                padding: "12px 14px",
                                fontSize: 12,
                                color: C.purple,
                                fontWeight: 600,
                            }}
                        >
                            📡 Device offline — vitals unavailable
                        </div>
                    )}

                    {/* Info grid */}
                    <div className="room-modal__grid">
                        {[
                            { label: "WING", value: wingName },
                            { label: "ROOM", value: `#${room.id}` },
                            { label: "CAREGIVER", value: room.caregiver },
                            {
                                label: "DEVICE",
                                value:
                                    room.device === "online"
                                        ? "● Online"
                                        : "⚠ Offline",
                            },
                            { label: "CONDITION", value: room.condition },
                            {
                                label: "ALERTS",
                                value:
                                    room.alerts > 0
                                        ? `${room.alerts} active`
                                        : "None",
                            },
                        ].map(({ label, value }) => (
                            <div key={label} className="room-modal__field">
                                <div className="room-modal__field-label">
                                    {label}
                                </div>
                                <div
                                    className="room-modal__field-value"
                                    style={{
                                        color:
                                            label === "DEVICE" &&
                                            room.device === "offline"
                                                ? C.purple
                                                : label === "ALERTS" &&
                                                    room.alerts > 0
                                                  ? C.red
                                                  : label === "CONDITION"
                                                    ? cc
                                                    : C.text,
                                    }}
                                >
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="room-modal__actions">
                        <div className="room-modal__action-row">
                            <Btn
                                variant="primary"
                                size="sm"
                                style={{ flex: 1 }}
                            >
                                View Resident Profile
                            </Btn>
                            <Btn variant="ghost" size="sm" style={{ flex: 1 }}>
                                Camera Feed
                            </Btn>
                        </div>
                        {room.alerts > 0 && (
                            <Btn
                                variant="danger"
                                size="sm"
                                style={{ width: "100%" }}
                            >
                                🚨 View {room.alerts} Active Alert
                                {room.alerts > 1 ? "s" : ""}
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
export default function LiveFloorPlan() {
    const [activeWing, setActiveWing] = useState("Sunrise");
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [, setTick] = useState(0);
    const [viewMode, setViewMode] = useState("floor");

    useEffect(() => {
        const t = setInterval(() => setTick((x) => x + 1), 3000);
        return () => clearInterval(t);
    }, []);

    const wing = WINGS[activeWing];
    const allRooms = Object.values(WINGS).flatMap((w) => w.rooms);
    const criticalCount = allRooms.filter(
        (r) => r.condition === "Critical",
    ).length;

    const openRoom = (room) => setSelectedRoom(room);
    const closeRoom = () => setSelectedRoom(null);

    return (
        <div className="floorplan-page">
            {/* Header */}
            <div className="floorplan-header">
                <div className="floorplan-header-left">
                    <div className="floorplan-live">
                        <div className="floorplan-live__dot" />
                        <span>LIVE · REAL-TIME</span>
                    </div>
                </div>
                <div className="floorplan-header-right">
                    <div className="floorplan-view-toggle">
                        <button
                            className={viewMode === "floor" ? "active" : ""}
                            onClick={() => setViewMode("floor")}
                        >
                            🗺 Floor View
                        </button>
                        <button
                            className={viewMode === "list" ? "active" : ""}
                            onClick={() => setViewMode("list")}
                        >
                            ☰ Room List
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick stats */}
            <div className="floorplan-stats">
                {[
                    {
                        label: "Total Rooms",
                        v: allRooms.length,
                        color: C.blue600,
                    },
                    { label: "Critical", v: criticalCount, color: C.red },
                    {
                        label: "Warning",
                        v: allRooms.filter((r) => r.condition === "Warning")
                            .length,
                        color: C.amber,
                    },
                    {
                        label: "Devices Offline",
                        v: allRooms.filter((r) => r.device === "offline")
                            .length,
                        color: C.purple,
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        className="floorplan-stat"
                        style={{ color: s.color }}
                    >
                        <div
                            className="floorplan-stat__value"
                            style={{ color: s.color }}
                        >
                            {s.v}
                        </div>
                        <div className="floorplan-stat__label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Wing tabs */}
            <div className="floorplan-wings">
                {Object.entries(WINGS).map(([name, data]) => {
                    const wingAlerts = data.rooms.reduce(
                        (a, r) => a + r.alerts,
                        0,
                    );
                    const isActive = activeWing === name;
                    return (
                        <button
                            key={name}
                            className={`wing-tab ${isActive ? "wing-tab--active" : ""}`}
                            onClick={() => {
                                setActiveWing(name);
                                closeRoom();
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontWeight: 800,
                                    color: isActive ? data.color : C.textSec,
                                    fontSize: 13,
                                    letterSpacing: "0.01em",
                                }}
                            >
                                <span
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 2,
                                        background: data.color,
                                        boxShadow: `0 0 0 2px ${data.color}25`,
                                    }}
                                />
                                {name} Wing
                            </span>
                            <span
                                style={{
                                    fontSize: 10,
                                    color: C.textMuted,
                                    fontWeight: 600,
                                    marginLeft: 16,
                                    letterSpacing: "0.04em",
                                    textTransform: "uppercase",
                                }}
                            >
                                {data.rooms.length} rooms
                            </span>
                            {wingAlerts > 0 && (
                                <div
                                    className="wing-tab__badge"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #ef4444, #dc2626)",
                                    }}
                                >
                                    {wingAlerts}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Floor / List view */}
            {viewMode === "floor" ? (
                <Card p="20px">
                    <SectionHeader
                        title={`${activeWing} Wing — Floor View`}
                        sub={`${wing.rooms.length} rooms · Tap a room for details`}
                    />
                    <div className="floorplan-canvas">
                        {/* Corridor */}
                        <div
                            className="floorplan-corridor"
                            style={{
                                background: wing.color + "12",
                                border: `1px dashed ${wing.color}50`,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 10,
                                    color: wing.color,
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                }}
                            >
                                CORRIDOR
                            </span>
                        </div>

                        {/* Room grid */}
                        <div className="floorplan-rooms">
                            {wing.rooms.map((room) => {
                                const cc = COND_COLOR(room.condition);
                                return (
                                    <div
                                        key={room.id}
                                        className="floorplan-room"
                                        style={{
                                            borderColor:
                                                room.condition === "Critical"
                                                    ? cc
                                                    : C.border,
                                            background:
                                                room.condition === "Critical"
                                                    ? cc + "08"
                                                    : "#fff",
                                        }}
                                        onClick={() => openRoom(room)}
                                    >
                                        {room.condition === "Critical" && (
                                            <div
                                                className="floorplan-room__pulse"
                                                style={{ background: cc }}
                                            />
                                        )}
                                        {room.alerts > 0 && (
                                            <div className="floorplan-room__alert-badge">
                                                {room.alerts}
                                            </div>
                                        )}

                                        <div className="floorplan-room__header">
                                            <span
                                                style={{
                                                    fontFamily: F.mono,
                                                    fontSize: 10,
                                                    fontWeight: 800,
                                                    color: C.textSec,
                                                }}
                                            >
                                                {room.id}
                                            </span>
                                            <span style={{ fontSize: 12 }}>
                                                {COND_ICON(room.condition)}
                                            </span>
                                        </div>

                                        <Avatar
                                            name={room.resident}
                                            size={30}
                                            color={cc}
                                        />

                                        <div
                                            style={{
                                                marginTop: 4,
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 1,
                                            }}
                                        >
                                            <div className="floorplan-room__name">
                                                {room.resident.split(" ")[0]}
                                            </div>
                                            <div className="floorplan-room__surname">
                                                {room.resident
                                                    .split(" ")
                                                    .slice(1)
                                                    .join(" ")}
                                            </div>
                                        </div>

                                        <Badge
                                            color={cc}
                                            style={{
                                                fontSize: 8,
                                                padding: "2px 6px",
                                                marginTop: 4,
                                            }}
                                        >
                                            {room.condition}
                                        </Badge>

                                        {room.device === "offline" && (
                                            <div
                                                style={{
                                                    fontSize: 8,
                                                    color: C.purple,
                                                    fontWeight: 700,
                                                    marginTop: 3,
                                                }}
                                            >
                                                📡 OFFLINE
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Empty/vacant rooms */}
                            {Array.from({
                                length: Math.max(0, 6 - wing.rooms.length),
                            }).map((_, i) => (
                                <div
                                    key={`empty-${i}`}
                                    className="floorplan-room floorplan-room--empty"
                                >
                                    <span
                                        style={{
                                            fontSize: 10,
                                            color: C.textMuted,
                                        }}
                                    >
                                        Vacant
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="floorplan-legend">
                            {[
                                { label: "Critical", color: C.red },
                                { label: "Warning", color: C.amber },
                                { label: "Active", color: C.green },
                                { label: "Resting", color: C.blue400 },
                                { label: "Device Offline", color: C.purple },
                            ].map((l) => (
                                <div
                                    key={l.label}
                                    className="floorplan-legend-item"
                                >
                                    <div
                                        className="floorplan-legend-dot"
                                        style={{ background: l.color }}
                                    />
                                    {l.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            ) : (
                <Card p="0">
                    <div className="room-list-header">
                        <span className="room-list-header__title">
                            {activeWing} Wing · {wing.rooms.length} Rooms
                        </span>
                    </div>
                    {wing.rooms.map((room, i) => {
                        const cc = COND_COLOR(room.condition);
                        return (
                            <div
                                key={room.id}
                                className="room-list-row"
                                style={{
                                    borderBottom:
                                        i < wing.rooms.length - 1
                                            ? `1px solid ${C.border}`
                                            : "none",
                                    borderLeft: `3px solid ${cc}`,
                                }}
                                onClick={() => openRoom(room)}
                            >
                                <div
                                    style={{
                                        fontFamily: F.mono,
                                        fontSize: 13,
                                        fontWeight: 800,
                                        color: C.textSec,
                                        width: 38,
                                    }}
                                >
                                    #{room.id}
                                </div>
                                <Avatar
                                    name={room.resident}
                                    size={34}
                                    color={cc}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: C.text,
                                        }}
                                    >
                                        {room.resident}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: C.textMuted,
                                        }}
                                    >
                                        {room.caregiver} ·{" "}
                                        {room.device === "offline"
                                            ? "📡 Offline"
                                            : "● Online"}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 5,
                                        flexShrink: 0,
                                        flexWrap: "wrap",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Badge color={cc} style={{ fontSize: 10 }}>
                                        {room.condition}
                                    </Badge>
                                    {room.alerts > 0 && (
                                        <Badge
                                            color={C.red}
                                            style={{ fontSize: 10 }}
                                        >
                                            ⚠ {room.alerts}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </Card>
            )}

            {/* Room detail modal */}
            {selectedRoom && (
                <RoomModal
                    room={selectedRoom}
                    wing={wing}
                    wingName={activeWing}
                    onClose={closeRoom}
                />
            )}
        </div>
    );
}
