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
    Switch,
} from "react-native";
import Svg, { Circle, Path, Rect, Line, G } from "react-native-svg";

const { width } = Dimensions.get("window");

// ─── Design Tokens (identical to Family Register) ─────────────────────────────
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

// ─── Decorative Geometry ──────────────────────────────────────────────────────
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

// ─── Bottom Decor ─────────────────────────────────────────────────────────────
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

// ─── Chevron Icon ─────────────────────────────────────────────────────────────
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
    optional,
    error,
}) {
    const [focused, setFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setFocused(true);
        Animated.timing(borderAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
    };
    const handleBlur = () => {
        setFocused(false);
        Animated.timing(borderAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    };

    const borderColor = error
        ? C.red
        : borderAnim.interpolate({ inputRange: [0, 1], outputRange: [C.border, C.borderFocus] });
    const bgColor = borderAnim.interpolate({ inputRange: [0, 1], outputRange: [C.inputBg, "#F0F6FF"] });

    return (
        <View style={inp.group}>
            <View style={inp.labelRow}>
                <Text style={inp.label}>{label}</Text>
                {optional && <Text style={inp.optional}>Optional</Text>}
            </View>
            <Animated.View style={[inp.wrapper, { borderColor, backgroundColor: bgColor }]}>
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
                    <TouchableOpacity onPress={onToggle} style={inp.eyeBtn} activeOpacity={0.7}>
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
    labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    label: { fontSize: 12, fontWeight: "700", color: C.textSecondary, letterSpacing: 0.8, textTransform: "uppercase" },
    optional: { fontSize: 11, fontWeight: "500", color: C.textMuted, letterSpacing: 0.3 },
    wrapper: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 16, height: 52 },
    input: { flex: 1, fontSize: 15, color: C.textPrimary, fontWeight: "500", paddingVertical: 0 },
    eyeBtn: { padding: 4, marginLeft: 8 },
    error: { fontSize: 12, color: C.red, marginTop: 6, marginLeft: 2 },
});

// ─── Password Strength ────────────────────────────────────────────────────────
function PasswordStrength({ password }) {
    const getStrength = () => {
        if (!password || password.length < 1) return { level: 0, label: "", color: C.border };
        if (password.length < 6) return { level: 1, label: "Weak", color: "#EF4444" };
        if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password))
            return { level: 2, label: "Fair", color: "#F59E0B" };
        return { level: 3, label: "Strong", color: C.green };
    };
    const { level, label, color } = getStrength();
    if (!password) return null;
    return (
        <View style={ps.wrap}>
            <View style={ps.bars}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={[ps.bar, { backgroundColor: i <= level ? color : C.border }]} />
                ))}
            </View>
            <Text style={[ps.label, { color }]}>{label}</Text>
        </View>
    );
}

const ps = StyleSheet.create({
    wrap: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: -8, marginBottom: 12 },
    bars: { flexDirection: "row", gap: 4, flex: 1 },
    bar: { flex: 1, height: 3, borderRadius: 2 },
    label: { fontSize: 11, fontWeight: "600", minWidth: 40 },
});

