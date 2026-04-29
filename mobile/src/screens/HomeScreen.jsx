// ── CHANGES FROM ORIGINAL ───────────────────────────────────────────────────
// 1. Added `onViewResident` prop to HomeScreen
// 2. Wrapped avatar ring + greeting in TouchableOpacity for future use
// 3. "View Full Profile" button now calls onViewResident()
// ────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
    Platform,
} from "react-native";

const { width } = Dimensions.get("window");

const RESIDENT_PHOTO = require("../../assets/profile1.jpg");

// ─── Design Tokens ─────────────────────────────────────────────────
const C = {
    bg: "#F7F8FC",
    surface: "#FFFFFF",
    accentSoft: "#EBF2FF",
    accent: "#2563B0",
    accentBright: "#3B82F6",
    textPrimary: "#0F1C35",
    textSecondary: "#5B6B8A",
    textMuted: "#9AAABE",
    green: "#22C55E",
    greenSoft: "#DCFCE7",
    greenText: "#16A34A",
    alertBg: "#FFF4F2",
    alertBorder: "#FFD5CF",
    alertRed: "#EF4444",
    alertTextDark: "#B91C1C",
    alertBody: "#DC2626",
};

const SHADOW = {
    shadowColor: "#1A3C6E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
};

// ─── Bottom Tab Bar ────────────────────────────────────────────────
function TabBar({ active, onPress }) {
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
                    activeOpacity={0.7}
                >
                    <Text style={[tab.icon, active === t.id && tab.iconActive]}>
                        {t.icon}
                    </Text>
                    <Text style={[tab.label, active === t.id && tab.labelActive]}>
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

// ─── Stat Chip ─────────────────────────────────────────────────────
function StatChip({ icon, label, value, valueColor, chipBg }) {
    return (
        <View style={[sc.wrap, { backgroundColor: chipBg }]}>
            <Text style={sc.icon}>{icon}</Text>
            <Text style={[sc.value, { color: valueColor }]}>{value}</Text>
            <Text style={sc.label}>{label}</Text>
        </View>
    );
}

const sc = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 14,
        borderRadius: 18,
        gap: 3,
    },
    icon: { fontSize: 20 },
    value: { fontSize: 16, fontWeight: "900", letterSpacing: -0.2 },
    label: { fontSize: 10, color: C.textMuted, fontWeight: "600", marginTop: 1 },
});

// ─── Activity Row ──────────────────────────────────────────────────
function ActivityRow({ time, title, subtitle, tag, tagColor, tagBg, isLast }) {
    const [hour, ampm] = time.split(" ");
    return (
        <View style={[ar.wrap, !isLast && ar.separator]}>
            <View style={ar.timeBlock}>
                <Text style={ar.hour}>{hour}</Text>
                <Text style={ar.ampm}>{ampm}</Text>
            </View>
            <View style={ar.accentBar} />
            <View style={ar.content}>
                <View style={ar.titleRow}>
                    <Text style={ar.title} numberOfLines={1}>{title}</Text>
                    {tag && (
                        <View style={[ar.chip, { backgroundColor: tagBg }]}>
                            <Text style={[ar.chipText, { color: tagColor }]}>{tag}</Text>
                        </View>
                    )}
                </View>
                {subtitle ? <Text style={ar.subtitle}>{subtitle}</Text> : null}
            </View>
        </View>
    );
}

const ar = StyleSheet.create({
    wrap: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        gap: 12,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: "#F0F3FA",
    },
    timeBlock: { width: 42, alignItems: "center" },
    hour: { fontSize: 13, fontWeight: "800", color: C.textPrimary, letterSpacing: -0.2 },
    ampm: { fontSize: 10, fontWeight: "600", color: C.textMuted },
    accentBar: {
        width: 3,
        height: 38,
        borderRadius: 2,
        backgroundColor: C.accentSoft,
    },
    content: { flex: 1 },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 3,
    },
    title: {
        fontSize: 14,
        fontWeight: "700",
        color: C.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    chip: {
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 20,
    },
    chipText: { fontSize: 10, fontWeight: "800" },
    subtitle: { fontSize: 12, color: C.textSecondary, lineHeight: 17 },
});

