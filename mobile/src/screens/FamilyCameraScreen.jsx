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

const ROOMS = ["Bedroom", "Living Room", "Kitchen", "Front Door"];

const ACTIVITY_LOG = [
    {
        icon: "😴",
        label: "Nora went to sleep",
        location: "Bedroom · 11:02 PM",
        time: "07m ago",
    },
    {
        icon: "🚶",
        label: "Motion detected",
        location: "Living Room · 11:42 AM",
        time: "2h ago",
    },
    {
        icon: "💊",
        label: "Medicine taken",
        location: "Kitchen · 08:20 AM",
        time: "2h ago",
    },
];

export default function FamilyCameraScreen({ onNavigate }) {
    const [activeTab, setActiveTab] = useState("camera");
    const [activeRoom, setActiveRoom] = useState("Bedroom");

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F0F7FF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => onNavigate("home")}
                    activeOpacity={0.75}
                >
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>CareSync Camera</Text>
                <TouchableOpacity>
                    <Text style={{ fontSize: 20 }}>🚩</Text>
                </TouchableOpacity>
            </View>

            {/* Room tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.roomTabsRow}
            >
                {ROOMS.map((r) => (
                    <TouchableOpacity
                        key={r}
                        style={[
                            styles.roomTab,
                            activeRoom === r && styles.roomTabActive,
                        ]}
                        onPress={() => setActiveRoom(r)}
                    >
                        <Text
                            style={[
                                styles.roomTabText,
                                activeRoom === r && styles.roomTabTextActive,
                            ]}
                        >
                            {r}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Camera Feed */}
                <View style={styles.cameraFeed}>
                    <View style={styles.cameraPreview}>
                        <Text style={{ fontSize: 48, opacity: 0.3 }}>📹</Text>
                        {/* Live badge */}
                        <View style={styles.liveBadge}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveBadgeText}>LIVE</Text>
                            <Text style={styles.liveTimestamp}>
                                · 10:42:31 AM
                            </Text>
                        </View>
                        {/* Camera controls */}
                        <View style={styles.cameraControls}>
                            <TouchableOpacity style={styles.controlBtn}>
                                <Text style={styles.controlIcon}>⛶</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.controlBtn}>
                                <Text style={styles.controlIcon}>🔊</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.controlBtn}>
                                <Text style={styles.controlIcon}>⤢</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Request Video Call */}
                <TouchableOpacity style={styles.videoCallBtn}>
                    <Text style={styles.videoCallIcon}>📹</Text>
                    <Text style={styles.videoCallText}>Request Video Call</Text>
                </TouchableOpacity>

                {/* Activity Log */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Activity Log</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.activityCard}>
                    {ACTIVITY_LOG.map((item, i) => (
                        <View
                            key={i}
                            style={[
                                styles.activityRow,
                                i < ACTIVITY_LOG.length - 1 &&
                                    styles.activityBorder,
                            ]}
                        >
                            <View style={styles.activityIconWrap}>
                                <Text style={styles.activityIcon}>
                                    {item.icon}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.activityLabel}>
                                    {item.label}
                                </Text>
                                <Text style={styles.activityLocation}>
                                    {item.location}
                                </Text>
                            </View>
                            <Text style={styles.activityTime}>{item.time}</Text>
                        </View>
                    ))}
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
    roomTabsRow: { paddingHorizontal: 16, marginBottom: 12 },
    roomTab: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: "white",
        borderWidth: 1.5,
        borderColor: "#E3F2FD",
    },
    roomTabActive: {
        backgroundColor: "#2196F3",
        borderColor: "#2196F3",
        borderBottomWidth: 3,
        borderBottomColor: "#1565C0",
    },
    roomTabText: { fontSize: 13, color: "#78909C", fontWeight: "500" },
    roomTabTextActive: { color: "white", fontWeight: "700" },
    scroll: { paddingHorizontal: 16, paddingBottom: 20 },
    cameraFeed: { marginBottom: 12 },
    cameraPreview: {
        height: 200,
        backgroundColor: "#1A2A3A",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    liveBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 5,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#66BB6A",
    },
    liveBadgeText: { color: "white", fontSize: 11, fontWeight: "800" },
    liveTimestamp: { color: "#90CAF9", fontSize: 10 },
    cameraControls: {
        position: "absolute",
        bottom: 12,
        right: 12,
        flexDirection: "row",
        gap: 8,
    },
    controlBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    controlIcon: { fontSize: 14 },
    videoCallBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2196F3",
        borderRadius: 14,
        paddingVertical: 14,
        gap: 8,
        marginBottom: 20,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    videoCallIcon: { fontSize: 18 },
    videoCallText: { color: "white", fontSize: 15, fontWeight: "700" },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1565C0" },
    seeAll: { fontSize: 12, color: "#2196F3", fontWeight: "600" },
    activityCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 8,
        elevation: 2,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
    },
    activityRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        gap: 12,
    },
    activityBorder: { borderBottomWidth: 1, borderBottomColor: "#F5F9FF" },
    activityIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#E3F2FD",
        alignItems: "center",
        justifyContent: "center",
    },
    activityIcon: { fontSize: 18 },
    activityLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#263238",
        marginBottom: 2,
    },
    activityLocation: { fontSize: 11, color: "#90A4AE" },
    activityTime: { fontSize: 11, color: "#90A4AE" },

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
