import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Platform,
    Image,
} from "react-native";

// ─── Design Tokens (matches HomeScreen / FamilyProfileScreen) ────────────────
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
    amber: "#D97706",
    amberSoft: "#FEF3C7",
    red: "#DC2626",
    redSoft: "#FEE2E2",
    border: "#E8EDFB",
    divider: "#F1F4FB",
};

const SHADOW = {
    shadowColor: "#1A3C6E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
};

const SHADOW_SM = {
    shadowColor: "#1A3C6E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
};

// Try to load resident photo — gracefully fall back if missing
let RESIDENT_PHOTO = null;
try {
    RESIDENT_PHOTO = require("../../assets/profile1.jpg");
} catch (_) {}

// ─── Tab Pill ─────────────────────────────────────────────────────────────────
function TabPill({ label, active, onPress }) {
    return (
        <TouchableOpacity
            style={[tp.pill, active && tp.pillActive]}
            onPress={onPress}
            activeOpacity={0.75}
        >
            <Text style={[tp.label, active && tp.labelActive]}>{label}</Text>
        </TouchableOpacity>
    );
}

const tp = StyleSheet.create({
    pill: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 30,
        backgroundColor: "transparent",
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
});

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, isLast }) {
    return (
        <View style={[ir.wrap, !isLast && ir.separator]}>
            <View style={ir.iconBox}>
                <Text style={{ fontSize: 15 }}>{icon}</Text>
            </View>
            <View style={ir.content}>
                <Text style={ir.label}>{label}</Text>
                <Text style={ir.value}>{value}</Text>
            </View>
        </View>
    );
}

const ir = StyleSheet.create({
    wrap: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        gap: 14,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: C.divider,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: C.accentSoft,
        alignItems: "center",
        justifyContent: "center",
    },
    content: { flex: 1 },
    label: {
        fontSize: 11,
        color: C.textMuted,
        fontWeight: "600",
        marginBottom: 2,
    },
    value: { fontSize: 14, fontWeight: "700", color: C.textPrimary },
});

// ─── Vital Card ───────────────────────────────────────────────────────────────
function VitalCard({ icon, label, value, unit, color, bg, trend }) {
    return (
        <View style={[vc.wrap, { backgroundColor: bg }]}>
            <View style={vc.top}>
                <Text style={vc.icon}>{icon}</Text>
                {trend ? <Text style={vc.trend}>{trend}</Text> : null}
            </View>
            <Text style={[vc.value, { color }]}>{value}</Text>
            <Text style={vc.unit}>{unit}</Text>
            <Text style={vc.label}>{label}</Text>
        </View>
    );
}

