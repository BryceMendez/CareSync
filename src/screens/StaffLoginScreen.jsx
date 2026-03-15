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
  ScrollView,
  StatusBar,
  Animated,
  ActivityIndicator,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

const { width } = Dimensions.get("window");

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </Svg>
  );
}

export default function StaffLoginScreen({
  onLogin,
  onFamilyPortal,
  onRegister,
  onForgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter your credentials.");
      shake();
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(email, password);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardView}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7FF" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bgTop} />
        <View style={styles.bgCircle} />

        <Animated.View style={[styles.container, { opacity: fadeIn }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Staff Portal</Text>
          </View>

          {/* Card */}
          <Animated.View
            style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
          >
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSubtitle}>
              Enter your credentials to access the staff portal
            </Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Work Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Work email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputFocused,
                ]}
              >
                <Svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  style={styles.inputIcon}
                >
                  <Path
                    d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                    fill={emailFocused ? "#2196F3" : "#90CAF9"}
                  />
                </Svg>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@organization.com"
                  placeholderTextColor="#B0BEC5"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputFocused,
                ]}
              >
                <Svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  style={styles.inputIcon}
                >
                  <Path
                    d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                    fill={passwordFocused ? "#2196F3" : "#90CAF9"}
                  />
                </Svg>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#B0BEC5"
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ padding: 4 }}
                >
                  <Svg width={18} height={18} viewBox="0 0 24 24">
                    <Path
                      d={
                        showPassword
                          ? "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                          : "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"
                      }
                      fill="#90CAF9"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.forgotPasswordRow} onPress={onForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.loginBtnText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <GoogleIcon /><Text style={styles.socialBtnText}> Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialBtnText}>🪪 Staff ID</Text>
              </TouchableOpacity>
            </View>

            {/* Register */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onRegister}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Family portal link */}
          <TouchableOpacity
            style={styles.familyPortal}
            onPress={onFamilyPortal}
          >
            <Text style={styles.familyPortalText}>Not a staff member?</Text>
            <Text style={styles.familyPortalLink}> Go to Family Portal</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
  header: { alignItems: "center", marginBottom: 24 },
  staffIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  staffIcon: { fontSize: 30 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1565C0",
    letterSpacing: 0.5,
  },
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
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1565C0",
    textAlign: "center",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#5B8DB8",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 19,
  },
  errorBox: {
    backgroundColor: "#FFEBEE",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#EF5350",
  },
  errorText: { color: "#C62828", fontSize: 13 },
  inputGroup: { marginBottom: 20 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#1565C0", marginBottom: 6 },
  forgotText: { fontSize: 13, color: "#2196F3", fontWeight: "500" },
  forgotPasswordRow: { marginTop: 8, alignItems: 'flex-end' },
  forgotPasswordText: { fontSize: 13, color: "#2196F3", fontWeight: "500" },
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
  inputIcon: { fontSize: 14, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#1A237E", paddingVertical: 0 },
  loginBtn: {
    backgroundColor: "#2196F3",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  loginBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E3F2FD" },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 11,
    color: "#90CAF9",
    fontWeight: "600",
  },
  socialRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  socialBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#E3F2FD",
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FAFCFF",
  },
  socialBtnText: { fontSize: 14, color: "#37474F", fontWeight: "500" },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: { fontSize: 13, color: "#78909C" },
  registerLink: { fontSize: 13, color: "#2196F3", fontWeight: "700" },
  familyPortal: { flexDirection: "row", marginTop: 20, alignItems: "center" },
  familyPortalText: { fontSize: 13, color: "#90A4AE" },
  familyPortalLink: { fontSize: 13, color: "#2196F3", fontWeight: "600" },
});
