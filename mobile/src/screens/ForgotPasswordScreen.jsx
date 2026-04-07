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
import Svg, { Circle, Path, Rect, Line, G } from "react-native-svg";

const { width } = Dimensions.get("window");

// ─── Design Tokens (identical to RegisterScreen) ──────────────────────────────
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
    greenBorder: "#BBF7D0",
    orange: "#D97706",
    orangeSoft: "#FFFBEB",
    divider: "#F1F4FB",
};

// ─── Decorative Geometry (identical to RegisterScreen) ────────────────────────
function DecoGeometry() {
    return (
        <Svg
            width={width * 0.6}
            height={width * 0.6}
            viewBox="0 0 260 260"
            style={{ position: "absolute", top: 0, right: 0 }}
        >
            <Circle cx="220" cy="40" r="130" fill="none" stroke="#EBF2FF" strokeWidth="1" />
            <Circle cx="220" cy="40" r="100" fill="none" stroke="#DBEAFE" strokeWidth="0.8" />
            <Circle cx="220" cy="40" r="68" fill="none" stroke="#BFDBFE" strokeWidth="0.6" />
            <Circle cx="160" cy="100" r="3" fill="#BFDBFE" />
            <Circle cx="178" cy="82" r="2.2" fill="#93C5FD" />
            <Circle cx="148" cy="118" r="1.8" fill="#DBEAFE" />
            <Circle cx="196" cy="68" r="2.6" fill="#93C5FD" />
            <Circle cx="136" cy="88" r="1.5" fill="#BFDBFE" />
            <Circle cx="208" cy="52" r="10" fill="#EBF2FF" />
            <Circle cx="208" cy="52" r="5" fill="#3B82F6" opacity="0.35" />
            <Line x1="200" y1="52" x2="216" y2="52" stroke="#BFDBFE" strokeWidth="0.8" />
            <Line x1="208" y1="44" x2="208" y2="60" stroke="#BFDBFE" strokeWidth="0.8" />
            <Rect x="130" y="140" width="7" height="7" rx="1.5" fill="#DBEAFE" />
            <Rect x="144" y="130" width="5" height="5" rx="1" fill="#BFDBFE" />
        </Svg>
    );
}

// ─── Bottom Decor (identical to RegisterScreen) ───────────────────────────────
function BottomDecor() {
    return (
        <View
            style={{
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
            }}
        />
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

// ─── Check Icon ───────────────────────────────────────────────────────────────
function CheckIcon({ color = "#fff", size = 12 }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
                d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                fill={color}
            />
        </Svg>
    );
}

// ─── Input Field (identical to RegisterScreen) ────────────────────────────────
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
    optional,
    error,
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

    const borderColor = error
        ? C.red
        : borderAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [C.border, C.borderFocus],
          });
    const bgColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [C.inputBg, "#F0F6FF"],
    });

    return (
        <View style={inp.group}>
            <View style={inp.labelRow}>
                <Text style={inp.label}>{label}</Text>
                {optional && <Text style={inp.optional}>Optional</Text>}
            </View>
            <Animated.View
                style={[inp.wrapper, { borderColor, backgroundColor: bgColor }]}
            >
                <TextInput
                    style={inp.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={C.textMuted}
                    keyboardType={keyboardType || "default"}
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
            {error ? <Text style={inp.error}>{error}</Text> : null}
        </View>
    );
}

const inp = StyleSheet.create({
    group: { marginBottom: 16 },
    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        color: C.textSecondary,
        letterSpacing: 0.8,
        textTransform: "uppercase",
    },
    optional: {
        fontSize: 11,
        fontWeight: "500",
        color: C.textMuted,
        letterSpacing: 0.3,
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
    error: { fontSize: 12, color: C.red, marginTop: 6, marginLeft: 2 },
});

// ─── Password Strength Indicator ──────────────────────────────────────────────
function PasswordStrength({ password }) {
    const getStrength = () => {
        if (!password || password.length < 1)
            return { level: 0, label: "", color: C.border };
        if (password.length < 6)
            return { level: 1, label: "Weak", color: "#EF4444" };
        if (
            password.length < 10 ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password)
        )
            return { level: 2, label: "Fair", color: "#F59E0B" };
        return { level: 3, label: "Strong", color: C.green };
    };
    const { level, label, color } = getStrength();
    if (!password) return null;
    return (
        <View style={ps.wrap}>
            <View style={ps.bars}>
                {[1, 2, 3].map((i) => (
                    <View
                        key={i}
                        style={[
                            ps.bar,
                            { backgroundColor: i <= level ? color : C.border },
                        ]}
                    />
                ))}
            </View>
            <Text style={[ps.label, { color }]}>{label}</Text>
        </View>
    );
}

