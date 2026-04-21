import { useState } from "react";
import { C } from "../constants";
import "../styles/Login.css";
import careSyncLogo from "../assets/CareSync_logo.png";

// ── Valid admin credentials ──────────────────────────────────────────
const VALID_CREDENTIALS = {
    email: "admin@sunrisecare.com",
    password: "Admin@1234",
};

export default function Login({ onLogin, onForgotPassword, onRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        setError("");

        // ── Basic empty-field guard ──────────────────────────────────────
        if (!email.trim() && !password.trim()) {
            setError("Please enter your email and password.");
            return;
        }
        if (!email.trim()) {
            setError("Email is required.");
            return;
        }
        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

        // ── Simulate network latency ─────────────────────────────────────
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setLoading(false);

        // ── Credential check ─────────────────────────────────────────────
        const emailMatch =
            email.trim().toLowerCase() === VALID_CREDENTIALS.email;
        const passwordMatch = password === VALID_CREDENTIALS.password;

        if (!emailMatch || !passwordMatch) {
            setError("Invalid email or password. Please try again.");
            return;
        }

        // ── Success ──────────────────────────────────────────────────────
        onLogin();
    };

    // Allow Enter key to submit
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSignIn();
    };

    return (
        <div className="login-wrapper">
            {/* Decorative blobs */}
            <div className="login-blob login-blob--tl" />
            <div className="login-blob login-blob--br" />
            <div className="login-blob login-blob--mid" />
            <div className="login-blob login-blob--tr" />

            {/* Logo */}
            <div className="login-logo">
                <img src={careSyncLogo} alt="CareSync" />
            </div>

            {/* Card */}
            <div className="login-card">
                {/* Headline */}
                <div className="login-headline">
                    <h1 className="login-headline__title">Admin sign in</h1>
                    <p className="login-headline__desc">
                        Sign in to manage Sunrise Care Center.
                    </p>
                </div>

                {/* ── Error banner ── */}
                {error && (
                    <div className="login-error" role="alert">
                        <span className="login-error__icon">⛔</span>
                        <span className="login-error__text">{error}</span>
                    </div>
                )}

                {/* Email */}
                <div className="login-field">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        placeholder="admin@sunrisecare.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={error ? "input--error" : ""}
                    />
                </div>

                {/* Password */}
                <div className="login-field">
                    <label htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={error ? "input--error" : ""}
                    />
                </div>

                {/* Remember / Forgot */}
                <div className="login-options">
                    <label className="login-remember">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <span>Keep me signed in</span>
                    </label>
                    <button className="login-forgot" onClick={onForgotPassword}>
                        Forgot password?
                    </button>
                </div>

                {/* Submit */}
                <button
                    className={`login-btn ${loading ? "login-btn--loading" : ""}`}
                    onClick={handleSignIn}
                    disabled={loading}
                >
                    {loading ? "Signing in…" : "Sign in to Admin Portal"}
                </button>

                {/* Register link */}
                <div style={{ textAlign: "center", marginTop: 14 }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>
                        Don't have an account?{" "}
                    </span>
                    <button
                        className="login-forgot"
                        onClick={onRegister}
                        style={{ fontSize: 12 }}
                    >
                        Create an account
                    </button>
                </div>

                {/* Audit notice */}
                <div className="login-audit">
                    <span className="login-audit__icon">⚠️</span>
                    <span className="login-audit__text">
                        All admin sessions are logged and audited for HIPAA
                        compliance. Unauthorized access is prohibited.
                    </span>
                </div>
            </div>

            {/* Compliance badges */}
            <div className="login-badges">
                {[
                    "🔒 HIPAA Compliant",
                    "🔐 AES-256 Encrypted",
                    "✅ SOC 2 Certified",
                ].map((b, i) => (
                    <span key={i} className="login-badge">
                        {b}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <p className="login-footer">
                Having trouble?{" "}
                <a href="#">Contact your system administrator</a> or{" "}
                <a href="#">CareSync Support</a>
            </p>
        </div>
    );
}