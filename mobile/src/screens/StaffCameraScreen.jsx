import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Dimensions,
    Modal,
    TextInput,
    SafeAreaView,
    Platform,
} from "react-native";

const { width } = Dimensions.get("window");

// ─── Design Tokens (Standardized) ───────────────────────────────────
const C = {
    bg: "#F0F7FF",
    surface: "#FFFFFF",
    accent: "#1565C0",
    accentSoft: "#EBF2FF",
    accentBright: "#2196F3",
    textPrimary: "#0D1B3E",
    textSecondary: "#5B6B8A",
    textMuted: "#9AAABE",
    green: "#22C55E",
    greenSoft: "#DCFCE7",
    greenText: "#16A34A",
    red: "#EF4444",
    redSoft: "#FEE2E2",
    border: "#E8EDFB",
    cameraPanel: "#1A2540",
};

const SHADOW = {
    shadowColor: "#1A3C6E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
};

// ─── Shared Staff Tab Bar (Included for full code) ──────────────────
export function StaffTabBar({ active, onPress }) {
    const tabs = [
        { id: "home", label: "Home", icon: "🏠" },
        { id: "alerts", label: "Alerts", icon: "🔔" },
        { id: "residents", label: "Residents", icon: "👥" },
        { id: "camera", label: "Camera", icon: "📷" },
        { id: "logs", label: "Logs", icon: "📋" },
    ];
    return (
        <View style={tab.container}>
            {tabs.map((t) => (
                <TouchableOpacity key={t.id} style={tab.item} onPress={() => onPress(t.id)}>
                    <Text style={[tab.icon, active === t.id && tab.iconActive]}>{t.icon}</Text>
                    <Text style={[tab.label, active === t.id && tab.labelActive]}>{t.label}</Text>
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
        paddingBottom: Platform.OS === 'ios' ? 30 : 15,
        paddingTop: 12,
        ...SHADOW,
    },
    item: { flex: 1, alignItems: "center" },
    icon: { fontSize: 20, opacity: 0.4 },
    iconActive: { opacity: 1 },
    label: { fontSize: 10, color: "#B0BEC5", fontWeight: "600" },
    labelActive: { color: "#2196F3", fontWeight: "700" },
});

// ─── Camera Components ──────────────────────────────────────────────
function MainViewer({ feed }) {
    if (!feed) {
        return (
            <View style={mv.placeholder}>
                <Text style={{ fontSize: 44, marginBottom: 12 }}>📹</Text>
                <Text style={mv.placeholderTitle}>No Feed Selected</Text>
                <Text style={mv.placeholderSub}>Tap any live camera below to view</Text>
            </View>
        );
    }
    const isLive = feed.status === "live";
    return (
        <View style={mv.viewer}>
            <View style={mv.feedArea}><Text style={{ fontSize: 52 }}>{feed.icon}</Text></View>
            <View style={mv.overlayTop}>
                <View style={isLive ? mv.liveBadge : mv.offlineBadge}>
                    {isLive && <View style={mv.liveDot} />}
                    <Text style={isLive ? mv.liveBadgeText : mv.offlineBadgeText}>{isLive ? "LIVE" : "OFFLINE"}</Text>
                </View>
                <Text style={mv.timestamp}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <View style={mv.overlayBottom}>
                <View style={{ flex: 1 }}>
                    <Text style={mv.feedLabel}>{feed.label}</Text>
                    {feed.resident && <Text style={mv.feedResident}>👤 {feed.resident}</Text>}
                </View>
                <View style={mv.controls}>
                    <TouchableOpacity style={mv.controlBtn}><Text>⛶</Text></TouchableOpacity>
                    <TouchableOpacity style={mv.controlBtn}><Text>📸</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const mv = StyleSheet.create({
    placeholder: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#EDF3FF", borderRadius: 20 },
    placeholderTitle: { fontSize: 16, fontWeight: "800", color: C.accent },
    placeholderSub: { fontSize: 12, color: C.textMuted },
    viewer: { flex: 1, borderRadius: 20, overflow: "hidden", backgroundColor: C.cameraPanel },
    feedArea: { flex: 1, alignItems: "center", justifyContent: "center" },
    overlayTop: { position: "absolute", top: 14, left: 14, right: 14, flexDirection: "row", justifyContent: "space-between" },
    liveBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 5 },
    liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.red },
    liveBadgeText: { color: "#fff", fontWeight: "800", fontSize: 10 },
    offlineBadge: { backgroundColor: "rgba(0,0,0,0.4)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    offlineBadgeText: { color: "#aaa", fontWeight: "800", fontSize: 10 },
    timestamp: { color: "#fff", fontSize: 12, opacity: 0.8 },
    overlayBottom: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(13,27,62,0.85)", padding: 15, flexDirection: "row" },
    feedLabel: { color: "#fff", fontWeight: "800" },
    feedResident: { color: "#fff", fontSize: 11, opacity: 0.7 },
    controls: { flexDirection: "row", gap: 8 },
    controlBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
});

function FeedTile({ feed, isSelected, onPress }) {
    const isLive = feed.status === "live";
    const tileWidth = (width - 50) / 2;
    return (
        <TouchableOpacity 
            style={[ft.tile, { width: tileWidth }, isSelected && ft.tileSelected]} 
            onPress={() => onPress(feed)}
            disabled={!isLive}
        >
            <View style={[ft.preview, !isLive && ft.previewOff]}>
                <Text style={{ fontSize: 24, opacity: isLive ? 1 : 0.3 }}>{feed.icon}</Text>
                <View style={isLive ? ft.livePill : ft.offPill}>
                    <Text style={ft.pillText}>{isLive ? "LIVE" : "OFFLINE"}</Text>
                </View>
            </View>
            <View style={ft.info}>
                <Text style={ft.label} numberOfLines={1}>{feed.label}</Text>
                <Text style={ft.sub}>{feed.resident || "Common Area"}</Text>
            </View>
        </TouchableOpacity>
    );
}

const ft = StyleSheet.create({
    tile: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", ...SHADOW, marginBottom: 4 },
    tileSelected: { borderWidth: 2, borderColor: C.accentBright },
    preview: { height: 80, backgroundColor: "#1A2540", alignItems: "center", justifyContent: "center" },
    previewOff: { backgroundColor: "#2D354A" },
    livePill: { position: "absolute", top: 8, left: 8, backgroundColor: C.red, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    offPill: { position: "absolute", top: 8, left: 8, backgroundColor: "#555", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    pillText: { color: "#fff", fontSize: 8, fontWeight: "900" },
    info: { padding: 10 },
    label: { fontSize: 13, fontWeight: "800", color: C.textPrimary },
    sub: { fontSize: 10, color: C.textMuted },
});

// ─── Main Camera Screen ─────────────────────────────────────────────
const INITIAL_CAMERAS = [
    { id: 1, label: "Room 101", resident: "Margaret Price", status: "live", icon: "🛏️" },
    { id: 2, label: "Room 108", resident: "George Mendez", status: "live", icon: "🛏️" },
    { id: 3, label: "Room 204", resident: "Nora Roberts", status: "live", icon: "🛏️" },
    { id: 4, label: "Room 215", resident: "Robert Hall", status: "live", icon: "🛏️" },
    { id: 5, label: "Room 312", resident: "Lila Chen", status: "offline", icon: "🛏️" },
    { id: 6, label: "Entrance", resident: null, status: "live", icon: "🚪" },
];

export default function StaffCameraScreen({ onNavigate }) {
    const [selectedFeed, setSelectedFeed] = useState(null);
    const [filter, setFilter] = useState("All");
    const [cameras, setCameras] = useState(INITIAL_CAMERAS);

    const filtered = cameras.filter(f => {
        if (filter === "All") return true;
        if (filter === "Rooms") return f.resident !== null;
        if (filter === "Offline") return f.status === "offline";
        return f.resident === null;
    });

    return (
        <View style={s.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            
            {/* Fix for content being "too high" */}
            <View style={s.topSpacer} />

            <View style={s.header}>
                <View>
                    <Text style={s.headerTitle}>Camera Monitor</Text>
                    <Text style={s.headerSub}>{cameras.filter(c=>c.status==='live').length} feeds active</Text>
                </View>
                <TouchableOpacity style={s.addBtn}><Text style={s.addBtnText}>+ Camera</Text></TouchableOpacity>
            </View>

            {/* Viewer - Fixed Height, No Scroll */}
            <View style={s.viewerContainer}>
                <MainViewer feed={selectedFeed} />
            </View>

            {/* Standardized Filter Tabs */}
            <View style={s.filterRowContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll}>
                    {["All", "Rooms", "Common Areas", "Offline"].map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[s.filterChip, filter === f && s.filterChipActive]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[s.filterChipText, filter === f && s.filterChipTextActive]}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Grid List - Flexible and Scrollable */}
            <ScrollView style={s.scrollArea} showsVerticalScrollIndicator={false}>
                <View style={s.grid}>
                    {filtered.map((feed) => (
                        <FeedTile
                            key={feed.id}
                            feed={feed}
                            isSelected={selectedFeed?.id === feed.id}
                            onPress={(f) => setSelectedFeed(f)}
                        />
                    ))}
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>

            <StaffTabBar active="camera" onPress={onNavigate} />
        </View>
    );
}

const s = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: C.bg },
    topSpacer: {
        height: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20,
    },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 22, marginBottom: 15 },
    headerTitle: { fontSize: 26, fontWeight: "900", color: C.accent },
    headerSub: { fontSize: 13, color: C.textMuted },
    addBtn: { backgroundColor: C.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
    addBtnText: { color: "#fff", fontWeight: "700", fontSize: 12 },

    viewerContainer: { height: 220, marginHorizontal: 20, marginBottom: 20, ...SHADOW },

    filterRowContainer: { marginBottom: 15 },
    filterScroll: { paddingHorizontal: 20, gap: 10 },
    filterChip: { 
        paddingHorizontal: 18, 
        paddingVertical: 10, 
        borderRadius: 20, 
        backgroundColor: C.surface, 
        borderWidth: 1, 
        borderColor: C.border 
    },
    filterChipActive: { backgroundColor: C.accent, borderColor: C.accent },
    filterChipText: { fontSize: 13, fontWeight: "700", color: C.textSecondary },
    filterChipTextActive: { color: "#fff" },

    scrollArea: { flex: 1 },
    grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 20, gap: 10 },
});