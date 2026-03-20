import clsx from "clsx";

export function StatCard({ label, value, sub, accent = "blue" }) {
  const accents = {
    blue:   "text-blue-400",
    green:  "text-emerald-400",
    amber:  "text-amber-400",
    red:    "text-red-400",
    purple: "text-purple-400",
  };
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <p className={clsx("text-2xl font-semibold", accents[accent])}>{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}

export function RiskBadge({ level }) {
  const styles = {
    high:   "bg-red-500/15 text-red-400 border-red-500/30",
    medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    low:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };
  return (
    <span className={clsx("px-2.5 py-1 text-xs font-medium rounded-full border", styles[level])}>
      {level?.toUpperCase()} RISK
    </span>
  );
}

export function LoadingSpinner({ size = "md" }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <div className={clsx("border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin", sizes[size])} />
  );
}

export function PageHeader({ title, description }) {
  return (
    <div className="mb-8">
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
}

export function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
      <span className="mt-0.5 shrink-0">⚠</span>
      <p>{message}</p>
    </div>
  );
}

export function Card({ children, className }) {
  return (
    <div className={clsx("bg-gray-900 border border-gray-800 rounded-xl p-6", className)}>
      {children}
    </div>
  );
}
