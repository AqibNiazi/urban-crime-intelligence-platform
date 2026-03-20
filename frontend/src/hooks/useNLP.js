import { useState } from "react";
import { classifyNLP } from "../api/client";

export function useNLP() {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const classify = async (description) => {
    setLoading(true);
    setError(null);
    try {
      const res = await classifyNLP(description);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Classification failed");
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, classify };
}
