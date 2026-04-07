import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Animated,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import Svg, {
    Circle,
    Path,
    Rect,
    G,
    Line,
    Defs,
    LinearGradient,
    Stop,
    Polygon,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
    bg: "#FFFFFF",
    surface: "#FFFFFF",

    // Unified accent to match family login style
    accent: "#1A56DB",
    accentBright: "#3B82F6",
    accentSoft: "#EBF2FF",
    accentMid: "#BFDBFE",

    // Status / badge
    staffBadge: "#1A56DB",
    staffBadgeBg: "#E8F2FF",

    textPrimary: "#07172E",
    textSecondary: "#3E5475",
    textMuted: "#8FA3BF",

    border: "#E4EAF5",
    borderFocus: "#3B82F6",
    inputBg: "#F5F8FF",

    red: "#D12727",
    redSoft: "#FEF2F2",

    divider: "#EEF2FA",
};

// ─── Top-Left Decorative Grid ──────────────────────────────────────────────────
function DecoGrid() {
    const dots = [];
    const cols = 7,
        rows = 6,
        gap = 18;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const opacity = 0.18 + (r + c) * 0.025;
            dots.push(
                <Circle
                    key={`${r}-${c}`}
                    cx={10 + c * gap}
                    cy={10 + r * gap}
                    r={1.6}
                    fill="#1D6FD8"
                    opacity={Math.min(opacity, 0.55)}
                />,
            );
        }
    }
    return (
        <Svg
            width={140}
            height={120}
            style={{ position: "absolute", top: 0, left: 0, opacity: 0.9 }}
        >
            {dots}
        </Svg>
    );
}

// ─── Google Icon ───────────────────────────────────────────────────────────────
function GoogleIcon() {
    return (
        <Svg width={17} height={17} viewBox="0 0 24 24">
            <Path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <Path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <Path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <Path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </Svg>
    );
}

// ─── ID Badge Icon ─────────────────────────────────────────────────────────────
function BadgeIcon() {
    return (
        <Svg width={17} height={17} viewBox="0 0 24 24">
            <Path
                d="M20 4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H4V6h16v14zM9 10H7V8h2v2zm0 4H7v-2h2v2zm4-4h-2V8h2v2zm4 0h-2V8h2v2zm-4 4h-2v-2h2v2zm4 0h-2v-2h2v2z"
                fill={C.textPrimary}
            />
        </Svg>
    );
}

// ─── Eye Icon ─────────────────────────────────────────────────────────────────
function EyeIcon({ visible }) {
    return (
        <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path
                d={
                    visible
                        ? "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                        : "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"
                }
                fill={C.textMuted}
            />
        </Svg>
    );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    autoCapitalize,
    secureTextEntry,
    showToggle,
    onToggle,
    showPassword,
}) {
    const [focused, setFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setFocused(true);
        Animated.timing(borderAnim, {
            toValue: 1,
            duration: 180,
            useNativeDriver: false,
        }).start();
    };
    const handleBlur = () => {
        setFocused(false);
        Animated.timing(borderAnim, {
            toValue: 0,
            duration: 180,
            useNativeDriver: false,
        }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [C.border, C.borderFocus],
    });
    const bgColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [C.inputBg, "#EEF6FF"],
    });

    return (
        <View style={inp.group}>
            <Text style={inp.label}>{label}</Text>
            <Animated.View
                style={[inp.wrapper, { borderColor, backgroundColor: bgColor }]}
            >
                <TextInput
                    style={inp.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={C.textMuted}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize || "none"}
                    autoCorrect={false}
                    secureTextEntry={secureTextEntry && !showPassword}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {showToggle && (
                    <TouchableOpacity
                        onPress={onToggle}
                        style={inp.eyeBtn}
                        activeOpacity={0.7}
                    >
                        <EyeIcon visible={showPassword} />
                    </TouchableOpacity>
                )}
            </Animated.View>
        </View>
    );
}

const inp = StyleSheet.create({
    group: { marginBottom: 18 },
    label: {
        fontSize: 12,
        fontWeight: "700",
        color: C.textSecondary,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        marginBottom: 8,
    },
    wrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 52,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: C.textPrimary,
        fontWeight: "500",
        paddingVertical: 0,
    },
    eyeBtn: { padding: 4, marginLeft: 8 },
});

// ─── Staff Role Pill ──────────────────────────────────────────────────────────
function RolePill({ label, selected, onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.75}
            style={[rp.pill, selected && rp.pillSelected]}
        >
            <Text style={[rp.text, selected && rp.textSelected]}>{label}</Text>
        </TouchableOpacity>
    );
}

