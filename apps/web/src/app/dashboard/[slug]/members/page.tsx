"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useProject, useRemoveMember } from "@/hooks/use-projects";
import { useAuthStore } from "@/store/auth.store";
import { useConfirm } from "@/hooks/use-confirm";
import { InviteModal } from "@/components/members/invite-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { UserPlus, Trash2, Crown, Pencil, Eye } from "lucide-react";

const ROLE_CONFIG = {
  OWNER: {
    label: "Owner",
    icon: Crown,
    color: "text-amber-700 bg-amber-50",
  },
  EDITOR: {
    label: "Editor",
    icon: Pencil,
    color: "text-blue-700 bg-blue-50",
  },
  VIEWER: {
    label: "Viewer",
    icon: Eye,
    color: "text-gray-600 bg-gray-100",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-purple-100 text-purple-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
];

function getAvatarColor(email: string): string {
  const index =
    email.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function MembersPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug);
  const removeMember = useRemoveMember(slug);
  const { user } = useAuthStore();
  const [showInvite, setShowInvite] = useState(false);
  const { confirm, dialogProps } = useConfirm();

  const currentMember = project?.members?.find(
    (m: any) => m.user.id === user?.id,
  );
  const isOwnerOrEditor =
    currentMember?.role === "OWNER" || currentMember?.role === "EDITOR";
  const isOwner = currentMember?.role === "OWNER";

  const handleRemoveMember = async (member: any) => {
    const ok = await confirm({
      title: "Remove member",
      message: `Remove ${member.user.displayName} (${member.user.email}) from this project? They will lose access to all secrets immediately.`,
      confirmLabel: "Remove member",
      variant: "danger",
    });
    if (ok) removeMember.mutate(member.user.id);
  };

  const handleLeaveProject = async () => {
    const ok = await confirm({
      title: "Leave project",
      message:
        "You will lose access to all secrets in this project. This cannot be undone.",
      confirmLabel: "Leave project",
      variant: "danger",
    });
    if (ok) removeMember.mutate(user?.id ?? "");
  };

  if (isLoading) {
    return (
      <div className="text-sm text-gray-400 py-12 text-center">
        Loading members...
      </div>
    );
  }

  return (
    <>
      {showInvite && (
        <InviteModal slug={slug} onClose={() => setShowInvite(false)} />
      )}

      {dialogProps.isOpen && (
        <ConfirmDialog
          title={dialogProps.title}
          message={dialogProps.message}
          confirmLabel={dialogProps.confirmLabel}
          cancelLabel={dialogProps.cancelLabel}
          variant={dialogProps.variant}
          isLoading={dialogProps.isLoading}
          onConfirm={dialogProps.onConfirm}
          onCancel={dialogProps.onCancel}
        />
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Team members
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {project?.members?.length ?? 0} member
              {project?.members?.length !== 1 ? "s" : ""} in this project
            </p>
          </div>
          {isOwnerOrEditor && (
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <UserPlus size={14} />
              Invite member
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {Object.entries(ROLE_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div
                key={key}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${config.color}`}
                  >
                    <Icon size={11} />
                    {config.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {key === "OWNER" &&
                    "Full access. Can manage members, secrets, and delete the project."}
                  {key === "EDITOR" &&
                    "Can create, update, and delete secrets. Cannot manage members."}
                  {key === "VIEWER" &&
                    "Read-only access. Can view and copy secrets but not modify them."}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Members
            </p>
          </div>

          <div className="divide-y divide-gray-50">
            {project?.members?.map((member: any) => {
              const config =
                ROLE_CONFIG[member.role as keyof typeof ROLE_CONFIG];
              const Icon = config.icon;
              const avatarColor = getAvatarColor(member.user.email);
              const isCurrentUser = member.user.id === user?.id;
              const canRemove = isOwner && !isCurrentUser;

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${avatarColor}`}
                    >
                      {getInitials(member.user.displayName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {member.user.displayName}
                        </p>
                        {isCurrentUser && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            you
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {member.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}
                    >
                      <Icon size={11} />
                      {config.label}
                    </span>

                    {canRemove && (
                      <button
                        onClick={() => handleRemoveMember(member)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        title="Remove member"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!isOwner && (
          <div className="mt-6 p-4 border border-red-100 rounded-xl bg-red-50">
            <p className="text-sm font-medium text-red-700 mb-1">
              Leave project
            </p>
            <p className="text-xs text-red-500 mb-3">
              You will lose access to all secrets in this project.
            </p>
            <button
              onClick={handleLeaveProject}
              className="text-sm text-red-600 font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
            >
              Leave project
            </button>
          </div>
        )}
      </div>
    </>
  );
}
