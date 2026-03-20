import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, MapPin, FileText, TrendingUp, AlertTriangle, Activity,
} from "lucide-react";
import clsx from "clsx";

const links = [
  { to: "/",         label: "Dashboard",   icon: LayoutDashboard },
  { to: "/predict",  label: "Predict",     icon: AlertTriangle   },
  { to: "/nlp",      label: "NLP Classify",icon: FileText        },
  { to: "/forecast", label: "Forecast",    icon: TrendingUp      },
  { to: "/hotspot",  label: "Hotspot",     icon: MapPin          },
];

export default function Sidebar({ apiStatus }) {
  const online = apiStatus?.status === "ok";

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-gray-950 border-r border-gray-800">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Activity size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">CrimeIQ</p>
            <p className="text-xs text-gray-500 mt-0.5">Analytics Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-blue-600/20 text-blue-400 font-medium"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* API status indicator */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-900">
          <span
            className={clsx(
              "w-2 h-2 rounded-full shrink-0",
              online ? "bg-emerald-400 animate-pulse" : "bg-red-500"
            )}
          />
          <div>
            <p className="text-xs font-medium text-gray-300">
              API {online ? "Connected" : "Offline"}
            </p>
            <p className="text-xs text-gray-600">localhost:5000</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
