import { useState, useCallback } from "react";
import { predict } from "@/services/api.js";
import { getRandomSample } from "@/util/featureGroups";
import { toast } from "react-toastify"; 

export function usePrediction() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runPrediction = useCallback(async (features) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await predict(features);
      setResult(res.data.data);
      toast.success("Prediction complete");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Failed to connect to the server. Is the backend running?";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Picks a random case from the local dataset — no API call needed.
  // Pass type = 'benign' | 'malignant' | 'any'
  const loadSample = useCallback((type = "any") => {
    const sample = getRandomSample(type);
    toast.success(`Loaded random ${sample.label} sample (ID: ${sample.id})`, {
      icon: sample.label === "Benign" ? "🟢" : "🔴",
    });
    return sample.data;
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, runPrediction, loadSample, reset };
}
