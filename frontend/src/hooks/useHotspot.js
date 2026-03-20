import { useState } from "react";
import { getHotspot } from "../api/client";

export function useHotspot() {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const lookup = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getHotspot(lat, lon);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Hotspot lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, lookup };
}
