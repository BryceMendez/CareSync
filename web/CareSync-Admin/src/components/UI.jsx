import { C, F } from "../constants";

// ── BADGE ──────────────────────────────────────────────────────────
export const Badge = ({
    children,
    color = C.blue600,
    bg,
    border,
    style = {},
}) => (
    <span
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 9px",
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.04em",
            fontFamily: F.body,
            color,
            background: bg || color + "12",
            border: `1px solid ${border || color + "30"}`,
            ...style,
        }}
    >
        {children}
    </span>
);

// ── BUTTON ─────────────────────────────────────────────────────────
export const Btn = ({
    children,
    variant = "primary",
    size = "md",
    onClick,
    style = {},
}) => {
    const sz = {
        sm: { padding: "5px 13px", fontSize: 12 },
        md: { padding: "8px 18px", fontSize: 13 },
        lg: { padding: "11px 28px", fontSize: 14 },
    };
    const v = {
        primary: {
            background: `linear-gradient(135deg, ${C.blue600}, ${C.blue700})`,
            color: "#fff",
            border: "none",
            boxShadow: `0 2px 8px ${C.blue600}40`,
        },
        secondary: {
            background: C.surface,
            color: C.textSec,
            border: `1px solid ${C.border}`,
        },
        danger: {
            background: C.redSoft,
            color: C.red,
            border: `1px solid ${C.redBorder}`,
        },
        ghost: {
            background: "transparent",
            color: C.blue600,
            border: `1px solid ${C.blue200}`,
        },
        success: {
            background: C.greenSoft,
            color: C.green,
            border: `1px solid ${C.greenBorder}`,
        },
    };
    return (
        <button
            onClick={onClick}
            style={{
                ...sz[size],
                ...v[variant],
                borderRadius: 8,
                fontFamily: F.body,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                ...style,
            }}
        >
            {children}
        </button>
    );
};

// ── CARD ───────────────────────────────────────────────────────────
export const Card = ({ children, style = {}, p = "20px", hover = false }) => (
    <div
        style={{
            background: C.surface,
            borderRadius: 14,
            border: `1px solid ${C.border}`,
            boxShadow:
                "0 1px 4px rgba(59,130,246,0.06), 0 4px 16px rgba(59,130,246,0.04)",
            padding: p,
            overflow: "hidden",
            transition: hover
                ? "box-shadow 0.2s, border-color 0.2s"
                : undefined,
            ...style,
        }}
    >
        {children}
    </div>
);

// ── SECTION HEADER ─────────────────────────────────────────────────
export const SectionHeader = ({ title, sub, action }) => (
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
        }}
    >
        <div>
            <div
                style={{
                    fontFamily: F.display,
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.text,
                }}
            >
                {title}
            </div>
            {sub && (
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                    {sub}
                </div>
            )}
        </div>
        {action}
    </div>
);

// ── DIVIDER ────────────────────────────────────────────────────────
export const Divider = () => (
    <div style={{ height: 1, background: C.border, margin: "0 -20px" }} />
);

// ── AVATAR ─────────────────────────────────────────────────────────
export const Avatar = ({ name, size = 32, color = C.blue500 }) => {
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("");
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: size / 3,
                background: color + "18",
                border: `1.5px solid ${color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.body,
                fontSize: size * 0.34,
                fontWeight: 700,
                color,
                flexShrink: 0,
            }}
        >
            {initials}
        </div>
    );
};

// ── PROGRESS BAR ───────────────────────────────────────────────────
export const ProgressBar = ({
    value,
    color = C.blue500,
    h = 6,
    bg = C.blue100,
    style = {},
}) => (
    <div
        style={{
            height: h,
            background: bg,
            borderRadius: h,
            overflow: "hidden",
            ...style,
        }}
    >
        <div
            style={{
                height: "100%",
                width: `${Math.min(value, 100)}%`,
                background: color,
                borderRadius: h,
                transition: "width 0.6s cubic-bezier(.34,1.56,.64,1)",
            }}
        />
    </div>
);

// ── MODAL ──────────────────────────────────────────────────────────
export const Modal = ({ title, subtitle, children, onClose, width = 560 }) => (
    <div
        style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.35)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <div
            style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 18,
                width,
                maxHeight: "88vh",
                overflowY: "auto",
                boxShadow:
                    "0 20px 80px rgba(37,99,235,0.15), 0 0 0 1px rgba(37,99,235,0.08)",
            }}
        >
            <div
                style={{
                    padding: "20px 24px 16px",
                    borderBottom: `1px solid ${C.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div>
                    <div
                        style={{
                            fontFamily: F.display,
                            fontSize: 17,
                            fontWeight: 700,
                            color: C.text,
                        }}
                    >
                        {title}
                    </div>
                    {subtitle && (
                        <div
                            style={{
                                fontSize: 12,
                                color: C.textMuted,
                                marginTop: 3,
                            }}
                        >
                            {subtitle}
                        </div>
                    )}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 16,
                        color: C.textMuted,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    ×
                </button>
            </div>
            <div style={{ padding: "20px 24px 24px" }}>{children}</div>
        </div>
    </div>
);

// ── INPUT ──────────────────────────────────────────────────────────
export const Input = ({
    label,
    placeholder,
    type = "text",
    value,
    onChange,
    icon,
    style = {},
}) => (
    <div style={{ marginBottom: 14, ...style }}>
        {label && (
            <label
                style={{
                    display: "block",
                    fontFamily: F.body,
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.textSec,
                    letterSpacing: "0.06em",
                    marginBottom: 5,
                }}
            >
                {label}
            </label>
        )}
        <div style={{ position: "relative" }}>
            {icon && (
                <span
                    style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 14,
                    }}
                >
                    {icon}
                </span>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={{
                    width: "100%",
                    padding: icon ? "9px 12px 9px 32px" : "9px 12px",
                    background: C.bg,
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 9,
                    color: C.text,
                    fontFamily: F.body,
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.blue400)}
                onBlur={(e) => (e.target.style.borderColor = C.border)}
            />
        </div>
    </div>
);

// ── SELECT ─────────────────────────────────────────────────────────
export const Select = ({ label, children, style = {} }) => (
    <div style={{ marginBottom: 14, ...style }}>
        {label && (
            <label
                style={{
                    display: "block",
                    fontFamily: F.body,
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.textSec,
                    letterSpacing: "0.06em",
                    marginBottom: 5,
                }}
            >
                {label}
            </label>
        )}
        <select
            style={{
                width: "100%",
                padding: "9px 12px",
                background: C.bg,
                border: `1.5px solid ${C.border}`,
                borderRadius: 9,
                color: C.text,
                fontFamily: F.body,
                fontSize: 13,
                outline: "none",
            }}
        >
            {children}
        </select>
    </div>
);
