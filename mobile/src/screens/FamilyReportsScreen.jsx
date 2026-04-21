import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
} from "react-native";
import { FamilyTabBar } from "./FamilyAlertsScreen";

const { width } = Dimensions.get("window");

// ─── Mini Calendar ─────────────────────────────────────────────────────────────
function MiniCalendar({ selectedDate, onSelect }) {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const dates = [
        [null, null, null, null, null, 1, 2],
        [3, 4, 5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14, 15, 16],
        [17, 18, 19, 20, 21, 22, 23],
        [24, 25, 26, 27, 28, 29, 30],
        [31, null, null, null, null, null, null],
    ];
    const alertDays = [4, 13, 22];

    return (
        <View style={cal.container}>
            {/* Month header */}
            <View style={cal.header}>
                <TouchableOpacity>
                    <Text style={cal.arrow}>‹</Text>
                </TouchableOpacity>
                <Text style={cal.month}>October 2023</Text>
                <TouchableOpacity>
                    <Text style={cal.arrow}>›</Text>
                </TouchableOpacity>
            </View>
            {/* Day headers */}
            <View style={cal.row}>
                {days.map((d, i) => (
                    <Text key={i} style={cal.dayHeader}>
                        {d}
                    </Text>
                ))}
            </View>
            {/* Date grid */}
            {dates.map((week, wi) => (
                <View key={wi} style={cal.row}>
                    {week.map((date, di) => (
                        <TouchableOpacity
                            key={di}
                            style={[
                                cal.dateCell,
                                date === selectedDate && cal.dateSelected,
                                !date && { opacity: 0 },
                            ]}
                            onPress={() => date && onSelect(date)}
                        >
                            <Text
                                style={[
                                    cal.dateText,
                                    date === selectedDate &&
                                        cal.dateTextSelected,
                                ]}
                            >
                                {date || ""}
                            </Text>
                            {alertDays.includes(date) &&
                                date !== selectedDate && (
                                    <View style={cal.alertDot} />
                                )}
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
}

const cal = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    arrow: { fontSize: 20, color: "#2196F3", paddingHorizontal: 8 },
    month: { fontSize: 15, fontWeight: "700", color: "#1565C0" },
    row: { flexDirection: "row", marginBottom: 4 },
    dayHeader: {
        flex: 1,
        textAlign: "center",
        fontSize: 11,
        color: "#90A4AE",
        fontWeight: "600",
    },
    dateCell: {
        flex: 1,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
    },
    dateSelected: { backgroundColor: "#2196F3" },
    dateText: { fontSize: 13, color: "#263238", fontWeight: "500" },
    dateTextSelected: { color: "white", fontWeight: "700" },
    alertDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#EF5350",
        marginTop: 1,
    },
});

// ─── Day Summary Card ──────────────────────────────────────────────────────────
function DaySummaryCard({
    date,
    tag,
    tagColor,
    tagBg,
    sleep,
    meals,
    activity,
    onPress,
}) {
    return (
        <TouchableOpacity
            style={ds.card}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <View style={ds.header}>
                <Text style={ds.date}>{date}</Text>
                <View style={[ds.tag, { backgroundColor: tagBg }]}>
                    <Text style={[ds.tagText, { color: tagColor }]}>{tag}</Text>
                </View>
            </View>
            <View style={ds.stats}>
                <View style={ds.stat}>
                    <View style={[ds.ring, { borderColor: "#2196F3" }]}>
                        <Text style={ds.ringEmoji}>😴</Text>
                    </View>
                    <Text style={ds.statValue}>{sleep}</Text>
                    <Text style={ds.statLabel}>Sleep</Text>
                </View>
                <View style={ds.stat}>
                    <View style={[ds.ring, { borderColor: "#FF9800" }]}>
                        <Text style={ds.ringEmoji}>🍽️</Text>
                    </View>
                    <Text style={ds.statValue}>{meals}</Text>
                    <Text style={ds.statLabel}>Meals</Text>
                </View>
                <View style={ds.stat}>
                    <View style={[ds.ring, { borderColor: "#66BB6A" }]}>
                        <Text style={ds.ringEmoji}>🏃</Text>
                    </View>
                    <Text style={ds.statValue}>{activity}</Text>
                    <Text style={ds.statLabel}>Activity</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const ds = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        elevation: 1,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    date: { fontSize: 14, fontWeight: "700", color: "#1565C0" },
    tag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
    tagText: { fontSize: 11, fontWeight: "700" },
    stats: { flexDirection: "row", justifyContent: "space-around" },
    stat: { alignItems: "center", gap: 4 },
    ring: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 3,
        alignItems: "center",
        justifyContent: "center",
    },
    ringEmoji: { fontSize: 20 },
    statValue: { fontSize: 13, fontWeight: "700", color: "#263238" },
    statLabel: { fontSize: 10, color: "#90A4AE" },
});

// ─── Main Reports Screen ───────────────────────────────────────────────────────
export default function FamilyReportsScreen({ onNavigate }) {
    const [activeTab, setActiveTab] = useState("reports");
    const [selectedDate, setSelectedDate] = useState(5);

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
                <Text style={styles.headerTitle}>Reports</Text>
                <TouchableOpacity>
                    <Text style={{ fontSize: 20 }}>🚩</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Calendar */}
                <MiniCalendar
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                />

                {/* Daily Summary title */}
                <Text style={styles.sectionTitle}>Daily Summary</Text>

                {/* Good day */}
                <DaySummaryCard
                    date="Oct 5, 2023"
                    tag="GOOD DAY"
                    tagColor="#2E7D32"
                    tagBg="#E8F5E9"
                    sleep="8h 13m"
                    meals="90%"
                    activity="46m"
                    onPress={() => onNavigate("daily-report")}
                />

                {/* Alert day */}
                <DaySummaryCard
                    date="Oct 4, 2023"
                    tag="ALERT DAY"
                    tagColor="#C62828"
                    tagBg="#FFEBEE"
                    sleep="9h 09m"
                    meals="40%"
                    activity="20m"
                    onPress={() => onNavigate("daily-report")}
                />

                {/* Weekly Focus Banner */}
                <View style={styles.focusBanner}>
                    <View style={styles.focusContent}>
                        <Text style={styles.focusLabel}>WEEKLY FOCUS</Text>
                        <Text style={styles.focusTitle}>
                            Hydration & Mobility
                        </Text>
                        <Text style={styles.focusDesc}>
                            Goals: 2L water daily. 15min walk.
                        </Text>
                    </View>
                    <Text style={{ fontSize: 40, opacity: 0.6 }}>🧘</Text>
                </View>
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
    scroll: { paddingHorizontal: 16, paddingBottom: 20 },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1565C0",
        marginBottom: 10,
    },
    focusBanner: {
        backgroundColor: "#1565C0",
        borderRadius: 16,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 6,
    },
    focusContent: { flex: 1 },
    focusLabel: {
        fontSize: 10,
        color: "#90CAF9",
        fontWeight: "700",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    focusTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "white",
        marginBottom: 4,
    },
    focusDesc: { fontSize: 12, color: "#BBDEFB" },

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
