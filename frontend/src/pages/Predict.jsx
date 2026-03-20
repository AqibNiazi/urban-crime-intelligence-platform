import { useState } from "react";
import { usePredict } from "../hooks/usePredict";
import { PageHeader, ErrorAlert, Card, LoadingSpinner } from "../components/index.jsx";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const SEASONS  = ["Winter", "Spring", "Summer", "Fall"];
const DAYS     = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const defaultForm = {
  latitude:    "41.8781",
  longitude:   "-87.6298",
  hour:        "14",
  month:       "7",
  day_of_week: "2",
  is_weekend:  "0",
  season:      "2",
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors";
const selectCls = inputCls;

export default function Predict() {
  const [form, setForm] = useState(defaultForm);
  const { result, loading, error, predict } = usePredict();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    predict({
      latitude:    parseFloat(form.latitude),
      longitude:   parseFloat(form.longitude),
      hour:        parseInt(form.hour),
      month:       parseInt(form.month),
      day_of_week: parseInt(form.day_of_week),
      is_weekend:  parseInt(form.is_weekend),
      season:      parseInt(form.season),
    });
  };

  const chartData = result?.top_3?.map((item) => ({
    name:  item.crime.length > 14 ? item.crime.slice(0, 14) + "…" : item.crime,
    value: parseFloat((item.probability * 100).toFixed(1)),
  }));

  return (
    <div>
      <PageHeader
        title="Crime Prediction"
        description="Predict the most likely crime type for a given location and time using the trained XGBoost model."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <h2 className="text-sm font-medium text-white mb-5">Input Features</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude">
                <input className={inputCls} value={form.latitude} onChange={set("latitude")} placeholder="41.8781" />
              </Field>
              <Field label="Longitude">
                <input className={inputCls} value={form.longitude} onChange={set("longitude")} placeholder="-87.6298" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Hour (0–23)">
                <input type="number" min="0" max="23" className={inputCls} value={form.hour} onChange={set("hour")} />
              </Field>
              <Field label="Month (1–12)">
                <input type="number" min="1" max="12" className={inputCls} value={form.month} onChange={set("month")} />
              </Field>
            </div>

            <Field label="Day of Week">
              <select className={selectCls} value={form.day_of_week} onChange={set("day_of_week")}>
                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Season">
                <select className={selectCls} value={form.season} onChange={set("season")}>
                  {SEASONS.map((s, i) => <option key={i} value={i}>{s}</option>)}
                </select>
              </Field>
              <Field label="Weekend?">
                <select className={selectCls} value={form.is_weekend} onChange={set("is_weekend")}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </Field>
            </div>

            <ErrorAlert message={error} />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors"
            >
              {loading ? <><LoadingSpinner size="sm" /> Predicting…</> : "Run Prediction"}
            </button>
          </form>
        </Card>

        {/* Result */}
        <div className="space-y-4">
          {result ? (
            <>
              <Card>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Predicted Crime</p>
                <p className="text-2xl font-semibold text-blue-400">{result.predicted_crime}</p>
              </Card>

              <Card>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Top 3 Probabilities</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 32 }}>
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip formatter={(v) => [`${v}%`, "Probability"]} contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#3b82f6" : i === 1 ? "#6366f1" : "#8b5cf6"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-48">
              <p className="text-sm text-gray-600">
                Fill in the form and run a prediction to see results.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
