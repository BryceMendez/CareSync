import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Switch,
    Platform,
} from "react-native";

// ─── Design Tokens ──────────────────────────────────────────────────────────
const C = {
    bg: "#F7F8FC",
    surface: "#FFFFFF",
    accent: "#1A56DB",
    accentBright: "#3B82F6",
    accentSoft: "#EBF2FF",
    accentMid: "#BFDBFE",
    textPrimary: "#0D1B3E",
    textSecondary: "#4B5E82",
    textMuted: "#9AAABE",
    green: "#16A34A",
    greenSoft: "#DCFCE7",
    greenText: "#16A34A",
    red: "#DC2626",
    redSoft: "#FEE2E2",
    redText: "#B91C1C",
    amber: "#D97706",
    amberSoft: "#FEF3C7",
    amberText: "#92400E",
    border: "#E8EDFB",
    divider: "#F1F4FB",
};

const SHADOW_SM = {
    shadowColor: "#1A3C6E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
};

// ─── Bottom Tab Bar ─────────────────────────────────────────────────────────
export function StaffTabBar({ active, onPress }) {
    const tabs = [
        { id: "home", label: "Home", icon: "🏠" },
        { id: "alerts", label: "Alerts", icon: "🔔" },
        { id: "residents", label: "Residents", icon: "👥" },
        { id: "camera", label: "Camera", icon: "📷" },
        { id: "logs", label: "Logs", icon: "📋" },
    ];
    return (
        <View style={tabStyles.container}>
            {tabs.map((t) => (
                <TouchableOpacity
                    key={t.id}
                    style={tabStyles.item}
                    onPress={() => onPress(t.id)}
                    activeOpacity={0.7}
                >
                    <Text style={[tabStyles.icon, active === t.id && tabStyles.iconActive]}>
                        {t.icon}
                    </Text>
                    <Text style={[tabStyles.label, active === t.id && tabStyles.labelActive]}>
                        {t.label}
                    </Text>
                    {active === t.id && <View style={tabStyles.dot} />}
                </TouchableOpacity>
            ))}
        </View>
    );
}

const tabStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#E3F2FD",
        paddingBottom: 26,
        paddingTop: 10,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 10,
    },
    item: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
    icon: { fontSize: 21, marginBottom: 1, opacity: 0.4 },
    iconActive: { opacity: 1 },
    label: { fontSize: 10, color: "#B0BEC5", fontWeight: "600" },
    labelActive: { color: "#2196F3", fontWeight: "700" },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#2196F3",
        marginTop: 2,
    },
});

