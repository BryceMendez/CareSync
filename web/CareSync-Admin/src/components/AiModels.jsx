import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { C, F } from "../constants";
import {
    Badge,
    Btn,
    Card,
    SectionHeader,
    ProgressBar,
    Divider,
} from "./UI.jsx";
import "../styles/AIModels.css";

const MODELS = [
    {
        id: "MDL-01",
        name: "Fall Detection CNN",
        version: "v4.2.1",
        type: "Computer Vision",
        accuracy: 97.3,
        status: "Healthy",
        inferences: "1.24M",
        latency: "18ms",
        lastTrained: "Mar 15, 2026",
        dataset: "48,500 samples",
        threshold: 80,
        description:
            "Convolutional neural network trained to detect fall events from CCTV camera feeds in real-time.",
        metrics: { precision: 96.8, recall: 97.1, f1: 96.9 },
        recentAlerts: 14,
        falsePositives: 2,
        trainingStatus: "Up to date",
    },
    {
        id: "MDL-02",
        name: "Inactivity LSTM",
        version: "v3.1.0",
        type: "Sequential / RNN",
        accuracy: 89.1,
        status: "Healthy",
        inferences: "892K",
        latency: "22ms",
        lastTrained: "Feb 28, 2026",
        dataset: "31,200 samples",
        threshold: 80,
        description:
            "Long Short-Term Memory network that monitors activity patterns and flags prolonged inactivity events.",
        metrics: { precision: 88.4, recall: 89.7, f1: 89.0 },
        recentAlerts: 9,
        falsePositives: 4,
        trainingStatus: "Up to date",
    },
    {
        id: "MDL-03",
        name: "Anomaly Autoencoder",
        version: "v2.8.3",
        type: "Autoencoder",
        accuracy: 76.4,
        status: "Degraded",
        inferences: "541K",
        latency: "35ms",
        lastTrained: "Jan 10, 2026",
        dataset: "22,100 samples",
        threshold: 80,
        description:
            "Unsupervised autoencoder model that detects unusual behavioral patterns and environmental anomalies.",
        metrics: { precision: 74.1, recall: 78.2, f1: 76.1 },
        recentAlerts: 21,
        falsePositives: 11,
        trainingStatus: "Retraining recommended",
    },
    {
        id: "MDL-04",
        name: "Wandering Risk Classifier",
        version: "v1.5.2",
        type: "Classification",
        accuracy: 84.7,
        status: "Healthy",
        inferences: "340K",
        latency: "14ms",
        lastTrained: "Mar 22, 2026",
        dataset: "18,900 samples",
        threshold: 80,
        description:
            "Binary classifier that predicts wandering risk based on movement patterns near restricted zones.",
        metrics: { precision: 83.9, recall: 85.2, f1: 84.5 },
        recentAlerts: 6,
        falsePositives: 3,
        trainingStatus: "Up to date",
    },
];

const STATUS_COLOR = (s) =>
    s === "Healthy" ? C.green : s === "Degraded" ? C.amber : C.red;

