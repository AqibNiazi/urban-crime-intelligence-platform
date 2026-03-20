import { useState } from "react";
import { useNLP } from "../hooks/useNLP";
import { PageHeader, ErrorAlert, Card, LoadingSpinner } from "../components/index.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";

const EXAMPLES = [
  "retail theft from store, shoplifting merchandise",
  "aggravated assault with knife on public street",
  "vehicle break-in, smashed window, items stolen",
  "possession of controlled substance, narcotics found on person",
  "armed robbery at convenience store, handgun used",
];

export default function NLPClassify() {
  const [text, setText]   = useState("");
  const { result, loading, error, classify } = useNLP();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length >= 5) classify(text.trim());
  };

  const chartData = result?.top_3?.map((item) => ({
    name:  item.crime.length > 16 ? item.crime.slice(0, 16) + "…" : item.crime,
    value: parseFloat((item.confidence * 100).toFixed(1)),
  }));

  const confidencePct = result ? Math.round(result.confidence * 100) : 0;

  return (
    <div>
      <PageHeader
        title="NLP Crime Classification"
        description="Classify a crime description into a crime category using TF-IDF vectorisation and Logistic Regression."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-medium text-white mb-4">Incident Description</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe the incident…"
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{text.length}/500 characters</span>
                <ErrorAlert message={error} />
              </div>
              <button
                type="submit"
                disabled={loading || text.trim().length < 5}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors"
              >
                {loading ? <><LoadingSpinner size="sm" /> Classifying…</> : "Classify"}
              </button>
            </form>
          </Card>

          <Card>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Example Descriptions</p>
            <div className="space-y-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setText(ex)}
                  className="w-full text-left text-xs text-gray-400 hover:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-700"
                >
                  {ex}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              <Card>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Predicted Category</p>
                <p className="text-2xl font-semibold text-blue-400 mb-3">{result.predicted_crime}</p>

                {/* Confidence bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Confidence</span>
                    <span className="text-gray-300">{confidencePct}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${confidencePct}%`,
                        background: confidencePct > 70 ? "#10b981" : confidencePct > 40 ? "#f59e0b" : "#ef4444",
                      }}
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Top 3 Classes</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 32 }}>
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip formatter={(v) => [`${v}%`, "Confidence"]} contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#10b981" : i === 1 ? "#3b82f6" : "#6366f1"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </>
          ) : (
            <Card className="flex items-center justify-center min-h-48">
              <p className="text-sm text-gray-600">
                Enter a description and click Classify to see results.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