const rp = StyleSheet.create({
    pill: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: C.border,
        backgroundColor: C.inputBg,
    },
    pillSelected: {
        borderColor: C.accentBright,
        backgroundColor: C.accentSoft,
    },
    text: {
        fontSize: 12,
        fontWeight: "600",
        color: C.textMuted,
        letterSpacing: 0.3,
    },
    textSelected: {
        color: C.accent,
    },
});

// ─── Main Staff Login Screen ──────────────────────────────────────────────────
export default function StaffLoginScreen({
    onLogin,
    onFamilyPortal,
    onRegister,
    onForgotPassword,
    onGoogleLogin,
    onStaffIdLogin,
    error: parentError = "",
    loading: parentLoading = false,
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");
    const displayedError = localError || parentError;

    const headerAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;
    const footerAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(120, [
            Animated.spring(headerAnim, {
                toValue: 1,
                tension: 60,
                friction: 10,
                useNativeDriver: true,
            }),
            Animated.spring(cardAnim, {
                toValue: 1,
                tension: 60,
                friction: 10,
                useNativeDriver: true,
            }),
            Animated.spring(footerAnim, {
                toValue: 1,
                tension: 60,
                friction: 10,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, {
                toValue: 10,
                duration: 55,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: -10,
                duration: 55,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 8,
                duration: 55,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: -8,
                duration: 55,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 0,
                duration: 55,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleLogin = () => {
        if (!email.trim() || !password) {
            setLocalError("Please enter your work email and password.");
            shake();
            return;
        }
        setLocalError("");
        onLogin(email.trim(), password);
    };

    const headerStyle = {
        opacity: headerAnim,
        transform: [
            {
                translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                }),
            },
        ],
    };
    const cardStyle = {
        opacity: cardAnim,
        transform: [
            {
                translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [32, 0],
                }),
            },
            { translateX: shakeAnim },
        ],
    };
    const footerStyle = {
        opacity: footerAnim,
        transform: [
            {
                translateY: footerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                }),
            },
        ],
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={s.root}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Bottom blob */}
            <View style={s.bottomBlob} />

            <ScrollView
                contentContainerStyle={s.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* ── Brand Header ── */}
                <Animated.View style={[s.header, headerStyle]}>
                    <View style={s.headerText}>
                        <Text style={s.brandName}>CareSync</Text>
                        <Text style={s.brandTagline}>Staff Portal</Text>
                    </View>
                </Animated.View>

                {/* ── Hero Text ── */}
                <Animated.View style={[s.heroText, headerStyle]}>
                    <Text style={s.heroTitle}>Staff Sign In</Text>
                    <Text style={s.heroSub}>
                        Securely access patient records, tasks, and team
                        coordination tools.
                    </Text>
                </Animated.View>

                {/* ── Card ── */}
                <Animated.View style={[s.card, cardStyle]}>
                    {/* Error Banner */}
                    {displayedError ? (
                        <View style={s.errorBanner}>
                            <View style={s.errorDot} />
                            <Text style={s.errorText}>{displayedError}</Text>
                        </View>
                    ) : null}

                    {/* Social / quick login */}
                    <View style={s.socialRow}>
                        <TouchableOpacity
                            style={s.socialBtn}
                            onPress={onGoogleLogin}
                            activeOpacity={0.75}
                        >
                            <GoogleIcon />
                            <Text style={s.socialText}>Google SSO</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={s.socialBtn}
                            onPress={onStaffIdLogin}
                            activeOpacity={0.75}
                        >
                            <BadgeIcon />
                            <Text style={s.socialText}>Staff ID</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={s.divider}>
                        <View style={s.dividerLine} />
                        <Text style={s.dividerLabel}>
                            or sign in with email
                        </Text>
                        <View style={s.dividerLine} />
                    </View>

                    {/* Fields */}
                    <InputField
                        label="Work Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="name@caresync.org"
                        keyboardType="email-address"
                    />
                    <InputField
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        secureTextEntry
                        showToggle
                        onToggle={() => setShowPassword(!showPassword)}
                        showPassword={showPassword}
                    />

                    {/* Forgot */}
                    <TouchableOpacity
                        style={s.forgotRow}
                        onPress={onForgotPassword}
                        activeOpacity={0.7}
                    >
                        <Text style={s.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>

                    {/* CTA */}
                    <TouchableOpacity
                        style={[
                            s.loginBtn,
                            parentLoading && s.loginBtnDisabled,
                        ]}
                        onPress={handleLogin}
                        activeOpacity={0.88}
                        disabled={parentLoading}
                    >
                        {parentLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={s.loginBtnText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Register */}
                    <View style={s.registerRow}>
                        <Text style={s.registerText}>New staff member? </Text>
                        <TouchableOpacity
                            onPress={onRegister}
                            activeOpacity={0.7}
                        >
                            <Text style={s.registerLink}>Create account</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* ── Family Portal Link ── */}
                <Animated.View style={[s.familyRow, footerStyle]}>
                    <View style={s.familyDivider} />
                    <TouchableOpacity
                        style={s.familyBtn}
                        onPress={onFamilyPortal}
                        activeOpacity={0.75}
                    >
                        <View style={s.familyIconDot} />
                        <Text style={s.familyText}>Family portal</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* ── Footer ── */}
                <Animated.View style={[s.footerNote, footerStyle]}>
                    <Text style={s.footerText}>
                        HIPAA-compliant · End-to-end encrypted
                    </Text>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: C.bg,
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 26,
        paddingBottom: 44,
    },
    bottomBlob: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: width * 0.25,
        backgroundColor: "#E8F0FB",
        opacity: 0.4,
        transform: [{ translateX: width * 0.25 }, { translateY: width * 0.25 }],
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 64 : 52,
        marginBottom: 30,
        gap: 12,
    },
    headerText: { flex: 1, gap: 1 },
    brandName: {
        fontSize: 20,
        fontWeight: "800",
        color: C.textPrimary,
        letterSpacing: -0.4,
    },
    brandTagline: {
        fontSize: 11,
        fontWeight: "600",
        color: C.textMuted,
        letterSpacing: 1.4,
        textTransform: "uppercase",
    },
    verifiedBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: C.accentSoft,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: C.accentMid,
    },
    verifiedText: {
        fontSize: 11,
        fontWeight: "700",
        color: C.accent,
        letterSpacing: 0.3,
    },

    // Hero
    heroText: { marginBottom: 22 },
    heroTitle: {
        fontSize: 34,
        fontWeight: "800",
        color: C.textPrimary,
        letterSpacing: -0.8,
        lineHeight: 40,
        marginBottom: 8,
    },
    heroSub: {
        fontSize: 14,
        color: C.textSecondary,
        lineHeight: 21,
        fontWeight: "400",
    },

    // Role selector
    roleRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 22,
        flexWrap: "wrap",
    },

    // Card
    card: {
        backgroundColor: C.surface,
        borderRadius: 28,
        padding: 24,
        borderWidth: 1,
        borderColor: C.border,
        shadowColor: "#0F4C8A",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.07,
        shadowRadius: 24,
        elevation: 4,
        marginBottom: 20,
    },

    // Access notice
    accessNotice: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: C.accentSoft,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: C.accentMid,
    },
    accessDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: C.accentBright,
    },
    accessText: {
        fontSize: 12,
        color: C.textSecondary,
        fontWeight: "500",
    },
    accessRole: {
        color: C.accent,
        fontWeight: "700",
    },

    // Error
    errorBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.redSoft,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 11,
        marginBottom: 18,
        gap: 10,
        borderWidth: 1,
        borderColor: "#FECACA",
    },
    errorDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: C.red,
        flexShrink: 0,
    },
    errorText: {
        fontSize: 13,
        color: C.red,
        fontWeight: "500",
        flex: 1,
        lineHeight: 18,
    },

    // Social
    socialRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    socialBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: 48,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: C.border,
        backgroundColor: C.inputBg,
    },
    socialText: {
        fontSize: 13,
        fontWeight: "600",
        color: C.textPrimary,
    },

    // Divider
    divider: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 22,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: C.divider,
    },
    dividerLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: C.textMuted,
        letterSpacing: 0.3,
    },

    // Forgot
    forgotRow: {
        alignSelf: "flex-end",
        marginTop: -8,
        marginBottom: 22,
    },
    forgotText: {
        fontSize: 13,
        color: C.accent,
        fontWeight: "600",
    },

    // Login CTA
    loginBtn: {
        backgroundColor: C.accent,
        borderRadius: 16,
        height: 54,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        shadowColor: C.accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
        elevation: 5,
    },
    loginBtnDisabled: { opacity: 0.65 },
    loginBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: 0.2,
    },

    // Register
    registerRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    registerText: {
        fontSize: 14,
        color: C.textMuted,
    },
    registerLink: {
        fontSize: 14,
        color: C.accent,
        fontWeight: "700",
    },

    // Family portal
    familyRow: {
        alignItems: "center",
        marginBottom: 14,
    },
    familyDivider: {
        width: 40,
        height: 1,
        backgroundColor: C.border,
        marginBottom: 14,
    },
    familyBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 30,
        backgroundColor: C.accentSoft,
        borderWidth: 1,
        borderColor: C.accentMid,
    },
    familyIconDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: C.accentBright,
    },
    familyText: {
        fontSize: 13,
        fontWeight: "700",
        color: C.accent,
    },
    familyArrow: {
        fontSize: 14,
        color: C.accent,
        fontWeight: "700",
    },

    // Footer
    footerNote: { alignItems: "center" },
    footerText: {
        fontSize: 11,
        color: C.textMuted,
        fontWeight: "500",
        letterSpacing: 0.2,
    },
});