const ps = StyleSheet.create({
    wrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: -8,
        marginBottom: 12,
    },
    bars: { flexDirection: "row", gap: 4, flex: 1 },
    bar: { flex: 1, height: 3, borderRadius: 2 },
    label: { fontSize: 11, fontWeight: "600", minWidth: 40 },
});

// ─── Step Progress Header (identical to RegisterScreen) ───────────────────────
function StepHeader({ step, total, title, subtitle, onBack }) {
    return (
        <View style={sh.container}>
            <View style={sh.topRow}>
                <TouchableOpacity
                    style={sh.backBtn}
                    onPress={onBack}
                    activeOpacity={0.7}
                >
                    <Svg width={20} height={20} viewBox="0 0 24 24">
                        <Path
                            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                            fill={C.accent}
                        />
                    </Svg>
                </TouchableOpacity>

                <View style={sh.stepMeta}>
                    <Text style={sh.progressStep}>
                        Step {step} of {total}
                    </Text>
                    <Text style={sh.progressPct}>
                        {Math.round((step / total) * 100)}%
                    </Text>
                </View>
            </View>

            <View style={sh.track}>
                {Array.from({ length: total }).map((_, i) => (
                    <View
                        key={i}
                        style={[
                            sh.seg,
                            i < step ? sh.segActive : sh.segInactive,
                        ]}
                    />
                ))}
            </View>

            <View style={sh.titleBlock}>
                <Text style={sh.title}>{title}</Text>
                {subtitle ? <Text style={sh.subtitle}>{subtitle}</Text> : null}
            </View>
        </View>
    );
}

const sh = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === "ios" ? 58 : 46,
        paddingHorizontal: 26,
        marginBottom: 8,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        marginBottom: 16,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: C.accentSoft,
        borderWidth: 1,
        borderColor: C.accentMid,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    stepMeta: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    progressStep: {
        fontSize: 12,
        fontWeight: "600",
        color: C.textMuted,
        letterSpacing: 0.3,
    },
    progressPct: { fontSize: 12, fontWeight: "700", color: C.accent },
    track: {
        flexDirection: "row",
        gap: 5,
        marginBottom: 24,
    },
    seg: { flex: 1, height: 4, borderRadius: 2 },
    segActive: { backgroundColor: C.accent },
    segInactive: { backgroundColor: C.border },
    titleBlock: { marginBottom: 24 },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: C.textPrimary,
        letterSpacing: -0.6,
        lineHeight: 34,
        marginBottom: 6,
    },
    subtitle: { fontSize: 14, color: C.textSecondary, lineHeight: 21 },
});

// ─── Primary CTA Button (identical to RegisterScreen) ────────────────────────
function CTAButton({ label, onPress, loading }) {
    return (
        <TouchableOpacity
            style={cta.btn}
            onPress={onPress}
            activeOpacity={0.88}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" size="small" />
            ) : (
                <>
                    <Text style={cta.text}>{label}</Text>
                    <View style={cta.arrow}>
                        <Svg width={16} height={16} viewBox="0 0 24 24">
                            <Path
                                d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
                                fill="#fff"
                            />
                        </Svg>
                    </View>
                </>
            )}
        </TouchableOpacity>
    );
}

const cta = StyleSheet.create({
    btn: {
        backgroundColor: C.accent,
        borderRadius: 16,
        height: 54,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginBottom: 20,
        shadowColor: C.accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
        elevation: 5,
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: 0.2,
    },
    arrow: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
});

// ─── Footer Link ──────────────────────────────────────────────────────────────
function FooterLink({ onLogin }) {
    return (
        <View style={fl.row}>
            <Text style={fl.text}>Remember your password? </Text>
            <TouchableOpacity onPress={onLogin} activeOpacity={0.7}>
                <Text style={fl.link}>Sign in</Text>
            </TouchableOpacity>
        </View>
    );
}

const fl = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    text: { fontSize: 14, color: C.textMuted },
    link: { fontSize: 14, color: C.accent, fontWeight: "700" },
});

