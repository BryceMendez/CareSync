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
import Svg, { Circle, Path } from "react-native-svg";

const { width } = Dimensions.get("window");

// ─── Shared Input Component (matches LoginScreen exactly) ──────────────────────

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
  focused,
  onFocus,
  onBlur,
  error,
  iconPath,
}) {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        {iconPath && (
          <Svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            style={styles.inputIcon}
          >
            <Path d={iconPath} fill={focused ? "#2196F3" : "#90CAF9"} />
          </Svg>
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B0BEC5"
          keyboardType={keyboardType || "default"}
          secureTextEntry={secureTextEntry && !show}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShow(!show)}
            style={styles.eyeButton}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path
                d={
                  show
                    ? "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    : "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"
                }
                fill="#90CAF9"
              />
            </Svg>
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <View style={styles.fieldErrorBox}>
          <Text style={styles.fieldError}>⚠ {error}</Text>
        </View>
      ) : null}
    </View>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const getStrength = () => {
    if (password.length < 6)
      return { level: 1, label: "Weak", color: "#EF5350" };
    if (password.length < 10)
      return { level: 2, label: "Medium", color: "#FFA726" };
    return { level: 3, label: "Strong", color: "#66BB6A" };
  };
  const { level, label, color } = getStrength();
  return (
    <View style={{ marginTop: -8, marginBottom: 12 }}>
      <View style={{ flexDirection: "row", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              backgroundColor: i <= level ? color : "#E3F2FD",
            }}
          />
        ))}
      </View>
      <Text style={{ fontSize: 11, color }}>{label}</Text>
    </View>
  );
}

function ProgressBar({ current, total }) {
  return (
    <View style={styles.progressWrap}>
      <Text style={styles.progressLabel}>Step {current}: Password Recovery</Text>
      <Text style={styles.progressCounter}>{current} of {total}</Text>
      <View style={styles.progressTrack}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[styles.progressSegment, i < current ? styles.progressActive : styles.progressInactive]}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Step 1: Enter Email ───────────────────────────────────────────────────────

function StepEnterEmail({ onNext, onBack }) {
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validate = () => {
    if (!email.trim()) {
      setError("Email address is required.");
      shake();
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      shake();
      return false;
    }
    return true;
  };

  const handleSend = () => {
    if (!validate()) return;
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext(email);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bgTop} />
        <View style={styles.bgCircle} />

        <View style={styles.container}>
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Svg width={32} height={32} viewBox="0 0 24 24">
                <Path
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  fill="#2196F3"
                />
              </Svg>
            </View>
            <Text style={styles.headerTitle}>Forgot Password?</Text>
            <Text style={styles.headerSub}>
              No worries! Enter your email and we'll send you a reset code.
            </Text>
          </View>

          {/* Card */}
          <Animated.View
            style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
          >
            <InputField
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                setError("");
              }}
              keyboardType="email-address"
              focused={emailFocused}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              error={error}
              iconPath="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
            />

            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
              onPress={handleSend}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.primaryBtnText}>Send Reset Code</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onBack} style={styles.backToLoginRow}>
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Step 2: Enter Code ────────────────────────────────────────────────────────

const CODE_LENGTH = 6;

