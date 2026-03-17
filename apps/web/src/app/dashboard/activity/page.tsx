"use client";
import { useState } from "react";
import { useMyAuditLogs } from "@/hooks/use-audit";
import { AuditLog } from "@/components/audit/audit-log";
import { Activity } from "lucide-react";

export default function ActivityPage() {
  const [limit, setLimit] = useState(50);
  const { data: logs, isLoading } = useMyAuditLogs(limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My activity</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Your personal audit log across all projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-gray-400" />
          <span className="text-sm text-gray-400">
            {logs?.length ?? 0} events
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {isLoading ? (
          <div className="text-sm text-gray-400 py-12 text-center">
            Loading activity...
          </div>
        ) : (
          <AuditLog logs={logs ?? []} showUser={false} />
        )}
      </div>

      {logs?.length === limit && (
        <div className="text-center mt-4">
          <button
            onClick={() => setLimit((l) => l + 50)}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
