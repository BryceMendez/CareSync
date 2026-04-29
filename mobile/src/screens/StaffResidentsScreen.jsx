import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    TextInput,
    Modal,
    SafeAreaView,
    Platform,
} from "react-native";

// ─── Design Tokens ──────────────────────────────────────────────────
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
    yellow: "#F59E0B",
    yellowSoft: "#FEF3C7",
    yellowText: "#92400E",
    red: "#EF4444",
    redSoft: "#FEE2E2",
    redText: "#B91C1C",
    border: "#E8EDFB",
};

const SHADOW = {
    shadowColor: "#1A3C6E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
};

const AVATARS = ["👩‍🦳", "👴", "👵", "👨‍🦳", "🧓", "👴", "👩‍🦳"];

// ─── Shared Staff Tab Bar ────────────────────────────────────────────
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
                <TouchableOpacity
                    key={t.id}
                    style={tab.item}
                    onPress={() => onPress(t.id)}
                    activeOpacity={0.7}
                >
                    <Text style={[tab.icon, active === t.id && tab.iconActive]}>
                        {t.icon}
                    </Text>
                    <Text style={[tab.label, active === t.id && tab.labelActive]} numberOfLines={1}>
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
        paddingBottom: Platform.OS === 'ios' ? 30 : 15,
        paddingTop: 12,
        ...SHADOW,
    },
    item: { flex: 1, alignItems: "center", justifyContent: "center" },
    icon: { fontSize: 20, marginBottom: 2, opacity: 0.4 },
    iconActive: { opacity: 1 },
    label: { fontSize: 10, color: "#B0BEC5", fontWeight: "600" },
    labelActive: { color: "#2196F3", fontWeight: "700" },
    dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#2196F3", marginTop: 4 },
});

// ─── Resident Card ───────────────────────────────────────────────────
function ResidentCard({ name, room, age, condition, status, avatar }) {
    const statusConfig = {
        stable: { color: C.greenText, bg: C.greenSoft, dot: C.green, label: "Stable" },
        attention: { color: C.yellowText, bg: C.yellowSoft, dot: C.yellow, label: "Needs Attention" },
        critical: { color: C.redText, bg: C.redSoft, dot: C.red, label: "Critical" },
    };
    const s = statusConfig[status] || statusConfig.stable;

    return (
        <View style={rc.card}>
            <View style={rc.avatarWrap}>
                <Text style={rc.avatarText}>{avatar}</Text>
            </View>
            <View style={rc.info}>
                <Text style={rc.name}>{name}</Text>
                <Text style={rc.meta}>Room {room} · Age {age}</Text>
                <Text style={rc.condition} numberOfLines={1}>{condition}</Text>
            </View>
            <View style={[rc.statusBadge, { backgroundColor: s.bg }]}>
                <View style={[rc.statusDot, { backgroundColor: s.dot }]} />
                <Text style={[rc.statusText, { color: s.color }]}>{s.label}</Text>
            </View>
        </View>
    );
}

const rc = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.surface,
        borderRadius: 18,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        ...SHADOW,
    },
    avatarWrap: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center", marginRight: 14 },
    avatarText: { fontSize: 24 },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: "800", color: C.textPrimary, marginBottom: 2 },
    meta: { fontSize: 12, color: C.textMuted, marginBottom: 2 },
    condition: { fontSize: 12, color: C.textSecondary },
    statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 5 },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: 10, fontWeight: "800" },
});

