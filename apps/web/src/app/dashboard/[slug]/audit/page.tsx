"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useProjectAuditLogs } from "@/hooks/use-audit";
import { AuditLog } from "@/components/audit/audit-log";
import { Shield } from "lucide-react";

const ACTION_FILTERS = [
  { label: "All", value: "" },
  { label: "Secrets", value: "SECRET" },
  { label: "Members", value: "PROJECT_MEMBER" },
  { label: "Auth", value: "USER" },
];

export default function ProjectAuditPage() {
  const { slug } = useParams<{ slug: string }>();
  const [limit, setLimit] = useState(100);
  const [filter, setFilter] = useState("");
  const { data: logs, isLoading } = useProjectAuditLogs(slug, limit);

  const filtered =
    logs?.filter((log: any) =>
      filter ? log.action.startsWith(filter) : true,
    ) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Audit log</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Every action taken in this project by all members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-gray-400" />
          <span className="text-sm text-gray-400">
            {filtered.length} events
          </span>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        {ACTION_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              filter === f.value
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {isLoading ? (
          <div className="text-sm text-gray-400 py-12 text-center">
            Loading audit log...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No events match this filter.</p>
          </div>
        ) : (
          <AuditLog logs={filtered} showUser={true} />
        )}
      </div>

      {logs?.length === limit && (
        <div className="text-center mt-4">
          <button
            onClick={() => setLimit((l) => l + 100)}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
