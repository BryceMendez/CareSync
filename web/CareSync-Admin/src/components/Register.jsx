import { useState } from "react";
import { C } from "../constants";
import "../styles/Login.css";
import careSyncLogo from "../assets/CareSync_logo.png";

export default function Register({ onBack }) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        suffix: "",
        email: "",
        role: "",
        password: "",
        confirm: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleRegister = async () => {
        setError("");
        setSuccess(false);

        const { firstName, lastName, email, role, password, confirm } = form;

        if (!firstName.trim()) { setError("First name is required."); return; }
        if (!lastName.trim()) { setError("Last name is required."); return; }
        if (!email.trim()) { setError("Work email is required."); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!role) { setError("Please select a role."); return; }
        if (!password) { setError("Password is required."); return; }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setLoading(false);

        setSuccess(true);
        setForm({
            firstName: "",
            lastName: "",
            middleName: "",
            suffix: "",
            email: "",
            role: "",
            password: "",
            confirm: "",
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleRegister();
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
            <div className="login-card" style={{ maxWidth: 520 }}>
                {/* Headline */}
                <div className="login-headline">
                    <h1 className="login-headline__title">Create admin account</h1>
                    <p className="login-headline__desc">
                        Fill in the details below. A super admin must approve
                        the account before access is granted.
                    </p>
                </div>

                {/* Success banner */}
                {success && (
                    <div
                        className="login-error"
                        role="status"
                        style={{
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            color: "#166534",
                        }}
                    >
                        <span className="login-error__icon">✅</span>
                        <span className="login-error__text">
                            Account created! Awaiting super admin approval.
                        </span>
                    </div>
                )}

                {/* Error banner */}
                {error && (
                    <div className="login-error" role="alert">
                        <span className="login-error__icon">⛔</span>
                        <span className="login-error__text">{error}</span>
                    </div>
                )}

                {/* ── PERSONAL INFORMATION ── */}
                <div className="register-section-label">Personal Information</div>

                <div className="register-row">
                    <div className="login-field">
                        <label htmlFor="reg-fname">First Name</label>
                        <input
                            id="reg-fname"
                            type="text"
                            placeholder="e.g. Maria"
                            value={form.firstName}
                            onChange={set("firstName")}
                            onKeyDown={handleKeyDown}
                            className={error && !form.firstName.trim() ? "input--error" : ""}
                        />
                    </div>
                    <div className="login-field">
                        <label htmlFor="reg-lname">Last Name</label>
                        <input
                            id="reg-lname"
                            type="text"
                            placeholder="e.g. Santos"
                            value={form.lastName}
                            onChange={set("lastName")}
                            onKeyDown={handleKeyDown}
                            className={error && !form.lastName.trim() ? "input--error" : ""}
                        />
                    </div>
                </div>

                <div className="register-row">
                    <div className="login-field">
                        <label htmlFor="reg-mname">
                            Middle Name{" "}
                            <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                                (optional)
                            </span>
                        </label>
                        <input
                            id="reg-mname"
                            type="text"
                            placeholder="e.g. Cruz"
                            value={form.middleName}
                            onChange={set("middleName")}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className="login-field">
                        <label htmlFor="reg-suffix">
                            Suffix{" "}
                            <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                                (optional)
                            </span>
                        </label>
                        <select
                            id="reg-suffix"
                            value={form.suffix}
                            onChange={set("suffix")}
                            className="register-select"
                        >
                            <option value="">— None —</option>
                            <option>Jr.</option>
                            <option>Sr.</option>
                            <option>II</option>
                            <option>III</option>
                            <option>MD</option>
                            <option>RN</option>
                        </select>
                    </div>
                </div>

                {/* ── ACCOUNT & ROLE ── */}
                <div className="register-divider" />
                <div className="register-section-label">Account &amp; Role</div>

                <div className="login-field">
                    <label htmlFor="reg-email">Work Email</label>
                    <input
                        id="reg-email"
                        type="email"
                        placeholder="yourname@sunrisecare.com"
                        value={form.email}
                        onChange={set("email")}
                        onKeyDown={handleKeyDown}
                        className={
                            error &&
                            (!form.email.trim() ||
                                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                ? "input--error"
                                : ""
                        }
                    />
                </div>

                <div className="login-field">
                    <label htmlFor="reg-role">Role / Position</label>
                    <select
                        id="reg-role"
                        value={form.role}
                        onChange={set("role")}
                        className={`register-select ${error && !form.role ? "input--error" : ""}`}
                    >
                        <option value="">— Select role —</option>
                        <option>Super Admin</option>
                        <option>Wing Admin</option>
                        <option>Nurse Supervisor</option>
                        <option>Care Coordinator</option>
                        <option>IT Staff</option>
                    </select>
                </div>

                {/* ── SECURITY ── */}
                <div className="register-divider" />
                <div className="register-section-label">Security</div>

                <div className="register-row">
                    <div className="login-field">
                        <label htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            type="password"
                            placeholder="Min. 8 characters"
                            value={form.password}
                            onChange={set("password")}
                            onKeyDown={handleKeyDown}
                            className={error && !form.password ? "input--error" : ""}
                        />
                    </div>
                    <div className="login-field">
                        <label htmlFor="reg-confirm">Confirm Password</label>
                        <input
                            id="reg-confirm"
                            type="password"
                            placeholder="Repeat password"
                            value={form.confirm}
                            onChange={set("confirm")}
                            onKeyDown={handleKeyDown}
                            className={
                                error && form.password !== form.confirm
                                    ? "input--error"
                                    : ""
                            }
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    className={`login-btn ${loading ? "login-btn--loading" : ""}`}
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? "Creating account…" : "Create Admin Account"}
                </button>

                {/* Audit notice */}
                <div className="login-audit">
                    <span className="login-audit__icon">⚠️</span>
                    <span className="login-audit__text">
                        New accounts require approval from a Super Admin before
                        login access is granted. All registrations are logged
                        for HIPAA compliance.
                    </span>
                </div>

                {/* Back to login */}
                <div style={{ textAlign: "center", marginTop: 14 }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>
                        Already have an account?{" "}
                    </span>
                    <button
                        className="login-forgot"
                        onClick={onBack}
                        style={{ fontSize: 12 }}
                    >
                        Sign in
                    </button>
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