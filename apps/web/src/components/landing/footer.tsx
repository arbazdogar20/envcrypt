import { FolderLock } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderLock size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">Envcrypt</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Register
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            GitHub
          </a>
        </div>
        <p className="text-xs text-gray-400">Built by you · Paris 2026</p>
      </div>
    </footer>
  );
}
