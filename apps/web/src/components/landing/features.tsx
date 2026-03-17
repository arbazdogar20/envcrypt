import {
  ShieldCheck,
  Terminal,
  Users,
  GitBranch,
  History,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "AES-256 encrypted",
    description:
      "Every secret is encrypted at rest using AES-256-GCM. Even if your database leaks, your secrets stay safe.",
  },
  {
    icon: Terminal,
    title: "CLI first",
    description:
      "Pull secrets straight into your .env file with one command. Push your local file to sync with your team.",
  },
  {
    icon: GitBranch,
    title: "Per-environment",
    description:
      "Separate secrets for development, staging, and production. Never accidentally use a prod key locally.",
  },
  {
    icon: Users,
    title: "Team access control",
    description:
      "Invite teammates with owner, editor, or viewer roles. Control exactly who can read or modify each project.",
  },
  {
    icon: History,
    title: "Audit logs",
    description:
      "Every secret access and change is logged. Know exactly who accessed what and when.",
  },
  {
    icon: Zap,
    title: "Instant onboarding",
    description:
      "New developer joins? They run one command and have everything they need. No more Slack hunts.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            Everything your team needs
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Built for small teams and solo developers who want security without
            the enterprise complexity.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <f.icon size={15} className="text-gray-700" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