// ── MODEL DETAIL MODAL ──────────────────────────────────────────────
function ModelModal({ model: m, onClose, onRetrain }) {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const statusColor = STATUS_COLOR(m.status);

    const modal = (
        <div
            className="ai-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="ai-modal ai-modal--detail"
                role="dialog"
                aria-modal="true"
            >
                {/* Accent stripe keyed to status */}
                <div
                    className="ai-modal__stripe"
                    style={{ background: statusColor }}
                />

                {/* Sticky header */}
                <div className="ai-modal__header">
                    <span className="ai-modal__header-title">
                        MODEL PROFILE
                    </span>
                    <button
                        className="ai-modal__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="ai-modal__body">
                    {/* Identity hero */}
                    <div className="ai-modal__identity">
                        <div className="ai-modal__icon">🤖</div>
                        <h2 className="ai-modal__name">{m.name}</h2>
                        <div className="ai-modal__id">
                            {m.id} · {m.version}
                        </div>
                        <div className="ai-modal__badges">
                            <Badge color={statusColor}>{m.status}</Badge>
                            <Badge color={C.blue500}>{m.type}</Badge>
                        </div>
                    </div>

                    {/* Degraded warning strip */}
                    {m.status === "Degraded" && (
                        <div className="ai-modal__alert-strip">
                            <span style={{ fontSize: 16 }}>⚠️</span>
                            <span>
                                This model is below the {m.threshold}% accuracy
                                threshold. Retraining is recommended.
                            </span>
                        </div>
                    )}

                    {/* Description */}
                    <p
                        style={{
                            fontSize: 12,
                            color: C.textSec,
                            margin: 0,
                            lineHeight: 1.6,
                        }}
                    >
                        {m.description}
                    </p>

                    {/* Performance metrics */}
                    <div>
                        <div className="ai-modal__section-label">
                            Performance Metrics
                        </div>
                        {[
                            {
                                label: "Accuracy",
                                v: m.accuracy,
                                color:
                                    m.accuracy >= m.threshold ? C.green : C.red,
                            },
                            {
                                label: "Precision",
                                v: m.metrics.precision,
                                color: C.blue500,
                            },
                            {
                                label: "Recall",
                                v: m.metrics.recall,
                                color: C.purple,
                            },
                            {
                                label: "F1 Score",
                                v: m.metrics.f1,
                                color: C.teal,
                            },
                        ].map((metric) => (
                            <div
                                key={metric.label}
                                style={{ marginBottom: 10 }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: 11,
                                        marginBottom: 4,
                                    }}
                                >
                                    <span
                                        style={{
                                            color: C.textSec,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {metric.label}
                                    </span>
                                    <span
                                        style={{
                                            fontWeight: 800,
                                            color: metric.color,
                                        }}
                                    >
                                        {metric.v}%
                                    </span>
                                </div>
                                <ProgressBar
                                    value={metric.v}
                                    color={metric.color}
                                    h={5}
                                    bg={metric.color + "20"}
                                />
                            </div>
                        ))}
                        {m.accuracy < m.threshold && (
                            <div
                                style={{
                                    fontSize: 10,
                                    color: C.red,
                                    marginTop: 2,
                                }}
                            >
                                ⚠ Below {m.threshold}% accuracy threshold
                            </div>
                        )}
                    </div>

                    {/* Info grid */}
                    <div className="ai-modal__info-grid">
                        {[
                            { label: "TYPE", value: m.type },
                            { label: "DATASET", value: m.dataset },
                            { label: "LAST TRAINED", value: m.lastTrained },
                            { label: "AVG LATENCY", value: m.latency },
                            { label: "INFERENCES", value: m.inferences },
                            { label: "RECENT ALERTS", value: m.recentAlerts },
                            {
                                label: "FALSE POSITIVES",
                                value: m.falsePositives,
                            },
                            { label: "THRESHOLD", value: `${m.threshold}%` },
                        ].map(({ label, value }) => (
                            <div key={label} className="ai-modal__field">
                                <div className="ai-modal__field-label">
                                    {label}
                                </div>
                                <div className="ai-modal__field-value">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Training status badge */}
                    <div
                        style={{
                            padding: "10px 14px",
                            background:
                                m.trainingStatus === "Up to date"
                                    ? C.greenSoft
                                    : C.amberSoft,
                            border: `1px solid ${m.trainingStatus === "Up to date" ? C.greenBorder : C.amberBorder}`,
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 700,
                            color:
                                m.trainingStatus === "Up to date"
                                    ? C.green
                                    : C.amber,
                        }}
                    >
                        {m.trainingStatus === "Up to date" ? "✅" : "⚠️"}{" "}
                        {m.trainingStatus}
                    </div>

                    {/* Actions */}
                    <div className="ai-modal__actions">
                        <Btn
                            variant="primary"
                            size="sm"
                            style={{ flex: 1 }}
                            onClick={() => {
                                onClose();
                                onRetrain(m);
                            }}
                        >
                            Retrain Model
                        </Btn>
                        <Btn variant="ghost" size="sm" style={{ flex: 1 }}>
                            View Logs
                        </Btn>
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modal, document.body);
}

// ── RETRAIN MODAL ───────────────────────────────────────────────────
function RetrainModal({ model, onClose }) {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const modal = (
        <div
            className="ai-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="ai-modal" role="dialog" aria-modal="true">
                <div
                    className="ai-modal__stripe"
                    style={{ background: C.blue600 }}
                />
                <div className="ai-modal__header">
                    <span className="ai-modal__header-title">
                        SCHEDULE RETRAINING
                    </span>
                    <button
                        className="ai-modal__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
                <div className="ai-modal__body">
                    <div style={{ fontSize: 12, color: C.textMuted }}>
                        Configure retraining job for{" "}
                        <strong style={{ color: C.text }}>{model?.name}</strong>
                    </div>
                    {[
                        { label: "Model", value: model?.name },
                        {
                            label: "Current Accuracy",
                            value: `${model?.accuracy}%`,
                        },
                        { label: "Dataset Size", value: model?.dataset },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 12px",
                                background: C.bg,
                                borderRadius: 8,
                                fontSize: 12,
                            }}
                        >
                            <span style={{ color: C.textMuted }}>{label}</span>
                            <span style={{ fontWeight: 700, color: C.text }}>
                                {value}
                            </span>
                        </div>
                    ))}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 5,
                        }}
                    >
                        <label
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: C.textSec,
                                letterSpacing: "0.06em",
                            }}
                        >
                            SCHEDULED TIME
                        </label>
                        <input
                            type="datetime-local"
                            style={{
                                padding: "9px 12px",
                                border: `1.5px solid ${C.border}`,
                                borderRadius: 9,
                                fontSize: 13,
                                outline: "none",
                                background: C.bg,
                            }}
                        />
                    </div>
                    <div className="ai-modal__actions">
                        <Btn
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </Btn>
                        <Btn
                            variant="primary"
                            size="sm"
                            onClick={onClose}
                            style={{ flex: 1 }}
                        >
                            Schedule →
                        </Btn>
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modal, document.body);
}

