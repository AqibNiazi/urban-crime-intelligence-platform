import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useHealth } from "@/hooks/useHealth";

export default function AppLayout() {
  const { status } = useHealth();
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar apiStatus={status} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