// ─── Add Resident Modal ──────────────────────────────────────────────
function AddResidentModal({ visible, onClose, onSave }) {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [age, setAge] = useState("");
    const [condition, setCondition] = useState("");
    const [status, setStatus] = useState("stable");

    const handleSave = () => {
        if (!name.trim() || !room.trim()) return;
        onSave({ name: name.trim(), room: room.trim(), age: parseInt(age) || 70, condition: condition.trim() || "No condition listed", status });
        setName(""); setRoom(""); setAge(""); setCondition(""); setStatus("stable");
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={m.overlay}>
                <View style={m.sheet}>
                    <View style={m.handle} />
                    <Text style={m.title}>Add Resident</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={m.label}>Full Name</Text>
                        <TextInput style={m.input} placeholder="Jane Smith" value={name} onChangeText={setName} />
                        <Text style={m.label}>Room & Age</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TextInput style={[m.input, { flex: 1 }]} placeholder="Room" value={room} onChangeText={setRoom} keyboardType="numeric" />
                            <TextInput style={[m.input, { flex: 1 }]} placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
                        </View>
                        <Text style={m.label}>Condition</Text>
                        <TextInput style={m.input} placeholder="Medical condition" value={condition} onChangeText={setCondition} />
                        
                        <Text style={m.label}>Select Status</Text>
                        <View style={m.statusRow}>
                            {["stable", "attention", "critical"].map((opt) => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[m.statusChip, status === opt && m.statusChipActive]}
                                    onPress={() => setStatus(opt)}
                                >
                                    <Text style={[m.statusChipText, status === opt && m.statusChipTextActive]}>
                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <View style={m.actions}>
                        <TouchableOpacity style={m.cancelBtn} onPress={onClose}>
                            <Text style={m.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={m.saveBtn} onPress={handleSave}>
                            <Text style={m.saveText}>Add Resident</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const m = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    sheet: { backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, maxHeight: '85%' },
    handle: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 10, alignSelf: 'center', marginBottom: 15 },
    title: { fontSize: 20, fontWeight: "800", color: C.textPrimary, marginBottom: 20 },
    label: { fontSize: 12, fontWeight: "700", color: C.textSecondary, marginBottom: 8, marginTop: 12 },
    input: { borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: "#F8FBFF" },
    statusRow: { flexDirection: "row", gap: 10, marginTop: 4 },
    statusChip: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
    statusChipActive: { backgroundColor: C.accent, borderColor: C.accent },
    statusChipText: { fontSize: 12, fontWeight: "600", color: C.textSecondary },
    statusChipTextActive: { color: "#fff" },
    actions: { flexDirection: "row", gap: 12, marginTop: 30, paddingBottom: Platform.OS === 'ios' ? 20 : 0 },
    cancelBtn: { flex: 1, padding: 16, alignItems: "center" },
    cancelText: { fontWeight: "700", color: C.textMuted },
    saveBtn: { flex: 2, backgroundColor: C.accent, borderRadius: 16, padding: 16, alignItems: "center" },
    saveText: { fontSize: 15, fontWeight: "800", color: "#fff" },
});

// ─── Main Screen Component ───────────────────────────────────────────
const INITIAL_RESIDENTS = [
    { id: 1, name: "Nora Roberts", room: "204", age: 78, condition: "Post-hip surgery recovery", status: "stable", avatar: "👩‍🦳" },
    { id: 2, name: "George Mendez", room: "108", age: 84, condition: "Diabetes, Hypertension", status: "attention", avatar: "👴" },
    { id: 3, name: "Lila Chen", room: "312", age: 91, condition: "Dementia — Stage 2", status: "attention", avatar: "👵" },
    { id: 4, name: "Robert Hall", room: "215", age: 72, condition: "Cardiac monitoring", status: "critical", avatar: "👨‍🦳" },
    { id: 5, name: "Margaret Price", room: "101", age: 80, condition: "Physical therapy ongoing", status: "stable", avatar: "👩‍🦳" },
];

export default function StaffResidentsScreen({ onNavigate }) {
    const [activeTab, setActiveTab] = useState("residents");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [residents, setResidents] = useState(INITIAL_RESIDENTS);
    const [showModal, setShowModal] = useState(false);

    const filtered = residents.filter((r) => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.room.includes(search);
        const matchFilter = filter === "All" || r.status.toLowerCase() === filter.toLowerCase();
        return matchSearch && matchFilter;
    });

    const handleAddResident = (data) => {
        const newRes = { id: Date.now(), avatar: AVATARS[residents.length % AVATARS.length], ...data };
        setResidents([newRes, ...residents]);
    };

    return (
        <View style={s.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            
            {/* 1. Added explicit spacing to move content down */}
            <View style={s.topSpacer} />

            {/* 2. Header Section */}
            <View style={s.header}>
                <View>
                    <Text style={s.headerTitle}>Residents</Text>
                    <Text style={s.headerSub}>{residents.length} total members</Text>
                </View>
                <TouchableOpacity style={s.addBtn} onPress={() => setShowModal(true)}>
                    <Text style={s.addBtnText}>+ Add</Text>
                </TouchableOpacity>
            </View>

            {/* 3. Search and Filters */}
            <View style={s.controlSection}>
                <View style={s.searchWrap}>
                    <Text style={s.searchIcon}>🔍</Text>
                    <TextInput
                        style={s.searchInput}
                        placeholder="Search by name or room..."
                        placeholderTextColor={C.textMuted}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                <View>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={s.filterScroll}
                    >
                        {["All", "Stable", "Attention", "Critical"].map((f) => (
                            <TouchableOpacity
                                key={f}
                                style={[s.filterChip, filter === f && s.filterChipActive]}
                                onPress={() => setFilter(f)}
                            >
                                <Text style={[s.filterChipText, filter === f && s.filterChipTextActive]}>
                                    {f}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {/* 4. List Content */}
            <ScrollView style={s.listContainer} showsVerticalScrollIndicator={false}>
                <View style={s.summaryRow}>
                    {[
                        { label: "Stable", count: residents.filter(r => r.status === "stable").length, color: C.greenText, bg: C.greenSoft },
                        { label: "Attention", count: residents.filter(r => r.status === "attention").length, color: C.yellowText, bg: C.yellowSoft },
                        { label: "Critical", count: residents.filter(r => r.status === "critical").length, color: C.redText, bg: C.redSoft },
                    ].map((item) => (
                        <View key={item.label} style={[s.summaryChip, { backgroundColor: item.bg }]}>
                            <Text style={[s.summaryCount, { color: item.color }]}>{item.count}</Text>
                            <Text style={[s.summaryLabel, { color: item.color }]}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                {filtered.length === 0 ? (
                    <View style={s.emptyState}>
                        <Text style={s.emptyIcon}>🔍</Text>
                        <Text style={s.emptyText}>No residents found</Text>
                    </View>
                ) : (
                    filtered.map((r) => <ResidentCard key={r.id} {...r} />)
                )}
                <View style={{ height: 30 }} />
            </ScrollView>

            <StaffTabBar active={activeTab} onPress={(id) => { setActiveTab(id); if(onNavigate) onNavigate(id); }} />

            <AddResidentModal visible={showModal} onClose={() => setShowModal(false)} onSave={handleAddResident} />
        </View>
    );
}

const s = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: C.bg },
    // This moves the app down from the battery bar
    topSpacer: {
        height: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20,
        backgroundColor: C.bg,
    },
    header: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        paddingHorizontal: 22, 
        paddingBottom: 20 
    },
    headerTitle: { fontSize: 28, fontWeight: "900", color: C.accent, letterSpacing: -0.5 },
    headerSub: { fontSize: 13, color: C.textMuted, fontWeight: "500" },
    addBtn: { backgroundColor: C.accent, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, ...SHADOW },
    addBtnText: { color: "#fff", fontWeight: "800" },
    
    controlSection: { paddingBottom: 10 },
    searchWrap: { 
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: C.surface, 
        marginHorizontal: 20, 
        borderRadius: 14, 
        paddingHorizontal: 14, 
        height: 50, 
        marginBottom: 15,
        ...SHADOW 
    },
    searchIcon: { marginRight: 10, fontSize: 16 },
    searchInput: { flex: 1, fontSize: 15, color: C.textPrimary },
    
    filterScroll: { paddingHorizontal: 20, gap: 10, paddingBottom: 5 },
    filterChip: { 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        borderRadius: 20, 
        backgroundColor: C.surface, 
        borderWidth: 1, 
        borderColor: C.border 
    },
    filterChipActive: { backgroundColor: C.accent, borderColor: C.accent },
    filterChipText: { fontSize: 13, fontWeight: "700", color: C.textSecondary },
    filterChipTextActive: { color: "#fff" },

    listContainer: { flex: 1 },
    summaryRow: { flexDirection: "row", marginHorizontal: 20, marginBottom: 15, gap: 10 },
    summaryChip: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 16 },
    summaryCount: { fontSize: 20, fontWeight: "900" },
    summaryLabel: { fontSize: 10, fontWeight: "700", textTransform: "uppercase" },

    emptyState: { alignItems: "center", justifyContent: "center", marginTop: 60 },
    emptyIcon: { fontSize: 40, marginBottom: 10 },
    emptyText: { fontSize: 14, color: C.textMuted, fontWeight: "600" },
});