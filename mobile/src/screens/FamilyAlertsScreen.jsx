import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from "react-native";

const ALERTS = [
    {
        id: "1",
        category: "critical",
        icon: "🔴",
        title: "Fall Detected",
        desc: "Living Room sensor triggered a fall alert. High impact detected near the sofa.",
        time: "2m ago",
        actions: ["Call Emergency", "Check Camera"],
        actionColors: ["#EF5350", "#2196F3"],
    },
    {
        id: "2",
        category: "warning",
        icon: "🟡",
        title: "Unusual Activity",
        desc: "Front door left open for more than 10 minutes during unusual hours.",
        time: "45m ago",
        actions: [],
    },
    {
        id: "3",
        category: "warning",
        icon: "🟡",
        title: "Medication Missed",
        desc: "No motion detected near the medicine cabinet at scheduled time (9:00 AM).",
        time: "2h ago",
        actions: [],
    },
    {
        id: "4",
        category: "resolved",
        icon: "🟢",
        title: "Kitchen Appliance Alert",
        desc: "Stove was left on. Turn off confirmed...",
        time: "3h ago",
        resolvedBy: "RESOLVED BY AUTOMATION",
        actions: [],
    },
    {
        id: "5",
        category: "resolved",
        icon: "🟢",
        title: "Low Heart Rate",
        desc: "Wearable detected dip to 52bpm...",
        time: "Yesterday",
        resolvedBy: "RESOLVED BY USER (MARKED AS INACTIVE)",
        actions: [],
    },
];

// Bottom Tab Bar (Family)
export function FamilyTabBar({ active, onPress }) {
    const tabs = [
        { id: "home", label: "Home", icon: "🏠" },
        { id: "alerts", label: "Alerts", icon: "🔔" },
        { id: "camera", label: "Camera", icon: "📷" },
        { id: "reports", label: "Reports", icon: "📊" },
        { id: "profile", label: "Profile", icon: "👤" },
    ];
    return (
        <View style={tab.container}>
            {tabs.map((t) => (
                <TouchableOpacity
                    key={t.id}
                    style={tab.item}
                    onPress={() => onPress(t.id)}
                >
                    <Text style={tab.icon}>{t.icon}</Text>
                    <Text
                        style={[tab.label, active === t.id && tab.labelActive]}
                    >
                        {t.label}
                    </Text>
                    {active === t.id && <View style={tab.dot} />}
                </TouchableOpacity>
            ))}
        </View>
    );
}

const tab = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#E3F2FD",
        paddingBottom: 20,
        paddingTop: 10,
    },
    item: { flex: 1, alignItems: "center" },
    icon: { fontSize: 20, marginBottom: 2 },
    label: { fontSize: 10, color: "#90A4AE" },
    labelActive: { color: "#2196F3", fontWeight: "700" },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#2196F3",
        marginTop: 2,
    },
});

