import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from "react-native";

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
                <View style={{ width: 40 }} />
            </View>

            {/* Coming Soon */}
            <View style={styles.body}>
                <Text style={styles.emoji}>🚧</Text>
                <Text style={styles.title}>Coming Soon</Text>
                <Text style={styles.subtitle}>
                    This screen is not included in the current sprint.
                </Text>
                <Text style={styles.path}>
                    src/screens/FamilyAlertsScreen.js
                </Text>
            </View>

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
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#1565C0" },
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
    body: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
    },
    emoji: { fontSize: 48, marginBottom: 16 },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1565C0",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#78909C",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 20,
    },
    path: {
        fontSize: 11,
        color: "#90A4AE",
        fontFamily: "monospace",
        backgroundColor: "#E3F2FD",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        overflow: "hidden",
    },
});
