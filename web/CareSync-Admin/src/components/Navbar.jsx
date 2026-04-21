import { C, F, NAV_LINKS } from "../constants";
import { Avatar } from "./UI.jsx";
import "../styles/Navbar.css";

// ── NAV ITEM ───────────────────────────────────────────────────────
const NavItem = ({ n, active, setActive }) => {
    const isActive = active === n.id;
    return (
        <button
            onClick={() => setActive(n.id)}
            className={`nav-item ${isActive ? "nav-item--active" : ""}`}
        >
            {isActive && <div className="nav-item__indicator" />}
            <svg
                width={15}
                height={15}
                viewBox="0 0 24 24"
                fill="none"
                stroke={isActive ? C.blue600 : C.textMuted}
                strokeWidth={isActive ? 2 : 1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d={n.icon} />
            </svg>
            <span
                style={{
                    fontFamily: F.body,
                    fontSize: 12.5,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? C.blue700 : C.textSec,
                    flex: 1,
                    textAlign: "left",
                }}
            >
                {n.label}
            </span>
            {n.badge && (
                <div
                    className="nav-item__badge"
                    style={{ background: n.badgeColor }}
                >
                    {n.badge}
                </div>
            )}
        </button>
    );
};

// ── SIDEBAR ────────────────────────────────────────────────────────
export default function Navbar({ active, setActive, onLogout, isOpen }) {
    return (
        <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
            {/* Logo + facility */}
            <div className="sidebar__header">
                <div className="sidebar__logo">
                    <div className="sidebar__logo-icon">
                        <svg
                            width={18}
                            height={18}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth={2.2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </div>
                    <div>
                        <div className="sidebar__logo-name">CareSync</div>
                        <div className="sidebar__logo-version">
                            ADMIN v2.4.1
                        </div>
                    </div>
                </div>
                <div className="sidebar__facility">
                    <div className="sidebar__facility-dot" />
                    <span className="sidebar__facility-name">
                        Sunrise Care Center
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar__nav">
                <div className="sidebar__nav-group-label">MAIN MENU</div>
                {NAV_LINKS.slice(0, 4).map((n) => (
                    <NavItem
                        key={n.id}
                        n={n}
                        active={active}
                        setActive={setActive}
                    />
                ))}

                <div className="sidebar__nav-group-label">MANAGEMENT</div>
                {NAV_LINKS.slice(4, 8).map((n) => (
                    <NavItem
                        key={n.id}
                        n={n}
                        active={active}
                        setActive={setActive}
                    />
                ))}

                <div className="sidebar__nav-group-label">FACILITY</div>
                {NAV_LINKS.slice(8, 9).map((n) => (
                    <NavItem
                        key={n.id}
                        n={n}
                        active={active}
                        setActive={setActive}
                    />
                ))}

                <div className="sidebar__nav-group-label">SYSTEM</div>
                {NAV_LINKS.slice(9).map((n) => (
                    <NavItem
                        key={n.id}
                        n={n}
                        active={active}
                        setActive={setActive}
                    />
                ))}
            </nav>

            {/* User footer */}
            <div className="sidebar__footer">
                <div className="sidebar__user">
                    <Avatar name="Admin User" size={32} color={C.blue600} />
                    <div className="sidebar__user-info">
                        <div className="sidebar__user-name">Dr. Admin User</div>
                        <div className="sidebar__user-role">Super Admin</div>
                    </div>
                    <div className="sidebar__user-online" />
                </div>
                <button onClick={onLogout} className="sidebar__signout">
                    <span>→</span> Sign Out
                </button>
            </div>
        </div>
    );
}