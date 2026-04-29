import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Modal,
    TextInput,
    Platform,
} from "react-native";
import { StaffTabBar } from "./StaffResidentsScreen";

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

// ─── Log Type Config ─────────────────────────────────────────────────
const LOG_TYPES = {
    medication: { icon: "💊", tag: "Medication", color: C.accent, bg: C.accentSoft },
    vitals:     { icon: "🩺", tag: "Vitals",     color: C.greenText, bg: C.greenSoft },
    incident:   { icon: "⚠️", tag: "Incident",   color: C.yellowText, bg: C.yellowSoft },
    therapy:    { icon: "🏃", tag: "Therapy",    color: C.accent, bg: C.accentSoft },
    critical:   { icon: "🚨", tag: "Critical",   color: C.redText, bg: C.redSoft },
};

// ─── Initial Data ────────────────────────────────────────────────────
const INITIAL_LOGS = [
    { id: 1, time: "08:15 AM", resident: "Nora Roberts", room: "204", type: "medication", note: "Morning medication administered — Metformin 500mg, Lisinopril 10mg" },
    { id: 2, time: "09:30 AM", resident: "George Mendez", room: "108", type: "vitals", note: "BP: 145/90 mmHg · HR: 82 bpm · Temp: 36.8°C" },
    { id: 3, time: "10:00 AM", resident: "Lila Chen", room: "312", type: "incident", note: "Resident appeared confused during breakfast. Monitored and settled. Family notified." },
    { id: 4, time: "11:15 AM", resident: "Robert Hall", room: "215", type: "critical", note: "BP: 162/98 mmHg · HR: 95 bpm · SpO₂: 94% — Physician alerted." },
    { id: 5, time: "01:00 PM", resident: "Margaret Price", room: "101", type: "therapy", note: "Physical therapy session completed. Improved hip flexion range noted." },
    { id: 6, time: "02:45 PM", resident: "Thomas Nguyen", room: "330", type: "medication", note: "Afternoon antibiotics administered. Appetite improved since morning." },
];

const INITIAL_TASKS = [
    { id: 1, label: "Evening medication round", time: "6:00 PM", done: false, icon: "💊" },
    { id: 2, label: "Vitals check — Robert Hall", time: "4:00 PM", done: false, icon: "🩺" },
    { id: 3, label: "Family call — Chen family", time: "5:00 PM", done: false, icon: "📞" },
    { id: 4, label: "Wound dressing — Room 204", time: "3:30 PM", done: true, icon: "🩹" },
    { id: 5, label: "Laundry pickup — Wing B", time: "2:00 PM", done: true, icon: "🧺" },
];

const LOG_FILTER_TABS = ["All", "Medication", "Vitals", "Incident", "Therapy", "Critical"];
const VIEW_TABS = ["Logs", "Tasks"];

