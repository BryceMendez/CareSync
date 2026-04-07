import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import LoginScreen from '../screens/LoginScreen';

// ─── Hardcoded Family Accounts ───────────────────────────────────────────────
const FAMILY_ACCOUNTS = [
    { email: "alex@caresync.ph", password: "family123", name: "Alex" },
    { email: "maria@caresync.ph", password: "family456", name: "Maria" },
];

export default function Login() {
    const navigation = useNavigation();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = (email, password) => {
        setError("");

        // Validation
        if (!email || !email.trim()) {
            setError("Please enter your email address.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!password || !password.trim()) {
            setError("Please enter your password.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        // Simulate async check
        setTimeout(() => {
            const account = FAMILY_ACCOUNTS.find(
                (a) =>
                    a.email.toLowerCase() === email.trim().toLowerCase() &&
                    a.password === password,
            );

            if (account) {
                setLoading(false);
                navigation.replace("Home");
            } else {
                setLoading(false);
                setError("Incorrect email or password. Please try again.");
            }
        }, 800);
    };

    return (
        <LoginScreen
            onLogin={handleLogin}
            onRegister={() => navigation.navigate("Register")}
            onForgotPassword={() => navigation.navigate("ForgotPassword")}
            onGoogleLogin={() => console.log("Google login")}
            onAppleLogin={() => console.log("Apple login")}
            onStaffPortal={() => navigation.navigate("StaffLogin")}
            error={error}
            loading={loading}
        />
    );
}
