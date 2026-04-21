import { useState } from "react";
import { C, F } from "../constants";
import { Badge, Btn, Card, SectionHeader, Divider } from "./UI.jsx";
import "../styles/Settings.css";

const TABS = [
    "General",
    "Notifications",
    "Security",
    "Users & Roles",
    "Integrations",
    "About",
];

const Toggle = ({ value, onChange }) => (
    <div
        className={`toggle ${value ? "toggle--on" : ""}`}
        onClick={() => onChange(!value)}
    >
        <div className="toggle__knob" />
    </div>
);

export default function Settings() {
    const [activeTab, setActiveTab] = useState("General");

    // General settings state
    const [facilityName, setFacilityName] = useState("Sunrise Care Center");
    const [timezone, setTimezone] = useState("Asia/Manila");
    const [language, setLanguage] = useState("English (US)");
    const [theme, setTheme] = useState("Light");

    // Notification settings state
    const [notifs, setNotifs] = useState({
        criticalAlerts: true,
        warningAlerts: true,
        deviceOffline: true,
        shiftReminders: false,
        weeklyReport: true,
        familyMessages: false,
        emailAlerts: true,
        smsAlerts: false,
    });

    // Security settings state
    const [security, setSecurity] = useState({
        twoFactor: true,
        sessionTimeout: "30 minutes",
        ipWhitelist: false,
        auditLog: true,
        passwordExpiry: "90 days",
    });

    const [saved, setSaved] = useState(false);
    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const INTEGRATIONS = [
        {
            name: "Electronic Health Records (EHR)",
            desc: "Sync resident medical records with your EHR system",
            connected: true,
            icon: "🏥",
        },
        {
            name: "Family Portal Mobile App",
            desc: "Enable family member access via mobile app",
            connected: true,
            icon: "📱",
        },
        {
            name: "Emergency Services API",
            desc: "Auto-notify local emergency services on critical alerts",
            connected: false,
            icon: "🚑",
        },
        {
            name: "Pharmacy Management",
            desc: "Connect medication dispensing and tracking",
            connected: false,
            icon: "💊",
        },
        {
            name: "Insurance & Billing",
            desc: "Export care data to insurance and billing platforms",
            connected: false,
            icon: "💼",
        },
    ];

    const ROLES = [
        {
            role: "Super Admin",
            perms: ["All permissions"],
            count: 2,
            color: C.red,
        },
        {
            role: "Admin",
            perms: ["Manage residents", "View reports", "Manage staff"],
            count: 4,
            color: C.purple,
        },
        {
            role: "Nurse Supervisor",
            perms: ["View all wings", "Manage incidents", "View staff"],
            count: 3,
            color: C.blue600,
        },
        {
            role: "Caregiver",
            perms: ["View assigned residents", "Log incidents"],
            count: 8,
            color: C.green,
        },
        {
            role: "IT Staff",
            perms: ["Manage devices", "View system logs"],
            count: 2,
            color: C.teal,
        },
        {
            role: "Family Member",
            perms: ["View linked resident", "Receive alerts"],
            count: 12,
            color: C.amber,
        },
    ];

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div>
                    
                </div>
                {saved && (
                    <div className="settings-saved">✅ Settings saved!</div>
                )}
            </div>

            <div className="settings-layout">
                {/* Sidebar */}
                <div className="settings-sidebar">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            className={`settings-tab-btn ${activeTab === tab ? "settings-tab-btn--active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="settings-content">
                    {activeTab === "General" && (
                        <Card>
                            <SectionHeader
                                title="General Settings"
                                sub="Facility information and display preferences"
                            />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 18,
                                }}
                            >
                                {[
                                    {
                                        label: "Facility Name",
                                        value: facilityName,
                                        set: setFacilityName,
                                        type: "text",
                                    },
                                ].map(({ label, value, set, type }) => (
                                    <div key={label} className="settings-field">
                                        <label>{label}</label>
                                        <input
                                            type={type}
                                            value={value}
                                            onChange={(e) =>
                                                set(e.target.value)
                                            }
                                        />
                                    </div>
                                ))}
                                <div className="settings-field">
                                    <label>Timezone</label>
                                    <select
                                        value={timezone}
                                        onChange={(e) =>
                                            setTimezone(e.target.value)
                                        }
                                    >
                                        {[
                                            "Asia/Manila",
                                            "Asia/Singapore",
                                            "America/New_York",
                                            "America/Chicago",
                                            "Europe/London",
                                            "Australia/Sydney",
                                        ].map((tz) => (
                                            <option key={tz}>{tz}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="settings-field">
                                    <label>Language</label>
                                    <select
                                        value={language}
                                        onChange={(e) =>
                                            setLanguage(e.target.value)
                                        }
                                    >
                                        {[
                                            "English (US)",
                                            "English (UK)",
                                            "Filipino",
                                            "Spanish",
                                            "French",
                                        ].map((l) => (
                                            <option key={l}>{l}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="settings-field">
                                    <label>Theme</label>
                                    <div style={{ display: "flex", gap: 10 }}>
                                        {["Light", "Dark", "System"].map(
                                            (t) => (
                                                <button
                                                    key={t}
                                                    onClick={() => setTheme(t)}
                                                    style={{
                                                        padding: "8px 18px",
                                                        borderRadius: 8,
                                                        border: `1.5px solid ${theme === t ? C.blue500 : C.border}`,
                                                        background:
                                                            theme === t
                                                                ? C.blue50
                                                                : C.surface,
                                                        color:
                                                            theme === t
                                                                ? C.blue600
                                                                : C.textSec,
                                                        fontWeight:
                                                            theme === t
                                                                ? 700
                                                                : 500,
                                                        fontSize: 13,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {t}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>
                                <Btn
                                    variant="primary"
                                    onClick={handleSave}
                                    style={{ alignSelf: "flex-start" }}
                                >
                                    Save Changes
                                </Btn>
                            </div>
                        </Card>
                    )}

                    {activeTab === "Notifications" && (
                        <Card>
                            <SectionHeader
                                title="Notification Preferences"
                                sub="Control which alerts and updates you receive"
                            />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0,
                                }}
                            >
                                {[
                                    {
                                        key: "criticalAlerts",
                                        label: "Critical Alerts",
                                        desc: "Immediate notification for critical incidents",
                                    },
                                    {
                                        key: "warningAlerts",
                                        label: "Warning Alerts",
                                        desc: "Notify on warning-level incidents",
                                    },
                                    {
                                        key: "deviceOffline",
                                        label: "Device Offline Alerts",
                                        desc: "Alert when IoT devices go offline",
                                    },
                                    {
                                        key: "shiftReminders",
                                        label: "Shift Reminders",
                                        desc: "Notify staff before shift changes",
                                    },
                                    {
                                        key: "weeklyReport",
                                        label: "Weekly Report",
                                        desc: "Auto-send weekly summary report",
                                    },
                                    {
                                        key: "familyMessages",
                                        label: "Family Messages",
                                        desc: "Notify on new family portal messages",
                                    },
                                    {
                                        key: "emailAlerts",
                                        label: "Email Alerts",
                                        desc: "Send alerts via email",
                                    },
                                    {
                                        key: "smsAlerts",
                                        label: "SMS Alerts",
                                        desc: "Send critical alerts via SMS",
                                    },
                                ].map((item, i, arr) => (
                                    <div
                                        key={item.key}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "14px 0",
                                            borderBottom:
                                                i < arr.length - 1
                                                    ? `1px solid ${C.border}`
                                                    : "none",
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    color: C.text,
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    color: C.textMuted,
                                                    marginTop: 2,
                                                }}
                                            >
                                                {item.desc}
                                            </div>
                                        </div>
                                        <Toggle
                                            value={notifs[item.key]}
                                            onChange={(v) =>
                                                setNotifs((p) => ({
                                                    ...p,
                                                    [item.key]: v,
                                                }))
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: 16 }}>
                                <Btn
                                    variant="primary"
                                    onClick={handleSave}
                                    style={{ alignSelf: "flex-start" }}
                                >
                                    Save Preferences
                                </Btn>
                            </div>
                        </Card>
                    )}

                    {activeTab === "Security" && (
                        <Card>
                            <SectionHeader
                                title="Security Settings"
                                sub="Authentication and access control"
                            />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 14,
                                }}
                            >
                                {[
                                    {
                                        key: "twoFactor",
                                        label: "Two-Factor Authentication",
                                        desc: "Require 2FA for all admin accounts",
                                    },
                                    {
                                        key: "ipWhitelist",
                                        label: "IP Whitelist",
                                        desc: "Restrict access to whitelisted IP addresses only",
                                    },
                                    {
                                        key: "auditLog",
                                        label: "Audit Logging",
                                        desc: "Log all admin actions for compliance",
                                    },
                                ].map((item, i, arr) => (
                                    <div
                                        key={item.key}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "12px 0",
                                            borderBottom:
                                                i < arr.length - 1
                                                    ? `1px solid ${C.border}`
                                                    : "none",
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    color: C.text,
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    color: C.textMuted,
                                                    marginTop: 2,
                                                }}
                                            >
                                                {item.desc}
                                            </div>
                                        </div>
                                        <Toggle
                                            value={security[item.key]}
                                            onChange={(v) =>
                                                setSecurity((p) => ({
                                                    ...p,
                                                    [item.key]: v,
                                                }))
                                            }
                                        />
                                    </div>
                                ))}
                                <div className="settings-field">
                                    <label>Session Timeout</label>
                                    <select
                                        value={security.sessionTimeout}
                                        onChange={(e) =>
                                            setSecurity((p) => ({
                                                ...p,
                                                sessionTimeout: e.target.value,
                                            }))
                                        }
                                    >
                                        {[
                                            "15 minutes",
                                            "30 minutes",
                                            "1 hour",
                                            "4 hours",
                                            "Never",
                                        ].map((t) => (
                                            <option key={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="settings-field">
                                    <label>Password Expiry</label>
                                    <select
                                        value={security.passwordExpiry}
                                        onChange={(e) =>
                                            setSecurity((p) => ({
                                                ...p,
                                                passwordExpiry: e.target.value,
                                            }))
                                        }
                                    >
                                        {[
                                            "30 days",
                                            "60 days",
                                            "90 days",
                                            "180 days",
                                            "Never",
                                        ].map((t) => (
                                            <option key={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <Divider />
                                <div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: C.text,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Change Admin Password
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 10,
                                        }}
                                    >
                                        {[
                                            "Current Password",
                                            "New Password",
                                            "Confirm New Password",
                                        ].map((label) => (
                                            <div
                                                key={label}
                                                className="settings-field"
                                                style={{ marginBottom: 0 }}
                                            >
                                                <label>{label}</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Btn
                                    variant="primary"
                                    onClick={handleSave}
                                    style={{ alignSelf: "flex-start" }}
                                >
                                    Save Security Settings
                                </Btn>
                            </div>
                        </Card>
                    )}

                    {activeTab === "Users & Roles" && (
                        <Card>
                            <SectionHeader
                                title="Users & Roles"
                                sub="Role-based access control configuration"
                                action={
                                    <Btn variant="primary" size="sm">
                                        + Add Role
                                    </Btn>
                                }
                            />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                }}
                            >
                                {ROLES.map((r) => (
                                    <div
                                        key={r.role}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 14,
                                            padding: "14px 16px",
                                            background: C.bg,
                                            borderRadius: 10,
                                            border: `1px solid ${C.border}`,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: 2,
                                                background: r.color,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                    marginBottom: 4,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        color: C.text,
                                                    }}
                                                >
                                                    {r.role}
                                                </span>
                                                <Badge
                                                    color={r.color}
                                                    style={{ fontSize: 9 }}
                                                >
                                                    {r.count} users
                                                </Badge>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 6,
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                {r.perms.map((p) => (
                                                    <span
                                                        key={p}
                                                        style={{
                                                            fontSize: 10,
                                                            color: C.textSec,
                                                            background:
                                                                C.surface,
                                                            padding: "2px 7px",
                                                            borderRadius: 5,
                                                            border: `1px solid ${C.border}`,
                                                        }}
                                                    >
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <Btn variant="ghost" size="sm">
                                            Edit
                                        </Btn>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeTab === "Integrations" && (
                        <Card>
                            <SectionHeader
                                title="Integrations"
                                sub="Connect external services and platforms"
                            />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 14,
                                }}
                            >
                                {INTEGRATIONS.map((intg) => (
                                    <div
                                        key={intg.name}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 14,
                                            padding: "14px 16px",
                                            background: C.bg,
                                            borderRadius: 10,
                                            border: `1px solid ${intg.connected ? C.greenBorder : C.border}`,
                                        }}
                                    >
                                        <span style={{ fontSize: 24 }}>
                                            {intg.icon}
                                        </span>
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                    marginBottom: 2,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        color: C.text,
                                                    }}
                                                >
                                                    {intg.name}
                                                </span>
                                                {intg.connected && (
                                                    <Badge
                                                        color={C.green}
                                                        style={{ fontSize: 9 }}
                                                    >
                                                        Connected
                                                    </Badge>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    color: C.textMuted,
                                                }}
                                            >
                                                {intg.desc}
                                            </div>
                                        </div>
                                        <Btn
                                            variant={
                                                intg.connected
                                                    ? "secondary"
                                                    : "primary"
                                            }
                                            size="sm"
                                        >
                                            {intg.connected
                                                ? "Configure"
                                                : "Connect"}
                                        </Btn>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeTab === "About" && (
                        <Card>
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "20px 0 10px",
                                }}
                            >
                                <div
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 16,
                                        background: `linear-gradient(135deg, ${C.blue600}, ${C.blue700})`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 12px",
                                    }}
                                >
                                    <svg
                                        width={28}
                                        height={28}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth={2.2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </div>
                                <div
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 800,
                                        color: C.text,
                                    }}
                                >
                                    CareSync Admin
                                </div>
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: C.textMuted,
                                        marginTop: 4,
                                    }}
                                >
                                    Smart AI Surveillance for Assisted Living
                                </div>
                                <Badge
                                    color={C.blue600}
                                    style={{ marginTop: 8 }}
                                >
                                    v2.4.1
                                </Badge>
                            </div>
                            <Divider />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                    padding: "16px 0",
                                }}
                            >
                                {[
                                    { label: "Version", value: "2.4.1" },
                                    {
                                        label: "Build",
                                        value: "20260410-stable",
                                    },
                                    {
                                        label: "AI Engine",
                                        value: "CareAI v3.0",
                                    },
                                    {
                                        label: "Database",
                                        value: "CareSync Cloud DB",
                                    },
                                    {
                                        label: "Last Updated",
                                        value: "April 10, 2026",
                                    },
                                    {
                                        label: "Support",
                                        value: "support@caresync.io",
                                    },
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
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
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
