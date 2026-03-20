import { useState } from "react";
import { predictCrime } from "../api/client";

export function usePredict() {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const predict = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await predictCrime(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, predict };
}
