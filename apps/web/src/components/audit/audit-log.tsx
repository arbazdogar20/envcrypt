"use client";
import { formatDistanceToNow } from "date-fns";

interface AuditEntry {
  id: string;
  action: string;
  resource: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
  user?: {
    email: string;
    displayName: string;
  };
}

const ACTION_CONFIG: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  USER_REGISTER: {
    label: "Registered account",
    color: "text-blue-600 bg-blue-50",
    dot: "bg-blue-400",
  },
  USER_LOGIN: {
    label: "Logged in",
    color: "text-gray-600 bg-gray-100",
    dot: "bg-gray-400",
  },
  PROJECT_CREATED: {
    label: "Created project",
    color: "text-green-700 bg-green-50",
    dot: "bg-green-400",
  },
  PROJECT_DELETED: {
    label: "Deleted project",
    color: "text-red-600 bg-red-50",
    dot: "bg-red-400",
  },
  PROJECT_MEMBER_INVITED: {
    label: "Invited member",
    color: "text-purple-600 bg-purple-50",
    dot: "bg-purple-400",
  },
  PROJECT_MEMBER_REMOVED: {
    label: "Removed member",
    color: "text-orange-600 bg-orange-50",
    dot: "bg-orange-400",
  },
  SECRET_ACCESSED: {
    label: "Accessed secrets",
    color: "text-gray-600 bg-gray-100",
    dot: "bg-gray-300",
  },
  SECRET_CREATED: {
    label: "Created secret",
    color: "text-green-700 bg-green-50",
    dot: "bg-green-400",
  },
  SECRET_UPDATED: {
    label: "Updated secret",
    color: "text-amber-700 bg-amber-50",
    dot: "bg-amber-400",
  },
  SECRET_DELETED: {
    label: "Deleted secret",
    color: "text-red-600 bg-red-50",
    dot: "bg-red-400",
  },
  SECRET_BULK_SET: {
    label: "Bulk imported secrets",
    color: "text-blue-600 bg-blue-50",
    dot: "bg-blue-400",
  },
  UNAUTHORIZED_ACCESS_ATTEMPT: {
    label: "Unauthorized access attempt",
    color: "text-red-700 bg-red-100",
    dot: "bg-red-600",
  },
};

function getMetadataDescription(
  action: string,
  metadata?: Record<string, any>,
): string | null {
  if (!metadata) return null;

  switch (action) {
    case "SECRET_CREATED":
    case "SECRET_UPDATED":
    case "SECRET_DELETED":
      return metadata.key
        ? `Key: ${metadata.key} · Env: ${metadata.environment}`
        : null;
    case "SECRET_ACCESSED":
      return metadata.environment
        ? `Env: ${metadata.environment} · ${metadata.count} secrets`
        : null;
    case "SECRET_BULK_SET":
      return metadata.count
        ? `${metadata.count} secrets · Env: ${metadata.environment}`
        : null;
    case "PROJECT_MEMBER_INVITED":
      return metadata.inviteeEmail
        ? `${metadata.inviteeEmail} as ${metadata.role}`
        : null;
    case "PROJECT_CREATED":
      return metadata.slug ? `/${metadata.slug}` : null;
    default:
      return null;
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface AuditLogProps {
  logs: AuditEntry[];
  showUser?: boolean;
}

export function AuditLog({ logs, showUser = false }: AuditLogProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-sm">No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {logs.map((log, index) => {
        const config = ACTION_CONFIG[log.action] ?? {
          label: log.action,
          color: "text-gray-600 bg-gray-100",
          dot: "bg-gray-400",
        };
        const description = getMetadataDescription(log.action, log.metadata);
        const isLast = index === logs.length - 1;

        return (
          <div key={log.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-2 h-2 rounded-full mt-3 shrink-0 ${config.dot}`}
              />
              {!isLast && <div className="w-px flex-1 bg-gray-100 mt-1" />}
            </div>

            <div className={`pb-4 flex-1 ${isLast ? "" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {showUser && log.user && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                          <span
                            className="text-xs font-medium text-gray-600"
                            style={{ fontSize: "9px" }}
                          >
                            {getInitials(log.user.displayName)}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {log.user.displayName}
                        </span>
                      </div>
                    )}
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color}`}
                    >
                      {config.label}
                    </span>
                    {description && (
                      <span className="text-xs text-gray-400 font-mono truncate">
                        {description}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(log.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {log.ipAddress && (
                      <>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400 font-mono">
                          {log.ipAddress}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