// ── MAIN PAGE ────────────────────────────────────────────────────────
export default function AIModels() {
    const [selectedModel, setSelectedModel] = useState(null);
    const [retrainTarget, setRetrainTarget] = useState(null);

    const avgAccuracy = (
        MODELS.reduce((a, m) => a + m.accuracy, 0) / MODELS.length
    ).toFixed(1);
    const degraded = MODELS.filter((m) => m.status === "Degraded").length;
    const totalInferences = "3.01M";

    return (
        <div className="ai-page">
            <div className="ai-header">
                <div />
                <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="ghost">📊 Model Logs</Btn>
                    <Btn variant="primary">+ Deploy Model</Btn>
                </div>
            </div>

            {/* KPIs */}
            <div className="ai-kpis">
                {[
                    {
                        label: "Avg Accuracy",
                        v: `${avgAccuracy}%`,
                        color: C.blue600,
                    },
                    {
                        label: "Total Inferences",
                        v: totalInferences,
                        color: C.teal,
                    },
                    {
                        label: "Degraded Models",
                        v: degraded,
                        color: degraded > 0 ? C.amber : C.green,
                    },
                    {
                        label: "Active Models",
                        v: MODELS.length,
                        color: C.green,
                    },
                ].map((k, i) => (
                    <div
                        key={i}
                        className="ai-kpi"
                        style={{ borderLeft: `3px solid ${k.color}` }}
                    >
                        <div
                            style={{
                                fontSize: 22,
                                fontWeight: 800,
                                color: k.color,
                            }}
                        >
                            {k.v}
                        </div>
                        <div
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: C.textSec,
                            }}
                        >
                            {k.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Degraded warning bar */}
            {degraded > 0 && (
                <div className="ai-warning-bar">
                    <span>⚠️</span>
                    <span
                        style={{
                            flex: 1,
                            fontSize: 12,
                            fontWeight: 600,
                            color: C.amber,
                        }}
                    >
                        {degraded} model{degraded > 1 ? "s are" : " is"} below
                        the accuracy threshold. Retraining is recommended.
                    </span>
                    <Btn
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                            setRetrainTarget(
                                MODELS.find((m) => m.status === "Degraded"),
                            )
                        }
                    >
                        Schedule Retraining
                    </Btn>
                </div>
            )}

            {/* Model grid — click any card to open detail modal */}
            <div className="ai-grid">
                {MODELS.map((m) => (
                    <div
                        key={m.id}
                        className="ai-card"
                        style={{
                            borderTop: `3px solid ${STATUS_COLOR(m.status)}`,
                        }}
                        onClick={() => setSelectedModel(m)}
                    >
                        <div className="ai-card__top">
                            <div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 800,
                                        color: C.text,
                                    }}
                                >
                                    {m.name}
                                </div>
                                <div
                                    style={{
                                        fontSize: 10,
                                        fontFamily: F.mono,
                                        color: C.textMuted,
                                        marginTop: 1,
                                    }}
                                >
                                    {m.id} · {m.version}
                                </div>
                            </div>
                            <Badge
                                color={STATUS_COLOR(m.status)}
                                style={{ fontSize: 9 }}
                            >
                                {m.status}
                            </Badge>
                        </div>

                        <div style={{ margin: "10px 0 8px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: 11,
                                    marginBottom: 4,
                                }}
                            >
                                <span style={{ color: C.textMuted }}>
                                    Accuracy
                                </span>
                                <span
                                    style={{
                                        fontWeight: 800,
                                        color:
                                            m.accuracy >= m.threshold
                                                ? C.green
                                                : C.red,
                                    }}
                                >
                                    {m.accuracy}%
                                </span>
                            </div>
                            <ProgressBar
                                value={m.accuracy}
                                color={
                                    m.accuracy >= m.threshold ? C.green : C.red
                                }
                                h={5}
                                bg={C.blue100}
                            />
                            {m.accuracy < m.threshold && (
                                <div
                                    style={{
                                        fontSize: 9,
                                        color: C.red,
                                        marginTop: 3,
                                    }}
                                >
                                    ⚠ Below {m.threshold}% threshold
                                </div>
                            )}
                        </div>

                        <p
                            style={{
                                fontSize: 11,
                                color: C.textSec,
                                margin: "0 0 10px",
                                lineHeight: 1.5,
                            }}
                        >
                            {m.description.length > 90
                                ? m.description.slice(0, 90) + "…"
                                : m.description}
                        </p>

                        <div
                            style={{
                                display: "flex",
                                gap: 6,
                                flexWrap: "wrap",
                            }}
                        >
                            <Badge color={C.blue500} style={{ fontSize: 9 }}>
                                {m.type}
                            </Badge>
                            <span style={{ fontSize: 10, color: C.textMuted }}>
                                {m.inferences} inferences
                            </span>
                            <span style={{ fontSize: 10, color: C.textMuted }}>
                                · {m.latency} avg
                            </span>
                        </div>

                        <div
                            style={{
                                marginTop: 10,
                                fontSize: 10,
                                color: C.textMuted,
                            }}
                        >
                            Last trained: {m.lastTrained}
                        </div>
                    </div>
                ))}
            </div>

            {/* Model detail modal — portal onto document.body */}
            {selectedModel && (
                <ModelModal
                    model={selectedModel}
                    onClose={() => setSelectedModel(null)}
                    onRetrain={(m) => setRetrainTarget(m)}
                />
            )}

            {/* Retrain modal — portal onto document.body */}
            {retrainTarget && (
                <RetrainModal
                    model={retrainTarget}
                    onClose={() => setRetrainTarget(null)}
                />
            )}
        </div>
    );
}
