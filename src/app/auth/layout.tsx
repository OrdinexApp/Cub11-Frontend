import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh flex items-center justify-center px-4 py-10 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.18),transparent_55%),radial-gradient(circle_at_75%_80%,hsl(var(--primary)/0.12),transparent_50%)]"
      />
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_18px_40px_-12px_hsl(var(--primary)/0.65)]">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">Cube11</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              video studio
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