// ─── STEP 1: Enter Email ───────────────────────────────────────────────────────
function StepEnterEmail({ onNext, onBack }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const cardAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(cardAnim, {
            toValue: 1,
            tension: 60,
            friction: 10,
            useNativeDriver: true,
        }).start();
    }, []);

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 8, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
        ]).start();
    };

    const handleSend = () => {
        if (!email.trim()) {
            setError("Email address is required.");
            shake();
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            shake();
            return;
        }
        setError("");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onNext(email);
        }, 1500);
    };

    const cardStyle = {
        opacity: cardAnim,
        transform: [
            {
                translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                }),
            },
            { translateX: shakeAnim },
        ],
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <DecoGeometry />
            <BottomDecor />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={s.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <StepHeader
                        step={1}
                        total={3}
                        title="Forgot your password?"
                        subtitle="No worries! Enter your email and we'll send you a reset code."
                        onBack={onBack}
                    />

                    <Animated.View style={[s.card, cardStyle]}>
                        {/* Icon banner */}
                        <View style={s.iconBanner}>
                            <View style={s.iconCircle}>
                                <Svg width={22} height={22} viewBox="0 0 24 24">
                                    <Path
                                        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                                        fill={C.accent}
                                    />
                                </Svg>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.iconBannerTitle}>Email Recovery</Text>
                                <Text style={s.iconBannerSub}>
                                    A 6-digit code will be sent to your inbox
                                </Text>
                            </View>
                        </View>

                        <InputField
                            label="Email Address"
                            value={email}
                            onChangeText={(v) => {
                                setEmail(v);
                                setError("");
                            }}
                            placeholder="name@example.com"
                            keyboardType="email-address"
                            error={error}
                        />

                        <CTAButton
                            label="Send Reset Code"
                            onPress={handleSend}
                            loading={loading}
                        />
                        <FooterLink onLogin={onBack} />
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// ─── STEP 2: Enter Code ────────────────────────────────────────────────────────
const CODE_LENGTH = 6;

