import { useState, useEffect } from "react";
import { checkHealth } from "../api/client";

export function useHealth() {
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth()
      .then((res) => setStatus(res.data))
      .catch(() => setStatus({ status: "unreachable" }))
      .finally(() => setLoading(false));
  }, []);

  return { status, loading };
}
