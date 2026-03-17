"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useSecrets, useSetSecret, useDeleteSecret } from "@/hooks/use-secrets";
import {
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Copy,
  Check,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";

const ENVIRONMENTS = ["development", "staging", "production"];

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const [env, setEnv] = useState("development");
  const [showValues, setShowValues] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { data: secrets, isLoading } = useSecrets(slug, env);
  const setSecret = useSetSecret(slug, env);
  const deleteSecret = useDeleteSecret(slug, env);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setSecret.mutate(
      { key: key.toUpperCase(), value },
      {
        onSuccess: () => {
          setKey("");
          setValue("");
          setShowForm(false);
        },
      },
    );
  };

  const handleCopy = (val: string, k: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(k);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 capitalize">
            {slug}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Environment variables</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/${slug}/members`}
            className="flex items-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users size={14} />
            Members
          </Link>
          {/* ✅ AUDIT LOG BUTTON — added here */}
          <Link
            href={`/dashboard/${slug}/audit`}
            className="flex items-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Shield size={14} />
            Audit log
          </Link>

          <button
            onClick={() => setShowValues(!showValues)}
            className="flex items-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showValues ? <EyeOff size={14} /> : <Eye size={14} />}
            {showValues ? "Hide" : "Reveal"} values
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={14} />
            Add secret
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        {ENVIRONMENTS.map((e) => (
          <button
            key={e}
            onClick={() => setEnv(e)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors capitalize ${
              env === e
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-gray-200 rounded-xl p-4 mb-4"
        >
          <p className="text-sm font-medium text-gray-900 mb-3">Add secret</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Key</label>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="DATABASE_URL"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Value</label>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="postgresql://..."
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={setSecret.isPending}
              className="bg-gray-900 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {setSecret.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-sm text-gray-400 py-12 text-center">
          Loading secrets...
        </div>
      ) : secrets?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No secrets in {env} yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">
                  Key
                </th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">
                  Value
                </th>
                <th className="w-16" />
              </tr>
            </thead>
            <tbody>
              {secrets?.map((secret: any) => (
                <tr
                  key={secret.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-900 font-medium">
                    {secret.key}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-500 max-w-xs truncate">
                    {showValues ? secret.value : "••••••••••••"}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleCopy(secret.value, secret.key)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        {copiedKey === secret.key ? (
                          <Check size={13} className="text-green-500" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${secret.key}?`))
                            deleteSecret.mutate(secret.key);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