// ─── Tab Pill ───────────────────────────────────────────────────────────────
function TabPill({ label, count, active, onPress }) {
    return (
        <TouchableOpacity
            style={[tp.pill, active && tp.pillActive]}
            onPress={onPress}
            activeOpacity={0.75}
        >
            <Text style={[tp.label, active && tp.labelActive]}>{label}</Text>
            {count !== undefined && count > 0 && (
                <View style={[tp.badge, active && tp.badgeActive]}>
                    <Text style={[tp.badgeText, active && tp.badgeTextActive]}>
                        {count}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const tp = StyleSheet.create({
    pill: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 30,
        backgroundColor: "transparent",
        gap: 6,
    },
    pillActive: {
        backgroundColor: C.accent,
    },
    label: {
        fontSize: 13,
        fontWeight: "700",
        color: C.textMuted,
    },
    labelActive: {
        color: "#fff",
    },
    badge: {
        backgroundColor: C.redSoft,
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    badgeActive: {
        backgroundColor: "rgba(255,255,255,0.3)",
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "800",
        color: C.red,
    },
    badgeTextActive: {
        color: "#fff",
    },
});

// ─── Notification Item ──────────────────────────────────────────────────────
function NotificationItem({ notification, onPress }) {
    const typeConfig = {
        critical: { color: "#DC2626", bg: "#FEE2E2", icon: "🚨", label: "Critical" },
        alert: { color: "#D97706", bg: "#FEF3C7", icon: "⚠️", label: "Alert" },
        task: { color: C.accentBright, bg: C.accentSoft, icon: "📋", label: "Task" },
        resident: { color: "#7C3AED", bg: "#EDE9FE", icon: "👤", label: "Resident" },
        shift: { color: C.green, bg: C.greenSoft, icon: "🕐", label: "Shift" },
    };

    const config = typeConfig[notification.type] || typeConfig.task;

    return (
        <TouchableOpacity
            style={[ni.wrap, !notification.read && ni.unread, notification.priority === "urgent" && ni.urgent]}
            onPress={() => onPress(notification)}
            activeOpacity={0.7}
        >
            <View style={[ni.iconBox, { backgroundColor: config.bg }]}>
                <Text style={{ fontSize: 18 }}>{config.icon}</Text>
            </View>
            <View style={ni.content}>
                <View style={ni.topRow}>
                    <Text style={ni.title} numberOfLines={1}>{notification.title}</Text>
                    <View style={[ni.typeChip, { backgroundColor: config.bg }]}>
                        <Text style={[ni.typeText, { color: config.color }]}>{config.label}</Text>
                    </View>
                </View>
                <Text style={ni.message} numberOfLines={2}>{notification.message}</Text>
                <View style={ni.bottomRow}>
                    <Text style={ni.time}>{notification.time}</Text>
                    {notification.room && (
                        <View style={ni.roomTag}>
                            <Text style={ni.roomText}>{notification.room}</Text>
                        </View>
                    )}
                </View>
            </View>
            {!notification.read && <View style={ni.dot} />}
        </TouchableOpacity>
    );
}

const ni = StyleSheet.create({
    wrap: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: C.divider,
    },
    unread: {
        backgroundColor: "#FAFBFF",
    },
    urgent: {
        backgroundColor: "#FFFBFB",
        borderLeftWidth: 3,
        borderLeftColor: "#DC2626",
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    content: { flex: 1 },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: "700",
        color: C.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    typeChip: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
    },
    typeText: { fontSize: 9, fontWeight: "800" },
    message: {
        fontSize: 13,
        color: C.textSecondary,
        lineHeight: 19,
        marginBottom: 6,
    },
    bottomRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    time: { fontSize: 11, color: C.textMuted, fontWeight: "500" },
    roomTag: {
        backgroundColor: C.accentSoft,
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    roomText: { fontSize: 10, color: C.accent, fontWeight: "700" },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: C.accentBright,
        marginTop: 8,
        flexShrink: 0,
    },
});

// ─── Setting Row ────────────────────────────────────────────────────────────
function SettingRow({ icon, label, description, value, onToggle, last }) {
    return (
        <View style={[sr.wrap, !last && sr.border]}>
            <View style={sr.iconBox}>
                <Text style={{ fontSize: 20 }}>{icon}</Text>
            </View>
            <View style={sr.content}>
                <Text style={sr.label}>{label}</Text>
                {description ? <Text style={sr.desc}>{description}</Text> : null}
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: C.border, true: C.accentMid }}
                thumbColor={value ? C.accent : "#fff"}
            />
        </View>
    );
}

const sr = StyleSheet.create({
    wrap: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: C.divider,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: C.accentSoft,
        alignItems: "center",
        justifyContent: "center",
    },
    content: { flex: 1 },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: C.textPrimary,
        marginBottom: 2,
    },
    desc: { fontSize: 12, color: C.textMuted, lineHeight: 17 },
});

