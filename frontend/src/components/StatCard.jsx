import clsx from "clsx";
function StatCard({ label, value, sub, accent = "blue" }) {
  const accents = {
    blue: "text-blue-400",
    green: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
    purple: "text-purple-400",
  };
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className={clsx("text-2xl font-semibold", accents[accent])}>{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}
export default StatCard;
