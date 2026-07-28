"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LiveTelemetryFeed() {
  const [logs, setLogs] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch of recent network telemetry
    const fetchTelemetry = async () => {
      const { data } = await supabase
        .from("ops_network_traces")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(10);
      if (data) {
        setLogs(data);
      }
    };

    fetchTelemetry();

    // Subscribe to new telemetry events
    const subscription = supabase
      .channel("network_telemetry_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ops_network_traces",
        },
        (payload: any) => {
          setLogs((prev) => [payload.new, ...prev].slice(0, 10));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase]);

  if (logs.length === 0) {
    return (
      <div className="pt-2 flex items-center gap-2 text-[#44444A]">
        <span className="w-2 h-2 bg-[#E50914] animate-pulse" />
        Awaiting input stream...
      </div>
    );
  }

  return (
    <div className="space-y-3 font-mono text-[0.65rem]">
      {logs.map((log) => (
        <div key={log.id} className="flex gap-4">
          <div className="w-24 shrink-0 opacity-50">
            {new Date(log.timestamp)
              .toISOString()
              .split("T")[1]
              .substring(0, 12)}
          </div>
          <div
            className={`w-16 shrink-0 font-bold ${
              log.severity === "CRITICAL"
                ? "text-[#E50914]"
                : log.severity === "WARNING"
                  ? "text-[#FFB020]"
                  : "text-[#27D17F]"
            }`}
          >
            [{log.method}]
          </div>
          <div className="text-white truncate flex-1">{log.endpoint}</div>
          <div className="w-24 shrink-0 text-right opacity-50 truncate">
            {log.ip_address}
          </div>
        </div>
      ))}
    </div>
  );
}