// ─── Mock Notification Data (Staff) ──────────────────────────────────────────
const MOCK_NOTIFICATIONS = [
    {
        id: "s1",
        type: "critical",
        title: "Fall Detected — James Wilson",
        message: "Room 204. Immediate response required. Fall sensor activated at bed area.",
        time: "Just now",
        read: false,
        priority: "urgent",
        room: "Room 204",
        date: "2024-10-25",
    },
    {
        id: "s2",
        type: "task",
        title: "Medication Round — Morning",
        message: "8 residents pending morning medication in East Wing, Rooms 201-210.",
        time: "5 minutes ago",
        read: false,
        room: "East Wing",
        date: "2024-10-25",
    },
    {
        id: "s3",
        type: "resident",
        title: "Eleanor Rigby — Mood Change",
        message: "Resident showing signs of agitation. Check-in recommended within 30 minutes.",
        time: "15 minutes ago",
        read: false,
        room: "Room 308",
        date: "2024-10-25",
    },
    {
        id: "s4",
        type: "shift",
        title: "Shift Change in 30 Minutes",
        message: "Your morning shift ends at 3:00 PM. Please complete pending tasks and handover notes.",
        time: "30 minutes ago",
        read: true,
        date: "2024-10-25",
    },
    {
        id: "s5",
        type: "task",
        title: "Vitals Check Overdue — Room 216",
        message: "Scheduled vitals check for Henry Smith is 20 minutes overdue.",
        time: "1 hour ago",
        read: true,
        room: "Room 216",
        date: "2024-10-25",
    },
    {
        id: "s6",
        type: "alert",
        title: "Missed Medication Alert",
        message: "Aspirin dose for Martha Stewart (Room 208-B) was not administered on schedule.",
        time: "2 hours ago",
        read: true,
        room: "Room 208-B",
        date: "2024-10-25",
    },
    {
        id: "s7",
        type: "resident",
        title: "New Admission — Robert Frost",
        message: "New resident assigned to Room 214. Care plan and meds need review.",
        time: "Yesterday, 2:00 PM",
        read: true,
        room: "Room 214",
        date: "2024-10-24",
    },
    {
        id: "s8",
        type: "shift",
        title: "Schedule Update — Next Week",
        message: "Your shift next Monday has been changed from Morning to Evening (2PM-10PM).",
        time: "Yesterday, 10:00 AM",
        read: true,
        date: "2024-10-24",
    },
    {
        id: "s9",
        type: "alert",
        title: "Low Stock — Room 210 Supplies",
        message: "Medical supplies for Room 210 are below minimum threshold. Restock needed.",
        time: "October 23, 4:30 PM",
        read: true,
        room: "Room 210",
        date: "2024-10-23",
    },
    {
        id: "s10",
        type: "critical",
        title: "Emergency — Code Blue",
        message: "Code Blue called in Dining Hall. All available staff respond immediately.",
        time: "October 22, 1:15 PM",
        read: true,
        priority: "urgent",
        date: "2024-10-22",
    },
];