const vc = StyleSheet.create({
    wrap: {
        flex: 1,
        borderRadius: 20,
        padding: 14,
        gap: 2,
    },
    top: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    icon: { fontSize: 22 },
    trend: { fontSize: 11, color: C.greenText, fontWeight: "700" },
    value: { fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
    unit: { fontSize: 11, color: C.textMuted, fontWeight: "600", marginTop: 1 },
    label: {
        fontSize: 11,
        color: C.textSecondary,
        fontWeight: "600",
        marginTop: 2,
    },
});

// ─── Activity Row ─────────────────────────────────────────────────────────────
function ActivityRow({ time, title, subtitle, tag, tagColor, tagBg, isLast }) {
    const parts = time.split(" ");
    const hour = parts[0];
    const ampm = parts[1];
    return (
        <View style={[ar.wrap, !isLast && ar.separator]}>
            <View style={ar.timeBlock}>
                <Text style={ar.hour}>{hour}</Text>
                <Text style={ar.ampm}>{ampm}</Text>
            </View>
            <View style={ar.accentBar} />
            <View style={ar.content}>
                <View style={ar.titleRow}>
                    <Text style={ar.title} numberOfLines={1}>
                        {title}
                    </Text>
                    {tag && (
                        <View style={[ar.chip, { backgroundColor: tagBg }]}>
                            <Text style={[ar.chipText, { color: tagColor }]}>
                                {tag}
                            </Text>
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
        paddingVertical: 13,
        gap: 12,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: C.divider,
    },
    timeBlock: { width: 42, alignItems: "center" },
    hour: {
        fontSize: 13,
        fontWeight: "800",
        color: C.textPrimary,
        letterSpacing: -0.2,
    },
    ampm: { fontSize: 10, fontWeight: "600", color: C.textMuted },
    accentBar: {
        width: 3,
        height: 36,
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
    chip: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
    chipText: { fontSize: 10, fontWeight: "800" },
    subtitle: { fontSize: 12, color: C.textSecondary, lineHeight: 17 },
});

// ─── Med Row ──────────────────────────────────────────────────────────────────
function MedRow({ name, dose, time, taken, isLast }) {
    return (
        <View style={[mr.wrap, !isLast && mr.separator]}>
            <View style={mr.iconBox}>
                <Text style={{ fontSize: 18 }}>💊</Text>
            </View>
            <View style={mr.content}>
                <Text style={mr.name}>{name}</Text>
                <Text style={mr.meta}>
                    {dose} · {time}
                </Text>
            </View>
            <View
                style={[
                    mr.badge,
                    { backgroundColor: taken ? C.greenSoft : C.amberSoft },
                ]}
            >
                <Text
                    style={[
                        mr.badgeText,
                        { color: taken ? C.greenText : C.amber },
                    ]}
                >
                    {taken ? "Taken" : "Pending"}
                </Text>
            </View>
        </View>
    );
}

const mr = StyleSheet.create({
    wrap: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        gap: 12,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: C.divider,
    },
    iconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: C.accentSoft,
        alignItems: "center",
        justifyContent: "center",
    },
    content: { flex: 1 },
    name: {
        fontSize: 14,
        fontWeight: "700",
        color: C.textPrimary,
        marginBottom: 2,
    },
    meta: { fontSize: 12, color: C.textSecondary },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeText: { fontSize: 10, fontWeight: "800" },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ResidentProfileScreen({ onBack }) {
    const [activeTab, setActiveTab] = useState("Overview");
    const tabs = ["Overview", "Activity", "Medications", "Care Team"];

    return (
        <View style={s.root}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            {/* ── Hero Image Header ── */}
            <View style={s.heroContainer}>
                {RESIDENT_PHOTO ? (
                    <Image
                        source={RESIDENT_PHOTO}
                        style={s.heroImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={s.heroImageFallback} />
                )}

                {/* Gradient overlay */}
                <View style={s.heroOverlay} />

                {/* Back button */}
                <TouchableOpacity
                    style={s.backBtn}
                    onPress={onBack}
                    activeOpacity={0.8}
                >
                    <Text style={s.backIcon}>‹</Text>
                </TouchableOpacity>

                {/* Hero content */}
                <View style={s.heroContent}>
                    {/* Status badge */}
                    <View style={s.statusBadge}>
                        <View style={s.statusDot} />
                        <Text style={s.statusText}>ACTIVE · ROOM 204</Text>
                    </View>

                    <Text style={s.heroName}>Nora Roberts</Text>

                    <View style={s.heroChipsRow}>
                        <View style={s.heroChip}>
                            <Text style={s.heroChipText}>🎂 Age 78</Text>
                        </View>
                        <View style={s.heroChip}>
                            <Text style={s.heroChipText}>🩸 Blood Type A+</Text>
                        </View>
                        <View style={s.heroChip}>
                            <Text style={s.heroChipText}>🚪 Wing B</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* ── Tab Pills ── */}
            <View style={s.tabRow}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={s.tabScroll}
                >
                    {tabs.map((t) => (
                        <TabPill
                            key={t}
                            label={t}
                            active={activeTab === t}
                            onPress={() => setActiveTab(t)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* ── Tab Content ── */}
            <ScrollView
                contentContainerStyle={s.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* ══ OVERVIEW ══ */}
                {activeTab === "Overview" && (
                    <>
                        {/* Quick Vitals */}
                        <View style={s.sectionHeader}>
                            <Text style={s.sectionTitle}>Today's Vitals</Text>
                            <View style={s.freshBadge}>
                                <View style={s.freshDot} />
                                <Text style={s.freshText}>Updated 1h ago</Text>
                            </View>
                        </View>

                        <View style={s.vitalsGrid}>
                            <View style={s.vitalsRow}>
                                <VitalCard
                                    icon="❤️"
                                    label="Heart Rate"
                                    value="78"
                                    unit="bpm"
                                    color="#E11D48"
                                    bg="#FFF0F3"
                                    trend="↑ Normal"
                                />
                                <View style={{ width: 10 }} />
                                <VitalCard
                                    icon="🩸"
                                    label="Blood Pressure"
                                    value="118/76"
                                    unit="mmHg"
                                    color={C.accent}
                                    bg={C.accentSoft}
                                />
                            </View>
                            <View style={{ height: 10 }} />
                            <View style={s.vitalsRow}>
                                <VitalCard
                                    icon="🌡️"
                                    label="Temperature"
                                    value="36.7"
                                    unit="°C"
                                    color={C.greenText}
                                    bg={C.greenSoft}
                                    trend="↑ Normal"
                                />
                                <View style={{ width: 10 }} />
                                <VitalCard
                                    icon="🫧"
                                    label="Oxygen Sat."
                                    value="98"
                                    unit="%"
                                    color={C.accent}
                                    bg={C.accentSoft}
                                    trend="↑ Good"
                                />
                            </View>
                        </View>

                        {/* Personal Info */}
                        <View style={[s.sectionHeader, { marginTop: 6 }]}>
                            <Text style={s.sectionTitle}>Personal Info</Text>
                        </View>
                        <View style={s.card}>
                            <InfoRow
                                icon="🪪"
                                label="Full Name"
                                value="Nora Mae Roberts"
                            />
                            <InfoRow
                                icon="🎂"
                                label="Date of Birth"
                                value="March 12, 1947 · Age 78"
                            />
                            <InfoRow
                                icon="🚪"
                                label="Room"
                                value="Room 204 · Wing B · 2nd Floor"
                            />
                            <InfoRow
                                icon="📅"
                                label="Admission Date"
                                value="February 3, 2024"
                            />
                            <InfoRow
                                icon="🩺"
                                label="Primary Physician"
                                value="Dr. Michelle Cruz"
                                isLast
                            />
                        </View>

                        {/* Medical Info */}
                        <View style={s.sectionHeader}>
                            <Text style={s.sectionTitle}>Medical Info</Text>
                        </View>
                        <View style={s.card}>
                            <InfoRow
                                icon="🔬"
                                label="Primary Diagnosis"
                                value="Mild Cognitive Decline"
                            />
                            <InfoRow
                                icon="⚠️"
                                label="Allergies"
                                value="Penicillin, Shellfish"
                            />
                            <InfoRow
                                icon="🩸"
                                label="Blood Type"
                                value="A Positive (A+)"
                            />
                            <InfoRow
                                icon="💉"
                                label="Last Vaccination"
                                value="Flu Shot · Dec 2024"
                                isLast
                            />
                        </View>

                        {/* Emergency Contact */}
                        <View style={s.sectionHeader}>
                            <Text style={s.sectionTitle}>
                                Emergency Contact
                            </Text>
                        </View>
                        <View style={s.emergencyCard}>
                            <View style={s.emergencyLeft}>
                                <View style={s.emergencyAvatar}>
                                    <Text style={s.emergencyAvatarText}>
                                        SJ
                                    </Text>
                                </View>
                                <View>
                                    <Text style={s.emergencyName}>
                                        Sarah Jenkins
                                    </Text>
                                    <Text style={s.emergencyRelation}>
                                        Daughter · Primary Contact
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={s.callBtn}
                                activeOpacity={0.8}
                            >
                                <Text style={{ fontSize: 18 }}>📞</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* ══ ACTIVITY ══ */}
                {activeTab === "Activity" && (
                    <>
                        <View style={s.sectionHeader}>
                            <Text style={s.sectionTitle}>Today's Activity</Text>
                        </View>
                        <View style={s.card}>
                            <ActivityRow
                                time="07:30 AM"
                                title="Morning Wake-Up"
                                subtitle="Assisted by Nurse Sarah. Mood: Cheerful."
                                tag="Done"
                                tagColor={C.greenText}
                                tagBg={C.greenSoft}
                            />
                            <ActivityRow
                                time="08:00 AM"
                                title="Breakfast"
                                subtitle="Oatmeal with berries, green tea. Full portion eaten."
                                tag="Done"
                                tagColor={C.greenText}
                                tagBg={C.greenSoft}
                            />
                            <ActivityRow
                                time="09:30 AM"
                                title="Garden Walk"
                                subtitle="15 mins with Nurse Sarah. Good mobility observed."
                                tag="Done"
                                tagColor={C.greenText}
                                tagBg={C.greenSoft}
                            />
                            <ActivityRow
                                time="10:15 AM"
                                title="Morning Medication"
                                subtitle="Blood pressure pill and multivitamin administered."
                                tag="Done"
                                tagColor={C.greenText}
                                tagBg={C.greenSoft}
                            />
                            <ActivityRow
                                time="12:00 PM"
                                title="Lunch"
                                subtitle="Brown rice, steamed veggies, chicken soup."
                                tag="Done"
                                tagColor={C.greenText}
                                tagBg={C.greenSoft}
                            />
                            <ActivityRow
                                time="02:00 PM"
                                title="Doctor's Check-up"
                                subtitle="Dr. Michelle Cruz · Room 204. Scheduled."
                                tag="Upcoming"
                                tagColor={C.amber}
                                tagBg={C.amberSoft}
                            />
                            <ActivityRow
                                time="06:00 PM"
                                title="Dinner"
                                subtitle="Scheduled meal in dining hall."
                                tag="Upcoming"
                                tagColor={C.amber}
                                tagBg={C.amberSoft}
                                isLast
                            />
                        </View>

                        {/* Weekly Steps */}
                        <View style={s.sectionHeader}>
                            <Text style={s.sectionTitle}>Weekly Steps</Text>
                        </View>
                        <View style={s.card}>
                            {[
                                { day: "Mon", steps: 2100, pct: 0.7 },
                                { day: "Tue", steps: 1850, pct: 0.62 },
                                { day: "Wed", steps: 2418, pct: 0.8 },
                                { day: "Thu", steps: 980, pct: 0.33 },
                                { day: "Fri", steps: 1600, pct: 0.53 },
                                { day: "Sat", steps: 2200, pct: 0.73 },
                                { day: "Sun", steps: 1400, pct: 0.47 },
                            ].map((d, i) => (
                                <View
                                    key={i}
                                    style={[sw.row, i < 6 && sw.separator]}
                                >
                                    <Text style={sw.day}>{d.day}</Text>
                                    <View style={sw.barBg}>
                                        <View
                                            style={[
                                                sw.barFill,
                                                { width: `${d.pct * 100}%` },
                                            ]}
                                        />
                                    </View>
                                    <Text style={sw.steps}>
                                        {d.steps.toLocaleString()}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {/* ══ MEDICATIONS ══ */}
                {activeTab === "Medications" && (
                    <>
                        <View style={s.sectionHeader}>
                            <Text style={s.sectionTitle}>
                                Today's Medications
                            </Text>
                        </View>
                        <View style={s.card}>
                            <MedRow
                                name="Amlodipine"
                                dose="5mg"
                                time="08:00 AM"
                                taken
                            />
                            <MedRow
                                name="Multivitamin"
                                dose="1 tablet"
                                time="08:00 AM"
                                taken
                            />
                            <MedRow
                                name="Metformin"
                                dose="500mg"
                                time="12:00 PM"
                                taken
                            />
                            <MedRow
                                name="Atorvastatin"
                                dose="10mg"
                                time="06:00 PM"
                                taken={false}
                            />
                            <MedRow
                                name="Aspirin"
                                dose="75mg"
                                time="09:00 PM"
                                taken={false}
                                isLast
                            />
                        </View>

                        <View style={s.sectionHeader}>
                            <Text style={s.sectionTitle}>
                                Prescription Info
                            </Text>
                        </View>
                        <View style={s.card}>
                            <InfoRow
                                icon="🩺"
                                label="Prescribing Doctor"
                                value="Dr. Michelle Cruz"
                            />
                            <InfoRow
                                icon="📅"
                                label="Last Review"
                                value="February 20, 2025"
                            />
                            <InfoRow
                                icon="📋"
                                label="Next Review"
                                value="May 20, 2025"
                            />
                            <InfoRow
                                icon="⚠️"
                                label="Drug Allergies"
                                value="Penicillin"
                                isLast
                            />
                        </View>
                    </>
                )}

                {/* ══ CARE TEAM ══ */}
                {activeTab === "Care Team" && (
                    <>
                        <View style={s.sectionHeader}>
                            <Text style={s.sectionTitle}>Assigned Staff</Text>
                        </View>

                        {[
                            {
                                initials: "NS",
                                name: "Nurse Sarah Mitchell",
                                role: "Primary Caregiver",
                                shift: "Morning · 07:00–15:00",
                                color: C.accent,
                                bg: C.accentSoft,
                            },
                            {
                                initials: "MC",
                                name: "Dr. Michelle Cruz",
                                role: "Primary Physician",
                                shift: "Visits Tue & Thu",
                                color: C.greenText,
                                bg: C.greenSoft,
                            },
                            {
                                initials: "RD",
                                name: "Rosa Dela Cruz",
                                role: "Physical Therapist",
                                shift: "Mon / Wed / Fri",
                                color: C.amber,
                                bg: C.amberSoft,
                            },
                            {
                                initials: "JL",
                                name: "Nurse John Lee",
                                role: "Night Caregiver",
                                shift: "Night · 23:00–07:00",
                                color: "#7C3AED",
                                bg: "#EDE9FE",
                            },
                        ].map((m, i) => (
                            <View key={i} style={s.teamCard}>
                                <View
                                    style={[
                                        s.teamAvatar,
                                        { backgroundColor: m.bg },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            s.teamAvatarText,
                                            { color: m.color },
                                        ]}
                                    >
                                        {m.initials}
                                    </Text>
                                </View>
                                <View style={s.teamContent}>
                                    <Text style={s.teamName}>{m.name}</Text>
                                    <Text style={s.teamRole}>{m.role}</Text>
                                    <View style={s.teamShiftRow}>
                                        <Text style={s.teamShiftIcon}>🕐</Text>
                                        <Text style={s.teamShift}>
                                            {m.shift}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={s.msgBtn}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ fontSize: 16 }}>💬</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        {/* Notes */}
                        <View style={[s.sectionHeader, { marginTop: 6 }]}>
                            <Text style={s.sectionTitle}>Care Notes</Text>
                        </View>
                        <View style={s.card}>
                            <InfoRow
                                icon="📝"
                                label="Latest Note"
                                value="Resident is responding well to new medication. Mood improved. — Nurse Sarah"
                            />
                            <InfoRow
                                icon="📅"
                                label="Note Date"
                                value="March 24, 2025"
                            />
                            <InfoRow
                                icon="🩺"
                                label="Doctor's Remark"
                                value="Continue current treatment plan. Next review in May."
                                isLast
                            />
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

// ─── Steps bar styles ─────────────────────────────────────────────────────────
const sw = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        gap: 12,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: C.divider,
    },
    day: {
        width: 32,
        fontSize: 12,
        fontWeight: "700",
        color: C.textMuted,
    },
    barBg: {
        flex: 1,
        height: 8,
        borderRadius: 4,
        backgroundColor: C.accentSoft,
    },
    barFill: {
        height: 8,
        borderRadius: 4,
        backgroundColor: C.accentBright,
    },
    steps: {
        width: 48,
        fontSize: 12,
        fontWeight: "700",
        color: C.textSecondary,
        textAlign: "right",
    },
});

// ─── Main Styles ──────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    scroll: { paddingBottom: 40 },

    // Hero
    heroContainer: {
        height: 300,
        position: "relative",
    },
    heroImage: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
    },
    heroImageFallback: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#1A2A4A",
    },
    heroOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(10, 20, 50, 0.55)",
    },
    backBtn: {
        position: "absolute",
        top: Platform.OS === "ios" ? 58 : 46,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.18)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
    },
    backIcon: {
        fontSize: 26,
        color: "#fff",
        fontWeight: "300",
        lineHeight: 30,
        marginTop: -2,
    },
    heroContent: {
        position: "absolute",
        bottom: 24,
        left: 22,
        right: 22,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: C.green,
    },
    statusText: {
        fontSize: 11,
        fontWeight: "800",
        color: "rgba(255,255,255,0.85)",
        letterSpacing: 1.3,
    },
    heroName: {
        fontSize: 32,
        fontWeight: "900",
        color: "#fff",
        letterSpacing: -0.8,
        marginBottom: 12,
    },
    heroChipsRow: {
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap",
    },
    heroChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.18)",
        paddingVertical: 5,
        paddingHorizontal: 11,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
    },
    heroChipText: {
        fontSize: 11,
        color: "#fff",
        fontWeight: "700",
    },

    // Tab row
    tabRow: {
        backgroundColor: C.surface,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        ...SHADOW_SM,
    },
    tabScroll: {
        paddingHorizontal: 16,
        gap: 4,
    },

    // Section Header
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 22,
        marginTop: 22,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: C.textPrimary,
        letterSpacing: -0.3,
    },
    freshBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.greenSoft,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 5,
    },
    freshDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: C.greenText,
    },
    freshText: { fontSize: 11, color: C.greenText, fontWeight: "700" },

    // Vitals
    vitalsGrid: {
        marginHorizontal: 22,
    },
    vitalsRow: {
        flexDirection: "row",
    },

    // Shared card
    card: {
        marginHorizontal: 22,
        backgroundColor: C.surface,
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: C.border,
        ...SHADOW_SM,
    },

    // Emergency contact
    emergencyCard: {
        marginHorizontal: 22,
        backgroundColor: C.surface,
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: C.border,
        ...SHADOW_SM,
        marginBottom: 22,
    },
    emergencyLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        flex: 1,
    },
    emergencyAvatar: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: C.accentSoft,
        alignItems: "center",
        justifyContent: "center",
    },
    emergencyAvatarText: {
        fontSize: 15,
        fontWeight: "800",
        color: C.accent,
    },
    emergencyName: {
        fontSize: 15,
        fontWeight: "800",
        color: C.textPrimary,
        marginBottom: 2,
    },
    emergencyRelation: {
        fontSize: 12,
        color: C.textSecondary,
    },
    callBtn: {
        width: 44,
        height: 44,
        borderRadius: 15,
        backgroundColor: C.greenSoft,
        alignItems: "center",
        justifyContent: "center",
    },

    // Care Team
    teamCard: {
        marginHorizontal: 22,
        marginBottom: 12,
        backgroundColor: C.surface,
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        borderWidth: 1,
        borderColor: C.border,
        ...SHADOW_SM,
    },
    teamAvatar: {
        width: 50,
        height: 50,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    teamAvatarText: {
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 0.5,
    },
    teamContent: { flex: 1 },
    teamName: {
        fontSize: 15,
        fontWeight: "800",
        color: C.textPrimary,
        marginBottom: 2,
    },
    teamRole: { fontSize: 12, color: C.textSecondary, marginBottom: 4 },
    teamShiftRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    teamShiftIcon: { fontSize: 11 },
    teamShift: { fontSize: 11, color: C.textMuted, fontWeight: "600" },
    msgBtn: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: C.accentSoft,
        alignItems: "center",
        justifyContent: "center",
    },
});
