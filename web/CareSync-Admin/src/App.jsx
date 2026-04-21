import { useState, useEffect } from "react";
import { PAGE_TITLE, PAGE_SUB } from "./constants";

// Components
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Residents from "./components/Residents";
import AlertsIncidents from "./components/AlertsIncidents";
import LiveFloorPlan from "./components/LiveFloorPlan";
import StaffCaregivers from "./components/StaffCaregivers";
import FamilyAccounts from "./components/FamilyAccounts";
import IoTDevices from "./components/IoTDevices";
import ReportsAnalytics from "./components/ReportsAnalytics";
import AiModels from "./components/AiModels";
import Settings from "./components/Settings";
import BuildingModel from "./components/BuildingModel";

// Styles
import "./App.css";

// ── TOP BAR ────────────────────────────────────────────────────────
function TopBar({ title, sub, onMenuToggle, sidebarOpen }) {
    const [timeStr, setTimeStr] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formatted = now.toLocaleString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
            setTimeStr(formatted);
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Hamburger — only visible on mobile via CSS */}
                <button
                    className={`topbar__hamburger${sidebarOpen ? " topbar__hamburger--open" : ""}`}
                    onClick={onMenuToggle}
                    aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                >
                    <span /><span /><span />
                </button>
                <div className="topbar__left">
                    <div className="topbar__title">{title}</div>
                    <div className="topbar__sub">{sub}</div>
                </div>
            </div>
            <div className="topbar__right">
                <div className="topbar__time">
                    <div className="topbar__time-dot" />
                    <span className="topbar__time-text">{timeStr}</span>
                </div>
                <div className="topbar__avatar">AU</div>
            </div>
        </div>
    );
}

// ── APP ────────────────────────────────────────────────────────────
export default function App() {
    const [screen, setScreen] = useState("login");
    const [page, setPage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const closeSidebar = () => setSidebarOpen(false);

    const handleSetPage = (p) => {
        setPage(p);
        closeSidebar(); // auto-close sidebar on mobile after nav
    };

    const PAGE_MAP = {
        dashboard: <Dashboard />,
        alerts:    <AlertsIncidents />,
        floorplan: <LiveFloorPlan />,
        residents: <Residents />,
        staff:     <StaffCaregivers />,
        family:    <FamilyAccounts />,
        devices:   <IoTDevices />,
        reports:   <ReportsAnalytics />,
        ai:        <AiModels />,
        settings:  <Settings />,
        building:  <BuildingModel />,
    };

    // ── AUTH SCREENS ────────────────────────────────────────────────
    if (screen === "login") {
        return (
            <Login
                onLogin={() => setScreen("app")}
                onForgotPassword={() => setScreen("forgot")}
                onRegister={() => setScreen("register")}
            />
        );
    }

    if (screen === "forgot") {
        return <ForgotPassword onBack={() => setScreen("login")} />;
    }

    if (screen === "register") {
        return (
            <Register
                onRegister={() => setScreen("login")}
                onBack={() => setScreen("login")}
            />
        );
    }

    // ── MAIN APP ────────────────────────────────────────────────────
    return (
        <div className="app-layout">
            {/* Sidebar overlay — tapping it closes the sidebar on mobile */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? "sidebar-overlay--open" : ""}`}
                onClick={closeSidebar}
            />

            <Navbar
                active={page}
                setActive={handleSetPage}
                onLogout={() => setScreen("login")}
                isOpen={sidebarOpen}
            />

            <div className="app-main">
                <TopBar
                    title={PAGE_TITLE[page]}
                    sub={PAGE_SUB[page]}
                    onMenuToggle={() => setSidebarOpen((p) => !p)}
                    sidebarOpen={sidebarOpen}
                />
                <div className="app-content">{PAGE_MAP[page]}</div>
            </div>
        </div>
    );
}