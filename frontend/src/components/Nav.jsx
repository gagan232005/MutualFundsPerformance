import React from "react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
    {
        to: "/",
        label: "Dashboard",
        icon: (
            <svg viewBox="0 0 24 24">
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
            </svg>
        ),
    },
    {
        to: "/analytics",
        label: "Analytics",
        icon: (
            <svg viewBox="0 0 24 24">
                <path d="M4 19V5" />
                <path d="M4 19h16" />
                <path d="M7 15l4-5 3 3 5-7" />
            </svg>
        ),
    },
    {
        to: "/prediction",
        label: "Prediction",
        icon: (
            <svg viewBox="0 0 24 24">
                <path d="M4 18l6-6 4 3 6-8" />
                <path d="M16 7h4v4" />
            </svg>
        ),
    },
    {
        to: "/model-comparison",
        label: "Model Comparison",
        icon: (
            <svg viewBox="0 0 24 24">
                <rect
                    x="5"
                    y="3"
                    width="14"
                    height="18"
                    rx="2"
                />
                <path d="M8 8h8" />
                <path d="M8 12h5" />
                <path d="M8 16h8" />
            </svg>
        ),
    },
    {
        to: "/sip-calculator",
        label: "SIP Calculator",
        icon: (
            <svg viewBox="0 0 24 24">
                <rect
                    x="5"
                    y="3"
                    width="14"
                    height="18"
                    rx="2"
                />
                <path d="M8 7h8" />
                <path d="M8 11h2" />
                <path d="M14 11h2" />
                <path d="M8 15h2" />
                <path d="M14 15h2" />
            </svg>
        ),
    },
    {
        to: "/understanding-models",
        label: "Models",
        icon: (
            <svg viewBox="0 0 24 24">
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />
                <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 3.5" />
                <path d="M12 16h.01" />
            </svg>
        ),
    },
    {
        to: "/about",
        label: "About",
        icon: (
            <svg viewBox="0 0 24 24">
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />
                <path d="M12 10v6" />
                <path d="M12 7h.01" />
            </svg>
        ),
    },
];

export default function Nav() {
    return (
        <nav className="main-nav">

            <div className="nav-links">

                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                            `nav-item ${
                                isActive
                                    ? "nav-item-active"
                                    : ""
                            }`
                        }
                    >

            <span className="nav-icon">
              {item.icon}
            </span>

                        <span>
              {item.label}
            </span>

                    </NavLink>
                ))}

            </div>

        </nav>
    );
}