import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    description: "Perfect for solo projects",
    features: [
      "1 project",
      "3 environments",
      "CLI access",
      "AES-256 encryption",
      "1 user",
    ],
    cta: "Get started",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Indie",
    price: "€7",
    period: "per month",
    description: "For serious solo developers",
    features: [
      "5 projects",
      "All environments",
      "CLI access",
      "AES-256 encryption",
      "1 user",
      "Custom domain",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Team",
    price: "€19",
    period: "per month",
    description: "For growing teams",
    features: [
      "Unlimited projects",
      "All environments",
      "CLI access",
      "AES-256 encryption",
      "Up to 5 users",
      "Custom domain",
      "Audit logs",
      "Role-based access",
    ],
    cta: "Start free trial",
    href: "/register",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 max-w-5xl mx-auto px-6">
      <div className="text-center mb-14">
        <h2 className="text-3xl font-semibold text-gray-900 mb-3">
          Simple pricing
        </h2>
        <p className="text-gray-500 text-lg">No hidden fees. Cancel anytime.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl p-6 flex flex-col ${
              plan.highlighted
                ? "bg-gray-900 text-white border-2 border-gray-900"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="mb-6">
              <p
                className={`text-sm font-medium mb-1 ${
                  plan.highlighted ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-4xl font-semibold ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${
                    plan.highlighted ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  /{plan.period}
                </span>
              </div>
              <p
                className={`text-sm mt-2 ${
                  plan.highlighted ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check
                    size={14}
                    className={
                      plan.highlighted ? "text-green-400" : "text-green-500"
                    }
                  />
                  <span
                    className={
                      plan.highlighted ? "text-gray-300" : "text-gray-600"
                    }
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                plan.highlighted
                  ? "bg-white text-gray-900 hover:bg-gray-100"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
