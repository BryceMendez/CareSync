import { useState } from "react";
import { C } from "../constants";
import { Card, Btn, Input } from "./UI.jsx";
import "../styles/ForgotPassword.css";

export default function ForgotPassword({ onBack }) {
    const [sent, setSent] = useState(false);
    const [email, setEmail] = useState("");

    return (
        <div className="forgot-wrapper">
            <div className="forgot-container">
                {!sent ? (
                    <>
                        <div className="forgot-header">
                            <div className="forgot-header__icon">🔐</div>
                            <h1 className="forgot-header__title">
                                Reset your password
                            </h1>
                            <p className="forgot-header__desc">
                                Enter your administrator email and we'll send a
                                secure reset link to your inbox.
                            </p>
                        </div>

                        <Card>
                            <Input
                                label="ADMINISTRATOR EMAIL"
                                placeholder="admin@sunrisecare.com"
                                type="email"
                                icon="✉️"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Btn
                                variant="primary"
                                onClick={() => setSent(true)}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    fontSize: 14,
                                    borderRadius: 10,
                                }}
                            >
                                Send Reset Link
                            </Btn>
                        </Card>

                        <button onClick={onBack} className="forgot-back">
                            ← Back to Login
                        </button>
                    </>
                ) : (
                    <Card>
                        <div className="forgot-success">
                            <div className="forgot-success__icon">📩</div>
                            <h2 className="forgot-success__title">
                                Check your inbox
                            </h2>
                            <p className="forgot-success__desc">
                                A password reset link has been sent to{" "}
                                <strong>{email || "your email"}</strong>. The
                                link expires in 30 minutes.
                            </p>
                            <div className="forgot-success__tips">
                                <p>
                                    Didn't receive it? Check your spam folder or
                                </p>
                                <button
                                    onClick={() => setSent(false)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: C.blue600,
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        fontSize: 13,
                                        padding: 0,
                                    }}
                                >
                                    try a different email address
                                </button>
                            </div>
                            <Btn
                                variant="primary"
                                onClick={onBack}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    fontSize: 14,
                                    borderRadius: 10,
                                }}
                            >
                                Return to Login
                            </Btn>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
