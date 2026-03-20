import { useEffect, useState } from "react";
import { useForecast } from "@/hooks/useForecast";
import {
  PageHeader,
  ErrorAlert,
  Card,
  LoadingSpinner,
  StatCard,
} from "@/components";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {Math.round(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function Forecast() {
  const [days, setDays]           = useState(30);
  const { data, loading, error, fetch } = useForecast();

  useEffect(() => { fetch(days); }, [days]);

  const chartData = data?.forecast?.map((row) => ({
    date:  row.date.slice(5),
    pred:  Math.round(row.predicted),
    upper: Math.round(row.upper_bound),
    lower: Math.round(row.lower_bound),
  }));

  const avg     = chartData ? Math.round(chartData.reduce((s, r) => s + r.pred, 0) / chartData.length) : null;
  const maxDay  = chartData ? chartData.reduce((a, b) => (a.pred > b.pred ? a : b), chartData[0]) : null;
  const minDay  = chartData ? chartData.reduce((a, b) => (a.pred < b.pred ? a : b), chartData[0]) : null;

  return (
    <div>
      <PageHeader
        title="Crime Forecast"
        description="Daily crime count forecast using Facebook Prophet with weekly and yearly seasonality components."
      />

      {/* Controls */}
      <Card className="mb-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-xs text-gray-500 mb-1.5">Forecast horizon</p>
            <div className="flex gap-2">
              {[7, 14, 30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    days === d
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
          {loading && <LoadingSpinner size="sm" />}
        </div>
      </Card>

      <ErrorAlert message={error} />

      {/* Stat row */}
      {avg && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Average / day" value={avg}          accent="blue"  />
          <StatCard label="Peak day"      value={maxDay?.pred} sub={maxDay?.date} accent="amber" />
          <StatCard label="Lowest day"    value={minDay?.pred} sub={minDay?.date} accent="green" />
        </div>
      )}

      {/* Chart */}
      <Card>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-5">
          Daily Crime Count — Next {days} Days
        </p>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : chartData ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} interval={Math.floor(chartData.length / 6)} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="upper" stroke="none" fill="url(#ciGrad)" name="Upper bound" />
              <Area type="monotone" dataKey="lower" stroke="none" fill="white"        fillOpacity={0}    name="Lower bound" />
              <Area type="monotone" dataKey="pred"  stroke="#3b82f6" strokeWidth={2}  fill="url(#predGrad)" name="Predicted" />
            </AreaChart>
          </ResponsiveContainer>
        ) : null}
      </Card>
    </div>
  );
}