// ─── Home Screen ───────────────────────────────────────────────────
export default function HomeScreen({ onNavigate, onViewResident }) {
    const [activeTab, setActiveTab] = useState("home");

    const handleNavigate = (id) => {
        setActiveTab(id);
        onNavigate && onNavigate(id);
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

            <ScrollView
                contentContainerStyle={s.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ── */}
                <View style={s.header}>
                    <View style={s.headerLeft}>
                        <View style={s.avatarRing}>
                            <View style={s.avatarInner}>
                                <Text style={{ fontSize: 17 }}>👤</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: 12 }}>
                            <Text style={s.welcomeLabel}>Welcome back</Text>
                            <Text style={s.greetingName}>Good Morning, Alex</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={s.msgBtn} activeOpacity={0.75}>
                        <Text style={{ fontSize: 20 }}>💬</Text>
                        <View style={s.msgBadge} />
                    </TouchableOpacity>
                </View>

                {/* ── Resident Hero Card ── */}
                <View style={s.heroCard}>
                    <Image
                        source={RESIDENT_PHOTO}
                        style={s.heroImage}
                        resizeMode="cover"
                    />

                    {/* Live badge top-left */}
                    <View style={s.liveBadge}>
                        <View style={s.liveDot} />
                        <Text style={s.liveBadgeText}>PRIMARY RESIDENT</Text>
                    </View>

                    {/* Bottom frosted panel */}
                    <View style={s.heroPanel}>
                        <View style={s.heroPanelRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={s.heroName}>Nora Roberts</Text>
                                <View style={s.heroChipsRow}>
                                    <View style={s.heroChip}>
                                        <Text style={s.heroChipText}>🚪 Room 204</Text>
                                    </View>
                                    <View style={[s.heroChip, { backgroundColor: C.greenSoft }]}>
                                        <View style={s.greenDot} />
                                        <Text style={[s.heroChipText, { color: C.greenText }]}>Active</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={s.pinBtn} activeOpacity={0.8}>
                                <Text style={{ fontSize: 22 }}>📍</Text>
                            </TouchableOpacity>
                        </View>

                        {/* ✅ UPDATED: calls onViewResident */}
                        <TouchableOpacity
                            style={s.profileBtn}
                            activeOpacity={0.85}
                            onPress={() => onViewResident && onViewResident()}
                        >
                            <Text style={s.profileBtnText}>View Full Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Stats Row ── */}
                <View style={s.statsRow}>
                    <StatChip
                        icon="💊"
                        label="Meds Today"
                        value="3 / 3"
                        valueColor={C.greenText}
                        chipBg={C.greenSoft}
                    />
                    <View style={s.statGap} />
                    <StatChip
                        icon="🚶"
                        label="Steps"
                        value="2,418"
                        valueColor={C.accent}
                        chipBg={C.accentSoft}
                    />
                    <View style={s.statGap} />
                    <StatChip
                        icon="❤️"
                        label="Pulse"
                        value="78 bpm"
                        valueColor="#E11D48"
                        chipBg="#FFF0F3"
                    />
                </View>

                {/* ── Active Alert ── */}
                <View style={s.alertCard}>
                    <View style={s.alertTop}>
                        <View style={s.alertIconBox}>
                            <Text style={{ fontSize: 22 }}>⚠️</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.alertEyebrow}>ACTIVE ALERT</Text>
                            <Text style={s.alertHeadline}>Fall Detected</Text>
                        </View>
                        <View style={s.pulseDot} />
                    </View>
                    <Text style={s.alertBody}>
                        Immediate attention required for{" "}
                        <Text style={{ fontWeight: "700" }}>Nora Roberts</Text>{" "}
                        in Room 204. No caregiver assigned yet.
                    </Text>
                    <TouchableOpacity style={s.respondBtn} activeOpacity={0.87}>
                        <Text style={s.respondText}>Respond Now</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Today's Activity ── */}
                <View style={s.sectionHeader}>
                    <Text style={s.sectionTitle}>Today's Activity</Text>
                    <TouchableOpacity style={s.viewAllPill} activeOpacity={0.7}>
                        <Text style={s.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={s.card}>
                    <ActivityRow
                        time="08:00 AM"
                        title="Breakfast Meal"
                        subtitle="Oatmeal with fresh berries and green tea."
                        tag="Done"
                        tagColor={C.greenText}
                        tagBg={C.greenSoft}
                    />
                    <ActivityRow
                        time="09:30 AM"
                        title="Morning Garden Walk"
                        subtitle="Accompanied by Nurse Sarah, 15 minutes."
                        tag="Done"
                        tagColor={C.greenText}
                        tagBg={C.greenSoft}
                    />
                    <ActivityRow
                        time="10:15 AM"
                        title="Morning Medication"
                        subtitle="Blood pressure and multivitamin administered."
                        tag="Done"
                        tagColor={C.greenText}
                        tagBg={C.greenSoft}
                        isLast
                    />
                </View>

                {/* ── Upcoming ── */}
                <View style={[s.sectionHeader, { marginTop: 6 }]}>
                    <Text style={s.sectionTitle}>Upcoming</Text>
                </View>

                <View style={[s.card, s.upcomingRow]}>
                    <View style={s.upcomingIconBox}>
                        <Text style={{ fontSize: 22 }}>🩺</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={s.upcomingTitle}>Doctor's Check-up</Text>
                        <Text style={s.upcomingMeta}>Dr. Michelle Cruz · Room 204</Text>
                    </View>
                    <View style={s.upcomingTimePill}>
                        <Text style={s.upcomingTimeText}>2:00 PM</Text>
                    </View>
                </View>

            </ScrollView>

            <TabBar active={activeTab} onPress={handleNavigate} />
        </View>
    );
}

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    scroll: { paddingBottom: 30 },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 22,
        paddingTop: Platform.OS === "ios" ? 58 : 46,
        paddingBottom: 18,
        backgroundColor: C.bg,
    },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    avatarRing: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2.5,
        borderColor: C.accentBright,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarInner: {
        width: 39,
        height: 39,
        borderRadius: 20,
        backgroundColor: C.accentSoft,
        alignItems: "center",
        justifyContent: "center",
    },
    welcomeLabel: {
        fontSize: 11,
        color: C.textMuted,
        fontWeight: "500",
        letterSpacing: 0.2,
        marginBottom: 1,
    },
    greetingName: {
        fontSize: 19,
        fontWeight: "800",
        color: C.textPrimary,
        letterSpacing: -0.3,
    },
    msgBtn: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: C.surface,
        alignItems: "center",
        justifyContent: "center",
        ...SHADOW,
    },
    msgBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: C.alertRed,
        borderWidth: 1.5,
        borderColor: C.surface,
    },
    heroCard: {
        marginHorizontal: 22,
        borderRadius: 26,
        overflow: "hidden",
        height: 470,
        marginBottom: 14,
        backgroundColor: "#1A2A4A",
        ...SHADOW,
        shadowOpacity: 0.16,
        shadowRadius: 20,
    },
    heroImage: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        width: "100%",
        height: "100%",
    },
    liveBadge: {
        position: "absolute",
        top: 18,
        left: 18,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.48)",
        paddingHorizontal: 11,
        paddingVertical: 6,
        borderRadius: 30,
        gap: 6,
    },
    liveDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: C.green,
    },
    liveBadgeText: {
        fontSize: 10,
        fontWeight: "800",
        color: "#fff",
        letterSpacing: 1.3,
    },
    heroPanel: {
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        backgroundColor: "rgba(255,255,255,0.97)",
        paddingHorizontal: 18,
        paddingTop: 17,
        paddingBottom: 18,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        gap: 14,
    },
    heroPanelRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    heroName: {
        fontSize: 23,
        fontWeight: "800",
        color: C.textPrimary,
        letterSpacing: -0.5,
        marginBottom: 9,
    },
    heroChipsRow: { flexDirection: "row", gap: 8 },
    heroChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.accentSoft,
        paddingVertical: 5,
        paddingHorizontal: 11,
        borderRadius: 30,
        gap: 5,
    },
    heroChipText: { fontSize: 11, color: C.accent, fontWeight: "700" },
    greenDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: C.green,
    },
    pinBtn: {
        width: 46,
        height: 46,
        borderRadius: 15,
        backgroundColor: C.accentSoft,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
    },
    profileBtn: {
        backgroundColor: C.accent,
        borderRadius: 16,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    profileBtnText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 15,
        letterSpacing: 0.1,
    },
    statsRow: {
        flexDirection: "row",
        marginHorizontal: 22,
        marginBottom: 14,
    },
    statGap: { width: 10 },
    alertCard: {
        marginHorizontal: 22,
        backgroundColor: C.alertBg,
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: C.alertBorder,
        ...SHADOW,
        shadowColor: "#FF4B2B",
        shadowOpacity: 0.1,
    },
    alertTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 11,
    },
    alertIconBox: {
        width: 46,
        height: 46,
        borderRadius: 15,
        backgroundColor: "#FFE4DF",
        alignItems: "center",
        justifyContent: "center",
    },
    alertEyebrow: {
        fontSize: 10,
        fontWeight: "800",
        color: C.alertTextDark,
        letterSpacing: 1.3,
        marginBottom: 3,
    },
    alertHeadline: {
        fontSize: 18,
        fontWeight: "800",
        color: C.alertTextDark,
        letterSpacing: -0.3,
    },
    pulseDot: {
        width: 11,
        height: 11,
        borderRadius: 6,
        backgroundColor: C.alertRed,
        alignSelf: "flex-start",
        marginTop: 2,
    },
    alertBody: {
        fontSize: 13,
        color: C.alertBody,
        lineHeight: 20,
        marginBottom: 14,
    },
    respondBtn: {
        backgroundColor: C.alertRed,
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    respondText: { color: "#fff", fontWeight: "800", fontSize: 15 },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 22,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: C.textPrimary,
        letterSpacing: -0.3,
    },
    viewAllPill: {
        backgroundColor: C.accentSoft,
        paddingHorizontal: 13,
        paddingVertical: 5,
        borderRadius: 20,
    },
    viewAllText: { fontSize: 12, color: C.accent, fontWeight: "700" },
    card: {
        marginHorizontal: 22,
        backgroundColor: C.surface,
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 4,
        marginBottom: 20,
        ...SHADOW,
    },
    upcomingRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        gap: 14,
    },
    upcomingIconBox: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: C.accentSoft,
        alignItems: "center",
        justifyContent: "center",
    },
    upcomingTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: C.textPrimary,
        marginBottom: 4,
    },
    upcomingMeta: { fontSize: 12, color: C.textSecondary },
    upcomingTimePill: {
        backgroundColor: C.accentSoft,
        paddingHorizontal: 11,
        paddingVertical: 6,
        borderRadius: 20,
    },
    upcomingTimeText: { fontSize: 12, color: C.accent, fontWeight: "800" },
});