import { useState, useCallback } from "react";
import { getForecast } from "../api/client";

export function useForecast() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async (days = 30) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getForecast(days);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Forecast failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetch };
}
