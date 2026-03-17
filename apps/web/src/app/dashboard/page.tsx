"use client";
import { useState } from "react";
import {
  useProjects,
  useCreateProject,
  useDeleteProject,
} from "@/hooks/use-projects";
import Link from "next/link";
import { Plus, Trash2, ChevronRight, FolderLock } from "lucide-react";

import { useMyAuditLogs } from "@/hooks/use-audit";
import { AuditLog } from "@/components/audit/audit-log";

export default function DashboardPage() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate(
      { name, slug },
      {
        onSuccess: () => {
          setName("");
          setSlug("");
          setShowForm(false);
        },
      },
    );
  };

  const { data: recentLogs } = useMyAuditLogs(5);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    );
  };

  if (isLoading) {
    return (
      <div className="text-sm text-gray-400 py-12 text-center">
        Loading projects...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your environment variables
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={14} />
          New project
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-gray-200 rounded-xl p-4 mb-4"
        >
          <p className="text-sm font-medium text-gray-900 mb-3">New project</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="My App"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="my-app"
                required
                pattern="[a-z0-9-]+"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createProject.isPending}
              className="bg-gray-900 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {createProject.isPending ? "Creating..." : "Create"}
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
      {projects?.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <FolderLock size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No projects yet. Create your first one.</p>
        </div>
      )}
      <div className="space-y-2">
        {projects?.map((project: any) => (
          <div
            key={project.id}
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:border-gray-300 transition-colors"
          >
            <Link
              href={`/dashboard/${project.slug}`}
              className="flex items-center gap-3 flex-1"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {project.name}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-400">
                    {project._count.secrets} secrets
                  </span>
                  <span className="text-gray-200">·</span>
                  <Link
                    href={`/dashboard/${project.slug}/members`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {project.members.length} member
                    {project.members.length !== 1 ? "s" : ""}
                  </Link>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm(`Delete ${project.name}?`))
                    deleteProject.mutate(project.slug);
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
              <ChevronRight size={14} className="text-gray-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Add this section at the bottom of the return, after the projects list */}
      {recentLogs && recentLogs.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-900">
              Recent activity
            </h2>
            <Link
              href="/dashboard/activity"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <AuditLog logs={recentLogs} showUser={false} />
          </div>
        </div>
      )}
    </div>
  );
}
