import { useHealth } from "../hooks/useHealth";
import { StatCard, Card, LoadingSpinner } from "../components/index.jsx";
import { Activity, CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";

const MODEL_LABELS = {
  xgb_model:        "XGBoost Classifier",
  nlp_model:        "NLP Logistic Regression",
  tfidf_vectorizer: "TF-IDF Vectorizer",
  prophet_model:    "Prophet Forecaster",
  kmeans_model:     "K-Means Clustering",
};

export default function Dashboard() {
  const { status, loading } = useHealth();
  const online = status?.status === "ok";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          System overview — Chicago crime analytics platform
        </p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Models"      value="5"            sub="Trained on Chicago dataset" accent="blue"   />
        <StatCard label="API Status"  value={online ? "Online" : "Offline"} sub="localhost:5000"  accent={online ? "green" : "red"} />
        <StatCard label="Crime Types" value="30+"          sub="Classification classes"     accent="purple" />
        <StatCard label="Dataset"     value="300k"         sub="Training samples"           accent="amber"  />
      </div>

      {/* Model health */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-5">
          <Activity size={18} className="text-blue-400" />
          <h2 className="text-sm font-medium text-white">Model Registry</h2>
          {loading && <LoadingSpinner size="sm" />}
        </div>

        {status?.models ? (
          <div className="space-y-2">
            {Object.entries(status.models).map(([key, loaded]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-800/50"
              >
                <span className="text-sm text-gray-300">
                  {MODEL_LABELS[key] || key}
                </span>
                <div className="flex items-center gap-2">
                  {loaded ? (
                    <>
                      <CheckCircle size={14} className="text-emerald-400" />
                      <span className="text-xs text-emerald-400">Loaded</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={14} className="text-red-400" />
                      <span className="text-xs text-red-400">Missing</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-sm text-gray-600">
              Cannot reach the Flask API. Make sure it's running on localhost:5000.
            </p>
          )
        )}
      </Card>

      {/* Quick guide */}
      <Card>
        <h2 className="text-sm font-medium text-white mb-4">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Crime Prediction",   desc: "XGBoost model — predict crime type from location and time" },
            { title: "NLP Classification", desc: "TF-IDF pipeline — classify from incident description text" },
            { title: "Crime Forecast",     desc: "Prophet model — 30-day daily crime count forecast" },
            { title: "Hotspot Detection",  desc: "K-Means clustering — risk level for any Chicago coordinate" },
          ].map((f) => (
            <div key={f.title} className="p-3 rounded-lg border border-gray-800 bg-gray-800/30">
              <p className="text-sm font-medium text-gray-200 mb-0.5">{f.title}</p>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
