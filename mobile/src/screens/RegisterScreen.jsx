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
    Alert,
    Easing,
} from "react-native";
import Svg, { Circle, Path, Rect, Line, G } from "react-native-svg";

const { width } = Dimensions.get("window");

// ─── Design Tokens (identical to Family Login) ────────────────────────────────
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

// ─── Decorative Geometry (top-right, same as Login) ───────────────────────────
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

// ─── Bottom Decor (same as Login) ─────────────────────────────────────────────
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

// ─── Brand Mark (same as Login) ───────────────────────────────────────────────
function BrandMark() {
    return (
        <Svg width={44} height={44} viewBox="0 0 44 44">
            <Circle cx="22" cy="22" r="21" fill="#EBF2FF" />
            <Circle cx="22" cy="22" r="21" fill="none" stroke="#BFDBFE" strokeWidth="1" />
            <Path
                d="M14 22 C14 17 17.5 13.5 22 13.5 C26.5 13.5 30 17 30 22"
                stroke="#1A56DB"
                strokeWidth="2.2"
                fill="none"
                strokeLinecap="round"
            />
            <Path
                d="M14 22 L16 24 L19 19 L22 27 L25 20 L28 24 L30 22"
                stroke="#3B82F6"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
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

// ─── Chevron Down Icon ────────────────────────────────────────────────────────
function ChevronIcon({ up }) {
    return (
        <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path
                d={up ? "M7 14l5-5 5 5H7z" : "M7 10l5 5 5-5H7z"}
                fill={C.textMuted}
            />
        </Svg>
    );
}

// ─── Search Icon ──────────────────────────────────────────────────────────────
function SearchIcon() {
    return (
        <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
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

// ─── Input Field (identical to Login) ─────────────────────────────────────────
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

// ─── Step Progress Header ─────────────────────────────────────────────────────
// FIX: Back button is now in normal document flow (flex row) instead of
// absolute-positioned, preventing it from overlapping the progress bar.
function StepHeader({ step, total, title, subtitle, onBack }) {
    return (
        <View style={sh.container}>
            {/* Top row: back button + step counter */}
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

            {/* Progress track */}
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

            {/* Step title */}
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
    // Row that holds back button + "Step X of Y / XX%" side by side
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
        // no absolute positioning — sits naturally in the row
        flexShrink: 0,
    },
    // Takes up remaining space next to the back button
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

// ─── Primary CTA Button ───────────────────────────────────────────────────────
function CTAButton({ label, onPress, loading }) {
    return (
        <TouchableOpacity
            style={cta.btn}
            onPress={onPress}
            activeOpacity={0.88}
            disabled={loading}
        >
            <Text style={cta.text}>{label}</Text>
            <View style={cta.arrow}>
                <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Path
                        d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
                        fill="#fff"
                    />
                </Svg>
            </View>
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
            <Text style={fl.text}>Already have an account? </Text>
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

// ─── STEP 1: Personal Info ─────────────────────────────────────────────────────
function StepPersonalInfo({ onNext, onBack, onLogin }) {
    const [form, setForm] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    const [errors, setErrors] = useState({});
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(cardAnim, {
            toValue: 1,
            tension: 60,
            friction: 10,
            useNativeDriver: true,
        }).start();
    }, []);

    const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

    const validate = () => {
        const e = {};
        if (!form.firstName.trim() || form.firstName.trim().length < 2)
            e.firstName = "First name must be at least 2 characters";
        if (!form.lastName.trim() || form.lastName.trim().length < 2)
            e.lastName = "Last name must be at least 2 characters";
        if (
            !form.email.trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        )
            e.email = "Enter a valid email address";
        if (form.phone && !/^[\d\s\-\(\)\+]+$/.test(form.phone))
            e.phone = "Enter a valid phone number";
        setErrors(e);
        return Object.keys(e).length === 0;
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

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
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
                        total={4}
                        title="Tell us about yourself"
                        subtitle="We'll use this to set up your family portal account."
                        onBack={onBack}
                    />

                    <Animated.View style={[s.card, cardStyle]}>
                        <InputField
                            label="First Name"
                            value={form.firstName}
                            onChangeText={set("firstName")}
                            placeholder="John"
                            autoCapitalize="words"
                            error={errors.firstName}
                        />
                        <InputField
                            label="Middle Name"
                            value={form.middleName}
                            onChangeText={set("middleName")}
                            placeholder="Optional"
                            autoCapitalize="words"
                            optional
                        />
                        <InputField
                            label="Last Name"
                            value={form.lastName}
                            onChangeText={set("lastName")}
                            placeholder="Doe"
                            autoCapitalize="words"
                            error={errors.lastName}
                        />
                        <InputField
                            label="Email Address"
                            value={form.email}
                            onChangeText={set("email")}
                            placeholder="name@example.com"
                            keyboardType="email-address"
                            error={errors.email}
                        />
                        <InputField
                            label="Phone Number"
                            value={form.phone}
                            onChangeText={set("phone")}
                            placeholder="(555) 000-0000"
                            keyboardType="phone-pad"
                            optional
                            error={errors.phone}
                        />

                        <CTAButton
                            label="Continue"
                            onPress={() => validate() && onNext(form)}
                        />
                        <FooterLink onLogin={onLogin} />
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// ─── STEP 2: Password & Access Code ───────────────────────────────────────────
function StepPassword({ onNext, onBack, onLogin }) {
    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
        accessCode: "",
        relationship: "",
    });
    const [errors, setErrors] = useState({});
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const cardAnim = useRef(new Animated.Value(0)).current;
    const dropAnim = useRef(new Animated.Value(0)).current;

    const RELATIONSHIPS = [
        "Spouse",
        "Child",
        "Parent",
        "Sibling",
        "Grandchild",
        "Other",
    ];

    useEffect(() => {
        Animated.spring(cardAnim, {
            toValue: 1,
            tension: 60,
            friction: 10,
            useNativeDriver: true,
        }).start();
    }, []);

    const toggleDrop = () => {
        const toVal = dropOpen ? 0 : 1;
        setDropOpen(!dropOpen);
        Animated.spring(dropAnim, {
            toValue: toVal,
            tension: 80,
            friction: 12,
            useNativeDriver: true,
        }).start();
    };

    const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

    const validate = () => {
        const e = {};
        if (!form.password) e.password = "Password is required";
        else if (form.password.length < 8)
            e.password = "Password must be at least 8 characters";
        else if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password))
            e.password = "Include uppercase and lowercase letters";
        else if (!/[0-9]/.test(form.password))
            e.password = "Include at least one number";

        if (!form.confirmPassword)
            e.confirmPassword = "Please confirm your password";
        else if (form.password !== form.confirmPassword)
            e.confirmPassword = "Passwords do not match";

        if (!form.accessCode.trim()) e.accessCode = "Access code is required";
        if (!form.relationship) e.relationship = "Please select a relationship";

        setErrors(e);
        return Object.keys(e).length === 0;
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

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
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
                        step={2}
                        total={4}
                        title="Secure your account"
                        subtitle="Create a strong password and enter your facility access code."
                        onBack={onBack}
                    />

                    <Animated.View style={[s.card, cardStyle]}>
                        <InputField
                            label="Password"
                            value={form.password}
                            onChangeText={set("password")}
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
                            value={form.confirmPassword}
                            onChangeText={set("confirmPassword")}
                            placeholder="••••••••"
                            secureTextEntry
                            showToggle
                            onToggle={() => setShowConfirm(!showConfirm)}
                            showPassword={showConfirm}
                            error={errors.confirmPassword}
                        />

                        {/* Access Code */}
                        <InputField
                            label="Facility Access Code"
                            value={form.accessCode}
                            onChangeText={set("accessCode")}
                            placeholder="e.g. CS-1234"
                            autoCapitalize="characters"
                            error={errors.accessCode}
                        />
                        <View style={s.hintBox}>
                            <Svg
                                width={14}
                                height={14}
                                viewBox="0 0 24 24"
                                style={{ marginTop: 1 }}
                            >
                                <Path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                                    fill={C.accentBright}
                                />
                            </Svg>
                            <Text style={s.hintText}>
                                Provided by your CareSync facility coordinator
                            </Text>
                        </View>

                        {/* Relationship Dropdown */}
                        <View style={inp.group}>
                            <Text style={inp.label}>
                                Relationship to Resident
                            </Text>
                            <TouchableOpacity
                                style={[
                                    s.dropTrigger,
                                    dropOpen && s.dropTriggerOpen,
                                    errors.relationship && {
                                        borderColor: C.red,
                                    },
                                ]}
                                onPress={toggleDrop}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={
                                        form.relationship
                                            ? s.dropSelected
                                            : s.dropPlaceholder
                                    }
                                >
                                    {form.relationship || "Select relationship"}
                                </Text>
                                <ChevronIcon up={dropOpen} />
                            </TouchableOpacity>
                            {errors.relationship ? (
                                <Text style={inp.error}>
                                    {errors.relationship}
                                </Text>
                            ) : null}
                            {dropOpen && (
                                <View style={s.dropdown}>
                                    {RELATIONSHIPS.map((r, i) => (
                                        <TouchableOpacity
                                            key={r}
                                            style={[
                                                s.dropItem,
                                                i ===
                                                    RELATIONSHIPS.length - 1 && {
                                                    borderBottomWidth: 0,
                                                },
                                            ]}
                                            onPress={() => {
                                                set("relationship")(r);
                                                setDropOpen(false);
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <Text
                                                style={[
                                                    s.dropItemText,
                                                    form.relationship === r &&
                                                        s.dropItemActive,
                                                ]}
                                            >
                                                {r}
                                            </Text>
                                            {form.relationship === r && (
                                                <CheckIcon
                                                    color={C.accent}
                                                    size={14}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <CTAButton
                            label="Continue"
                            onPress={() => validate() && onNext(form)}
                        />
                        <FooterLink onLogin={onLogin} />
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// ─── STEP 3: Link Resident ─────────────────────────────────────────────────────
const MOCK_RESIDENTS = [
    { id: "1", name: "Eleanor Roosevelt", room: "Room 102-A" },
    { id: "2", name: "Arthur Miller", room: "Room 135" },
    { id: "3", name: "Martha Stewart", room: "Room 208-B" },
    { id: "4", name: "Roosevelt Jr.", room: "Room 110" },
    { id: "5", name: "Robert Frost", room: "Room 214" },
];

function ResidentCard({ resident, linked, onLink }) {
    const isLinked = linked?.id === resident.id;
    const initials = resident.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);

    return (
        <TouchableOpacity
            style={[rc.card, isLinked && rc.cardLinked]}
            onPress={() => onLink(resident)}
            activeOpacity={0.8}
        >
            <View style={[rc.avatar, isLinked && rc.avatarLinked]}>
                <Text style={[rc.initials, isLinked && rc.initialsLinked]}>
                    {initials}
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[rc.name, isLinked && rc.nameLinked]}>
                    {resident.name}
                </Text>
                <Text style={rc.room}>{resident.room}</Text>
            </View>
            <View style={[rc.pill, isLinked && rc.pillLinked]}>
                {isLinked ? (
                    <>
                        <CheckIcon color={C.green} size={12} />
                        <Text style={rc.pillTextLinked}>Linked</Text>
                    </>
                ) : (
                    <Text style={rc.pillText}>Link</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const rc = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: C.border,
        backgroundColor: C.inputBg,
        marginBottom: 10,
    },
    cardLinked: { borderColor: C.greenBorder, backgroundColor: C.greenSoft },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: C.accentSoft,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarLinked: { backgroundColor: "#DCFCE7" },
    initials: { fontSize: 14, fontWeight: "800", color: C.accent },
    initialsLinked: { color: C.green },
    name: {
        fontSize: 14,
        fontWeight: "700",
        color: C.textPrimary,
        marginBottom: 2,
    },
    nameLinked: { color: C.green },
    room: { fontSize: 12, color: C.textMuted },
    pill: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 30,
        backgroundColor: C.accentSoft,
        borderWidth: 1,
        borderColor: C.accentMid,
    },
    pillLinked: {
        backgroundColor: C.greenSoft,
        borderColor: C.greenBorder,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    pillText: { fontSize: 12, fontWeight: "700", color: C.accent },
    pillTextLinked: { fontSize: 12, fontWeight: "700", color: C.green },
});

function StepLinkResident({ onNext, onBack, onLogin }) {
    const [query, setQuery] = useState("");
    const [linked, setLinked] = useState(null);
    const [agreed, setAgreed] = useState(false);
    const [errors, setErrors] = useState({});
    const [searchFocused, setSearchFocused] = useState(false);
    const cardAnim = useRef(new Animated.Value(0)).current;
    const borderAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(cardAnim, {
            toValue: 1,
            tension: 60,
            friction: 10,
            useNativeDriver: true,
        }).start();
    }, []);

    const filtered = MOCK_RESIDENTS.filter((r) =>
        r.name.toLowerCase().includes(query.toLowerCase()),
    );
    const showResults = query.length > 0;

    const handleFocus = () => {
        setSearchFocused(true);
        Animated.timing(borderAnim, {
            toValue: 1,
            duration: 180,
            useNativeDriver: false,
        }).start();
    };
    const handleBlur = () => {
        setSearchFocused(false);
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

    const handleContinue = () => {
        const e = {};
        if (!linked) e.linked = "Please select a resident to link";
        if (!agreed)
            e.agreed =
                "You must agree to the Terms of Service and Privacy Policy";
        setErrors(e);
        if (Object.keys(e).length > 0) return;
        const verificationCode = String(
            Math.floor(100000 + Math.random() * 900000),
        );
        Alert.alert("Verification Code", `Demo code: ${verificationCode}`, [
            { text: "OK" },
        ]);
        onNext({ linked, verificationCode });
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

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <BottomDecor />

            <ScrollView
                contentContainerStyle={s.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <StepHeader
                    step={3}
                    total={4}
                    title="Link your loved one"
                    subtitle="Search for your resident by name to connect your account."
                    onBack={onBack}
                />

                <Animated.View style={[s.card, cardStyle]}>
                    {/* Search input */}
                    <View style={inp.group}>
                        <Text style={inp.label}>Search Residents</Text>
                        <Animated.View
                            style={[
                                inp.wrapper,
                                { borderColor, backgroundColor: bgColor },
                            ]}
                        >
                            <SearchIcon />
                            <TextInput
                                style={[inp.input, { marginLeft: 10 }]}
                                value={query}
                                onChangeText={setQuery}
                                placeholder="Type a name, e.g. Roosevelt"
                                placeholderTextColor={C.textMuted}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                autoCapitalize="words"
                            />
                            {query.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => setQuery("")}
                                    activeOpacity={0.7}
                                >
                                    <Svg width={16} height={16} viewBox="0 0 24 24">
                                        <Path
                                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                                            fill={C.textMuted}
                                        />
                                    </Svg>
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    </View>

                    {/* Results */}
                    {showResults && (
                        <View style={s.resultsWrap}>
                            <View style={s.resultsHeader}>
                                <Text style={s.resultsLabel}>Results</Text>
                                <View style={s.resultsBadge}>
                                    <Text style={s.resultsBadgeText}>
                                        {filtered.length} found
                                    </Text>
                                </View>
                            </View>
                            {filtered.length > 0 ? (
                                filtered.map((r) => (
                                    <ResidentCard
                                        key={r.id}
                                        resident={r}
                                        linked={linked}
                                        onLink={(res) => {
                                            setLinked(res);
                                            setErrors((e) => ({
                                                ...e,
                                                linked: null,
                                            }));
                                        }}
                                    />
                                ))
                            ) : (
                                <View style={s.noResults}>
                                    <Text style={s.noResultsText}>
                                        No residents found for "{query}"
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    {errors.linked ? (
                        <Text style={[inp.error, { marginBottom: 12 }]}>
                            {errors.linked}
                        </Text>
                    ) : null}

                    <View style={s.divider}>
                        <View style={s.dividerLine} />
                        <Text style={s.dividerLabel}>Terms & Privacy</Text>
                        <View style={s.dividerLine} />
                    </View>

                    {/* Checkbox */}
                    <TouchableOpacity
                        style={s.checkRow}
                        onPress={() => setAgreed(!agreed)}
                        activeOpacity={0.8}
                    >
                        <View style={[s.checkbox, agreed && s.checkboxChecked]}>
                            {agreed && <CheckIcon color="#fff" size={10} />}
                        </View>
                        <Text style={s.checkLabel}>
                            I agree to the{" "}
                            <Text style={s.checkLink}>Terms of Service</Text>{" "}
                            and <Text style={s.checkLink}>Privacy Policy</Text>.
                        </Text>
                    </TouchableOpacity>
                    {errors.agreed ? (
                        <Text style={[inp.error, { marginBottom: 12 }]}>
                            {errors.agreed}
                        </Text>
                    ) : null}

                    <CTAButton
                        label="Send Verification Code"
                        onPress={handleContinue}
                    />
                    <FooterLink onLogin={onLogin} />
                </Animated.View>
            </ScrollView>
        </View>
    );
}

// ─── STEP 4: Verify Email ──────────────────────────────────────────────────────
const CODE_LENGTH = 6;

function StepVerifyEmail({
    onVerified,
    onBack,
    email = "n***@example.com",
    expectedCode,
}) {
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
        if (expectedCode && full !== expectedCode) {
            setError("Incorrect code. Please try again.");
            shake();
            return;
        }
        onVerified(full);
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

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <BottomDecor />

            <ScrollView
                contentContainerStyle={s.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <StepHeader
                    step={4}
                    total={4}
                    title="Verify your email"
                    subtitle={`Enter the 6-digit code sent to ${email}`}
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
                        <Text style={ve.emailText}>{email}</Text>
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

                    <CTAButton
                        label="Verify & Complete"
                        onPress={handleVerify}
                    />

                    {/* Resend */}
                    <View style={ve.resendRow}>
                        <Text style={ve.resendText}>Didn't receive it? </Text>
                        <TouchableOpacity
                            onPress={handleResend}
                            disabled={!canResend}
                        >
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

// ─── Root Register Screen ──────────────────────────────────────────────────────
export default function RegisterScreen({ onComplete, onLogin }) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({});

    const handleNext = (stepData) => {
        setData((d) => ({ ...d, ...stepData }));
        setStep((s) => s + 1);
    };

    const handleBack = () => {
        if (step === 1) onLogin();
        else setStep((s) => s - 1);
    };

    if (step === 1)
        return (
            <StepPersonalInfo
                onNext={handleNext}
                onBack={handleBack}
                onLogin={onLogin}
            />
        );
    if (step === 2)
        return (
            <StepPassword
                onNext={handleNext}
                onBack={handleBack}
                onLogin={onLogin}
            />
        );
    if (step === 3)
        return (
            <StepLinkResident
                onNext={handleNext}
                onBack={handleBack}
                onLogin={onLogin}
            />
        );
    if (step === 4)
        return (
            <StepVerifyEmail
                onVerified={(code) => onComplete({ ...data, code })}
                onBack={handleBack}
                email={data.email}
                expectedCode={data.verificationCode}
            />
        );

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

    divider: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginVertical: 20,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: C.divider },
    dividerLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: C.textMuted,
        letterSpacing: 0.3,
    },

    hintBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        backgroundColor: C.accentSoft,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: -8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: C.accentMid,
    },
    hintText: { fontSize: 12, color: C.textSecondary, flex: 1, lineHeight: 18 },

    // Dropdown
    dropTrigger: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 52,
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: 16,
        borderColor: C.border,
        backgroundColor: C.inputBg,
    },
    dropTriggerOpen: { borderColor: C.borderFocus, backgroundColor: "#F0F6FF" },
    dropSelected: { fontSize: 15, color: C.textPrimary, fontWeight: "500" },
    dropPlaceholder: { fontSize: 15, color: C.textMuted },
    dropdown: {
        marginTop: 6,
        borderWidth: 1.5,
        borderColor: C.border,
        borderRadius: 14,
        backgroundColor: C.surface,
        overflow: "hidden",
        shadowColor: "#1A3C6E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    dropItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: C.divider,
    },
    dropItemText: { fontSize: 15, color: C.textPrimary },
    dropItemActive: { color: C.accent, fontWeight: "700" },

    // Residents
    resultsWrap: { marginBottom: 8 },
    resultsHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    resultsLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: C.textMuted,
        letterSpacing: 0.8,
        textTransform: "uppercase",
    },
    resultsBadge: {
        backgroundColor: C.accentSoft,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: C.accentMid,
    },
    resultsBadgeText: { fontSize: 11, fontWeight: "700", color: C.accent },
    noResults: { paddingVertical: 20, alignItems: "center" },
    noResultsText: { fontSize: 13, color: C.textMuted },

    // Checkbox
    checkRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 20,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: C.border,
        backgroundColor: C.inputBg,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 1,
    },
    checkboxChecked: { backgroundColor: C.accent, borderColor: C.accent },
    checkLabel: {
        flex: 1,
        fontSize: 13,
        color: C.textSecondary,
        lineHeight: 20,
    },
    checkLink: { color: C.accent, fontWeight: "700" },
});