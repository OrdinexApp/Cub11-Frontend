"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  LayoutTemplate,
  PlaySquare,
  UserCircle2,
  Sparkles,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
    <aside className="hidden md:flex h-dvh sticky top-0 w-64 shrink-0 flex-col gap-2 border-r border-border/50 bg-card/40 px-4 py-6">
      <Link
        href="/projects"
        className="flex items-center gap-2 px-3 py-2 mb-2"
        aria-label="Cube11 home"
      >
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.6)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">Cube11</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            video studio
          </span>
        </div>
      </Link>

      <Button asChild size="lg" className="mt-1 mb-2 justify-start">
        <Link href="/new">
          <Sparkles className="h-4 w-4" />
          New project
        </Link>
      </Button>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40",
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-primary/10 ring-1 ring-primary/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <item.icon className="relative h-4.5 w-4.5 h-[18px] w-[18px]" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <CreditMeter />

        <div className="flex items-center justify-between gap-2 rounded-2xl border border-border/60 bg-card/50 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium leading-tight">
              {user?.full_name || user?.email || "Signed in"}
            </p>
            {user?.full_name && (
              <p className="truncate text-[10px] text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
          <button
            onClick={logout}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-accent/40 hover:text-foreground"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
