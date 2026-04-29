import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { FamilyTabBar } from "./FamilyAlertsScreen";

export default function FamilyCameraScreen({ onNavigate }) {
    const [activeTab, setActiveTab] = useState("camera");

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
                    src/screens/FamilyCameraScreen.js
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
