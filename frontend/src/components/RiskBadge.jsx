import clsx from "clsx";
function RiskBadge({ level }) {
  const styles = {
    high: "bg-red-500/15 text-red-400 border-red-500/30",
    medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };
  return (
    <span
      className={clsx(
        "px-2.5 py-1 text-xs font-medium rounded-full border",
        styles[level],
      )}
    >
      {level?.toUpperCase()} RISK
    </span>
  );
}

export default RiskBadge;