// ─── Add Log Modal ───────────────────────────────────────────────────
function AddLogModal({ visible, onClose, onSave }) {
    const [resident, setResident] = useState("");
    const [room, setRoom] = useState("");
    const [type, setType] = useState("medication");
    const [note, setNote] = useState("");

    const typeOptions = [
        { value: "medication", label: "💊 Medication" },
        { value: "vitals", label: "🩺 Vitals" },
        { value: "incident", label: "⚠️ Incident" },
        { value: "therapy", label: "🏃 Therapy" },
        { value: "critical", label: "🚨 Critical" },
    ];

    const handleSave = () => {
        if (!resident.trim() || !room.trim()) return;
        const now = new Date();
        const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        onSave({ resident: resident.trim(), room: room.trim(), type, note: note.trim() || "No notes provided.", time });
        setResident(""); setRoom(""); setType("medication"); setNote("");
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={lm.overlay}>
                <View style={lm.sheet}>
                    <View style={lm.handle} />
                    <Text style={lm.title}>Add Log Entry</Text>
                    <Text style={lm.label}>Resident Name</Text>
                    <TextInput style={lm.input} placeholder="e.g. Nora Roberts" placeholderTextColor={C.textMuted} value={resident} onChangeText={setResident} />
                    <Text style={lm.label}>Room Number</Text>
                    <TextInput style={lm.input} placeholder="e.g. 204" placeholderTextColor={C.textMuted} value={room} onChangeText={setRoom} keyboardType="numeric" />
                    <Text style={lm.label}>Log Type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }} contentContainerStyle={{ gap: 8 }}>
                        {typeOptions.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={[lm.typeChip, type === opt.value && lm.typeChipActive]}
                                onPress={() => setType(opt.value)}
                                activeOpacity={0.75}
                            >
                                <Text style={[lm.typeChipText, type === opt.value && lm.typeChipTextActive]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <Text style={lm.label}>Notes</Text>
                    <TextInput
                        style={[lm.input, lm.textarea]}
                        placeholder="Describe the log entry..."
                        placeholderTextColor={C.textMuted}
                        value={note}
                        onChangeText={setNote}
                        multiline
                        numberOfLines={3}
                    />
                    <View style={lm.actions}>
                        <TouchableOpacity style={lm.cancelBtn} onPress={onClose} activeOpacity={0.8}>
                            <Text style={lm.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={lm.saveBtn} onPress={handleSave} activeOpacity={0.8}>
                            <Text style={lm.saveText}>Add Log</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// ─── Add Task Modal ──────────────────────────────────────────────────
function AddTaskModal({ visible, onClose, onSave }) {
    const [label, setLabel] = useState("");
    const [time, setTime] = useState("");
    const [icon, setIcon] = useState("📋");

    const iconOptions = ["💊", "🩺", "📞", "🩹", "🧺", "📋", "🏃", "🍽️", "🚿"];

    const handleSave = () => {
        if (!label.trim()) return;
        onSave({ label: label.trim(), time: time.trim() || "Anytime", icon, done: false });
        setLabel(""); setTime(""); setIcon("📋");
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={lm.overlay}>
                <View style={lm.sheet}>
                    <View style={lm.handle} />
                    <Text style={lm.title}>Add Task</Text>
                    <Text style={lm.label}>Task Description</Text>
                    <TextInput style={lm.input} placeholder="e.g. Evening medication round" placeholderTextColor={C.textMuted} value={label} onChangeText={setLabel} />
                    <Text style={lm.label}>Time</Text>
                    <TextInput style={lm.input} placeholder="e.g. 6:00 PM" placeholderTextColor={C.textMuted} value={time} onChangeText={setTime} />
                    <Text style={lm.label}>Icon</Text>
                    <View style={lm.iconGrid}>
                        {iconOptions.map((ic) => (
                            <TouchableOpacity
                                key={ic}
                                style={[lm.iconBtn, icon === ic && lm.iconBtnActive]}
                                onPress={() => setIcon(ic)}
                                activeOpacity={0.75}
                            >
                                <Text style={{ fontSize: 20 }}>{ic}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={lm.actions}>
                        <TouchableOpacity style={lm.cancelBtn} onPress={onClose} activeOpacity={0.8}>
                            <Text style={lm.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={lm.saveBtn} onPress={handleSave} activeOpacity={0.8}>
                            <Text style={lm.saveText}>Add Task</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const lm = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    sheet: { backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 22, paddingBottom: 36 },
    handle: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 10, alignSelf: 'center', marginBottom: 15 },
    title: { fontSize: 18, fontWeight: "800", color: C.textPrimary, marginBottom: 16 },
    label: { fontSize: 11, fontWeight: "700", color: C.textMuted, marginBottom: 6, marginTop: 12, textTransform: "uppercase", letterSpacing: 0.5 },
    input: { borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 11, fontSize: 13, color: C.textPrimary, backgroundColor: "#F8FBFF" },
    textarea: { height: 80, textAlignVertical: "top" },
    typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
    typeChipActive: { backgroundColor: C.accent, borderColor: C.accent },
    typeChipText: { fontSize: 12, fontWeight: "700", color: C.textSecondary },
    typeChipTextActive: { color: "#fff" },
    iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    iconBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },
    iconBtnActive: { backgroundColor: C.accentSoft, borderColor: C.accent },
    actions: { flexDirection: "row", gap: 10, marginTop: 20 },
    cancelBtn: { flex: 1, backgroundColor: "#F0F7FF", borderRadius: 14, padding: 13, alignItems: "center", borderWidth: 1, borderColor: C.border },
    cancelText: { fontSize: 14, fontWeight: "700", color: C.textSecondary },
    saveBtn: { flex: 2, backgroundColor: C.accent, borderRadius: 14, padding: 13, alignItems: "center" },
    saveText: { fontSize: 14, fontWeight: "800", color: "#fff" },
});

// ─── Logs Screen ─────────────────────────────────────────────────────
export default function StaffLogsScreen({ onNavigate }) {
    const [activeTab, setActiveTab] = useState("logs");
    const [viewTab, setViewTab] = useState("Logs");
    const [logFilter, setLogFilter] = useState("All");
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [showLogModal, setShowLogModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);

    const toggleTask = (id) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    };

    const handleAddLog = (data) => {
        setLogs((prev) => [{ id: Date.now(), ...data }, ...prev]);
    };

    const handleAddTask = (data) => {
        setTasks((prev) => [...prev, { id: Date.now(), ...data }]);
    };

    const filteredLogs = logs.filter(
        (l) => logFilter === "All" || LOG_TYPES[l.type]?.tag === logFilter
    );

    const pendingTasks = tasks.filter((t) => !t.done);
    const doneTasks = tasks.filter((t) => t.done);

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            
            {/* Top Spacer to move content down from status bar */}
            <View style={s.topSpacer} />

            <View style={s.header}>
                <View>
                    <Text style={s.headerTitle}>Logs & Tasks</Text>
                    <Text style={s.headerSub}>
                        Today, {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                    </Text>
                </View>
                <TouchableOpacity
                    style={s.addBtn}
                    activeOpacity={0.8}
                    onPress={() => viewTab === "Logs" ? setShowLogModal(true) : setShowTaskModal(true)}
                >
                    <Text style={s.addBtnText}>{viewTab === "Logs" ? "+ Log" : "+ Task"}</Text>
                </TouchableOpacity>
            </View>

            {/* Fixed Controls Area (Toggle + Filters) */}
            <View style={s.controlsArea}>
                <View style={s.viewToggleRow}>
                    {VIEW_TABS.map((v) => (
                        <TouchableOpacity
                            key={v}
                            style={[s.viewToggle, viewTab === v && s.viewToggleActive]}
                            onPress={() => setViewTab(v)}
                            activeOpacity={0.8}
                        >
                            <Text style={[s.viewToggleText, viewTab === v && s.viewToggleTextActive]}>
                                {v === "Logs" ? "📋 Logs" : "✅ Tasks"}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {viewTab === "Logs" && (
                    <View style={s.filterRowContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={s.filterScrollContent}
                        >
                            {LOG_FILTER_TABS.map((f) => (
                                <TouchableOpacity
                                    key={f}
                                    style={[s.filterChip, logFilter === f && s.filterChipActive]}
                                    onPress={() => setLogFilter(f)}
                                    activeOpacity={0.75}
                                >
                                    <Text style={[s.filterChipText, logFilter === f && s.filterChipTextActive]}>
                                        {f}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>

            {/* Scrollable List Area */}
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                style={s.scrollContainer}
                contentContainerStyle={s.scrollContent}
            >
                {viewTab === "Logs" ? (
                    filteredLogs.length === 0 ? (
                        <View style={s.emptyState}>
                            <Text style={{ fontSize: 36 }}>📋</Text>
                            <Text style={s.emptyText}>No logs found</Text>
                        </View>
                    ) : (
                        filteredLogs.map((log, index) => {
                            const t = LOG_TYPES[log.type] || LOG_TYPES.medication;
                            return (
                                <View key={log.id} style={s.logCard}>
                                    <View style={s.timelineCol}>
                                        <View style={s.iconCircle}><Text style={{ fontSize: 18 }}>{t.icon}</Text></View>
                                        {index < filteredLogs.length - 1 && <View style={s.timelineLine} />}
                                    </View>
                                    <View style={s.logContent}>
                                        <View style={s.logTopRow}>
                                            <View style={[s.tagBadge, { backgroundColor: t.bg }]}>
                                                <Text style={[s.tagText, { color: t.color }]}>{t.tag}</Text>
                                            </View>
                                            <Text style={s.logTime}>{log.time}</Text>
                                        </View>
                                        <Text style={s.logResident}>{log.resident} · Room {log.room}</Text>
                                        <Text style={s.logNote}>{log.note}</Text>
                                    </View>
                                </View>
                            );
                        })
                    )
                ) : (
                    <>
                        <Text style={s.taskSectionTitle}>Pending ({pendingTasks.length})</Text>
                        {pendingTasks.map((task) => (
                            <TouchableOpacity key={task.id} style={s.taskCard} onPress={() => toggleTask(task.id)}>
                                <View style={s.taskCheckbox}><View style={s.checkboxEmpty} /></View>
                                <View style={s.taskIconBox}><Text style={{ fontSize: 18 }}>{task.icon}</Text></View>
                                <View style={s.taskInfo}>
                                    <Text style={s.taskLabel}>{task.label}</Text>
                                    <Text style={s.taskTime}>🕐 {task.time}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <Text style={[s.taskSectionTitle, { marginTop: 20 }]}>Completed ({doneTasks.length})</Text>
                        {doneTasks.map((task) => (
                            <TouchableOpacity key={task.id} style={[s.taskCard, s.taskCardDone]} onPress={() => toggleTask(task.id)}>
                                <View style={s.taskCheckbox}><View style={s.checkboxFilled}><Text style={{ color: "#fff", fontSize: 12 }}>✓</Text></View></View>
                                <View style={[s.taskIconBox, { opacity: 0.5 }]}><Text style={{ fontSize: 18 }}>{task.icon}</Text></View>
                                <View style={s.taskInfo}>
                                    <Text style={[s.taskLabel, s.taskLabelDone]}>{task.label}</Text>
                                    <Text style={s.taskTime}>🕐 {task.time}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                )}
            </ScrollView>

            <StaffTabBar active={activeTab} onPress={(id) => { setActiveTab(id); onNavigate(id); }} />

            <AddLogModal visible={showLogModal} onClose={() => setShowLogModal(false)} onSave={handleAddLog} />
            <AddTaskModal visible={showTaskModal} onClose={() => setShowTaskModal(false)} onSave={handleAddTask} />
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    topSpacer: { height: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20 },
    header: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 22, paddingBottom: 16 },
    headerTitle: { fontSize: 26, fontWeight: "800", color: C.accent, letterSpacing: -0.5 },
    headerSub: { fontSize: 13, color: C.textMuted, marginTop: 2 },
    addBtn: { backgroundColor: C.accent, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, ...SHADOW },
    addBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },
    
    controlsArea: { paddingBottom: 10 },
    viewToggleRow: { flexDirection: "row", marginHorizontal: 20, backgroundColor: C.surface, borderRadius: 14, padding: 4, marginBottom: 12, ...SHADOW },
    viewToggle: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
    viewToggleActive: { backgroundColor: C.accent },
    viewToggleText: { fontSize: 14, fontWeight: "700", color: C.textMuted },
    viewToggleTextActive: { color: "#fff" },

    filterRowContainer: { marginBottom: 5 },
    filterScrollContent: { paddingHorizontal: 20, gap: 10, paddingBottom: 5 },
    filterChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
    filterChipActive: { backgroundColor: C.accent, borderColor: C.accent },
    filterChipText: { fontSize: 13, fontWeight: "700", color: C.textSecondary },
    filterChipTextActive: { color: "#fff" },

    scrollContainer: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },

    emptyState: { alignItems: "center", marginTop: 60, gap: 12 },
    emptyText: { fontSize: 16, color: C.textMuted, fontWeight: "600" },
    logCard: { flexDirection: "row", marginBottom: 4, gap: 12 },
    timelineCol: { alignItems: "center", width: 48 },
    iconCircle: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.surface, alignItems: "center", justifyContent: "center", ...SHADOW },
    timelineLine: { width: 2, flex: 1, backgroundColor: C.border, marginVertical: 4, minHeight: 20 },
    logContent: { flex: 1, backgroundColor: C.surface, borderRadius: 16, padding: 14, marginBottom: 8, ...SHADOW },
    logTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
    tagBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    tagText: { fontSize: 11, fontWeight: "800" },
    logTime: { fontSize: 12, color: C.textMuted, fontWeight: "600" },
    logResident: { fontSize: 13, fontWeight: "800", color: C.textPrimary, marginBottom: 4 },
    logNote: { fontSize: 12, color: C.textSecondary, lineHeight: 18 },
    
    taskSectionTitle: { fontSize: 16, fontWeight: "800", color: C.textPrimary, marginBottom: 10, marginTop: 4 },
    taskCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderRadius: 16, padding: 14, marginBottom: 10, gap: 12, ...SHADOW },
    taskCardDone: { opacity: 0.65 },
    taskCheckbox: { width: 28, alignItems: "center" },
    checkboxEmpty: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: C.border },
    checkboxFilled: { width: 22, height: 22, borderRadius: 6, backgroundColor: C.green, alignItems: "center", justifyContent: "center" },
    taskIconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
    taskInfo: { flex: 1 },
    taskLabel: { fontSize: 14, fontWeight: "700", color: C.textPrimary, marginBottom: 3 },
    taskLabelDone: { textDecorationLine: "line-through", color: C.textMuted },
    taskTime: { fontSize: 12, color: C.textMuted },
});