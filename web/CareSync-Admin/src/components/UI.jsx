import { C, F } from "../constants";
import "../styles/UI.css";

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
}) => (
    <button
        onClick={onClick}
        className={`cs-btn cs-btn--${variant} cs-btn--${size}`}
        style={style}
    >
        {children}
    </button>
);

// ── CARD ───────────────────────────────────────────────────────────
export const Card = ({ children, style = {}, p = "20px", hover = false }) => (
    <div
        className={hover ? "cs-card--hover" : undefined}
        style={{
            background: C.surface,
            borderRadius: 14,
            border: `1px solid ${C.border}`,
            boxShadow:
                "0 1px 4px rgba(59,130,246,0.06), 0 4px 16px rgba(59,130,246,0.04)",
            padding: p,
            overflow: "hidden",
            transition: hover
                ? "box-shadow 0.2s var(--cs-ease), border-color 0.2s var(--cs-ease)"
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
                    lineHeight: 1.3,
                }}
            >
                {title}
            </div>
            {sub && (
                <div
                    style={{
                        fontSize: 12,
                        color: C.textMuted,
                        marginTop: 2,
                        lineHeight: 1.5,
                    }}
                >
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
                borderRadius: Math.round(size / 3),
                background: color + "18",
                border: `1.5px solid ${color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.body,
                fontSize: Math.round(size * 0.34),
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
                transition: "width 0.5s var(--cs-ease)",
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
            WebkitBackdropFilter: "blur(4px)",
            backdropFilter: "blur(4px)",
            zIndex: "var(--z-modal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
        }}
    >
        <div
            className="cs-modal__content"
            style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 18,
                width,
                maxWidth: "100%",
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
                    position: "sticky",
                    top: 0,
                    background: C.surface,
                    zIndex: 1,
                    borderRadius: "18px 18px 0 0",
                }}
            >
                <div>
                    <div
                        style={{
                            fontFamily: F.display,
                            fontSize: 17,
                            fontWeight: 700,
                            color: C.text,
                            lineHeight: 1.3,
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
                                lineHeight: 1.5,
                            }}
                        >
                            {subtitle}
                        </div>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="cs-btn cs-btn--secondary cs-btn--sm"
                    style={{
                        width: 28,
                        height: 28,
                        padding: 0,
                        borderRadius: 8,
                        fontSize: 16,
                        color: C.textMuted,
                        flexShrink: 0,
                        marginLeft: 12,
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
                    textTransform: "uppercase",
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
                        pointerEvents: "none",
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
                    lineHeight: 1.5,
                    transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = C.blue400;
                    e.target.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.12)";
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = C.border;
                    e.target.style.boxShadow = "none";
                }}
            />
        </div>
    </div>
);

// ── SELECT ─────────────────────────────────────────────────────────
export const Select = ({ label, value, onChange, children, style = {} }) => (
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
                    textTransform: "uppercase",
                }}
            >
                {label}
            </label>
        )}
        <select
            value={value}
            onChange={onChange}
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
                lineHeight: 1.5,
                cursor: "pointer",
                transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={(e) => {
                e.target.style.borderColor = C.blue400;
                e.target.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.12)";
            }}
            onBlur={(e) => {
                e.target.style.borderColor = C.border;
                e.target.style.boxShadow = "none";
            }}
        >
            {children}
        </select>
    </div>
);
