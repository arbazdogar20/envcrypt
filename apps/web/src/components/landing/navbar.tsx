"use client";
import Link from "next/link";
import { FolderLock } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderLock size={18} className="text-gray-900" />
          <span className="font-semibold text-gray-900 text-sm">Envcrypt</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