// ─── Main StaffAlertsScreen ─────────────────────────────────────────────────
export default function StaffAlertsScreen({ onNavigate }) {
    const [activeTab, setActiveTab] = useState("alerts");
    const [subTab, setSubTab] = useState("notifications");

    // Notification settings (staff-specific)
    const [settings, setSettings] = useState({
        emergencyAlerts: true,
        residentAlerts: true,
        taskReminders: true,
        medicationAlerts: true,
        shiftUpdates: true,
        facilityAnnouncements: false,
        pushNotifications: true,
        soundEnabled: true,
        vibrationEnabled: true,
    });

    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [selectedNotif, setSelectedNotif] = useState(null);

    const toggleSetting = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setSelectedNotif(null);
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter((n) => !n.read).length;
    const criticalCount = notifications.filter((n) => n.type === "critical" && !n.read).length;

    const handleNavigate = (id) => {
        setActiveTab(id);
        onNavigate && onNavigate(id);
    };

    // ── Render Sub-Screens ────────────────────────────────────────────────

    const renderNotificationsTab = () => (
        <>
            {unreadCount > 0 && (
                <View style={s.actionRow}>
                    {criticalCount > 0 && (
                        <View style={s.criticalBanner}>
                            <Text style={s.criticalText}>🚨 {criticalCount} critical</Text>
                        </View>
                    )}
                    <TouchableOpacity style={s.markAllBtn} onPress={markAllAsRead} activeOpacity={0.7}>
                        <Text style={s.markAllText}>Mark all read ({unreadCount})</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={s.card}>
                {notifications.length === 0 ? (
                    <View style={s.emptyState}>
                        <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
                        <Text style={s.emptyTitle}>All Clear</Text>
                        <Text style={s.emptySubtitle}>
                            No pending alerts or notifications.
                        </Text>
                    </View>
                ) : (
                    notifications.map((notif) => (
                        <NotificationItem
                            key={notif.id}
                            notification={notif}
                            onPress={(n) => setSelectedNotif(n)}
                        />
                    ))
                )}
            </View>
        </>
    );

    const renderHistoryTab = () => {
        const grouped = notifications.reduce((acc, n) => {
            if (!acc[n.date]) acc[n.date] = [];
            acc[n.date].push(n);
            return acc;
        }, {});

        const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

        return sortedDates.map((date) => (
            <View key={date}>
                <Text style={s.dateHeader}>
                    {date === new Date().toISOString().split("T")[0] ? "Today" : date}
                </Text>
                <View style={s.card}>
                    {grouped[date].map((notif) => (
                        <NotificationItem
                            key={notif.id}
                            notification={notif}
                            onPress={(n) => setSelectedNotif(n)}
                        />
                    ))}
                </View>
            </View>
        ));
    };

    const renderSettingsTab = () => (
        <>
            <Text style={s.sectionLabel}>GENERAL</Text>
            <View style={s.card}>
                <SettingRow
                    icon="🔔"
                    label="Push Notifications"
                    description="Receive notifications on your device"
                    value={settings.pushNotifications}
                    onToggle={() => toggleSetting("pushNotifications")}
                />
                <SettingRow
                    icon="🔊"
                    label="Sound"
                    description="Play sound for critical alerts"
                    value={settings.soundEnabled}
                    onToggle={() => toggleSetting("soundEnabled")}
                />
                <SettingRow
                    icon="📳"
                    label="Vibration"
                    description="Vibrate for urgent notifications"
                    value={settings.vibrationEnabled}
                    onToggle={() => toggleSetting("vibrationEnabled")}
                    last
                />
            </View>

            <Text style={s.sectionLabel}>ALERT TYPES</Text>
            <View style={s.card}>
                <SettingRow
                    icon="🚨"
                    label="Emergency Alerts"
                    description="Code Blue, falls, medical emergencies"
                    value={settings.emergencyAlerts}
                    onToggle={() => toggleSetting("emergencyAlerts")}
                />
                <SettingRow
                    icon="👤"
                    label="Resident Alerts"
                    description="Mood changes, unusual activity, check-ins"
                    value={settings.residentAlerts}
                    onToggle={() => toggleSetting("residentAlerts")}
                />
                <SettingRow
                    icon="📋"
                    label="Task Reminders"
                    description="Upcoming and overdue tasks"
                    value={settings.taskReminders}
                    onToggle={() => toggleSetting("taskReminders")}
                />
                <SettingRow
                    icon="💊"
                    label="Medication Alerts"
                    description="Medication schedules and missed doses"
                    value={settings.medicationAlerts}
                    onToggle={() => toggleSetting("medicationAlerts")}
                />
                <SettingRow
                    icon="🕐"
                    label="Shift Updates"
                    description="Schedule changes, shift reminders"
                    value={settings.shiftUpdates}
                    onToggle={() => toggleSetting("shiftUpdates")}
                />
                <SettingRow
                    icon="🏢"
                    label="Facility Announcements"
                    description="General updates from administration"
                    value={settings.facilityAnnouncements}
                    onToggle={() => toggleSetting("facilityAnnouncements")}
                    last
                />
            </View>
        </>
    );

    const renderDetail = () => {
        if (!selectedNotif) return null;
        const typeConf = {
            critical: { color: "#DC2626", bg: "#FEE2E2" },
            alert: { color: "#D97706", bg: "#FEF3C7" },
            task: { color: C.accentBright, bg: C.accentSoft },
            resident: { color: "#7C3AED", bg: "#EDE9FE" },
            shift: { color: C.green, bg: C.greenSoft },
        };
        const conf = typeConf[selectedNotif.type] || typeConf.task;

        return (
            <View style={s.detailOverlay}>
                <View style={s.detailCard}>
                    <View style={[s.detailIcon, { backgroundColor: conf.bg }]}>
                        <Text style={{ fontSize: 32 }}>📋</Text>
                    </View>
                    <View style={[s.detailTypeBadge, { backgroundColor: conf.bg }]}>
                        <Text style={[s.detailTypeText, { color: conf.color }]}>
                            {selectedNotif.type.toUpperCase()}
                        </Text>
                    </View>
                    <Text style={s.detailTitle}>{selectedNotif.title}</Text>
                    <Text style={s.detailMessage}>{selectedNotif.message}</Text>
                    {selectedNotif.room && (
                        <View style={s.detailRoomTag}>
                            <Text style={s.detailRoomText}>📍 {selectedNotif.room}</Text>
                        </View>
                    )}
                    <Text style={s.detailTime}>{selectedNotif.time}</Text>

                    <View style={s.detailActions}>
                        <TouchableOpacity
                            style={s.detailDismissBtn}
                            onPress={() => markAsRead(selectedNotif.id)}
                            activeOpacity={0.85}
                        >
                            <Text style={s.detailDismissText}>Dismiss</Text>
                        </TouchableOpacity>
                        {selectedNotif.type === "critical" && (
                            <TouchableOpacity
                                style={s.detailRespondBtn}
                                onPress={() => markAsRead(selectedNotif.id)}
                                activeOpacity={0.85}
                            >
                                <Text style={s.detailRespondText}>Respond</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity
                    style={s.backBtn}
                    onPress={() => handleNavigate("home")}
                    activeOpacity={0.75}
                >
                    <Text style={s.backIcon}>‹</Text>
                </TouchableOpacity>
                <View style={s.headerCenter}>
                    <Text style={s.headerTitle}>Staff Alerts</Text>
                    {unreadCount > 0 && (
                        <View style={s.headerBadge}>
                            <Text style={s.headerBadgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Sub-tabs */}
            <View style={s.subTabRow}>
                <TabPill
                    label="Inbox"
                    count={unreadCount}
                    active={subTab === "notifications"}
                    onPress={() => setSubTab("notifications")}
                />
                <TabPill
                    label="History"
                    active={subTab === "history"}
                    onPress={() => setSubTab("history")}
                />
                <TabPill
                    label="Settings"
                    active={subTab === "settings"}
                    onPress={() => setSubTab("settings")}
                />
            </View>

            {/* Content */}
            <ScrollView
                contentContainerStyle={s.scroll}
                showsVerticalScrollIndicator={false}
            >
                {subTab === "notifications" && renderNotificationsTab()}
                {subTab === "history" && renderHistoryTab()}
                {subTab === "settings" && renderSettingsTab()}
            </ScrollView>

            {/* Detail Modal */}
            {selectedNotif && renderDetail()}

            <StaffTabBar active={activeTab} onPress={handleNavigate} />
        </View>
    );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    scroll: { paddingBottom: 30 },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: Platform.OS === "ios" ? 58 : 46,
        paddingBottom: 12,
        backgroundColor: C.bg,
    },
    headerCenter: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    headerTitle: { fontSize: 20, fontWeight: "800", color: C.textPrimary },
    headerBadge: {
        backgroundColor: C.red,
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    headerBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: C.surface,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: C.border,
    },
    backIcon: {
        fontSize: 26,
        color: C.textPrimary,
        fontWeight: "300",
        lineHeight: 30,
        marginTop: -2,
    },

    // Sub-tabs
    subTabRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 4,
        backgroundColor: C.surface,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        ...SHADOW_SM,
    },

    // Action row
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 4,
    },
    criticalBanner: {
        backgroundColor: "#FEE2E2",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    criticalText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#DC2626",
    },
    markAllBtn: {},
    markAllText: {
        fontSize: 13,
        fontWeight: "700",
        color: C.accent,
    },

    // Section label
    sectionLabel: {
        fontSize: 11,
        fontWeight: "800",
        color: C.textMuted,
        letterSpacing: 1,
        textTransform: "uppercase",
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 8,
    },

    // Card
    card: {
        marginHorizontal: 16,
        backgroundColor: C.surface,
        borderRadius: 18,
        overflow: "hidden",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: C.border,
        ...SHADOW_SM,
    },

    // Date header
    dateHeader: {
        fontSize: 13,
        fontWeight: "700",
        color: C.textMuted,
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 6,
    },

    // Empty state
    emptyState: {
        alignItems: "center",
        paddingVertical: 40,
        paddingHorizontal: 24,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: C.textPrimary,
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 13,
        color: C.textMuted,
        textAlign: "center",
        lineHeight: 20,
    },

    // Detail Modal
    detailOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        paddingHorizontal: 24,
    },
    detailCard: {
        backgroundColor: C.surface,
        borderRadius: 24,
        padding: 28,
        alignItems: "center",
        width: "100%",
        ...SHADOW_SM,
    },
    detailIcon: {
        width: 72,
        height: 72,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    detailTypeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 16,
    },
    detailTypeText: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
    detailTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: C.textPrimary,
        textAlign: "center",
        marginBottom: 10,
    },
    detailMessage: {
        fontSize: 14,
        color: C.textSecondary,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 12,
    },
    detailRoomTag: {
        backgroundColor: C.accentSoft,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginBottom: 12,
    },
    detailRoomText: { fontSize: 12, color: C.accent, fontWeight: "700" },
    detailTime: {
        fontSize: 12,
        color: C.textMuted,
        marginBottom: 24,
    },
    detailActions: {
        flexDirection: "row",
        gap: 12,
    },
    detailDismissBtn: {
        backgroundColor: C.accent,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 36,
    },
    detailDismissText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 15,
    },
    detailRespondBtn: {
        backgroundColor: "#DC2626",
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 36,
    },
    detailRespondText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 15,
    },
});