export default function FamilyAlertsScreen({ onNavigate }) {
    const [activeTab, setActiveTab] = useState("alerts");
    const [filter, setFilter] = useState("All");
    const filters = ["All", "Unread", "Resolved"];

    const filtered =
        filter === "All"
            ? ALERTS
            : filter === "Resolved"
              ? ALERTS.filter((a) => a.category === "resolved")
              : ALERTS.filter((a) => a.category !== "resolved");

    const critical = filtered.filter((a) => a.category === "critical");
    const warnings = filtered.filter((a) => a.category === "warning");
    const resolved = filtered.filter((a) => a.category === "resolved");

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => onNavigate("home")}
                    activeOpacity={0.75}
                >
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Alerts</Text>
                <TouchableOpacity>
                    <Text style={{ fontSize: 20 }}>🚩</Text>
                </TouchableOpacity>
            </View>

            {/* Filter tabs */}
            <View style={styles.filterRow}>
                {filters.map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[
                            styles.filterBtn,
                            filter === f && styles.filterBtnActive,
                        ]}
                        onPress={() => setFilter(f)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                filter === f && styles.filterTextActive,
                            ]}
                        >
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Critical Alerts */}
                {critical.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionLabelCritical}>
                                CRITICAL ALERTS
                            </Text>
                            <View style={styles.newBadge}>
                                <Text style={styles.newBadgeText}>
                                    {critical.length} New
                                </Text>
                            </View>
                        </View>
                        {critical.map((alert) => (
                            <View
                                key={alert.id}
                                style={[
                                    styles.alertCard,
                                    styles.alertCardCritical,
                                ]}
                            >
                                <View style={styles.alertTop}>
                                    <View style={styles.criticalDot} />
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.alertTitleRow}>
                                            <Text style={styles.alertTitle}>
                                                {alert.title}
                                            </Text>
                                            <Text style={styles.alertTime}>
                                                {alert.time}
                                            </Text>
                                        </View>
                                        <Text style={styles.alertDesc}>
                                            {alert.desc}
                                        </Text>
                                    </View>
                                </View>
                                {alert.actions.length > 0 && (
                                    <View style={styles.actionRow}>
                                        {alert.actions.map((a, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                style={[
                                                    styles.actionBtn,
                                                    {
                                                        backgroundColor:
                                                            alert.actionColors[
                                                                i
                                                            ],
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={styles.actionBtnText}
                                                >
                                                    {a}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </>
                )}

                {/* Warnings */}
                {warnings.length > 0 && (
                    <>
                        <Text style={styles.sectionLabelWarning}>WARNINGS</Text>
                        {warnings.map((alert) => (
                            <View
                                key={alert.id}
                                style={[
                                    styles.alertCard,
                                    styles.alertCardWarning,
                                ]}
                            >
                                <View style={styles.alertTop}>
                                    <View style={styles.warningDot} />
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.alertTitleRow}>
                                            <Text style={styles.alertTitle}>
                                                {alert.title}
                                            </Text>
                                            <Text style={styles.alertTime}>
                                                {alert.time}
                                            </Text>
                                        </View>
                                        <Text style={styles.alertDesc}>
                                            {alert.desc}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </>
                )}

                {/* Resolved */}
                {resolved.length > 0 && (
                    <>
                        <Text style={styles.sectionLabelResolved}>
                            RESOLVED
                        </Text>
                        {resolved.map((alert) => (
                            <View
                                key={alert.id}
                                style={[
                                    styles.alertCard,
                                    styles.alertCardResolved,
                                ]}
                            >
                                <View style={styles.alertTop}>
                                    <View style={styles.resolvedDot} />
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.alertTitleRow}>
                                            <Text
                                                style={[
                                                    styles.alertTitle,
                                                    { color: "#78909C" },
                                                ]}
                                            >
                                                {alert.title}
                                            </Text>
                                            <Text style={styles.alertTime}>
                                                {alert.time}
                                            </Text>
                                        </View>
                                        <Text style={styles.alertDesc}>
                                            {alert.desc}
                                        </Text>
                                        {alert.resolvedBy && (
                                            <Text style={styles.resolvedLabel}>
                                                {alert.resolvedBy}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>

            <FamilyTabBar
                active={activeTab}
                onPress={(id) => {
                    setActiveTab(id);
                    onNavigate(id);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F0F7FF" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 12,
    },
    backArrow: { fontSize: 20, color: "#1565C0", fontWeight: "600" },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#1565C0" },
    filterRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 12,
    },
    filterBtn: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "white",
        borderWidth: 1.5,
        borderColor: "#E3F2FD",
    },
    filterBtnActive: { backgroundColor: "#2196F3", borderColor: "#2196F3" },
    filterText: { fontSize: 13, color: "#78909C", fontWeight: "500" },
    filterTextActive: { color: "white", fontWeight: "700" },
    scroll: { paddingHorizontal: 16, paddingBottom: 20 },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    sectionLabelCritical: {
        fontSize: 11,
        fontWeight: "800",
        color: "#EF5350",
        letterSpacing: 0.5,
    },
    sectionLabelWarning: {
        fontSize: 11,
        fontWeight: "800",
        color: "#FF9800",
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    sectionLabelResolved: {
        fontSize: 11,
        fontWeight: "800",
        color: "#66BB6A",
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    newBadge: {
        backgroundColor: "#FFEBEE",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    newBadgeText: { fontSize: 10, color: "#EF5350", fontWeight: "700" },
    alertCard: {
        backgroundColor: "white",
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: "#E3F2FD",
        elevation: 1,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    alertCardCritical: { borderLeftWidth: 4, borderLeftColor: "#EF5350" },
    alertCardWarning: { borderLeftWidth: 4, borderLeftColor: "#FF9800" },
    alertCardResolved: {
        borderLeftWidth: 4,
        borderLeftColor: "#66BB6A",
        opacity: 0.85,
    },
    alertTop: { flexDirection: "row", gap: 10 },
    criticalDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#EF5350",
        marginTop: 4,
    },
    warningDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#FF9800",
        marginTop: 4,
    },
    resolvedDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#66BB6A",
        marginTop: 4,
    },
    alertTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    alertTitle: { fontSize: 14, fontWeight: "700", color: "#263238", flex: 1 },
    alertTime: { fontSize: 11, color: "#90A4AE", marginLeft: 8 },
    alertDesc: { fontSize: 12, color: "#78909C", lineHeight: 17 },
    resolvedLabel: {
        fontSize: 10,
        color: "#66BB6A",
        fontWeight: "700",
        marginTop: 4,
    },
    actionRow: { flexDirection: "row", gap: 10, marginTop: 12 },
    actionBtn: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
    },
    actionBtnText: { color: "white", fontWeight: "700", fontSize: 12 },

    // Back button styles (matching StaffProfileScreen)
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: "#F7F9FF",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#E8EDFB",
    },
    backIcon: {
        fontSize: 26,
        color: "#0D1B3E",
        fontWeight: "300",
        lineHeight: 30,
        marginTop: -2,
    },
});