function StepEnterCode({ email, onNext, onBack }) {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleChange = (val, index) => {
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError("");
    if (digit && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
    }
  };

  const handleVerify = () => {
    const filled = code.filter((c) => c !== "").length;
    if (filled < CODE_LENGTH) {
      setError(`${CODE_LENGTH - filled} digit(s) still missing.`);
      shake();
      return;
    }
    onNext(code.join(""));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bgTop} />
        <View style={styles.bgCircle} />

        <View style={styles.container}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Svg width={32} height={32} viewBox="0 0 24 24">
                <Path
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  fill="#2196F3"
                />
              </Svg>
            </View>
            <Text style={styles.headerTitle}>Check Your Email</Text>
            <Text style={styles.headerSub}>
              We sent a 6-digit code to{"\n"}
              <Text style={{ color: "#2196F3", fontWeight: "600" }}>
                {email}
              </Text>
            </Text>
          </View>

          <View style={styles.card}>
            <Animated.View
              style={[
                styles.codeRow,
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
                      styles.codeBox,
                      code[i] ? styles.codeBoxFilled : null,
                      error && !code[i] ? styles.codeBoxError : null,
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

            {error ? (
              <View style={styles.fieldErrorBox}>
                <Text style={styles.fieldError}>⚠ {error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleVerify}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Verify Code</Text>
            </TouchableOpacity>

            {/* Resend */}
            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity
                onPress={() => {
                  if (!canResend) return;
                  setTimer(45);
                  setCanResend(false);
                  setCode(Array(CODE_LENGTH).fill(""));
                  inputRefs.current[0]?.focus();
                }}
                disabled={!canResend}
              >
                <Text
                  style={[
                    styles.resendLink,
                    !canResend && { color: "#90A4AE" },
                  ]}
                >
                  {canResend
                    ? "Resend now"
                    : `Resend in 00:${String(timer).padStart(2, "0")}`}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.changeEmailRow} onPress={onBack}>
              <Text style={styles.changeEmailText}>Change Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Step 3: New Password ──────────────────────────────────────────────────────

function StepNewPassword({ onComplete, onBack }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validate = () => {
    const e = {};
    if (!password) e.password = "New password is required.";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(password))
      e.password = "Must include an uppercase letter.";
    else if (!/[0-9]/.test(password))
      e.password = "Must include at least one number.";
    else if (!/[^a-zA-Z0-9]/.test(password))
      e.password = "Must include a special character (@#$!).";
    if (!confirm) e.confirm = "Please confirm your new password.";
    else if (password !== confirm) e.confirm = "Passwords do not match.";
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bgTop} />
        <View style={styles.bgCircle} />

        <View style={styles.container}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Svg width={32} height={32} viewBox="0 0 24 24">
                <Path
                  d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                  fill="#2196F3"
                />
              </Svg>
            </View>
            <Text style={styles.headerTitle}>Set New Password</Text>
            <Text style={styles.headerSub}>
              Create a strong new password for your account.
            </Text>
          </View>

          <Animated.View
            style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
          >
            <InputField
              label="New Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setErrors((e) => ({ ...e, password: "" }));
              }}
              secureTextEntry
              focused={passwordFocused}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              error={errors.password}
              iconPath="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
            />
            <PasswordStrength password={password} />

            <InputField
              label="Confirm New Password"
              placeholder="••••••••"
              value={confirm}
              onChangeText={(v) => {
                setConfirm(v);
                setErrors((e) => ({ ...e, confirm: "" }));
              }}
              secureTextEntry
              focused={confirmFocused}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
              error={errors.confirm}
              iconPath="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
            />

            {/* Password requirements */}
            <View style={styles.requirementsCard}>
              <Text style={styles.requirementsTitle}>
                PASSWORD REQUIREMENTS
              </Text>
              {[
                { text: "At least 8 characters", met: password.length >= 8 },
                {
                  text: "Uppercase & lowercase letters",
                  met: /[a-z]/.test(password) && /[A-Z]/.test(password),
                },
                { text: "At least one number", met: /[0-9]/.test(password) },
                {
                  text: "One special character (@#$!)",
                  met: /[^a-zA-Z0-9]/.test(password),
                },
              ].map((r, i) => (
                <View key={i} style={styles.requirementRow}>
                  <Text
                    style={{
                      color: r.met ? "#66BB6A" : "#90A4AE",
                      fontSize: 13,
                      marginRight: 8,
                    }}
                  >
                    {r.met ? "✅" : "○"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: r.met ? "#2E7D32" : "#78909C",
                    }}
                  >
                    {r.text}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
              onPress={handleReset}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.primaryBtnText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Step 4: Success ───────────────────────────────────────────────────────────

function StepSuccess({ onLogin }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1, tension: 60, friction: 8, useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 600, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F7FF' }}>
      <View style={styles.bgTop} />
      <View style={styles.bgCircle} />

      <Animated.View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        opacity: fadeAnim,
      }}>

        {/* Success icon */}
       

        {/* Title */}
        <Text style={{
          fontSize: 28, fontWeight: '700',
          color: '#1565C0', marginBottom: 12,
          textAlign: 'center',
        }}>
          Password Reset!
        </Text>

        {/* Subtitle */}
        <Text style={{
          fontSize: 14, color: '#5B8DB8',
          textAlign: 'center', lineHeight: 22,
          marginBottom: 40,
        }}>
          Your password has been successfully updated.{'\n'}
          You can now log in with your new password.
        </Text>

        {/* Button — full width */}
        <TouchableOpacity
          style={[styles.primaryBtn, { width: width - 64 }]}
          onPress={onLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Back to Login</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

// ─── Main ForgotPassword Screen ────────────────────────────────────────────────

export default function ForgotPasswordScreen({ onBack }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

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
        onNext={(c) => {
          setCode(c);
          setStep(3);
        }}
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

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  keyboardView: { flex: 1, backgroundColor: "#F0F7FF" },
  scrollContent: { flexGrow: 1, alignItems: "center", paddingBottom: 32 },
  bgTop: {
    position: "absolute",
    width: width * 1.4,
    height: 300,
    borderRadius: width * 0.7,
    backgroundColor: "#BBDEFB",
    opacity: 0.4,
    top: -160,
  },
  bgCircle: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#90CAF9",
    opacity: 0.15,
    bottom: 100,
    right: -40,
  },
  container: { width: "100%", alignItems: "center", paddingTop: 60 },
  backBtn: {
    position: "absolute",
    top: 30,
    left: 10,
    zIndex: 10,
    padding: 8,
  },
  backArrow: {
    fontSize: 30,
    color: "#1565C0",
    fontWeight: "600",
  },

  // Progress bar
  progressWrap: { paddingHorizontal: 24, paddingTop: 100, paddingBottom: 8 },
  progressLabel: { fontSize: 12, color: '#90CAF9', marginBottom: 6 },
  progressCounter: { position: 'absolute', right: 24, top: 100, fontSize: 12, color: '#90CAF9' },
  progressTrack: { flexDirection: 'row', gap: 4 },
  progressSegment: { flex: 1, height: 4, borderRadius: 2 },
  progressActive: { backgroundColor: '#2196F3' },
  progressInactive: { backgroundColor: '#E3F2FD' },

  // Header
  header: { alignItems: "center", marginBottom: 24, paddingHorizontal: 24 },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1565C0",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 13,
    color: "#5B8DB8",
    textAlign: "center",
    lineHeight: 20,
  },

  // Card — identical to LoginScreen
  card: {
    width: width - 32,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },

  // Input — identical to LoginScreen
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1565C0",
    marginBottom: 7,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F9FF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E3F2FD",
    paddingHorizontal: 14,
    height: 50,
  },
  inputFocused: { borderColor: "#2196F3", backgroundColor: "#F0F7FF" },
  inputError: { borderColor: "#EF5350", backgroundColor: "#FFF5F5" },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#1A237E", paddingVertical: 0 },
  eyeButton: { padding: 4 },
  fieldErrorBox: { marginTop: 4, marginBottom: 4 },
  fieldError: { fontSize: 12, color: "#EF5350", fontWeight: "500" },

  // Code boxes
  codeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  codeBox: {
    width: 44,
    height: 54,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E3F2FD",
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#1565C0",
  },
  codeBoxFilled: { borderColor: "#2196F3", backgroundColor: "#F0F7FF" },
  codeBoxError: { borderColor: "#EF5350", backgroundColor: "#FFF5F5" },

  // Resend
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  resendText: { fontSize: 13, color: "#90A4AE" },
  resendLink: { fontSize: 13, color: "#2196F3", fontWeight: "600" },
  changeEmailRow: { alignItems: "center", marginTop: 10 },
  changeEmailText: { fontSize: 12, color: "#2196F3", fontWeight: "600" },

  // Requirements
  requirementsCard: {
    backgroundColor: "#F5F9FF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  requirementsTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#90A4AE",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  // Primary button — identical to LoginScreen loginButton
  primaryBtn: {
    backgroundColor: "#2196F3",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Back to login
  backToLoginRow: { alignItems: "center", marginTop: 16 },
  backToLoginText: { fontSize: 13, color: "#2196F3", fontWeight: "600" },

  // Success
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  successIconWrap: { marginBottom: 24 },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1565C0",
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#5B8DB8",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
});