// ─── Step Header ──────────────────────────────────────────────────────────────
function StepHeader({ step, total, title, subtitle, onBack }) {
    return (
        <View style={sh.container}>
            <View style={sh.topRow}>
                <TouchableOpacity style={sh.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Svg width={20} height={20} viewBox="0 0 24 24">
                        <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill={C.accent} />
                    </Svg>
                </TouchableOpacity>
                <View style={sh.stepMeta}>
                    <Text style={sh.progressStep}>Step {step} of {total}</Text>
                    <Text style={sh.progressPct}>{Math.round((step / total) * 100)}%</Text>
                </View>
            </View>
            <View style={sh.track}>
                {Array.from({ length: total }).map((_, i) => (
                    <View key={i} style={[sh.seg, i < step ? sh.segActive : sh.segInactive]} />
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
    container: { paddingTop: Platform.OS === "ios" ? 58 : 46, paddingHorizontal: 26, marginBottom: 8 },
    topRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 },
    backBtn: {
        width: 38, height: 38, borderRadius: 12,
        backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.accentMid,
        alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    stepMeta: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    progressStep: { fontSize: 12, fontWeight: "600", color: C.textMuted, letterSpacing: 0.3 },
    progressPct: { fontSize: 12, fontWeight: "700", color: C.accent },
    track: { flexDirection: "row", gap: 5, marginBottom: 24 },
    seg: { flex: 1, height: 4, borderRadius: 2 },
    segActive: { backgroundColor: C.accent },
    segInactive: { backgroundColor: C.border },
    titleBlock: { marginBottom: 24 },
    title: { fontSize: 28, fontWeight: "800", color: C.textPrimary, letterSpacing: -0.6, lineHeight: 34, marginBottom: 6 },
    subtitle: { fontSize: 14, color: C.textSecondary, lineHeight: 21 },
});

// ─── CTA Button ───────────────────────────────────────────────────────────────
function CTAButton({ label, onPress, loading }) {
    return (
        <TouchableOpacity style={cta.btn} onPress={onPress} activeOpacity={0.88} disabled={loading}>
            <Text style={cta.text}>{label}</Text>
            <View style={cta.arrow}>
                <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="#fff" />
                </Svg>
            </View>
        </TouchableOpacity>
    );
}

const cta = StyleSheet.create({
    btn: {
        backgroundColor: C.accent, borderRadius: 16, height: 54,
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
        marginBottom: 20,
        shadowColor: C.accent, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 16, elevation: 5,
    },
    text: { color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 0.2 },
    arrow: { width: 26, height: 26, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
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
    row: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
    text: { fontSize: 14, color: C.textMuted },
    link: { fontSize: 14, color: C.accent, fontWeight: "700" },
});

// ─── Dropdown Field ───────────────────────────────────────────────────────────
function DropdownField({ label, value, onChange, options, placeholder, error }) {
    const [open, setOpen] = useState(false);
    return (
        <View style={inp.group}>
            {label ? (
                <View style={inp.labelRow}>
                    <Text style={inp.label}>{label}</Text>
                </View>
            ) : null}
            <TouchableOpacity
                style={[s.dropTrigger, open && s.dropTriggerOpen, error && { borderColor: C.red }]}
                onPress={() => setOpen(!open)}
                activeOpacity={0.8}
            >
                <Text style={value ? s.dropSelected : s.dropPlaceholder}>
                    {value || placeholder || "Select..."}
                </Text>
                <ChevronIcon up={open} />
            </TouchableOpacity>
            {error ? <Text style={inp.error}>{error}</Text> : null}
            {open && (
                <View style={s.dropdown}>
                    {options.map((o, i) => (
                        <TouchableOpacity
                            key={o}
                            style={[s.dropItem, i === options.length - 1 && { borderBottomWidth: 0 }]}
                            onPress={() => { onChange(o); setOpen(false); }}
                            activeOpacity={0.7}
                        >
                            <Text style={[s.dropItemText, value === o && s.dropItemActive]}>{o}</Text>
                            {value === o && <CheckIcon color={C.accent} size={14} />}
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

// ─── Hint Box ─────────────────────────────────────────────────────────────────
function HintBox({ text }) {
    return (
        <View style={s.hintBox}>
            <Svg width={14} height={14} viewBox="0 0 24 24" style={{ marginTop: 1 }}>
                <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill={C.accentBright} />
            </Svg>
            <Text style={s.hintText}>{text}</Text>
        </View>
    );
}

// ─── STEP 1: Professional Details ─────────────────────────────────────────────
function StepProfessionalDetails({ onNext, onBack, onLogin }) {
    const [form, setForm] = useState({ fullName: "", employeeId: "", wing: "", email: "" });
    const [errors, setErrors] = useState({});
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(cardAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }).start();
    }, []);

    const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

    const validate = () => {
        const e = {};
        if (!form.fullName.trim() || form.fullName.trim().length < 3)
            e.fullName = "Full name must be at least 3 characters";
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            e.email = "Enter a valid email address";
        if (!form.employeeId.trim() || form.employeeId.trim().length < 3)
            e.employeeId = "Employee ID must be at least 3 characters";
        if (!form.wing) e.wing = "Please select your wing assignment";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const cardStyle = {
        opacity: cardAnim,
        transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <DecoGeometry />
            <BottomDecor />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <StepHeader
                        step={1} total={5}
                        title="Staff credentials"
                        subtitle="Enter your official employment details to create your caregiver profile."
                        onBack={onBack}
                    />
                    <Animated.View style={[s.card, cardStyle]}>
                        <InputField label="Full Name" value={form.fullName} onChangeText={set("fullName")} placeholder="e.g. Sarah Jenkins" autoCapitalize="words" error={errors.fullName} />
                        <InputField label="Employee ID" value={form.employeeId} onChangeText={set("employeeId")} placeholder="e.g. EMP-2048" autoCapitalize="characters" error={errors.employeeId} />
                        <InputField label="Work Email" value={form.email} onChangeText={set("email")} placeholder="you@caresync.com" keyboardType="email-address" error={errors.email} />
                        <DropdownField
                            label="Wing Assignment"
                            value={form.wing}
                            onChange={set("wing")}
                            options={["Wing A", "Wing B", "Wing C", "Wing D", "All Wings"]}
                            placeholder="Select your assigned wing"
                            error={errors.wing}
                        />
                        <HintBox text="Your credentials will be verified by the facility administrator within 24 hours." />
                        <CTAButton label="Continue" onPress={() => validate() && onNext(form)} />
                        <FooterLink onLogin={onLogin} />
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// ─── STEP 2: Create Password ───────────────────────────────────────────────────
function StepCreatePassword({ onNext, onBack, onLogin }) {
    const [form, setForm] = useState({ password: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(cardAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }).start();
    }, []);

    const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

    const requirements = [
        { text: "At least 8 characters", met: form.password.length >= 8 },
        { text: "Uppercase & lowercase letters", met: /[a-z]/.test(form.password) && /[A-Z]/.test(form.password) },
        { text: "At least one number", met: /[0-9]/.test(form.password) },
        { text: "One special character (@#$!)", met: /[^a-zA-Z0-9]/.test(form.password) },
    ];

    const validate = () => {
        const e = {};
        if (!form.password) e.password = "Password is required";
        else if (!requirements.every((r) => r.met)) e.password = "Password does not meet all requirements";
        if (!form.confirm) e.confirm = "Please confirm your password";
        else if (form.password !== form.confirm) e.confirm = "Passwords do not match";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const cardStyle = {
        opacity: cardAnim,
        transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <DecoGeometry />
            <BottomDecor />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <StepHeader
                        step={2} total={5}
                        title="Secure your account"
                        subtitle="Create a strong password to protect sensitive resident data."
                        onBack={onBack}
                    />
                    <Animated.View style={[s.card, cardStyle]}>
                        <InputField
                            label="Password" value={form.password} onChangeText={set("password")}
                            placeholder="••••••••" secureTextEntry showToggle
                            onToggle={() => setShowPass(!showPass)} showPassword={showPass} error={errors.password}
                        />
                        <PasswordStrength password={form.password} />
                        <InputField
                            label="Confirm Password" value={form.confirm} onChangeText={set("confirm")}
                            placeholder="••••••••" secureTextEntry showToggle
                            onToggle={() => setShowConfirm(!showConfirm)} showPassword={showConfirm} error={errors.confirm}
                        />

                        {/* Requirements */}
                        <View style={s.requirementsCard}>
                            <Text style={s.requirementsTitle}>Security Requirements</Text>
                            {requirements.map((r, i) => (
                                <View key={i} style={s.requirementRow}>
                                    <View style={[s.reqDot, r.met && s.reqDotMet]}>
                                        {r.met && <CheckIcon color="#fff" size={9} />}
                                    </View>
                                    <Text style={[s.reqText, r.met && s.reqTextMet]}>{r.text}</Text>
                                </View>
                            ))}
                        </View>

                        <CTAButton label="Continue" onPress={() => validate() && onNext(form)} />
                        <FooterLink onLogin={onLogin} />
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// ─── STEP 3: Shift & Escalation ───────────────────────────────────────────────
const SHIFTS = [
    { id: "day", label: "Day Shift", time: "6:00 AM – 2:00 PM", icon: "☀️" },
    { id: "evening", label: "Evening Shift", time: "2:00 PM – 10:00 PM", icon: "🌇" },
    { id: "night", label: "Night Shift", time: "10:00 PM – 6:00 AM", icon: "🌙" },
];

const ESCALATION_OPTIONS = [
    "If unacknowledged for 5 mins",
    "If unacknowledged for 10 mins",
    "If unacknowledged for 15 mins",
];

function StepShiftEscalation({ onNext, onBack, onLogin }) {
    const [shift, setShift] = useState("day");
    const [onCall, setOnCall] = useState(false);
    const [escalation, setEscalation] = useState(ESCALATION_OPTIONS[0]);
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(cardAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }).start();
    }, []);

    const cardStyle = {
        opacity: cardAnim,
        transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <DecoGeometry />
            <BottomDecor />
            <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <StepHeader
                    step={3} total={5}
                    title="Shift & escalation"
                    subtitle="Configure your availability and alert response protocols."
                    onBack={onBack}
                />
                <Animated.View style={[s.card, cardStyle]}>
                    {/* Shift selector */}
                    <Text style={s.sectionLabel}>Primary Shift</Text>
                    {SHIFTS.map((sh) => (
                        <TouchableOpacity
                            key={sh.id}
                            style={[s.shiftCard, shift === sh.id && s.shiftCardSelected]}
                            onPress={() => setShift(sh.id)}
                            activeOpacity={0.8}
                        >
                            <View style={[s.shiftIconWrap, shift === sh.id && s.shiftIconWrapSelected]}>
                                <Text style={{ fontSize: 18 }}>{sh.icon}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[s.shiftLabel, shift === sh.id && { color: C.accent }]}>{sh.label}</Text>
                                <Text style={s.shiftTime}>{sh.time}</Text>
                            </View>
                            <View style={[s.radio, shift === sh.id && s.radioSelected]}>
                                {shift === sh.id && <View style={s.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    ))}

                    {/* On-Call Toggle */}
                    <View style={s.divider}>
                        <View style={s.dividerLine} />
                        <Text style={s.dividerLabel}>Availability</Text>
                        <View style={s.dividerLine} />
                    </View>

                    <View style={s.onCallRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={s.onCallLabel}>On-Call Availability</Text>
                            <Text style={s.onCallDesc}>Be available for emergency assignments outside shift</Text>
                        </View>
                        <Switch
                            value={onCall}
                            onValueChange={setOnCall}
                            trackColor={{ false: C.border, true: C.accentMid }}
                            thumbColor={onCall ? C.accent : "#fff"}
                        />
                    </View>

                    {/* Escalation */}
                    <View style={s.divider}>
                        <View style={s.dividerLine} />
                        <Text style={s.dividerLabel}>Escalation Rules</Text>
                        <View style={s.dividerLine} />
                    </View>

                    <DropdownField
                        label="Trigger Condition"
                        value={escalation}
                        onChange={setEscalation}
                        options={ESCALATION_OPTIONS}
                        placeholder="Select escalation rule"
                    />
                    <HintBox text="Alerts will be escalated to your supervisor if unacknowledged within the selected timeframe." />

                    <CTAButton label="Continue" onPress={() => onNext({ shift, onCall, escalation })} />
                    <FooterLink onLogin={onLogin} />
                </Animated.View>
            </ScrollView>
        </View>
    );
}

// ─── STEP 4: Verify Credentials (ID Upload) ───────────────────────────────────
function StepVerifyCredentials({ onNext, onBack, onLogin }) {
    const [uploaded, setUploaded] = useState(false);
    const [error, setError] = useState("");
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(cardAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }).start();
    }, []);

    const handleContinue = () => {
        if (!uploaded) { setError("Please upload your Staff ID or professional licence to continue."); return; }
        setError("");
        onNext({ documentUploaded: true });
    };

    const cardStyle = {
        opacity: cardAnim,
        transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <DecoGeometry />
            <BottomDecor />
            <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <StepHeader
                    step={4} total={5}
                    title="Verify credentials"
                    subtitle="Upload a photo of your Staff ID or professional licence to confirm your identity."
                    onBack={onBack}
                />
                <Animated.View style={[s.card, cardStyle]}>
                    {/* Upload zone */}
                    <View style={[s.uploadZone, uploaded && s.uploadZoneSuccess]}>
                        {uploaded ? (
                            <View style={s.uploadSuccessContent}>
                                <View style={s.uploadSuccessIcon}>
                                    <CheckIcon color={C.green} size={28} />
                                </View>
                                <Text style={s.uploadSuccessTitle}>Document uploaded</Text>
                                <Text style={s.uploadSuccessSubtitle}>Your ID has been attached successfully</Text>
                            </View>
                        ) : (
                            <View style={s.uploadEmptyContent}>
                                <View style={s.uploadEmptyIcon}>
                                    <Svg width={32} height={32} viewBox="0 0 24 24">
                                        <Path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-3-7H9v-2h6v2zm0 4H9v-2h6v2z" fill={C.accentMid} />
                                    </Svg>
                                </View>
                                <Text style={s.uploadEmptyTitle}>No document selected</Text>
                                <Text style={s.uploadEmptySubtitle}>Tap a button below to upload</Text>
                            </View>
                        )}
                    </View>

                    {error ? <Text style={[inp.error, { marginBottom: 12 }]}>{error}</Text> : null}

                    {/* Upload buttons */}
                    <View style={s.uploadBtns}>
                        <TouchableOpacity style={s.uploadBtn} onPress={() => { setUploaded(true); setError(""); }} activeOpacity={0.8}>
                            <Svg width={20} height={20} viewBox="0 0 24 24">
                                <Path d="M12 15.2l-4.8-4.8h3V4h3.6v6.4h3L12 15.2zM4 17.6h16V20H4v-2.4z" fill={C.accent} />
                            </Svg>
                            <Text style={s.uploadBtnText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={s.uploadBtn} onPress={() => { setUploaded(true); setError(""); }} activeOpacity={0.8}>
                            <Svg width={20} height={20} viewBox="0 0 24 24">
                                <Path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill={C.accent} />
                            </Svg>
                            <Text style={s.uploadBtnText}>From Gallery</Text>
                        </TouchableOpacity>
                    </View>

                    <HintBox text="Accepted formats: JPG, PNG, PDF. Ensure your ID number and photo are clearly visible." />

                    <CTAButton label={uploaded ? "Continue" : "Upload to Continue"} onPress={handleContinue} />
                    <FooterLink onLogin={onLogin} />
                </Animated.View>
            </ScrollView>
        </View>
    );
}

// ─── STEP 5: Email Verification ───────────────────────────────────────────────
const CODE_LENGTH = 6;

function StepEmailVerification({ onVerified, onBack, email = "s***@caresync.com", expectedCode, onResend }) {
    const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
    const [timer, setTimer] = useState(45);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState("");
    const inputRefs = useRef([]);
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(cardAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }).start();
    }, []);

    useEffect(() => {
        if (timer === 0) { setCanResend(true); return; }
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
        if (full.length < CODE_LENGTH) { setError("Please enter the complete 6-digit code."); shake(); return; }
        if (expectedCode && full !== expectedCode) { setError("Incorrect code. Please try again."); shake(); return; }
        onVerified(full);
    };

    const handleResend = () => {
        if (!canResend) return;
        const newCode = String(Math.floor(100000 + Math.random() * 900000));
        setTimer(45);
        setCanResend(false);
        setCode(Array(CODE_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        setError("");
        if (typeof onResend === "function") onResend(newCode);
        Alert.alert("Verification Code", `New code: ${newCode}`, [{ text: "OK" }]);
    };

    const cardStyle = {
        opacity: cardAnim,
        transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <DecoGeometry />
            <BottomDecor />
            <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <StepHeader
                    step={5} total={5}
                    title="Verify your email"
                    subtitle={`Enter the 6-digit code sent to ${email}`}
                    onBack={onBack}
                />
                <Animated.View style={[s.card, cardStyle]}>
                    {/* Email tag */}
                    <View style={ve.emailTag}>
                        <Svg width={14} height={14} viewBox="0 0 24 24">
                            <Path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={C.accentBright} />
                        </Svg>
                        <Text style={ve.emailText}>{email}</Text>
                    </View>

                    {/* Code inputs */}
                    <Animated.View style={[ve.codeRow, { transform: [{ translateX: shakeAnim }] }]}>
                        {Array(CODE_LENGTH).fill(0).map((_, i) => (
                            <TextInput
                                key={i}
                                ref={(ref) => (inputRefs.current[i] = ref)}
                                style={[ve.box, code[i] ? ve.boxFilled : null, error ? ve.boxError : null]}
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

                    <CTAButton label="Verify & Complete" onPress={handleVerify} />

                    <View style={ve.resendRow}>
                        <Text style={ve.resendText}>Didn't receive it? </Text>
                        <TouchableOpacity onPress={handleResend} disabled={!canResend}>
                            <Text style={[ve.resendLink, !canResend && ve.resendDisabled]}>
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
        flexDirection: "row", alignItems: "center", gap: 8,
        backgroundColor: C.accentSoft, borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 10, marginBottom: 28,
        borderWidth: 1, borderColor: C.accentMid, alignSelf: "flex-start",
    },
    emailText: { fontSize: 13, fontWeight: "600", color: C.accent },
    codeRow: { flexDirection: "row", gap: 10, justifyContent: "center", marginBottom: 24 },
    box: {
        width: 46, height: 58, borderRadius: 14, borderWidth: 1.5,
        borderColor: C.border, backgroundColor: C.inputBg,
        textAlign: "center", fontSize: 22, fontWeight: "800", color: C.textPrimary,
    },
    boxFilled: { borderColor: C.accentBright, backgroundColor: "#EBF2FF" },
    boxError: { borderColor: C.red, backgroundColor: C.redSoft },
    error: { color: C.red, fontSize: 13, textAlign: "center", marginBottom: 16 },
    resendRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 4 },
    resendText: { fontSize: 13, color: C.textMuted },
    resendLink: { fontSize: 13, color: C.accent, fontWeight: "700" },
    resendDisabled: { color: C.textMuted },
});

// ─── Root Staff Register Screen ────────────────────────────────────────────────
export default function StaffRegisterScreen({ onComplete, onLogin, onBack }) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({});

    const handleNext = (stepData) => {
        const merged = { ...data, ...stepData };

        // On step 4 (credential upload), generate verification code before moving to verify step
        if (step === 4) {
            const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
            Alert.alert("Verification Code", `Demo code: ${verificationCode}`, [{ text: "OK" }]);
            setData({ ...merged, verificationCode });
            setStep((s) => s + 1);
            return;
        }

        setData(merged);
        setStep((s) => s + 1);
    };

    const handleBack = () => {
        if (step === 1) onBack ? onBack() : onLogin();
        else setStep((s) => s - 1);
    };

    if (step === 1) return <StepProfessionalDetails onNext={handleNext} onBack={handleBack} onLogin={onLogin} />;
    if (step === 2) return <StepCreatePassword onNext={handleNext} onBack={handleBack} onLogin={onLogin} />;
    if (step === 3) return <StepShiftEscalation onNext={handleNext} onBack={handleBack} onLogin={onLogin} />;
    if (step === 4) return <StepVerifyCredentials onNext={handleNext} onBack={handleBack} onLogin={onLogin} />;
    if (step === 5) return (
        <StepEmailVerification
            onVerified={(code) => onComplete({ ...data, code })}
            onBack={handleBack}
            email={data.email}
            expectedCode={data.verificationCode}
            onResend={(newCode) => setData((d) => ({ ...d, verificationCode: newCode }))}
        />
    );

    return null;
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    scroll: { flexGrow: 1, paddingBottom: 48 },
    card: {
        marginHorizontal: 26, backgroundColor: C.surface, borderRadius: 28,
        padding: 24, borderWidth: 1, borderColor: C.border,
        shadowColor: "#1A3C6E", shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.07, shadowRadius: 24, elevation: 4, marginBottom: 20,
    },

    // Section label
    sectionLabel: {
        fontSize: 12, fontWeight: "700", color: C.textSecondary,
        letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12,
    },

    // Divider
    divider: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: C.divider },
    dividerLabel: { fontSize: 11, fontWeight: "600", color: C.textMuted, letterSpacing: 0.3 },

    // Hint box
    hintBox: {
        flexDirection: "row", alignItems: "flex-start", gap: 8,
        backgroundColor: C.accentSoft, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10,
        marginTop: -4, marginBottom: 16,
        borderWidth: 1, borderColor: C.accentMid,
    },
    hintText: { fontSize: 12, color: C.textSecondary, flex: 1, lineHeight: 18 },

    // Dropdown
    dropTrigger: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        height: 52, borderWidth: 1.5, borderRadius: 14,
        paddingHorizontal: 16, borderColor: C.border, backgroundColor: C.inputBg,
    },
    dropTriggerOpen: { borderColor: C.borderFocus, backgroundColor: "#F0F6FF" },
    dropSelected: { fontSize: 15, color: C.textPrimary, fontWeight: "500" },
    dropPlaceholder: { fontSize: 15, color: C.textMuted },
    dropdown: {
        marginTop: 6, borderWidth: 1.5, borderColor: C.border, borderRadius: 14,
        backgroundColor: C.surface, overflow: "hidden",
        shadowColor: "#1A3C6E", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
    },
    dropItem: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 16, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: C.divider,
    },
    dropItemText: { fontSize: 15, color: C.textPrimary },
    dropItemActive: { color: C.accent, fontWeight: "700" },

    // Shift cards
    shiftCard: {
        flexDirection: "row", alignItems: "center", gap: 14,
        padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: C.border,
        backgroundColor: C.inputBg, marginBottom: 10,
    },
    shiftCardSelected: { borderColor: C.accentBright, backgroundColor: C.accentSoft },
    shiftIconWrap: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: C.surface, alignItems: "center", justifyContent: "center",
        borderWidth: 1, borderColor: C.border,
    },
    shiftIconWrapSelected: { backgroundColor: "#DBEAFE", borderColor: C.accentMid },
    shiftLabel: { fontSize: 14, fontWeight: "700", color: C.textPrimary, marginBottom: 2 },
    shiftTime: { fontSize: 12, color: C.textMuted },
    radio: {
        width: 20, height: 20, borderRadius: 10,
        borderWidth: 2, borderColor: C.border,
        alignItems: "center", justifyContent: "center",
    },
    radioSelected: { borderColor: C.accent },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.accent },

    // On-call row
    onCallRow: {
        flexDirection: "row", alignItems: "center",
        padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: C.border,
        backgroundColor: C.inputBg, marginBottom: 0,
    },
    onCallLabel: { fontSize: 14, fontWeight: "700", color: C.textPrimary, marginBottom: 2 },
    onCallDesc: { fontSize: 12, color: C.textMuted },

    // Password requirements
    requirementsCard: {
        backgroundColor: C.accentSoft, borderRadius: 14,
        padding: 16, marginBottom: 20,
        borderWidth: 1, borderColor: C.accentMid,
    },
    requirementsTitle: {
        fontSize: 12, fontWeight: "700", color: C.textSecondary,
        letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12,
    },
    requirementRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
    reqDot: {
        width: 18, height: 18, borderRadius: 9,
        borderWidth: 1.5, borderColor: C.border, backgroundColor: C.surface,
        alignItems: "center", justifyContent: "center",
    },
    reqDotMet: { backgroundColor: C.green, borderColor: C.green },
    reqText: { fontSize: 13, color: C.textMuted },
    reqTextMet: { color: C.green, fontWeight: "600" },

    // Upload zone
    uploadZone: {
        borderRadius: 20, borderWidth: 2, borderStyle: "dashed",
        borderColor: C.border, backgroundColor: C.inputBg,
        padding: 32, alignItems: "center", marginBottom: 12, minHeight: 160,
        justifyContent: "center",
    },
    uploadZoneSuccess: { borderColor: C.greenBorder, backgroundColor: C.greenSoft, borderStyle: "solid" },
    uploadEmptyContent: { alignItems: "center" },
    uploadEmptyIcon: {
        width: 60, height: 60, borderRadius: 30,
        backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center", marginBottom: 12,
    },
    uploadEmptyTitle: { fontSize: 15, fontWeight: "700", color: C.textSecondary, marginBottom: 4 },
    uploadEmptySubtitle: { fontSize: 13, color: C.textMuted },
    uploadSuccessContent: { alignItems: "center" },
    uploadSuccessIcon: {
        width: 60, height: 60, borderRadius: 30,
        backgroundColor: C.greenSoft, alignItems: "center", justifyContent: "center",
        marginBottom: 12, borderWidth: 2, borderColor: C.greenBorder,
    },
    uploadSuccessTitle: { fontSize: 15, fontWeight: "700", color: C.green, marginBottom: 4 },
    uploadSuccessSubtitle: { fontSize: 13, color: C.textSecondary },

    uploadBtns: { flexDirection: "row", gap: 12, marginBottom: 16, marginTop: 4 },
    uploadBtn: {
        flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: 8, height: 48, borderRadius: 14,
        borderWidth: 1.5, borderColor: C.accentMid, backgroundColor: C.accentSoft,
    },
    uploadBtnText: { fontSize: 14, fontWeight: "700", color: C.accent },
});