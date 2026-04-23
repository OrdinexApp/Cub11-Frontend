"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  LayoutTemplate,
  PlaySquare,
  UserCircle2,
  LogOut,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CreditMeter } from "./CreditMeter";
import { useLogout } from "@/lib/api/use-auth";
import { useAuthStore } from "@/lib/stores/auth-store";

export const NAV_ITEMS = [
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/videos", label: "My Videos", icon: PlaySquare },
  { href: "/account", label: "Account", icon: UserCircle2 },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-2 border-r border-gray-200 bg-white px-4 py-6 shadow-[1px_0_0_0_rgba(17,24,39,0.03),4px_0_20px_-8px_rgba(17,24,39,0.04)] md:flex">
      {/* Brand */}
      <Link
        href="/projects"
        className="mb-2 flex items-center gap-2 px-2 py-1.5"
        aria-label="Cubell home"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="28" height="28" rx="8" fill="#7C3AED" />
          <polygon points="11,8 21,14 11,20" fill="white" />
          <rect x="7" y="8" width="2.5" height="12" rx="1.25" fill="white" />
        </svg>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-bold tracking-tight text-[#7C3AED]">
            Cubell
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">
            video studio
          </span>
        </div>
      </Link>

      {/* Primary CTA — new project */}
      <Link
        href="/new"
        className="mb-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-4 text-[13.5px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(124,58,237,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#6D28D9] hover:shadow-[0_12px_24px_-6px_rgba(124,58,237,0.55)]"
      >
        <Plus className="h-4 w-4" />
        New project
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors",
                active ? "text-[#7C3AED]" : "text-gray-600 hover:text-gray-900",
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-violet-600/10 ring-1 ring-violet-600/15"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <item.icon className="relative h-[17px] w-[17px]" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer: credits + user */}
      <div className="mt-auto flex flex-col gap-3">
        <CreditMeter />

        <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 shadow-sm">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[12px] font-bold text-white">
              {(user?.full_name || user?.email || "?")
                .slice(0, 1)
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-semibold leading-tight text-gray-900">
                {user?.full_name || user?.email?.split("@")[0] || "Signed in"}
              </p>
              {user?.email && (
                <p className="truncate text-[11px] text-gray-500">{user.email}</p>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Very soft brand glow at bottom — decorative only */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08),transparent_70%)] blur-xl"
      />
    </aside>
  );
}
