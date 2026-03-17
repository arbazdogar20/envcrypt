"use client";
import { useState } from "react";
import { useInviteMember } from "@/hooks/use-projects";
import { X } from "lucide-react";

interface InviteModalProps {
  slug: string;
  onClose: () => void;
}

const ROLES = [
  {
    value: "VIEWER",
    label: "Viewer",
    description: "Can read secrets, cannot modify anything",
  },
  {
    value: "EDITOR",
    label: "Editor",
    description: "Can create, update and delete secrets",
  },
  {
    value: "OWNER",
    label: "Owner",
    description: "Full access including member management",
  },
];

export function InviteModal({ slug, onClose }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("VIEWER");
  const invite = useInviteMember(slug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    invite.mutate(
      { email, role },
      {
        onSuccess: () => {
          setEmail("");
          setRole("VIEWER");
          onClose();
        },
      },
    );
  };

  return (
    <div
      style={{
        minHeight: "320px",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="fixed inset-0 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Invite team member
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              They must already have an Envcrypt account
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="teammate@company.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Role
            </label>
            <div className="space-y-2">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    role === r.value
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {r.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {r.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={invite.isPending}
              className="flex-1 bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors font-medium"
            >
              {invite.isPending ? "Inviting..." : "Send invite"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 text-sm py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