function StepEnterCode({ email, onNext, onBack }) {
    const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
    const [timer, setTimer] = useState(45);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState("");
    const inputRefs = useRef([]);
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(cardAnim, {
            toValue: 1,
            tension: 60,
            friction: 10,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        if (timer === 0) {
            setCanResend(true);
            return;
        }
        const t = setInterval(() => setTimer((v) => v - 1), 1000);
        return () => clearInterval(t);
    }, [timer]);

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 8, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
        ]).start();
    };

    const handleChange = (val, i) => {
        const digit = val.replace(/[^0-9]/g, "").slice(-1);
        const newCode = [...code];
        newCode[i] = digit;
        setCode(newCode);
        setError("");
        if (digit && i < CODE_LENGTH - 1) inputRefs.current[i + 1]?.focus();
    };

    const handleKeyPress = (e, i) => {
        if (e.nativeEvent.key === "Backspace" && !code[i] && i > 0) {
            inputRefs.current[i - 1]?.focus();
            const newCode = [...code];
            newCode[i - 1] = "";
            setCode(newCode);
        }
    };

    const handleVerify = () => {
        const full = code.join("");
        if (full.length < CODE_LENGTH) {
            setError("Please enter the complete 6-digit code.");
            shake();
            return;
        }
        onNext(full);
    };

    const handleResend = () => {
        if (!canResend) return;
        setTimer(45);
        setCanResend(false);
        setCode(Array(CODE_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
    };

    const cardStyle = {
        opacity: cardAnim,
        transform: [
            {
                translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                }),
            },
        ],
    };

    // Mask email: show first char + *** + domain
    const maskedEmail = email
        ? email.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + "***" + c)
        : "your email";

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <DecoGeometry />
            <BottomDecor />

            <ScrollView
                contentContainerStyle={s.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <StepHeader
                    step={2}
                    total={3}
                    title="Check your inbox"
                    subtitle={`Enter the 6-digit code we sent to ${maskedEmail}`}
                    onBack={onBack}
                />

                <Animated.View style={[s.card, cardStyle]}>
                    {/* Email tag */}
                    <View style={ve.emailTag}>
                        <Svg width={14} height={14} viewBox="0 0 24 24">
                            <Path
                                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                                fill={C.accentBright}
                            />
                        </Svg>
                        <Text style={ve.emailText}>{maskedEmail}</Text>
                    </View>

                    {/* Code inputs */}
                    <Animated.View
                        style={[
                            ve.codeRow,
                            { transform: [{ translateX: shakeAnim }] },
                        ]}
                    >
                        {Array(CODE_LENGTH)
                            .fill(0)
                            .map((_, i) => (
                                <TextInput
                                    key={i}
                                    ref={(ref) => (inputRefs.current[i] = ref)}
                                    style={[
                                        ve.box,
                                        code[i] ? ve.boxFilled : null,
                                        error ? ve.boxError : null,
                                    ]}
                                    value={code[i]}
                                    onChangeText={(val) => handleChange(val, i)}
                                    onKeyPress={(e) => handleKeyPress(e, i)}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    selectTextOnFocus
                                />
                            ))}
                    </Animated.View>

                    {error ? <Text style={ve.error}>{error}</Text> : null}

                    <CTAButton label="Verify Code" onPress={handleVerify} />

                    {/* Resend */}
                    <View style={ve.resendRow}>
                        <Text style={ve.resendText}>Didn't receive it? </Text>
                        <TouchableOpacity onPress={handleResend} disabled={!canResend}>
                            <Text
                                style={[
                                    ve.resendLink,
                                    !canResend && ve.resendDisabled,
                                ]}
                            >
                                {canResend
                                    ? "Resend code"
                                    : `Resend in ${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const ve = StyleSheet.create({
    emailTag: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: C.accentSoft,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: C.accentMid,
        alignSelf: "flex-start",
    },
    emailText: { fontSize: 13, fontWeight: "600", color: C.accent },
    codeRow: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        marginBottom: 24,
    },
    box: {
        width: 46,
        height: 58,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: C.border,
        backgroundColor: C.inputBg,
        textAlign: "center",
        fontSize: 22,
        fontWeight: "800",
        color: C.textPrimary,
    },
    boxFilled: { borderColor: C.accentBright, backgroundColor: "#EBF2FF" },
    boxError: { borderColor: C.red, backgroundColor: C.redSoft },
    error: {
        color: C.red,
        fontSize: 13,
        textAlign: "center",
        marginBottom: 16,
    },
    resendRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 4,
    },
    resendText: { fontSize: 13, color: C.textMuted },
    resendLink: { fontSize: 13, color: C.accent, fontWeight: "700" },
    resendDisabled: { color: C.textMuted },
});

// ─── STEP 3: New Password ──────────────────────────────────────────────────────
function StepNewPassword({ onComplete, onBack }) {
    const [form, setForm] = useState({ password: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const cardAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(cardAnim, {
            toValue: 1,
            tension: 60,
            friction: 10,
            useNativeDriver: true,
        }).start();
    }, []);

    const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 8, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
        ]).start();
    };

    const requirements = [
        { text: "At least 8 characters", met: form.password.length >= 8 },
        {
            text: "Uppercase & lowercase letters",
            met: /[a-z]/.test(form.password) && /[A-Z]/.test(form.password),
        },
        { text: "At least one number", met: /[0-9]/.test(form.password) },
        {
            text: "One special character (@#$!)",
            met: /[^a-zA-Z0-9]/.test(form.password),
        },
    ];

    const validate = () => {
        const e = {};
        if (!form.password) e.password = "Password is required.";
        else if (form.password.length < 8)
            e.password = "Password must be at least 8 characters.";
        else if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password))
            e.password = "Include uppercase and lowercase letters.";
        else if (!/[0-9]/.test(form.password))
            e.password = "Include at least one number.";
        else if (!/[^a-zA-Z0-9]/.test(form.password))
            e.password = "Include a special character (@#$!).";

        if (!form.confirm) e.confirm = "Please confirm your password.";
        else if (form.password !== form.confirm)
            e.confirm = "Passwords do not match.";

        setErrors(e);
        if (Object.keys(e).length > 0) shake();
        return Object.keys(e).length === 0;
    };

    const handleReset = () => {
        if (!validate()) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onComplete();
        }, 1500);
    };

    const cardStyle = {
        opacity: cardAnim,
        transform: [
            {
                translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                }),
            },
            { translateX: shakeAnim },
        ],
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <DecoGeometry />
            <BottomDecor />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={s.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <StepHeader
                        step={3}
                        total={3}
                        title="Set new password"
                        subtitle="Create a strong password to secure your account."
                        onBack={onBack}
                    />

                    <Animated.View style={[s.card, cardStyle]}>
                        <InputField
                            label="New Password"
                            value={form.password}
                            onChangeText={(v) => {
                                set("password")(v);
                                setErrors((e) => ({ ...e, password: "" }));
                            }}
                            placeholder="••••••••"
                            secureTextEntry
                            showToggle
                            onToggle={() => setShowPass(!showPass)}
                            showPassword={showPass}
                            error={errors.password}
                        />
                        <PasswordStrength password={form.password} />

                        <InputField
                            label="Confirm Password"
                            value={form.confirm}
                            onChangeText={(v) => {
                                set("confirm")(v);
                                setErrors((e) => ({ ...e, confirm: "" }));
                            }}
                            placeholder="••••••••"
                            secureTextEntry
                            showToggle
                            onToggle={() => setShowConfirm(!showConfirm)}
                            showPassword={showConfirm}
                            error={errors.confirm}
                        />

                        {/* Requirements card */}
                        <View style={np.reqCard}>
                            <Text style={np.reqTitle}>PASSWORD REQUIREMENTS</Text>
                            {requirements.map((r, i) => (
                                <View key={i} style={np.reqRow}>
                                    <View
                                        style={[
                                            np.reqDot,
                                            r.met && np.reqDotMet,
                                        ]}
                                    >
                                        {r.met && (
                                            <CheckIcon color="#fff" size={8} />
                                        )}
                                    </View>
                                    <Text
                                        style={[
                                            np.reqText,
                                            r.met && np.reqTextMet,
                                        ]}
                                    >
                                        {r.text}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <CTAButton
                            label="Reset Password"
                            onPress={handleReset}
                            loading={loading}
                        />
                        <FooterLink onLogin={() => {}} />
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const np = StyleSheet.create({
    reqCard: {
        backgroundColor: C.accentSoft,
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: C.accentMid,
    },
    reqTitle: {
        fontSize: 10,
        fontWeight: "700",
        color: C.textMuted,
        letterSpacing: 0.8,
        marginBottom: 12,
    },
    reqRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
    },
    reqDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: C.border,
        backgroundColor: C.surface,
        alignItems: "center",
        justifyContent: "center",
    },
    reqDotMet: { backgroundColor: C.green, borderColor: C.green },
    reqText: { fontSize: 12, color: C.textMuted, flex: 1 },
    reqTextMet: { color: C.green, fontWeight: "600" },
});

// ─── Step 4: Success ───────────────────────────────────────────────────────────
function StepSuccess({ onLogin }) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 60,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(cardAnim, {
                toValue: 1,
                tension: 60,
                friction: 10,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <DecoGeometry />
            <BottomDecor />

            <Animated.View
                style={[
                    sc.container,
                    { opacity: fadeAnim },
                ]}
            >
                {/* Success mark */}
                <Animated.View
                    style={[
                        sc.iconOuter,
                        { transform: [{ scale: scaleAnim }] },
                    ]}
                >
                    <View style={sc.iconInner}>
                        <Svg width={36} height={36} viewBox="0 0 24 24">
                            <Path
                                d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                                fill={C.green}
                            />
                        </Svg>
                    </View>
                </Animated.View>

                <Animated.View
                    style={[
                        s.card,
                        {
                            opacity: cardAnim,
                            transform: [
                                {
                                    translateY: cardAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [24, 0],
                                    }),
                                },
                            ],
                            alignItems: "center",
                        },
                    ]}
                >
                    <Text style={sc.title}>Password Reset!</Text>
                    <Text style={sc.subtitle}>
                        Your password has been successfully updated. You can now
                        log in with your new credentials.
                    </Text>

                    <TouchableOpacity
                        style={cta.btn}
                        onPress={onLogin}
                        activeOpacity={0.88}
                    >
                        <Text style={cta.text}>Back to Login</Text>
                        <View style={cta.arrow}>
                            <Svg width={16} height={16} viewBox="0 0 24 24">
                                <Path
                                    d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
                                    fill="#fff"
                                />
                            </Svg>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

const sc = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 26,
        gap: 24,
    },
    iconOuter: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: C.greenSoft,
        borderWidth: 2,
        borderColor: C.greenBorder,
        alignItems: "center",
        justifyContent: "center",
    },
    iconInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#DCFCE7",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: C.textPrimary,
        letterSpacing: -0.5,
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: C.textSecondary,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 24,
    },
});

// ─── Root ForgotPassword Screen ────────────────────────────────────────────────
export default function ForgotPasswordScreen({ onBack }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");

    if (step === 1)
        return (
            <StepEnterEmail
                onNext={(e) => {
                    setEmail(e);
                    setStep(2);
                }}
                onBack={onBack}
            />
        );
    if (step === 2)
        return (
            <StepEnterCode
                email={email}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
            />
        );
    if (step === 3)
        return (
            <StepNewPassword
                onComplete={() => setStep(4)}
                onBack={() => setStep(2)}
            />
        );
    if (step === 4) return <StepSuccess onLogin={onBack} />;

    return null;
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    scroll: { flexGrow: 1, paddingBottom: 48 },

    card: {
        marginHorizontal: 26,
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

    // Icon banner (Step 1 only)
    iconBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        backgroundColor: C.accentSoft,
        borderRadius: 16,
        padding: 14,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: C.accentMid,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#DBEAFE",
        alignItems: "center",
        justifyContent: "center",
    },
    iconBannerTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: C.textPrimary,
        marginBottom: 2,
    },
    iconBannerSub: {
        fontSize: 12,
        color: C.textSecondary,
        lineHeight: 17,
    },
});