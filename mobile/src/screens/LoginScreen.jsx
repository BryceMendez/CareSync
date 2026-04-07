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
import Svg, { Circle, Path, Rect, G, Line } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    accent: "#1A56DB",
    accentBright: "#3B82F6",
    accentSoft: "#EBF2FF",
    accentMid: "#BFDBFE",
    textPrimary: "#0D1B3E",
    textSecondary: "#4B5E82",
    textMuted: "#9AAABE",
    border: "#E8EDFB",
    borderFocus: "#3B82F6",
    inputBg: "#F7F9FF",
    red: "#DC2626",
    redSoft: "#FEF2F2",
    green: "#16A34A",
    greenSoft: "#F0FDF4",
    divider: "#F1F4FB",
};



const geo = StyleSheet.create({
    svg: {
        position: "absolute",
        top: 0,
        right: 0,
        opacity: 1,
    },
});



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

// ─── Apple Icon ────────────────────────────────────────────────────────────────
function AppleIcon() {
    return (
        <Svg width={17} height={17} viewBox="0 0 24 24">
            <Path
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
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
    autoCorrect,
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
        outputRange: [C.inputBg, "#F0F6FF"],
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
                    autoCorrect={autoCorrect || false}
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

// ─── Main Login Screen ────────────────────────────────────────────────────────
export default function LoginScreen({
    onLogin,
    onRegister,
    onForgotPassword,
    onGoogleLogin,
    onAppleLogin,
    onStaffPortal,
    error: parentError = "",
    loading: parentLoading = false,
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");
    const displayedError = localError || parentError;

    // Entrance animations
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
            setLocalError("Please enter your email and password.");
            shake();
            return;
        }
        setLocalError("");
        onLogin(email.trim(), password);
    };

    // Derived animation styles
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

            

            {/* Bottom decorative element */}
            <View style={s.bottomDecor} />

            <ScrollView
                contentContainerStyle={s.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* ── Brand Header ── */}
                <Animated.View style={[s.header, headerStyle]}>
                    <View style={s.headerText}>
                        <Text style={s.brandName}>CareSync</Text>
                        <Text style={s.brandTagline}>Family Portal</Text>
                    </View>
                </Animated.View>

                {/* ── Hero text ── */}
                <Animated.View style={[s.heroText, headerStyle]}>
                    <Text style={s.heroTitle}>Welcome back</Text>
                    <Text style={s.heroSub}>
                        Sign in to stay connected with your loved one's care.
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

                    {/* Social login — top of card for modern layout */}
                    <View style={s.socialRow}>
                        <TouchableOpacity
                            style={s.socialBtn}
                            onPress={onGoogleLogin}
                            activeOpacity={0.75}
                        >
                            <GoogleIcon />
                            <Text style={s.socialText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={s.socialBtn}
                            onPress={onAppleLogin}
                            activeOpacity={0.75}
                        >
                            <AppleIcon />
                            <Text style={s.socialText}>Apple</Text>
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

                    {/* Email field */}
                    <InputField
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="name@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    {/* Password field */}
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

                    {/* Forgot password */}
                    <TouchableOpacity
                        style={s.forgotRow}
                        onPress={onForgotPassword}
                        activeOpacity={0.7}
                    >
                        <Text style={s.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>

                    {/* Login CTA */}
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
                        <Text style={s.registerText}>New to CareSync? </Text>
                        <TouchableOpacity
                            onPress={onRegister}
                            activeOpacity={0.7}
                        >
                            <Text style={s.registerLink}>Create account</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* ── Staff Portal ── */}
                <Animated.View style={[s.staffRow, footerStyle]}>
                    <View style={s.staffDivider} />
                    <TouchableOpacity
                        style={s.staffBtn}
                        onPress={onStaffPortal}
                        activeOpacity={0.75}
                    >
                        <View style={s.staffIconDot} />
                        <Text style={s.staffText}>Staff portal</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* ── Footer note ── */}
                <Animated.View style={[s.footerNote, footerStyle]}>
                    <Text style={s.footerText}>
                        Protected by end-to-end encryption
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
        paddingBottom: 40,
    },
    bottomDecor: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: width * 0.45,
        height: width * 0.45,
        borderRadius: width * 0.225,
        backgroundColor: "#EBF2FF",
        opacity: 0.45,
        transform: [
            { translateX: -width * 0.22 },
            { translateY: width * 0.22 },
        ],
    },

    // Header / brand
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 64 : 52,
        marginBottom: 36,
        gap: 12,
    },
    headerText: { gap: 1 },
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

    // Hero text
    heroText: {
        marginBottom: 32,
    },
    heroTitle: {
        fontSize: 34,
        fontWeight: "800",
        color: C.textPrimary,
        letterSpacing: -0.8,
        lineHeight: 40,
        marginBottom: 8,
    },
    heroSub: {
        fontSize: 15,
        color: C.textSecondary,
        lineHeight: 22,
        fontWeight: "400",
    },

    // Card
    card: {
        backgroundColor: C.surface,
        borderRadius: 28,
        padding: 24,
        borderWidth: 1,
        borderColor: C.border,
        shadowColor: "#1A3C6E",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.07,
        shadowRadius: 24,
        elevation: 4,
        marginBottom: 20,
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
        fontSize: 14,
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

    // Login button
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
    loginBtnDisabled: {
        opacity: 0.65,
    },
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

    // Staff portal
    staffRow: {
        alignItems: "center",
        marginBottom: 14,
    },
    staffDivider: {
        width: 40,
        height: 1,
        backgroundColor: C.border,
        marginBottom: 14,
    },
    staffBtn: {
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
    staffIconDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: C.accentBright,
    },
    staffText: {
        fontSize: 13,
        fontWeight: "700",
        color: C.accent,
    },
    staffArrow: {
        fontSize: 14,
        color: C.accent,
        fontWeight: "700",
    },

    // Footer note
    footerNote: {
        alignItems: "center",
    },
    footerText: {
        fontSize: 11,
        color: C.textMuted,
        fontWeight: "500",
        letterSpacing: 0.2,
    },
});
