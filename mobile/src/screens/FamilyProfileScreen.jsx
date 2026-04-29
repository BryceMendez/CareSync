// ── CHANGES FROM ORIGINAL ───────────────────────────────────────────────────
// 1. Added `onViewResident` prop
// 2. Linked Resident card now calls onViewResident() on press
// ────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { FamilyTabBar } from "./FamilyAlertsScreen";

const PREFERENCES = [
    {
        icon: "🔔",
        label: "Notifications",
        desc: "Alerts, updates, and reminders",
    },
    {
        icon: "🔒",
        label: "Security & Privacy",
        desc: "2FA, Password and Permissions",
    },
];

const SUPPORT = [
    { icon: "❓", label: "Help Center" },
    { icon: "ℹ️", label: "About CareSync" },
];

export default function FamilyProfileScreen({
    profile,
    onNavigate,
    onSignOut,
    onViewResident,
}) {
    const [activeTab, setActiveTab] = useState("profile");

    const name = profile?.name || "Sarah Jenkins";
    const email = profile?.email || "sarah.jenkins@example.com";
    const residentName = profile?.residentName || "Nora Roberts";
    const relationship = profile?.relationship || "Mother";

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
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity>
                    <Text style={{ fontSize: 20 }}>🚩</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarWrap}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>SJ</Text>
                        </View>
                    </View>
                    <Text style={styles.profileName}>{name}</Text>
                    <Text style={styles.profileEmail}>{email}</Text>
                    <TouchableOpacity style={styles.editProfileBtn}>
                        <Text style={styles.editProfileText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Linked Resident — ✅ UPDATED: tappable, calls onViewResident */}
                <Text style={styles.sectionLabel}>LINKED RESIDENT</Text>
                <TouchableOpacity
                    style={styles.residentCard}
                    activeOpacity={0.78}
                    onPress={() => onViewResident && onViewResident()}
                >
                    <View style={styles.residentAvatar}>
                        <Text style={styles.residentAvatarText}>NR</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.residentName}>{residentName}</Text>
                        <Text style={styles.residentDetail}>
                            {relationship} · Room 402 · Main Wing
                        </Text>
                        <Text style={styles.residentTapHint}>
                            Tap to view resident profile →
                        </Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>

                {/* Preferences */}
                <Text style={styles.sectionLabel}>PREFERENCES</Text>
                <View style={styles.menuCard}>
                    {PREFERENCES.map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.menuRow,
                                i < PREFERENCES.length - 1 && styles.menuBorder,
                            ]}
                        >
                            <View style={styles.menuIconWrap}>
                                <Text style={styles.menuIcon}>{item.icon}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.menuLabel}>
                                    {item.label}
                                </Text>
                                <Text style={styles.menuDesc}>{item.desc}</Text>
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Support & Info */}
                <Text style={styles.sectionLabel}>SUPPORT & INFO</Text>
                <View style={styles.menuCard}>
                    {SUPPORT.map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.menuRow,
                                i < SUPPORT.length - 1 && styles.menuBorder,
                            ]}
                        >
                            <View style={styles.menuIconWrap}>
                                <Text style={styles.menuIcon}>{item.icon}</Text>
                            </View>
                            <Text style={[styles.menuLabel, { flex: 1 }]}>
                                {item.label}
                            </Text>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Sign Out */}
                <TouchableOpacity style={styles.signOutBtn} onPress={onSignOut}>
                    <Text style={styles.signOutIcon}>↩️</Text>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                {/* Version */}
                <Text style={styles.version}>Version 2.4.1 (build 816)</Text>
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
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#1565C0" },
    scroll: { paddingHorizontal: 16, paddingBottom: 32 },

    profileCard: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    avatarWrap: { marginBottom: 12 },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#2196F3",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#E3F2FD",
    },
    avatarText: { color: "white", fontSize: 28, fontWeight: "700" },
    profileName: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1565C0",
        marginBottom: 4,
    },
    profileEmail: { fontSize: 13, color: "#90A4AE", marginBottom: 12 },
    editProfileBtn: {
        borderWidth: 1.5,
        borderColor: "#2196F3",
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 20,
    },
    editProfileText: { fontSize: 13, color: "#2196F3", fontWeight: "600" },

    sectionLabel: {
        fontSize: 11,
        fontWeight: "800",
        color: "#90A4AE",
        letterSpacing: 0.8,
        marginBottom: 8,
        marginLeft: 2,
    },

    residentCard: {
        backgroundColor: "white",
        borderRadius: 14,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
        elevation: 1,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    residentAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#BBDEFB",
        alignItems: "center",
        justifyContent: "center",
    },
    residentAvatarText: { fontSize: 14, fontWeight: "700", color: "#1565C0" },
    residentName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#263238",
        marginBottom: 2,
    },
    residentDetail: { fontSize: 12, color: "#90A4AE", marginBottom: 3 },
    residentTapHint: { fontSize: 11, color: "#2196F3", fontWeight: "600" },

    menuCard: {
        backgroundColor: "white",
        borderRadius: 14,
        marginBottom: 20,
        overflow: "hidden",
        elevation: 1,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    menuRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        gap: 12,
    },
    menuBorder: { borderBottomWidth: 1, borderBottomColor: "#F5F9FF" },
    menuIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#E3F2FD",
        alignItems: "center",
        justifyContent: "center",
    },
    menuIcon: { fontSize: 16 },
    menuLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#263238",
        marginBottom: 2,
    },
    menuDesc: { fontSize: 11, color: "#90A4AE" },
    chevron: { fontSize: 20, color: "#BBDEFB" },

    signOutBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderWidth: 1.5,
        borderColor: "#FFCDD2",
        borderRadius: 14,
        paddingVertical: 14,
        marginBottom: 16,
        backgroundColor: "#FFF5F5",
    },
    signOutIcon: { fontSize: 18 },
    signOutText: { fontSize: 15, color: "#EF5350", fontWeight: "700" },
    version: { fontSize: 11, color: "#B0BEC5", textAlign: "center" },

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
