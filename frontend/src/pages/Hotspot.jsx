import { useState } from "react";
import { useHotspot } from "../hooks/useHotspot";
import { PageHeader, ErrorAlert, Card, LoadingSpinner, RiskBadge } from "../components/index.jsx";
import { MapPin, Navigation } from "lucide-react";

const CHICAGO_LOCATIONS = [
  { name: "The Loop",         lat: 41.8827, lon: -87.6233 },
  { name: "Wicker Park",      lat: 41.9089, lon: -87.6776 },
  { name: "South Side",       lat: 41.7943, lon: -87.6023 },
  { name: "Humboldt Park",    lat: 41.9000, lon: -87.7230 },
  { name: "Hyde Park",        lat: 41.7943, lon: -87.5908 },
  { name: "Logan Square",     lat: 41.9206, lon: -87.7032 },
];

export default function Hotspot() {
  const [lat, setLat] = useState("41.8781");
  const [lon, setLon] = useState("-87.6298");
  const { result, loading, error, lookup } = useHotspot();

  const handleSubmit = (e) => {
    e.preventDefault();
    lookup(parseFloat(lat), parseFloat(lon));
  };

  const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors";

  return (
    <div>
      <PageHeader
        title="Hotspot Detection"
        description="Identify the crime cluster for any Chicago coordinate using the trained K-Means model."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-medium text-white mb-5">Coordinates</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Latitude</label>
                  <input className={inputCls} value={lat} onChange={(e) => setLat(e.target.value)} placeholder="41.8781" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Longitude</label>
                  <input className={inputCls} value={lon} onChange={(e) => setLon(e.target.value)} placeholder="-87.6298" />
                </div>
              </div>

              <ErrorAlert message={error} />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors"
              >
                {loading
                  ? <><LoadingSpinner size="sm" /> Looking up…</>
                  : <><Navigation size={14} /> Look up Hotspot</>
                }
              </button>
            </form>
          </Card>

          {/* Preset locations */}
          <Card>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Chicago Neighbourhoods</p>
            <div className="grid grid-cols-2 gap-2">
              {CHICAGO_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => { setLat(String(loc.lat)); setLon(String(loc.lon)); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-left transition-colors border border-gray-700 hover:border-gray-600"
                >
                  <MapPin size={12} className="text-blue-400 shrink-0" />
                  <span className="text-xs text-gray-300">{loc.name}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {result ? (
            <>
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cluster</p>
                    <p className="text-3xl font-semibold text-white">#{result.cluster_id}</p>
                  </div>
                  <RiskBadge level={result.risk_level} />
                </div>
                <div className="h-px bg-gray-800 my-4" />
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Distance to centre</span>
                    <span className="text-gray-200 font-medium">{result.distance_km} km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cluster centre (lat)</span>
                    <span className="text-gray-200 font-mono text-xs">{result.cluster_center.latitude}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cluster centre (lon)</span>
                    <span className="text-gray-200 font-mono text-xs">{result.cluster_center.longitude}</span>
                  </div>
                </div>
              </Card>

              {/* Risk explanation */}
              <Card>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Risk Thresholds</p>
                <div className="space-y-2">
                  {[
                    { level: "high",   range: "< 0.5 km from cluster centre",    color: "bg-red-500"     },
                    { level: "medium", range: "0.5 – 1.5 km from cluster centre", color: "bg-amber-500"   },
                    { level: "low",    range: "≥ 1.5 km from cluster centre",    color: "bg-emerald-500" },
                  ].map((r) => (
                    <div key={r.level} className="flex items-center gap-3 text-xs">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${r.color}`} />
                      <span className="text-gray-400 capitalize w-14">{r.level}</span>
                      <span className="text-gray-600">{r.range}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="flex items-center justify-center min-h-48">
              <p className="text-sm text-gray-600">
                Enter coordinates or pick a neighbourhood to see hotspot data.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
