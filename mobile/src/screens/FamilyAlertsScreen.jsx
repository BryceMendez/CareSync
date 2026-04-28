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
    accent: "#2563B0",
    accentBright: "#3B82F6",
    accentSoft: "#EBF2FF",
    accentMid: "#BFDBFE",
    textPrimary: "#0F1C35",
    textSecondary: "#5B6B8A",
    textMuted: "#9AAABE",
    green: "#22C55E",
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

// ─── Bottom Tab Bar (Family) ────────────────────────────────────────────────
export function FamilyTabBar({ active, onPress }) {
    const tabs = [
        { id: "home", label: "Home", icon: "🏠" },
        { id: "alerts", label: "Alerts", icon: "🔔" },
        { id: "camera", label: "Camera", icon: "📷" },
        { id: "reports", label: "Reports", icon: "📊" },
        { id: "profile", label: "Profile", icon: "👤" },
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
        alert: { color: C.red, bg: C.redSoft, icon: "⚠️", label: "Alert" },
        reminder: { color: C.accentBright, bg: C.accentSoft, icon: "🔔", label: "Reminder" },
        info: { color: C.accent, bg: C.accentSoft, icon: "ℹ️", label: "Info" },
        success: { color: C.green, bg: C.greenSoft, icon: "✅", label: "Update" },
    };

    const config = typeConfig[notification.type] || typeConfig.info;

    return (
        <TouchableOpacity
            style={[ni.wrap, !notification.read && ni.unread]}
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
                <Text style={ni.time}>{notification.time}</Text>
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
    time: { fontSize: 11, color: C.textMuted, fontWeight: "500" },
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
function SettingRow({ icon, label, description, value, onToggle }) {
    return (
        <View style={sr.wrap}>
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

// ─── Mock Notification Data ─────────────────────────────────────────────────
const MOCK_NOTIFICATIONS = [
    {
        id: "1",
        type: "alert",
        title: "Fall Detected — Nora Roberts",
        message: "Immediate attention required in Room 204. No caregiver has responded yet.",
        time: "2 minutes ago",
        read: false,
        date: "2024-10-25",
    },
    {
        id: "2",
        type: "reminder",
        title: "Medication Reminder",
        message: "Nora's blood pressure medication is scheduled in 15 minutes.",
        time: "30 minutes ago",
        read: false,
        date: "2024-10-25",
    },
    {
        id: "3",
        type: "info",
        title: "Doctor Visit Scheduled",
        message: "Dr. Michelle Cruz will visit Nora tomorrow at 10:00 AM for a routine check-up.",
        time: "2 hours ago",
        read: true,
        date: "2024-10-25",
    },
    {
        id: "4",
        type: "success",
        title: "Daily Report Available",
        message: "Nora's daily activity report for October 24 is now available to view.",
        time: "5 hours ago",
        read: true,
        date: "2024-10-25",
    },
    {
        id: "5",
        type: "info",
        title: "Room Change Notice",
        message: "Nora has been temporarily moved to Room 302 for maintenance in Wing B.",
        time: "Yesterday, 3:15 PM",
        read: true,
        date: "2024-10-24",
    },
    {
        id: "6",
        type: "alert",
        title: "Missed Medication — Nora Roberts",
        message: "Evening medication was not administered on time. Please contact staff.",
        time: "Yesterday, 9:30 PM",
        read: true,
        date: "2024-10-24",
    },
    {
        id: "7",
        type: "reminder",
        title: "Weekly Care Review",
        message: "Your weekly care review with Nurse Sarah is scheduled for Friday at 2:00 PM.",
        time: "October 23, 10:00 AM",
        read: true,
        date: "2024-10-23",
    },
    {
        id: "8",
        type: "success",
        title: "New Photo Uploaded",
        message: "A new photo of Nora from today's garden walk has been added to her gallery.",
        time: "October 22, 4:45 PM",
        read: true,
        date: "2024-10-22",
    },
    {
        id: "9",
        type: "info",
        title: "Facility Update",
        message: "East Wing will undergo maintenance this weekend. No impact on resident care.",
        time: "October 21, 11:00 AM",
        read: true,
        date: "2024-10-21",
    },
    {
        id: "10",
        type: "alert",
        title: "Unusual Activity Detected",
        message: "Motion sensor detected unusual movement in Nora's room at 3:00 AM.",
        time: "October 20, 3:15 AM",
        read: true,
        date: "2024-10-20",
    },
];

// ─── Main FamilyAlertsScreen ────────────────────────────────────────────────
export default function FamilyAlertsScreen({ onNavigate }) {
    const [activeTab, setActiveTab] = useState("alerts");
    const [subTab, setSubTab] = useState("notifications"); // "notifications" | "history" | "settings"

    // Notification settings
    const [settings, setSettings] = useState({
        fallAlerts: true,
        medicationReminders: true,
        dailyReports: true,
        facilityUpdates: false,
        careTeamMessages: true,
        emergencyAlerts: true,
        pushNotifications: true,
    });

    // Notification state
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

    const handleNavigate = (id) => {
        setActiveTab(id);
        onNavigate && onNavigate(id);
    };

    // ── Render Sub-Screens ────────────────────────────────────────────────

    const renderNotificationsTab = () => (
        <>
            {/* Mark all read button */}
            {unreadCount > 0 && (
                <TouchableOpacity style={s.markAllBtn} onPress={markAllAsRead} activeOpacity={0.7}>
                    <Text style={s.markAllText}>Mark all as read ({unreadCount})</Text>
                </TouchableOpacity>
            )}

            <View style={s.card}>
                {notifications.length === 0 ? (
                    <View style={s.emptyState}>
                        <Text style={{ fontSize: 40, marginBottom: 12 }}>🔔</Text>
                        <Text style={s.emptyTitle}>No Notifications</Text>
                        <Text style={s.emptySubtitle}>
                            You're all caught up! New notifications will appear here.
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
        // Group notifications by date
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
                    {grouped[date].map((notif, i) => (
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
            {/* Push Notifications Master Toggle */}
            <Text style={s.sectionLabel}>GENERAL</Text>
            <View style={s.card}>
                <SettingRow
                    icon="🔔"
                    label="Push Notifications"
                    description="Receive notifications on your device"
                    value={settings.pushNotifications}
                    onToggle={() => toggleSetting("pushNotifications")}
                />
            </View>

            <Text style={s.sectionLabel}>ALERT TYPES</Text>
            <View style={s.card}>
                <SettingRow
                    icon="⚠️"
                    label="Emergency Alerts"
                    description="Fall detection, medical emergencies"
                    value={settings.emergencyAlerts}
                    onToggle={() => toggleSetting("emergencyAlerts")}
                />
                <SettingRow
                    icon="🛟"
                    label="Fall Alerts"
                    description="When a fall is detected in your loved one's room"
                    value={settings.fallAlerts}
                    onToggle={() => toggleSetting("fallAlerts")}
                />
                <SettingRow
                    icon="💊"
                    label="Medication Reminders"
                    description="When medications are due or missed"
                    value={settings.medicationReminders}
                    onToggle={() => toggleSetting("medicationReminders")}
                />
                <SettingRow
                    icon="📊"
                    label="Daily Reports"
                    description="When a new daily report is available"
                    value={settings.dailyReports}
                    onToggle={() => toggleSetting("dailyReports")}
                />
                <SettingRow
                    icon="💬"
                    label="Care Team Messages"
                    description="Messages from nurses and caregivers"
                    value={settings.careTeamMessages}
                    onToggle={() => toggleSetting("careTeamMessages")}
                />
                <SettingRow
                    icon="🏢"
                    label="Facility Updates"
                    description="General announcements and updates"
                    value={settings.facilityUpdates}
                    onToggle={() => toggleSetting("facilityUpdates")}
                    last
                />
            </View>
        </>
    );

    const renderDetail = () => {
        if (!selectedNotif) return null;
        const config = {
            alert: { color: C.red, bg: C.redSoft },
            reminder: { color: C.accentBright, bg: C.accentSoft },
            info: { color: C.accent, bg: C.accentSoft },
            success: { color: C.green, bg: C.greenSoft },
        };
        const typeConf = config[selectedNotif.type] || config.info;

        return (
            <View style={s.detailOverlay}>
                <View style={s.detailCard}>
                    <View style={[s.detailIcon, { backgroundColor: typeConf.bg }]}>
                        <Text style={{ fontSize: 32 }}>🔔</Text>
                    </View>
                    <View style={[s.detailTypeBadge, { backgroundColor: typeConf.bg }]}>
                        <Text style={[s.detailTypeText, { color: typeConf.color }]}>
                            {selectedNotif.type.toUpperCase()}
                        </Text>
                    </View>
                    <Text style={s.detailTitle}>{selectedNotif.title}</Text>
                    <Text style={s.detailMessage}>{selectedNotif.message}</Text>
                    <Text style={s.detailTime}>{selectedNotif.time}</Text>

                    <TouchableOpacity
                        style={s.detailCloseBtn}
                        onPress={() => markAsRead(selectedNotif.id)}
                        activeOpacity={0.85}
                    >
                        <Text style={s.detailCloseText}>Dismiss</Text>
                    </TouchableOpacity>
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
                    <Text style={s.headerTitle}>Notifications</Text>
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

            {/* Notification Detail Modal */}
            {selectedNotif && renderDetail()}

            <FamilyTabBar active={activeTab} onPress={handleNavigate} />
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

    // Mark all read
    markAllBtn: {
        marginHorizontal: 20,
        marginTop: 12,
        marginBottom: 4,
        alignSelf: "flex-end",
    },
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
        marginBottom: 16,
    },
    detailTime: {
        fontSize: 12,
        color: C.textMuted,
        marginBottom: 24,
    },
    detailCloseBtn: {
        backgroundColor: C.accent,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 48,
    },
    detailCloseText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 15,
    },
});