import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  FileText,
  TrendingUp,
  AlertTriangle,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/predict", label: "Predict", icon: AlertTriangle },
  { to: "/nlp", label: "NLP Classify", icon: FileText },
  { to: "/forecast", label: "Forecast", icon: TrendingUp },
  { to: "/hotspot", label: "Hotspot", icon: MapPin },
];

export default function Sidebar({ apiStatus }) {
  const [collapsed, setCollapsed] = useState(false);
  const online = apiStatus?.status === "ok";

  return (
    <aside
      className={clsx(
        "relative shrink-0 h-screen sticky top-0 flex flex-col bg-gray-950 border-r border-gray-800 transition-all duration-300 ease-in-out",
        collapsed ? "w-[60px]" : "w-64",
      )}
    >
      {/* Collapse toggle button — sits on the right edge */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shadow-md"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div
        className={clsx(
          "border-b border-gray-800 transition-all duration-300",
          collapsed ? "px-3 py-5" : "px-6 py-5",
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Activity size={16} className="text-white" />
          </div>
          {/* Hide text when collapsed */}
          <div
            className={clsx(
              "transition-all duration-200 overflow-hidden whitespace-nowrap",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            <p className="text-sm font-semibold text-white leading-none">
              CrimeSense
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Crime Intelligence</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav
        className={clsx(
          "flex-1 py-4 space-y-0.5 transition-all duration-300",
          collapsed ? "px-2" : "px-3",
        )}
      >
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors overflow-hidden",
                collapsed ? "justify-center px-0" : "",
                isActive
                  ? "bg-blue-600/20 text-blue-400 font-medium"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200",
              )
            }
          >
            <Icon size={16} className="shrink-0" />
            <span
              className={clsx(
                "transition-all duration-200 whitespace-nowrap overflow-hidden",
                collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
              )}
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* API status */}
      <div
        className={clsx(
          "border-t border-gray-800 transition-all duration-300",
          collapsed ? "px-2 py-4" : "px-4 py-4",
        )}
      >
        {collapsed ? (
          // Collapsed: just the dot centered
          <div
            className="flex justify-center"
            title={`API ${online ? "Connected" : "Offline"} — localhost:5000`}
          >
            <span
              className={clsx(
                "w-2.5 h-2.5 rounded-full",
                online ? "bg-emerald-400 animate-pulse" : "bg-red-500",
              )}
            />
          </div>
        ) : (
          // Expanded: full status card
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-900">
            <span
              className={clsx(
                "w-2 h-2 rounded-full shrink-0",
                online ? "bg-emerald-400 animate-pulse" : "bg-red-500",
              )}
            />
            <div>
              <p className="text-xs font-medium text-gray-300">
                API {online ? "Connected" : "Offline"}
              </p>
              <p className="text-xs text-gray-600">
                {online ? "crime-analytics-api" : "API unreachable"}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
