"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./Sidebar";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 glass">
      <div className="relative grid grid-cols-5 gap-1 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />
        ))}

        <Link
          href="/new"
          className="relative -top-5 mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_18px_30px_-12px_hsl(var(--primary)/0.6)]"
          aria-label="New project"
        >
          <Plus className="h-6 w-6" />
        </Link>

        {NAV_ITEMS.slice(2).map((item) => (
          <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />
        ))}
      </div>
    </nav>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Plus;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {active && (
        <motion.span
          layoutId="bottom-active"
          className="absolute inset-0 rounded-xl bg-primary/10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
      )}
      <Icon className="relative h-5 w-5" />
      <span className="relative">{label}</span>
    </Link>
  );
}
